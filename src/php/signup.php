<?php
session_start();
require_once __DIR__ . '/../database/db_con.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../frontends/signup.html');
    exit;
}

$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$confirmPassword = trim($_POST['confirm_password'] ?? '');
$photoPath = null;

try {
    $checkStmt = $conn->prepare('SELECT email FROM users WHERE email = ? LIMIT 1');
    $checkStmt->bind_param('s', $email);
    $checkStmt->execute();
    $existingUser = $checkStmt->get_result()->fetch_assoc();
    $checkStmt->close();

    if ($existingUser) {
        die('An account with this email already exists.');
    }

    // ==================== HANDLE PHOTO UPLOAD ====================
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['photo'];
        
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($file['type'], $allowedTypes)) {
            die('Only JPG, PNG, GIF and WebP images are allowed.');
        }

        if ($file['size'] > $maxSize) {
            die('File size must be less than 5MB.');
        }

        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../uploads/profile_photos/';

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFileName = 'user_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $destination = $uploadDir . $newFileName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $photoPath = 'uploads/profile_photos/' . $newFileName; // relative path to store in DB
        } else {
            die('Failed to upload photo.');
        }
    }

    $role = 'student';
    $insertStmt = $conn->prepare('INSERT INTO users (uname, email, password, role, phone, address, photo) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $insertStmt->bind_param('sssssss', $fullname, $email, $password, $role, $phone, $address, $photoPath);
    $insertStmt->execute();

    $_SESSION['user_id'] = $insertStmt->insert_id;
    $_SESSION['user_name'] = $fullname;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $role;
    $_SESSION['user_phone'] = $phone;
    $_SESSION['user_address'] = $address;
    if($photoPath) {
        $_SESSION['user_photo'] = $photoPath;
    }
    echo "<script>
        localStorage.setItem('userPhoto', '" . $photoPath . "');
        sessionStorage.setItem('userPhoto', '" . $photoPath . "');
    </script>";

    $insertStmt->close();

    header('Location: ../frontends/student/student_homepage.html');
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo 'Signup failed. Please try again later.';
}
?>