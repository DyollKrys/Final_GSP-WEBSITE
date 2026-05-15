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

$raw = file_get_contents("php://input");
$data = json_decode($raw !== false && $raw !== "" ? $raw : "null");
if (!is_object($data)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or empty JSON body"]);
    exit;
}

$id = isset($data->id) ? (int) $data->id : 0;
$title = isset($data->title) ? trim((string) $data->title) : "";
$content = isset($data->content) ? trim((string) $data->content) : "";
$eventRaw = isset($data->event_date) ? trim((string) $data->event_date) : "";

if ($id <= 0 || $title === "" || $content === "") {
    http_response_code(400);
    echo json_encode(["message" => "Valid id, title, and content required"]);
    exit;
}

$eventDate = normalize_event_date_update($eventRaw);
if ($eventDate === null) {
    http_response_code(400);
    echo json_encode(["message" => "Valid event_date (YYYY-MM-DD) required"]);
    exit;
}

try {
    $stmt = $conn->prepare(
        "UPDATE announcements SET title = ?, content = ?, event_date = ? WHERE id = ?"
    );
    $stmt->execute([$title, $content, $eventDate, $id]);
    $check = $conn->prepare("SELECT id FROM announcements WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }
    echo json_encode(["message" => "Updated"]);
} catch (PDOException $e) {
    http_response_code(500);
    $msg = $e->getMessage();
    echo json_encode([
        "message" => "Server error",
        "detail" => $msg,
        "hint" => (strpos($msg, "event_date") !== false)
            ? "Run database/migration_announcements_event_date.sql on your MySQL database."
            : null,
    ]);
}

function normalize_event_date_update(string $raw): ?string
{
    if ($raw === "") {
        return null;
    }
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $raw)) {
        return null;
    }
    $parts = array_map("intval", explode("-", $raw));
    if (count($parts) !== 3 || !checkdate($parts[1], $parts[2], $parts[0])) {
        return null;
    }
    return $raw;
}
