<?php
require_once '../../database/db_con.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$user_id = $_SESSION['user_id'];
$event_id = (int)($_GET['event_id'] ?? 0);

if (!$event_id) {
    echo json_encode(['success' => false, 'message' => 'Invalid event ID']);
    exit;
}

try {

    $stmt = $conn->prepare("DELETE FROM participators WHERE user_id = ? AND event_id = ?");
    $stmt->bind_param("ii", $user_id, $event_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Registration cancelled successfully!'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to cancel registration']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>