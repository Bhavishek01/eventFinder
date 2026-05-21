<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

// Get all events with complaint count and feedback count
$sql = "SELECT e.*,
        (SELECT COUNT(*) FROM complaints WHERE event_id = e.event_id) as complaint_count,
        (SELECT COUNT(*) FROM feedback WHERE event_id = e.event_id) as feedback_count
        FROM events e 
        ORDER BY e.date DESC";

$result = $conn->query($sql);
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$conn->close();
?>