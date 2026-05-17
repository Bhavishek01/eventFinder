<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT e.*, p.status, p.p_type 
        FROM participators p 
        JOIN events e ON p.event_id = e.event_id 
        WHERE p.user_id = ? 
        ORDER BY e.date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$stmt->close();
$conn->close();
?>