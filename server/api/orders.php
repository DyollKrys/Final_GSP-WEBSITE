<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../includes/require_admin.php";
require_admin_user($conn);

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

try {
    $stmt = $conn->query(
        "SELECT o.id, o.user_id, o.total, o.payment_method, o.notes, o.status, o.created_at,
                u.email AS user_email, u.fullname AS user_fullname
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         ORDER BY o.created_at DESC"
    );
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
    $msg = $e->getMessage();
    $hint = (strpos($msg, "order_items") !== false || strpos($msg, "Unknown table") !== false)
        ? "Run database/migration_orders_cart.sql"
        : null;
    echo json_encode(["message" => "Server error", "detail" => $msg, "hint" => $hint]);
}
