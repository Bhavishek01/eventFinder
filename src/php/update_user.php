<?php
require_once('../database/db_con.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$user_id = (int)$_POST['user_id'];
$uname   = trim($_POST['uname'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$password = $_POST['password'] ?? '';

if (!$user_id || empty($uname)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields (Name is required)']);
    exit;
}

$photoPath = null;

// Handle photo upload if provided
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
    $sql = "UPDATE users SET uname = ?, phone = ?, address = ?";
    $types = "sss";
    $params = [$uname, $phone, $address];

    if (!empty($password)) {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $sql .= ", password = ?";
        $params[] = $hashed;
        $types .= "s";
    }

    if ($photoPath) {
        $sql .= ", photo = ?";
        $params[] = $photoPath;
        $types .= "s";
    }

    $sql .= " WHERE user_id = ?";
    $params[] = $user_id;
    $types .= "i";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database update failed']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>