<?php
/**
 * One-time: renames legacy MySQL tables for troop registration.
 * - troop_registrations -> troop_registrations_pending
 * - If you never had `troop_registration_archive`, creates `troop_registrations_archive`
 *   + `troop_registration_member_archive` for the approve flow.
 *
 * Open once:
 *   http://localhost/Final_GSP-WEBSITE-main/server/install_rename_troop_pending.php?run=1
 */

header('Content-Type: text/plain; charset=utf-8');

if (($_GET['run'] ?? '') !== '1') {
    echo "Add ?run=1 to the URL to run the rename once, then this file will be deleted.\n";
    exit;
}

require __DIR__ . '/config/database.php';

function tableExists(PDO $conn, string $name): bool
{
    $s = $conn->prepare(
        'SELECT COUNT(*) FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?'
    );
    $s->execute([$name]);
    return (int) $s->fetchColumn() > 0;
}

function foreignKeyNames(PDO $conn, string $table): array
{
    $s = $conn->prepare(
        "SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = ?
           AND CONSTRAINT_TYPE = 'FOREIGN KEY'"
    );
    $s->execute([$table]);
    return $s->fetchAll(PDO::FETCH_COLUMN) ?: [];
}

function dropAllForeignKeys(PDO $conn, string $table): void
{
    foreach (foreignKeyNames($conn, $table) as $fk) {
        $conn->exec('ALTER TABLE `' . str_replace('`', '``', $table) . '` DROP FOREIGN KEY `' . str_replace('`', '``', $fk) . '`');
    }
}

/** Create archive tables when neither legacy nor current archive table exists. */
function ensureArchiveTables(PDO $conn): void
{
    if (tableExists($conn, 'troop_registrations_archive')
        || tableExists($conn, 'troop_registration_archive')) {
        return;
    }

    $conn->exec(
        "CREATE TABLE IF NOT EXISTS `troop_registrations_archive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `original_registration_id` int(11) NOT NULL,
  `troop_name` varchar(255) DEFAULT NULL,
  `age_level` varchar(255) DEFAULT NULL,
  `troop_type` varchar(255) DEFAULT NULL,
  `troop_address` text DEFAULT NULL,
  `leader_name` varchar(255) DEFAULT NULL,
  `leader_birthdate` date DEFAULT NULL,
  `leader_beneficiary` varchar(255) DEFAULT NULL,
  `prior_status` varchar(32) NOT NULL DEFAULT 'pending',
  `original_created_at` timestamp NULL DEFAULT NULL,
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `original_registration_id` (`original_registration_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $conn->exec(
        "CREATE TABLE IF NOT EXISTS `troop_registration_member_archive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `archive_id` int(11) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `first_name` varchar(128) NOT NULL,
  `middle_initial` varchar(16) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `grade` varchar(64) DEFAULT NULL,
  `member_status` enum('new','re-reg') NOT NULL DEFAULT 'new',
  `original_member_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archive_id` (`archive_id`),
  CONSTRAINT `fk_trma_archive` FOREIGN KEY (`archive_id`) REFERENCES `troop_registrations_archive` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    echo "OK: Created `troop_registrations_archive` and `troop_registration_member_archive` (no legacy `troop_registration_archive` table was present).\n";
}

try {
    $hasOld = tableExists($conn, 'troop_registrations');
    $hasPending = tableExists($conn, 'troop_registrations_pending');

    if (!$hasOld && $hasPending) {
        echo "Table `troop_registrations_pending` already exists and `troop_registrations` is gone. Nothing to rename.\n";
    } elseif (!$hasOld && !$hasPending) {
        http_response_code(400);
        echo "Error: Neither `troop_registrations` nor `troop_registrations_pending` exists.\n";
        exit;
    } elseif ($hasOld && $hasPending) {
        http_response_code(400);
        echo "Error: Both `troop_registrations` and `troop_registrations_pending` exist. Resolve manually in phpMyAdmin.\n";
        exit;
    } else {
        if (tableExists($conn, 'troop_registration_members')) {
            dropAllForeignKeys($conn, 'troop_registration_members');
        }

        $conn->exec('RENAME TABLE `troop_registrations` TO `troop_registrations_pending`');
        echo "OK: Renamed `troop_registrations` -> `troop_registrations_pending`.\n";

        if (tableExists($conn, 'troop_registration_members')) {
            try {
                $conn->exec(
                    'ALTER TABLE `troop_registration_members`
                     ADD CONSTRAINT `fk_trm_pending` FOREIGN KEY (`registration_id`)
                     REFERENCES `troop_registrations_pending` (`id`) ON DELETE CASCADE'
                );
                echo "OK: Re-linked `troop_registration_members` FK to pending table.\n";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate') !== false || strpos($e->getMessage(), 'already exists') !== false) {
                    echo "Note: FK `fk_trm_pending` already present on `troop_registration_members`.\n";
                } else {
                    throw $e;
                }
            }
        }
    }

    $hasOldArchive = tableExists($conn, 'troop_registration_archive');
    $hasNewArchive = tableExists($conn, 'troop_registrations_archive');

    if ($hasOldArchive && !$hasNewArchive) {
        if (tableExists($conn, 'troop_registration_member_archive')) {
            dropAllForeignKeys($conn, 'troop_registration_member_archive');
        }
        $conn->exec('RENAME TABLE `troop_registration_archive` TO `troop_registrations_archive`');
        echo "OK: Renamed `troop_registration_archive` -> `troop_registrations_archive`.\n";
        if (tableExists($conn, 'troop_registration_member_archive')) {
            try {
                $conn->exec(
                    'ALTER TABLE `troop_registration_member_archive`
                     ADD CONSTRAINT `fk_trma_archive` FOREIGN KEY (`archive_id`)
                     REFERENCES `troop_registrations_archive` (`id`) ON DELETE CASCADE'
                );
                echo "OK: Re-linked `troop_registration_member_archive` FK.\n";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate') !== false || strpos($e->getMessage(), 'already exists') !== false) {
                    echo "Note: FK `fk_trma_archive` already present.\n";
                } else {
                    throw $e;
                }
            }
        }
    } elseif ($hasOldArchive && $hasNewArchive) {
        echo "Note: Old `troop_registration_archive` still exists alongside `troop_registrations_archive`. Rename or drop the old table manually if empty.\n";
    }

    ensureArchiveTables($conn);
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Error: ' . $e->getMessage() . "\n";
    exit;
}

$self = __FILE__;
if (is_file($self) && @unlink($self)) {
    echo "This installer file was deleted.\n";
} else {
    echo "Could not delete this file; remove manually:\n" . $self . "\n";
}
