<?php
session_start();
session_destroy();

setcookie("remember_login", "", time() - 3600, "/");

header("Location: index.php");
exit();
?>