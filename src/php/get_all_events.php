<?php
session_start();
require_once '../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

$result = $conn->query("SELECT * FROM events ORDER BY date DESC");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$conn->close();
?>