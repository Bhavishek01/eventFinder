<?php
require_once('../../database/db_con.php');
require_once('../email_helper.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$subject    = trim($_POST['subject'] ?? '');
$body       = trim($_POST['body'] ?? '');
$created_by = $_SESSION['user_name'] ?? null;

if (empty($subject) || empty($body) || !$created_by) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$sent = sendToAllUsers($subject, $body);

echo json_encode(['success' => true, 'message' => "Notice sent to $sent users."]);
?>