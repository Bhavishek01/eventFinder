<?php
session_start();
require_once __DIR__ . '/../database/db_con.php';

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');


try {
    $stmt = $conn->prepare('SELECT user_id, uname, email, password, role, phone, address FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user || $user['password'] !== $password) {
        $error = "Invalid email or password. Please try again.";
        $_SESSION['login_error'] = $error;
        header('Location: ../frontends/login.html?error=1');
        exit;
    }

    // Clear any previous error
    unset($_SESSION['login_error']);

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['user_name'] = $user['uname'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'] ;
    $_SESSION['user_phone'] = $user['phone'] ;
    $_SESSION['user_address'] = $user['address'];
    $_SESSION['user_photo'] = $user['photo'] ? $user['photo'] : 'uploads/profile_photos/default.jpg';

    if ($_SESSION['user_role'] === 'admin') {
        header('Location: ../frontends/admin/admin_homepage.html');
    } else {
        header('Location: ../frontends/student/student_homepage.html');
    }
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Login failed. Please try again later.';
}
?>