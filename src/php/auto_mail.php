<?php
// Automated mail data (no form required).
$_POST['name'] = 'Admin';
$_POST['email'] = 'admin0928@gmail.com';
$_POST['subject'] = 'About upcoming event';
$_POST['participant'] = 'bhavishek8bit23@kcc.edu.np'; // Replace with actual participant email
$_POST['message'] = 'Hello, I am interested in learning more about the upcoming event. Could you please provide me with more details? Thank you!';

include '../php/mail.php';
?>