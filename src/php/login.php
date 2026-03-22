<?php
session_start();
require_once __DIR__ . '/../database/db_con.php';

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if($email === 'admin0928@gmail.com' && $password === "@Admin123") {
    header('Location: ../frontends/admin_homepage.html?error=1');
    exit;
}


try {
    $stmt = $conn->prepare('SELECT user_id, uname, email, password, role FROM users WHERE email = ? LIMIT 1');
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

    $_SESSION['user_id'] = (int) $user['user_id'];
    $_SESSION['user_name'] = $user['uname'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'] ?: 'student';

    if ($_SESSION['user_role'] === 'admin') {
        header('Location: ../frontends/admin-homepage.html');
    } else {
        header('Location: ../frontends/student-homepage.html');
    }
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Login failed. Please try again later.';
}
?>