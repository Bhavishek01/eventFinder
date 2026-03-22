<?php
session_start();
require_once __DIR__ . '/../database/db_con.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../htmls/signup.html');
    exit;
}

$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');
$confirmPassword = trim($_POST['confirm_password'] ?? '');

if ($fullname === '' || $email === '' || $password === '' || $confirmPassword === '') {
    die('All fields are required.');
}

if ($password !== $confirmPassword) {
    die('Password and confirm password do not match.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die('Invalid email format.');
}

if (!preg_match('/@kcc\.edu\.np$/i', $email)) {
    die('Only college email accounts are allowed for signup.');
}

try {
    $checkStmt = $conn->prepare('SELECT user_id FROM users WHERE email = ? LIMIT 1');
    $checkStmt->bind_param('s', $email);
    $checkStmt->execute();
    $existingUser = $checkStmt->get_result()->fetch_assoc();
    $checkStmt->close();

    if ($existingUser) {
        die('An account with this email already exists.');
    }

    $baseUsername = strstr($email, '@', true);
    $username = $baseUsername ?: strtolower(str_replace(' ', '', $fullname));
    $counter = 1;

    while (true) {
        $userCheck = $conn->prepare('SELECT user_id FROM users WHERE uname = ? LIMIT 1');
        $userCheck->bind_param('s', $username);
        $userCheck->execute();
        $hasUsername = $userCheck->get_result()->fetch_assoc();
        $userCheck->close();

        if (!$hasUsername) {
            break;
        }

        $username = $baseUsername . $counter;
        $counter++;
    }

    $role = 'student';
    $insertStmt = $conn->prepare('INSERT INTO users (uname, email, password, role) VALUES (?, ?, ?, ?)');
    $insertStmt->bind_param('ssss', $username, $email, $password, $role);
    $insertStmt->execute();

    $_SESSION['user_id'] = $insertStmt->insert_id;
    $_SESSION['user_name'] = $fullname;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $role;

    $insertStmt->close();

    header('Location: ../htmls/homepage.html');
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Signup failed. Please try again later.';
}
?>