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
$email   = trim($_POST['email'] ?? '');
$role    = trim($_POST['role'] ?? '');
$password = $_POST['password'] ?? '';

// Validation
$errors = [];

if (empty($uname)) {
    $errors[] = "Full name is required.";
}

if (empty($phone)) {
    $errors[] = "Phone number is required.";
} elseif (!preg_match('/^(98|97)\d{8}$/', $phone)) {
    $errors[] = "Invalid phone number format (98XXXXXXXX or 97XXXXXXXX).";
}

if (!empty($password)) {
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters.";
    } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\\:"|,.<>\/?]).{8,}$/', $password)) {
        $errors[] = "Password must include uppercase, lowercase, number and symbol.";
    }
}

if (empty($email)) {
    $errors[] = "Email is required.";
} 
else {
    $lowerEmail = strtolower(trim($email));
    
    if (strpos($lowerEmail, 'admin') === 0) {
    } 
    else {
        if (!preg_match('/^[a-zA-Z]+\d+(bit|bca)\d+@kcc\.edu\.np$/i', $email)) {
            $errors[] = "Invalid email format. Students must use KCC college email.";
        }
    }
}

if (empty($phone)) {
    $errors[] = "Phone number is required.";
} elseif (!preg_match('/^(98|97)\d{8}$/', $phone)) {
    $errors[] = "Invalid phone number format (98XXXXXXXX or 97XXXXXXXX).";
}



if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode("<br>", $errors)]);
    exit;
}

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
    $sql = "UPDATE users SET uname = ?, phone = ?, address = ? ";
    $types = "sss";
    $params = [$uname, $phone, $address];


    if (!empty($password)) {
        $sql .= ", password = ?";
        $params[] = $password;
        $types .= "s";
    }

    if (!empty($email)) {
        $sql .= ", email = ?";
        $params[] = $email;
        $types .= "s";
    }

    if (!empty($role)) {
        $sql .= ", role = ?";
        $params[] = $role;
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