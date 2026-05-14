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

$raw = file_get_contents("php://input");
$data = json_decode($raw);
if (!is_object($data)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid JSON body"]);
    exit;
}

$userId = isset($data->user_id) ? (int) $data->user_id : 0;
$token = isset($data->token) ? (string) $data->token : "";
$notes = isset($data->notes) ? trim((string) $data->notes) : "";
$items = isset($data->items) && is_array($data->items) ? $data->items : [];

$user = resolveCheckoutUser($conn, $userId, $token);
if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Sign in required to place an order"]);
    exit;
}

if (count($items) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "Cart is empty"]);
    exit;
}

if (count($items) > 50) {
    http_response_code(400);
    echo json_encode(["message" => "Too many line items"]);
    exit;
}

$normalized = [];
foreach ($items as $row) {
    if (!is_object($row)) {
        continue;
    }
    $pid = isset($row->product_id) ? (int) $row->product_id : 0;
    $qty = isset($row->quantity) ? (int) $row->quantity : 0;
    if ($pid <= 0 || $qty <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Each item needs product_id and a positive quantity"]);
        exit;
    }
    if (!isset($normalized[$pid])) {
        $normalized[$pid] = 0;
    }
    $normalized[$pid] += $qty;
}

if (count($normalized) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "No valid items"]);
    exit;
}

try {
    $conn->beginTransaction();

    $productStmt = $conn->prepare(
        "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE"
    );
    $lines = [];
    $total = 0.0;

    foreach ($normalized as $productId => $qty) {
        $productStmt->execute([$productId]);
        $p = $productStmt->fetch(PDO::FETCH_ASSOC);
        if (!$p) {
            $conn->rollBack();
            http_response_code(400);
            echo json_encode(["message" => "Product not found: " . $productId]);
            exit;
        }
        $stock = (int) $p["stock"];
        if ($stock < $qty) {
            $conn->rollBack();
            http_response_code(409);
            echo json_encode([
                "message" => "Not enough stock for \"" . $p["name"] . "\" (requested " . $qty . ", available " . $stock . ")",
            ]);
            exit;
        }
        $price = (float) $p["price"];
        $lineTotal = $price * $qty;
        $total += $lineTotal;
        $lines[] = [
            "product_id" => $productId,
            "name" => (string) $p["name"],
            "quantity" => $qty,
            "unit_price" => $price,
        ];
    }

    $insOrder = $conn->prepare(
        "INSERT INTO orders (user_id, total, payment_method, notes, status)
         VALUES (?, ?, 'Face to Face', ?, 'pending')"
    );
    $insOrder->execute([
        (int) $user["id"],
        round($total, 2),
        $notes !== "" ? $notes : null,
    ]);
    $orderId = (int) $conn->lastInsertId();

    $insItem = $conn->prepare(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($lines as $line) {
        $insItem->execute([
            $orderId,
            $line["product_id"],
            $line["name"],
            $line["quantity"],
            round($line["unit_price"], 2),
        ]);
    }

    $conn->commit();

    echo json_encode([
        "message" => "Order placed",
        "order_id" => $orderId,
        "total" => round($total, 2),
        "status" => "pending",
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    $msg = $e->getMessage();
    $hint = (strpos($msg, "order_items") !== false || strpos($msg, "Unknown table") !== false)
        ? "Run database/migration_orders_cart.sql to create order line items."
        : null;
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $msg, "hint" => $hint]);
}
