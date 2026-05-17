<?php
session_start();
require_once '../database/db_con.php';

$result = $conn->query("SELECT c.*, u.uname, e.ename 
                       FROM complaints c 
                       LEFT JOIN users u ON c.user_id = u.user_id 
                       LEFT JOIN events e ON c.event_id = e.event_id 
                       WHERE c.reply IS NULL 
                       ORDER BY c.created_at DESC");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
$conn->close();
?>