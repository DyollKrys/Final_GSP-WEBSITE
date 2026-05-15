<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? (int) $data->id : 0;
$status = isset($data->status) ? $data->status : "";

$allowed = ["pending", "approved", "rejected"];
if ($id <= 0 || !in_array($status, $allowed, true)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid payload"]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE troop_registrations_pending SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    echo json_encode(["message" => "Updated"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
