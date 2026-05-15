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

$email = isset($data->email) ? trim((string) $data->email) : "";
$password = isset($data->password) ? (string) $data->password : "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Missing credentials"]);
    exit;
}

$email = strtolower($email);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email address"]);
    exit;
}

// Valid bcrypt dummy so password_verify always runs (mitigates trivial email enumeration via timing).
$dummyHash = '$2y$10$eImiTXuWVxfM37uY4JANjQh5Ku6gzog.ggOPBK/UvTySkV6isYH6i';

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $storedHash = (is_array($user) && !empty($user["password"]) && is_string($user["password"]))
        ? $user["password"]
        : $dummyHash;

    if (!password_verify($password, $storedHash)) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid email or password"]);
        exit;
    }

    unset($user["password"]);

    $emailForToken = isset($user["email"]) && is_string($user["email"]) ? $user["email"] : $email;
    $token = base64_encode((string) $emailForToken);

    echo json_encode([
        "message" => "Success",
        "user" => $user,
        "token" => $token,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
