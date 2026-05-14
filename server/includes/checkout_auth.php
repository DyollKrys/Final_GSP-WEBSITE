<?php

/**
 * Match logged-in client (user id + base64(email) token from login) to a DB user row.
 */
function resolveCheckoutUser(PDO $conn, int $userId, $token): ?array
{
    if ($userId <= 0 || !is_string($token) || $token === "") {
        return null;
    }
    $decoded = base64_decode($token, true);
    if ($decoded === false || trim($decoded) === "") {
        return null;
    }
    $email = strtolower(trim($decoded));
    $stmt = $conn->prepare(
        "SELECT id, email, fullname FROM users WHERE id = ? AND email = ? LIMIT 1"
    );
    $stmt->execute([$userId, $email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

/** Order row for this user, or null if not found / not owned. */
function fetchUserOrderRow(PDO $conn, int $orderId, array $user): ?array
{
    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$orderId, (int) $user["id"]]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}
