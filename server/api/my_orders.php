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

$token = isset($data->token) ? (string) $data->token : "";

$user = resolveUserFromApiToken($conn, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Sign in required"]);
    exit;
}

try {
    $stmt = $conn->prepare(
        "SELECT id, user_id, total, payment_method, notes, status, created_at
         FROM orders WHERE user_id = ? ORDER BY created_at DESC"
    );
    $stmt->execute([(int) $user["id"]]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $ids = array_map("intval", array_column($orders, "id"));

    $byOrder = [];
    if (count($ids) > 0) {
        $placeholders = implode(",", array_fill(0, count($ids), "?"));
        $is = $conn->prepare(
            "SELECT id, order_id, product_id, product_name, quantity, unit_price
             FROM order_items WHERE order_id IN ($placeholders) ORDER BY id"
        );
        $is->execute($ids);
        foreach ($is->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $oid = (int) $row["order_id"];
            if (!isset($byOrder[$oid])) {
                $byOrder[$oid] = [];
            }
            $byOrder[$oid][] = $row;
        }
    }

    foreach ($orders as &$o) {
        $o["items"] = $byOrder[(int) $o["id"]] ?? [];
    }
    unset($o);

    echo json_encode($orders);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $e->getMessage()]);
}
