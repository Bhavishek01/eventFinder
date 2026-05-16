<?php
require_once('../database/db_con.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$user_id = (int)$_POST['user_id'];
$uname = trim($_POST['uname'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$role = trim($_POST['role'] ?? '');
$password = $_POST['password'] ?? '';

if (!$user_id || empty($uname) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$photoPath = null;

// Handle photo upload
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo'];
    $uploadDir = __DIR__ . '/../uploads/profile_photos/';
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'user_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
    $targetPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $photoPath = 'uploads/profile_photos/' . $newFileName;
    }
}

try {
    $sql = "UPDATE users SET uname=?, email=?, phone=?, address=?, role=?";
    $params = [$uname, $email, $phone, $address, $role];
    $types = "sssss";

    if (!empty($password)) {
        
        $sql .= ", password=?";
        $params[] = $password;
        $types .= "s";
    }

    if ($photoPath) {
        $sql .= ", photo=?";
        $params[] = $photoPath;
        $types .= "s";
    }

    $sql .= " WHERE user_id=?";
    $params[] = $user_id;
    $types .= "i";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>