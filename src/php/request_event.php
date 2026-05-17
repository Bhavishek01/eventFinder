<?php
require_once('../database/db_con.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$student_id = $_SESSION['user_id'] ?? null;
if (!$student_id) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$ename = trim($_POST['eventName'] ?? '');
$category = trim($_POST['eventCategory'] ?? '');
$venue = trim($_POST['eventLocation'] ?? '');
$description = trim($_POST['eventDescription'] ?? '');
$date = $_POST['eventDate'] ?? '';
$time = $_POST['eventTime'] ?? '';
$volunteers_needed = (int)($_POST['volunteersNeeded'] ?? 0);

if (empty($ename) || empty($category) || empty($venue) || empty($description) || empty($date)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    $sql = "INSERT INTO event_requests (student_id, ename, category, description, date, time, venue, volunteers_needed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issssssi", $student_id, $ename, $category, $description, $date, $time, $venue, $volunteers_needed);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Request submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit request']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>