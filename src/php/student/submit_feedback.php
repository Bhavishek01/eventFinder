<?php
require_once '../../database/db_con.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$user_id   = $_SESSION['user_id'];
$event_id  = (int)$_POST['event_id'];
$rating    = (int)$_POST['rating'];
$feedback  = trim($_POST['feedback'] ?? '');

if (!$event_id || !$rating || $rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'message' => 'Invalid rating or missing fields']);
    exit;
}

try {
    $sql = "INSERT INTO feedback (user_id, event_id, rating, feedback) 
            VALUES (?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiis", $user_id, $event_id, $rating, $feedback);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit feedback']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>