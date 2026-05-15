<?php

require_once __DIR__ . "/checkout_auth.php";

/**
 * Read session token from header (preferred) or query string.
 * Does not read php://input so JSON bodies stay available to the caller.
 */
function read_api_token_from_request(): string
{
    if (!empty($_SERVER["HTTP_X_AUTH_TOKEN"])) {
        return trim((string) $_SERVER["HTTP_X_AUTH_TOKEN"]);
    }
    $auth = isset($_SERVER["HTTP_AUTHORIZATION"]) ? (string) $_SERVER["HTTP_AUTHORIZATION"] : "";
    if ($auth !== "" && preg_match('/Bearer\s+(\S+)/i', $auth, $m)) {
        return trim($m[1]);
    }
    if (isset($_GET["token"]) && is_string($_GET["token"])) {
        return trim((string) $_GET["token"]);
    }
    return "";
}

/**
 * Stop with 401/403 unless the token belongs to a user whose role contains "admin".
 *
 * @return array Authenticated admin user row (id, email, fullname, role)
 */
function require_admin_user(PDO $conn): array
{
    $token = read_api_token_from_request();
    $user = resolveUserFromApiToken($conn, $token);
    if (!$user) {
        http_response_code(401);
        header("Content-Type: application/json");
        echo json_encode(["message" => "Sign in required"]);
        exit;
    }
    $role = isset($user["role"]) ? strtolower(trim((string) $user["role"])) : "";
    if (strpos($role, "admin") === false) {
        http_response_code(403);
        header("Content-Type: application/json");
        echo json_encode(["message" => "Admin access required"]);
        exit;
    }
    return $user;
}
