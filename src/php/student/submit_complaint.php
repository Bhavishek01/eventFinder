<?php
require_once '../../database/db_con.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$user_id    = $_SESSION['user_id'];
$event_id   = (int)$_POST['event_id'];
$subject    = trim($_POST['subject'] ?? '');
$complaint  = trim($_POST['complaint'] ?? '');

if (!$event_id || empty($subject) || empty($complaint)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $sql = "INSERT INTO complaints (user_id, event_id, subject, complaint) 
            VALUES (?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiss", $user_id, $event_id, $subject, $complaint);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Complaint submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit complaint']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>