<?php
session_start();
require_once '../../database/db_con.php';

$request_id = (int)$_GET['request_id'];

$stmt = $conn->prepare("SELECT er.*, u.uname as student_name 
                       FROM event_requests er 
                       JOIN users u ON er.student_id = u.user_id 
                       WHERE er.request_id = ?");
$stmt->bind_param("i", $request_id);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode($result->fetch_assoc());

$stmt->close();
$conn->close();
?>