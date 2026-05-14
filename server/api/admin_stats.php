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
    $users = (int) $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $orders = (int) $conn->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $pendingOrders = (int) $conn->query(
        "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
    )->fetchColumn();
    $products = (int) $conn->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $registrations = (int) $conn->query("SELECT COUNT(*) FROM troop_registrations_pending")->fetchColumn();

    echo json_encode([
        "users" => $users,
        "orders" => $orders,
        "pending_orders" => $pendingOrders,
        "products" => $products,
        "registrations" => $registrations,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
