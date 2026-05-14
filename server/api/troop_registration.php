<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$sql = "INSERT INTO troop_registrations(
    troop_name,
    age_level,
    troop_type,
    troop_address,
    leader_name,
    leader_birthdate,
    leader_beneficiary
)
VALUES(
    '$data->troop_name',
    '$data->age_level',
    '$data->troop_type',
    '$data->troop_address',
    '$data->leader_name',
    '$data->leader_birthdate',
    '$data->leader_beneficiary'
)";

if($conn->query($sql)) {
    echo json_encode([
        "message" => "Registration Submitted"
    ]);
}

?>