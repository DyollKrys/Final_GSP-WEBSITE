<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$id = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid id"]);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }
    echo json_encode(["message" => "Deleted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
