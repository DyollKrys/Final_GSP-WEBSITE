<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/upload_publication.php";

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
    $sel = $conn->prepare("SELECT image FROM products WHERE id = ?");
    $sel->execute([$id]);
    $row = $sel->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    publication_unlink_if_local(isset($row["image"]) ? (string) $row["image"] : null);

    $del = $conn->prepare("DELETE FROM products WHERE id = ?");
    $del->execute([$id]);
    echo json_encode(["message" => "Deleted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
