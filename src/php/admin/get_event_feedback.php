<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

$event_id = (int)$_GET['event_id'];

$stmt = $conn->prepare("SELECT f.*, u.uname 
                       FROM feedback f 
                       JOIN users u ON f.user_id = u.user_id 
                       WHERE f.event_id = ? 
                       ORDER BY f.created_at DESC");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$stmt->close();
$conn->close();
?>