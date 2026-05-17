<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

$result = $conn->query("SELECT user_id, uname, email, role, phone, address, photo 
                       FROM users ORDER BY uname ASC");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$conn->close();
?>