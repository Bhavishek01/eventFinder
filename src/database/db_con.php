<?php

$conn = new mysqli("localhost", "root", "", "eventfinder0");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Set charset
$conn->set_charset("utf8");

?>