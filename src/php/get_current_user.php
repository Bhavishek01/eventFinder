<?php
session_start();
require_once '../database/db_con.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {

$photoPath = $user['photo'] ? $user['photo'] : 'uploads/profile_photos/default.jpg';

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['user_id'],
            'name' => $user['uname'],
            'email' => $user['email'],
            'photo' => $photoPath,
            'role' => $user['role'],
            'phone' => $user['phone'],
            'address' => $user['address']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>