<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw !== false && $raw !== "" ? $raw : "null");
if (!is_object($data)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid JSON"]);
    exit;
}

$id = isset($data->id) ? (int) $data->id : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid id"]);
    exit;
}

try {
    $conn->beginTransaction();

    $sel = $conn->prepare(
        "SELECT id, troop_name, age_level, troop_type, troop_address,
                leader_name, leader_birthdate, leader_beneficiary, status, created_at
         FROM troop_registrations_pending WHERE id = ? FOR UPDATE"
    );
    $sel->execute([$id]);
    $reg = $sel->fetch(PDO::FETCH_ASSOC);
    if (!$reg) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $prior = isset($reg["status"]) ? (string) $reg["status"] : "pending";

    $insArch = $conn->prepare(
        "INSERT INTO troop_registrations_archive (
            original_registration_id, troop_name, age_level, troop_type, troop_address,
            leader_name, leader_birthdate, leader_beneficiary, prior_status, original_created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $insArch->execute([
        (int) $reg["id"],
        $reg["troop_name"],
        $reg["age_level"],
        $reg["troop_type"],
        $reg["troop_address"],
        $reg["leader_name"],
        $reg["leader_birthdate"],
        $reg["leader_beneficiary"],
        $prior,
        $reg["created_at"],
    ]);
    $archiveId = (int) $conn->lastInsertId();

    $members = [];
    try {
        $mStmt = $conn->prepare(
            "SELECT id, last_name, first_name, middle_initial, birthdate, grade, member_status
             FROM troop_registration_members WHERE registration_id = ?"
        );
        $mStmt->execute([$id]);
        $members = $mStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "troop_registration_members") === false
            && strpos($e->getMessage(), "Unknown table") === false
            && strpos($e->getMessage(), "doesn't exist") === false
        ) {
            throw $e;
        }
    }

    if (count($members) > 0) {
        $insMem = $conn->prepare(
            "INSERT INTO troop_registration_member_archive (
                archive_id, last_name, first_name, middle_initial, birthdate, grade, member_status, original_member_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($members as $m) {
            $insMem->execute([
                $archiveId,
                $m["last_name"],
                $m["first_name"],
                $m["middle_initial"],
                $m["birthdate"],
                $m["grade"],
                $m["member_status"],
                $m["id"],
            ]);
        }
    }

    try {
        $conn->prepare(
            "DELETE FROM troop_registration_members WHERE registration_id = ?"
        )->execute([$id]);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "troop_registration_members") === false
            && strpos($e->getMessage(), "Unknown table") === false
            && strpos($e->getMessage(), "doesn't exist") === false
        ) {
            throw $e;
        }
    }

    $del = $conn->prepare("DELETE FROM troop_registrations_pending WHERE id = ?");
    $del->execute([$id]);
    if ($del->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $conn->commit();
    echo json_encode([
        "message" => "Approved and archived",
        "archive_id" => $archiveId,
        "members_archived" => count($members),
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    $msg = $e->getMessage();
    echo json_encode([
        "message" => "Server error",
        "detail" => $msg,
        "hint" => (strpos($msg, "troop_registrations_archive") !== false
            || strpos($msg, "troop_registration_member_archive") !== false
            || strpos($msg, "Unknown table") !== false)
            ? "Run database/migration_troop_registration_archive.sql to create archive tables."
            : null,
    ]);
}
