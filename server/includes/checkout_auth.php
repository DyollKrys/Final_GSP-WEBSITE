<?php

/**
 * Resolve the signed-in user from the session token only (base64 email from login).
 * Never trust a client-supplied user_id — it must not influence authorization.
 */
function resolveUserFromApiToken(PDO $conn, $token): ?array
{
    if (!is_string($token) || $token === "") {
        return null;
    }
    $decoded = base64_decode($token, true);
    if ($decoded === false) {
        return null;
    }
    $email = strtolower(trim($decoded));
    if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return null;
    }
    $stmt = $conn->prepare(
        "SELECT id, email, fullname, role FROM users WHERE email = ? LIMIT 1"
    );
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

/**
 * @deprecated Use resolveUserFromApiToken($conn, $token). user_id is ignored.
 */
function resolveCheckoutUser(PDO $conn, int $userId, $token): ?array
{
    return resolveUserFromApiToken($conn, $token);
}

/** Order row for this user, or null if not found / not owned. */
function fetchUserOrderRow(PDO $conn, int $orderId, array $user): ?array
{
    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$orderId, (int) $user["id"]]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}
