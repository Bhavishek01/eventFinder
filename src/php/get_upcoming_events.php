<?php
session_start();
require_once '../database/db_con.php';
$result = $conn->query("SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC LIMIT 20");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>