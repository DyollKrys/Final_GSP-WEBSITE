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

$id = isset($_POST["id"]) ? (int) $_POST["id"] : 0;
$title = isset($_POST["title"]) ? trim((string) $_POST["title"]) : "";
$description = isset($_POST["description"]) ? trim((string) $_POST["description"]) : "";
$issueRaw = isset($_POST["issue_date"]) ? trim((string) $_POST["issue_date"]) : "";
$issueDate = normalize_publication_issue_date($issueRaw);
if ($issueDate === null) {
    http_response_code(400);
    echo json_encode(["message" => "Valid issue date (YYYY-MM-DD) required"]);
    exit;
}

if ($id <= 0 || $title === "") {
    http_response_code(400);
    echo json_encode(["message" => "Valid id and title required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, title, description, file, image FROM publications WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $newFile = (string) $row["file"];
    $newImage = isset($row["image"]) ? ($row["image"] !== "" ? (string) $row["image"] : null) : null;

    if (isset($_FILES["file"]) && $_FILES["file"]["error"] === UPLOAD_ERR_OK) {
        $docRes = publication_save_upload($_FILES["file"], "pub_", []);
        if ($docRes["file"] === null) {
            http_response_code(400);
            echo json_encode(["message" => $docRes["error"] ?? "Document upload failed"]);
            exit;
        }
        publication_unlink_if_local($newFile);
        $newFile = $docRes["file"];
    }

    if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
        $imgAllowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        $imgRes = publication_save_upload($_FILES["image"], "pubimg_", $imgAllowed);
        if ($imgRes["file"] === null) {
            if ($newFile !== (string) $row["file"]) {
                publication_unlink_if_local($newFile);
            }
            http_response_code(400);
            echo json_encode(["message" => $imgRes["error"] ?? "Image upload failed"]);
            exit;
        }
        publication_unlink_if_local($newImage);
        $newImage = $imgRes["file"];
    }

    $upd = $conn->prepare(
        "UPDATE publications SET title = ?, description = ?, file = ?, image = ?, issue_date = ? WHERE id = ?"
    );
    $upd->execute([
        $title,
        $description !== "" ? $description : null,
        $newFile,
        $newImage,
        $issueDate,
        $id,
    ]);

    echo json_encode(["message" => "Updated"]);
} catch (PDOException $e) {
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
