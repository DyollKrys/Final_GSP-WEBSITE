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
    $conn->beginTransaction();

    try {
        $conn->prepare(
            "DELETE FROM troop_registration_members WHERE registration_id = ?"
        )->execute([$id]);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), "troop_registration_members") === false
            && strpos($e->getMessage(), "Unknown table") === false
            && strpos($e->getMessage(), "doesn't exist") === false
        ) {
            throw $e;
        }
    }

    $stmt = $conn->prepare("DELETE FROM troop_registrations_pending WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(["message" => "Not found"]);
        exit;
    }

    $conn->commit();
    echo json_encode(["message" => "Deleted"]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
