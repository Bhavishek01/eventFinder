<?php
session_start();
require_once '../../database/db_con.php';

$event_id = (int)$_GET['event_id'];

$stmt = $conn->prepare("SELECT c.*, u.uname 
                       FROM complaints c 
                       JOIN users u ON c.user_id = u.user_id 
                       WHERE c.event_id = ? 
                       ORDER BY c.created_at DESC");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$stmt->close();
$conn->close();
?>