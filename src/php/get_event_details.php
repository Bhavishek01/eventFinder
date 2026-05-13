<?php
session_start();

require_once '../database/db_con.php';

$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

if (!$event_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid event ID']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM events WHERE event_id = ?");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();
$event = $result->fetch_assoc();

if ($event) {
    echo json_encode($event);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Event not found']);
}

$stmt->close();
$conn->close();
?>