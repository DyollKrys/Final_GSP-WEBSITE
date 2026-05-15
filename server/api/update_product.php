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

$id = isset($_POST["id"]) ? (int) $_POST["id"] : 0;
$name = isset($_POST["name"]) ? trim((string) $_POST["name"]) : "";
$description = isset($_POST["description"]) ? trim((string) $_POST["description"]) : "";
$price = isset($_POST["price"]) ? $_POST["price"] : null;
$stock = isset($_POST["stock"]) ? $_POST["stock"] : null;

if ($id <= 0 || $name === "" || $price === null || $price === "" || $stock === null || $stock === "") {
    http_response_code(400);
    echo json_encode(["message" => "Valid id, name, price, and stock are required"]);
    exit;
}

$newUploaded = null;

try {
    $sel = $conn->prepare("SELECT image FROM products WHERE id = ?");
    $sel->execute([$id]);
    $row = $sel->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $oldImg = $row["image"];
    $newImage = $oldImg;

    if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
        $imgAllowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        $imgRes = publication_save_upload($_FILES["image"], "prod_", $imgAllowed);
        if ($imgRes["file"] === null) {
            http_response_code(400);
            echo json_encode(["message" => $imgRes["error"] ?? "Image upload failed"]);
            exit;
        }
        $newUploaded = $imgRes["file"];
        $newImage = $newUploaded;
        if (
            $oldImg
            && (string) $oldImg !== (string) $newImage
            && !preg_match("#^https?://#i", (string) $oldImg)
        ) {
            publication_unlink_if_local((string) $oldImg);
        }
    }

    $stmt = $conn->prepare(
        "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?"
    );
    $stmt->execute([
        $name,
        $description,
        (float) $price,
        (int) $stock,
        $newImage,
        $id,
    ]);

    echo json_encode(["message" => "Updated", "image" => $newImage]);
} catch (PDOException $e) {
    if ($newUploaded !== null) {
        publication_unlink_if_local($newUploaded);
    }
    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "detail" => $e->getMessage(),
    ]);
}
