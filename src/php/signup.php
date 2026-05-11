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

if ($fullname === '' || $email === '' || $password === '' || $confirmPassword === '' || $phone === '' || $address === '') {
    die('All fields are required.');
}

try {
    $checkStmt = $conn->prepare('SELECT email FROM users WHERE email = ? LIMIT 1');
    $checkStmt->bind_param('s', $email);
    $checkStmt->execute();
    $existingUser = $checkStmt->get_result()->fetch_assoc();
    $checkStmt->close();

    if ($existingUser) {
        die('An account with this email already exists.');
    }

    $role = 'student';
    $insertStmt = $conn->prepare('INSERT INTO users (uname, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)');
    $insertStmt->bind_param('ssssss', $fullname, $email, $password, $role, $phone, $address);
    $insertStmt->execute();

    $_SESSION['user_id'] = $insertStmt->insert_id;
    $_SESSION['user_name'] = $fullname;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $role;
    $_SESSION['user_phone'] = $phone;
    $_SESSION['user_address'] = $address;

    $insertStmt->close();

    header('Location: ../frontends/student_homepage.html');
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo 'Signup failed. Please try again later.';
}
?>