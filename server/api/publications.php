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
        "SELECT id, title, description, file, image, issue_date, created_at
         FROM publications
         ORDER BY COALESCE(issue_date, DATE(created_at)) DESC, created_at DESC"
    );
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    $msg = $e->getMessage();
    echo json_encode([
        "message" => "Server error",
        "detail" => $msg,
        "hint" => (strpos($msg, "Unknown column") !== false)
            ? "Run database/migration_publications_image_description.sql and migration_publications_issue_date.sql"
            : null,
    ]);
}
