<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

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

$troop_name = isset($data->troop_name) ? trim((string) $data->troop_name) : "";
$age_level = isset($data->age_level) ? trim((string) $data->age_level) : "";
$troop_type = isset($data->troop_type) ? trim((string) $data->troop_type) : "";
$troop_address = isset($data->troop_address) ? trim((string) $data->troop_address) : "";
$leader_name = isset($data->leader_name) ? trim((string) $data->leader_name) : "";
$leader_birthdate = isset($data->leader_birthdate) ? trim((string) $data->leader_birthdate) : "";
$leader_beneficiary = isset($data->leader_beneficiary) ? trim((string) $data->leader_beneficiary) : "";

if ($troop_name === "" || $leader_name === "") {
    http_response_code(400);
    echo json_encode(["message" => "Troop name and leader name are required"]);
    exit;
}

$membersIn = isset($data->members) && is_array($data->members) ? $data->members : [];
$members = [];
foreach ($membersIn as $m) {
    if (!is_object($m)) {
        continue;
    }
    $ln = isset($m->last_name) ? trim((string) $m->last_name) : "";
    $fn = isset($m->first_name) ? trim((string) $m->first_name) : "";
    if ($ln === "" && $fn === "") {
        continue;
    }
    $mi = isset($m->middle_initial) ? trim((string) $m->middle_initial) : "";
    $bd = isset($m->birthdate) ? trim((string) $m->birthdate) : "";
    $gr = isset($m->grade) ? trim((string) $m->grade) : "";
    $st = isset($m->member_status) ? trim((string) $m->member_status) : "new";
    if (!in_array($st, ["new", "re-reg"], true)) {
        $st = "new";
    }
    if ($ln === "" || $fn === "" || $bd === "" || $gr === "") {
        http_response_code(400);
        echo json_encode([
            "message" => "Each member must have last name, first name, birthdate, and grade (middle initial optional).",
        ]);
        exit;
    }
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $bd)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid member birthdate format"]);
        exit;
    }
    $p = array_map("intval", explode("-", $bd));
    if (count($p) !== 3 || !checkdate($p[1], $p[2], $p[0])) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid member birthdate"]);
        exit;
    }
    $members[] = [
        "last_name" => $ln,
        "first_name" => $fn,
        "middle_initial" => $mi === "" ? null : $mi,
        "birthdate" => $bd,
        "grade" => $gr,
        "member_status" => $st,
    ];
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare(
        "INSERT INTO troop_registrations_pending (
            troop_name, age_level, troop_type, troop_address,
            leader_name, leader_birthdate, leader_beneficiary, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')"
    );
    $stmt->execute([
        $troop_name,
        $age_level,
        $troop_type,
        $troop_address,
        $leader_name,
        $leader_birthdate !== "" ? $leader_birthdate : null,
        $leader_beneficiary,
    ]);
    $registrationId = (int) $conn->lastInsertId();

    if (count($members) > 0) {
        $ins = $conn->prepare(
            "INSERT INTO troop_registration_members (
                registration_id, last_name, first_name, middle_initial, birthdate, grade, member_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($members as $row) {
            $ins->execute([
                $registrationId,
                $row["last_name"],
                $row["first_name"],
                $row["middle_initial"],
                $row["birthdate"],
                $row["grade"],
                $row["member_status"],
            ]);
        }
    }

    $conn->commit();
    echo json_encode([
        "message" => "Registration Submitted",
        "registration_id" => $registrationId,
        "members_saved" => count($members),
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
        "hint" => (strpos($msg, "troop_registration_members") !== false || strpos($msg, "Unknown table") !== false)
            ? "Run database/migration_troop_registration_members.sql to create the members table."
            : null,
    ]);
}
