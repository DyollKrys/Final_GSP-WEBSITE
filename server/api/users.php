<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $stmt = $conn->query(
            "SELECT id, fullname, email, role, created_at FROM users ORDER BY id ASC"
        );
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
        $id = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid id"]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Deleted"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
