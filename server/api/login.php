<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if($result->num_rows > 0) {

    $user = $result->fetch_assoc();

    if(password_verify($password, $user['password'])) {

        echo json_encode([
            "message" => "Success",
            "user" => $user,
            "token" => base64_encode($user['email'])
        ]);

    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid Password"]);
    }

} else {
    http_response_code(404);
    echo json_encode(["message" => "User Not Found"]);
}

?>