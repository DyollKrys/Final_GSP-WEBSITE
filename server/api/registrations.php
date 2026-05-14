<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

try {
    $stmt = $conn->query(
        "SELECT tr.id, tr.troop_name, tr.age_level, tr.troop_type, tr.troop_address,
                tr.leader_name, tr.leader_birthdate, tr.leader_beneficiary, tr.status, tr.created_at,
                (SELECT COUNT(*) FROM troop_registration_members m WHERE m.registration_id = tr.id) AS member_count
         FROM troop_registrations_pending tr
         ORDER BY tr.created_at DESC"
    );
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    if (strpos($e->getMessage(), "troop_registration_members") !== false
        || strpos($e->getMessage(), "doesn't exist") !== false
        || strpos($e->getMessage(), "Unknown table") !== false
    ) {
        $stmt = $conn->query(
            "SELECT id, troop_name, age_level, troop_type, troop_address,
                    leader_name, leader_birthdate, leader_beneficiary, status, created_at
             FROM troop_registrations_pending ORDER BY created_at DESC"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as &$r) {
            $r["member_count"] = 0;
        }
        unset($r);
        echo json_encode($rows);
        exit;
    }
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
