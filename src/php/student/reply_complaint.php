<?php
require_once('../database/db_con.php');
session_start();
header('Content-Type: application/json');

$complaint_id = (int)$_POST['complaint_id'];
$reply = trim($_POST['reply'] ?? '');
$replied_by = $_SESSION['user_id'] ?? null;

if (!$complaint_id || empty($reply) || !$replied_by) {
    echo json_encode(['success' => false, 'message' => 'Missing data']);
    exit;
}

$stmt = $conn->prepare("UPDATE complaints SET reply=?, replied_by=?, replied_at=NOW() WHERE complaint_id=?");
$stmt->bind_param("sii", $reply, $replied_by, $complaint_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Reply sent']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to reply']);
}

$stmt->close();
$conn->close();
?>