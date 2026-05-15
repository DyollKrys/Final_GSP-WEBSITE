<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/upload_publication.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

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
    $stmt = $conn->prepare("SELECT file, image FROM publications WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $del = $conn->prepare("DELETE FROM publications WHERE id = ?");
    $del->execute([$id]);
    if ($del->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    publication_unlink_if_local($row["file"] ?? null);
    publication_unlink_if_local($row["image"] ?? null);

    echo json_encode(["message" => "Deleted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
