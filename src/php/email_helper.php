<?php
require_once('../../database/db_con.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../../php/phpmailer/src/Exception.php';
require_once '../../php/phpmailer/src/PHPMailer.php';
require_once '../../php/phpmailer/src/SMTP.php';

function sendNotification($to_email, $to_name, $subject, $message) {
    if (empty($to_email) || empty($subject) || empty($message)) {
        return false;
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'admin0928@gmail.com';
        $mail->Password   = 'nfjmpppisansytbx';
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        $mail->setFrom('admin0928@gmail.com', 'KCC EventFinder');
        $mail->addAddress($to_email, $to_name);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = nl2br($message);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function sendToAllStudents($subject, $message) {
    global $conn;

    $result = $conn->query("SELECT email, uname FROM users WHERE email IS NOT NULL");
    $sent = 0;

    while ($row = $result->fetch_assoc()) {
        if (sendNotification($row['email'], $row['uname'], $subject, $message)) {
            $sent++;
        }
    }

    return $sent;
}

function sendToAllUsers($subject, $message) {
    global $conn;

    $result = $conn->query("SELECT email, uname FROM users WHERE email IS NOT NULL");
    $sent = 0;

    while ($row = $result->fetch_assoc()) {
        if (sendNotification($row['email'], $row['uname'], $subject, $message)) {
            $sent++;
        }
    }

    return $sent;
}
?>