<?php

/**
 * @return array{file: string|null, error: string|null}
 */
function publication_save_upload(array $file, string $prefix, array $allowedExt): array
{
    if (!isset($file["error"]) || $file["error"] !== UPLOAD_ERR_OK) {
        return ["file" => null, "error" => "Upload failed"];
    }
    $uploadDir = realpath(__DIR__ . "/../uploads");
    if ($uploadDir === false) {
        return ["file" => null, "error" => "Upload directory missing"];
    }
    $orig = isset($file["name"]) ? (string) $file["name"] : "";
    $ext = pathinfo($orig, PATHINFO_EXTENSION);
    $ext = $ext !== "" ? "." . preg_replace("/[^a-zA-Z0-9]/", "", $ext) : "";
    $extLower = strtolower($ext);
    if ($allowedExt !== [] && !in_array($extLower, $allowedExt, true)) {
        return ["file" => null, "error" => "File type not allowed: " . ($ext !== "" ? $ext : "(none)")];
    }
    $safeName = $prefix . bin2hex(random_bytes(8)) . $ext;
    $dest = $uploadDir . DIRECTORY_SEPARATOR . $safeName;
    if (!move_uploaded_file($file["tmp_name"], $dest)) {
        return ["file" => null, "error" => "Could not save file"];
    }
    return ["file" => $safeName, "error" => null];
}

function publication_unlink_if_local(?string $name): void
{
    if ($name === null || $name === "" || $name === "na") {
        return;
    }
    if (preg_match("#[\\\\/]#", $name)) {
        return;
    }
    $uploadDir = realpath(__DIR__ . "/../uploads");
    if ($uploadDir === false) {
        return;
    }
    $path = $uploadDir . DIRECTORY_SEPARATOR . $name;
    if (is_file($path)) {
        @unlink($path);
    }
}
