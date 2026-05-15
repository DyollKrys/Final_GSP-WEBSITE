<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/upload_publication.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$name = isset($_POST["name"]) ? trim((string) $_POST["name"]) : "";
$description = isset($_POST["description"]) ? trim((string) $_POST["description"]) : "";
$price = isset($_POST["price"]) ? $_POST["price"] : null;
$stock = isset($_POST["stock"]) ? $_POST["stock"] : null;

if ($name === "" || $price === null || $price === "" || $stock === null || $stock === "") {
    http_response_code(400);
    echo json_encode(["message" => "Name, price, and stock are required"]);
    exit;
}

$imageName = null;
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $imgAllowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    $imgRes = publication_save_upload($_FILES["image"], "prod_", $imgAllowed);
    if ($imgRes["file"] === null) {
        http_response_code(400);
        echo json_encode(["message" => $imgRes["error"] ?? "Image upload failed"]);
        exit;
    }
    $imageName = $imgRes["file"];
}

try {
    $stmt = $conn->prepare(
        "INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $name,
        $description,
        (float) $price,
        (int) $stock,
        $imageName,
    ]);
    echo json_encode([
        "message" => "Created",
        "id" => (int) $conn->lastInsertId(),
        "image" => $imageName,
    ]);
} catch (PDOException $e) {
    publication_unlink_if_local($imageName);
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $e->getMessage()]);
}
