<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/checkout_auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
if (!is_object($data)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid JSON body"]);
    exit;
}

$userId = isset($data->user_id) ? (int) $data->user_id : 0;
$token = isset($data->token) ? (string) $data->token : "";
$orderId = isset($data->order_id) ? (int) $data->order_id : 0;

$user = resolveCheckoutUser($conn, $userId, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Sign in required"]);
    exit;
}

if ($orderId <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "order_id required"]);
    exit;
}

$order = fetchUserOrderRow($conn, $orderId, $user);
if (!$order) {
    http_response_code(404);
    echo json_encode(["message" => "Order not found"]);
    exit;
}

$st = strtolower(trim((string) $order["status"]));
if ($st !== "pending") {
    http_response_code(403);
    echo json_encode(["message" => "Only pending orders can be deleted"]);
    exit;
}

try {
    $conn->prepare("DELETE FROM orders WHERE id = ? AND user_id = ?")->execute([
        $orderId,
        (int) $user["id"],
    ]);
    echo json_encode(["message" => "Order deleted"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $e->getMessage()]);
}
