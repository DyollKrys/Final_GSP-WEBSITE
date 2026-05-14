<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/upload_publication.php";
require_once __DIR__ . "/../includes/publication_dates.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$title = isset($_POST["title"]) ? trim((string) $_POST["title"]) : "";
$description = isset($_POST["description"]) ? trim((string) $_POST["description"]) : "";
$issueRaw = isset($_POST["issue_date"]) ? trim((string) $_POST["issue_date"]) : "";
$issueDate = normalize_publication_issue_date($issueRaw);
if ($issueDate === null) {
    http_response_code(400);
    echo json_encode(["message" => "Valid issue date (YYYY-MM-DD) required"]);
    exit;
}

if ($title === "") {
    http_response_code(400);
    echo json_encode(["message" => "Title required"]);
    exit;
}

if (!isset($_FILES["file"]) || $_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["message" => "Publication file upload required"]);
    exit;
}

$docRes = publication_save_upload($_FILES["file"], "pub_", []);
if ($docRes["file"] === null) {
    http_response_code(400);
    echo json_encode(["message" => $docRes["error"] ?? "Document upload failed"]);
    exit;
}
$safeDoc = $docRes["file"];

$imageName = null;
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $imgAllowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    $imgRes = publication_save_upload($_FILES["image"], "pubimg_", $imgAllowed);
    if ($imgRes["file"] === null) {
        publication_unlink_if_local($safeDoc);
        http_response_code(400);
        echo json_encode(["message" => $imgRes["error"] ?? "Image upload failed"]);
        exit;
    }
    $imageName = $imgRes["file"];
}

try {
    $stmt = $conn->prepare(
        "INSERT INTO publications (title, description, file, image, issue_date) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $title,
        $description !== "" ? $description : null,
        $safeDoc,
        $imageName,
        $issueDate,
    ]);
    echo json_encode([
        "message" => "Uploaded",
        "file" => $safeDoc,
        "image" => $imageName,
    ]);
} catch (PDOException $e) {
    publication_unlink_if_local($safeDoc);
    publication_unlink_if_local($imageName);
    $msg = $e->getMessage();
    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "detail" => $msg,
        "hint" => (strpos($msg, "Unknown column") !== false)
            ? "Run database/migration_publications_image_description.sql and migration_publications_issue_date.sql"
            : null,
    ]);
}
