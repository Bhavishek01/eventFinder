<?php
session_start();
session_destroy();

// Clear remember cookie
setcookie("remember_login", "", time() - 3600, "/");

header("Location: index.php");
exit();
?>