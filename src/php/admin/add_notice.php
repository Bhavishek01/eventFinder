<?php
require_once('../../database/db_con.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$subject = trim($_POST['subject'] ?? '');
$body = trim($_POST['body'] ?? '');
$created_by = $_SESSION['user_name'] ?? null;

if (empty($subject) || empty($body) || !$created_by) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $sql = "INSERT INTO notices (subject, body, created_by) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $subject, $body, $created_by);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Notice published successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>