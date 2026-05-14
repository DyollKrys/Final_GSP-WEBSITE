<?php

/** @return non-falsy string YYYY-MM-DD or null */
function normalize_publication_issue_date(string $raw): ?string
{
    $raw = trim($raw);
    if ($raw === "") {
        return null;
    }
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $raw)) {
        return null;
    }
    $parts = array_map("intval", explode("-", $raw));
    if (count($parts) !== 3 || !checkdate($parts[1], $parts[2], $parts[0])) {
        return null;
    }
    return $raw;
}
