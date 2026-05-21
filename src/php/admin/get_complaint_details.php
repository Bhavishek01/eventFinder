<?php
session_start();
require_once '../../database/db_con.php';

$complaint_id = (int)$_GET['complaint_id'];

$stmt = $conn->prepare("SELECT c.*, u.uname, e.ename 
                       FROM complaints c 
                       LEFT JOIN users u ON c.user_id = u.user_id 
                       LEFT JOIN events e ON c.event_id = e.event_id 
                       WHERE c.complaint_id = ?");
$stmt->bind_param("i", $complaint_id);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode($result->fetch_assoc() ?: ['error' => 'Not found']);

$stmt->close();
$conn->close();
?>