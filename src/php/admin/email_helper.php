<?php
require_once 'mail.php';   // your existing mail.php

function sendTemplateEmail($template_name, $recipient_email, $recipient_name, $data = []) {
    
    global $conn;
    $stmt = $conn->prepare("SELECT subject, message FROM mails WHERE template_name = ?");
    $stmt->bind_param("s", $template_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $template = $result->fetch_assoc();
    $stmt->close();

    if (!$template) {
        return false;
    }

    $subject = $template['subject'];
    $message = $template['message'];

    // Replace placeholders
    $subject = str_replace('{name}', $recipient_name, $subject);
    $message = str_replace('{name}', $recipient_name, $message);

    foreach ($data as $key => $value) {
        $subject = str_replace('{' . $key . '}', $value, $subject);
        $message = str_replace('{' . $key . '}', $value, $message);
    }

    // Prepare for your existing mail.php
    $_POST['email'] = 'admin0928@gmail.com';     // sender
    $_POST['name']  = 'KCC EventFinder';
    $_POST['subject'] = $subject;
    $_POST['participant'] = $recipient_email;
    $_POST['message'] = nl2br($message);

    // Call your existing mailer
    include 'mail.php';   // or better to make a function

    return true;
}