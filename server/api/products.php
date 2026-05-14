<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/database.php';

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];

while($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);

?>
