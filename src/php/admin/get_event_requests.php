<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

$sql = "SELECT er.*, u.uname as student_name 
        FROM event_requests er 
        JOIN users u ON er.student_id = u.user_id 
        WHERE er.status = 'pending' 
        ORDER BY er.created_at DESC";

$result = $conn->query($sql);
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$conn->close();
?>