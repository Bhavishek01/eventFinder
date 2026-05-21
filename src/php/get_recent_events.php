<?php
session_start();
require_once '../database/db_con.php';

$result = $conn->query("SELECT * FROM events WHERE date < CURDATE() ORDER BY date DESC LIMIT 4");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>