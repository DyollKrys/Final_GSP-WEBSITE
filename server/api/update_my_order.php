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
$notes = isset($data->notes) ? trim((string) $data->notes) : "";
$items = isset($data->items) && is_array($data->items) ? $data->items : [];

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
    echo json_encode(["message" => "Only pending orders can be updated"]);
    exit;
}

if (count($items) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "At least one line item is required"]);
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

    $lockOrder = $conn->prepare("SELECT id, status FROM orders WHERE id = ? FOR UPDATE");
    $lockOrder->execute([$orderId]);
    $locked = $lockOrder->fetch(PDO::FETCH_ASSOC);
    if (!$locked || strtolower(trim((string) $locked["status"])) !== "pending") {
        $conn->rollBack();
        http_response_code(403);
        echo json_encode(["message" => "Order is no longer pending"]);
        exit;
    }

    $conn->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);

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

    $upd = $conn->prepare(
        "UPDATE orders SET total = ?, notes = ? WHERE id = ? AND user_id = ?"
    );
    $upd->execute([
        round($total, 2),
        $notes !== "" ? $notes : null,
        $orderId,
        (int) $user["id"],
    ]);

    $conn->commit();

    echo json_encode([
        "message" => "Order updated",
        "order_id" => $orderId,
        "total" => round($total, 2),
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $e->getMessage()]);
}
