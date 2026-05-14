<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
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

$id = isset($data->id) ? (int) $data->id : 0;
$status = isset($data->status) ? trim((string) $data->status) : "";

if ($id <= 0 || $status === "") {
    http_response_code(400);
    echo json_encode(["message" => "Invalid payload"]);
    exit;
}

/** Normalize legacy `ready` to `approved`. */
function normalize_order_status(string $s): string
{
    $s = strtolower(trim($s));
    return $s === "ready" ? "approved" : $s;
}

$next = normalize_order_status($status);
$allowed = ["pending", "approved", "rejected", "completed"];
if (!in_array($next, $allowed, true)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid status"]);
    exit;
}

$transitions = [
    "pending" => ["approved", "rejected"],
    "approved" => ["completed"],
    "rejected" => [],
    "completed" => [],
];

try {
    $conn->beginTransaction();

    $curStmt = $conn->prepare("SELECT id, status FROM orders WHERE id = ? FOR UPDATE");
    $curStmt->execute([$id]);
    $row = $curStmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(["message" => "Order not found"]);
        exit;
    }

    $current = normalize_order_status((string) $row["status"]);
    if (!isset($transitions[$current]) || !in_array($next, $transitions[$current], true)) {
        $conn->rollBack();
        http_response_code(400);
        echo json_encode([
            "message" => "Cannot change status from \"" . $current . "\" to \"" . $next . "\"",
        ]);
        exit;
    }

    if ($next === "approved" && $current === "pending") {
        $itemsStmt = $conn->prepare(
            "SELECT product_id, quantity FROM order_items WHERE order_id = ? FOR UPDATE"
        );
        $itemsStmt->execute([$id]);
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($items as $it) {
            $pid = (int) $it["product_id"];
            $qty = (int) $it["quantity"];
            $upd = $conn->prepare(
                "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?"
            );
            $upd->execute([$qty, $pid, $qty]);
            if ($upd->rowCount() === 0) {
                $conn->rollBack();
                http_response_code(409);
                echo json_encode([
                    "message" => "Insufficient stock to approve (product id " . $pid . ")",
                ]);
                exit;
            }
        }
    }

    $updOrder = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $updOrder->execute([$next, $id]);

    $conn->commit();
    echo json_encode(["message" => "Updated", "status" => $next]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Server error", "detail" => $e->getMessage()]);
}
