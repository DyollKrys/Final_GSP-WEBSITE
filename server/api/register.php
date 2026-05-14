<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$fullname = $data->fullname;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users(fullname,email,password)
VALUES('$fullname','$email','$password')";

if($conn->query($sql)) {
    echo json_encode([
        "message" => "Registered Successfully"
    ]);
}

?>