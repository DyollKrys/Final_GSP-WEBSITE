<?php

require_once __DIR__ . "/../includes/cors.php";
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

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

$fullname = isset($data->fullname) ? trim((string) $data->fullname) : "";
$email = isset($data->email) ? trim((string) $data->email) : "";
$password = isset($data->password) ? (string) $data->password : "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Email and password required"]);
    exit;
}

$email = strtolower($email);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email address"]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(["message" => "Password must be at least 8 characters"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare(
        "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'member')"
    );
    $stmt->execute([$fullname, $email, $hash]);
    echo json_encode(["message" => "Registered Successfully"]);
} catch (PDOException $e) {
    if (isset($e->errorInfo[0]) && $e->errorInfo[0] === "23000") {
        http_response_code(409);
        echo json_encode(["message" => "Email already registered"]);
        exit;
    }
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
