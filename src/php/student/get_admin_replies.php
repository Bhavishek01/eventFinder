<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Combine Event Requests, Complaints with replies, and Lost Items
$sql = "
    (SELECT 'event_request' as type, er.request_id as id, er.ename, NULL as subject, er.status, er.created_at 
     FROM event_requests er 
     WHERE er.student_id = ?)

    UNION ALL

    (SELECT 'complaint' as type, c.complaint_id as id, e.ename, c.subject, c.reply as status, c.replied_at as created_at 
     FROM complaints c 
     LEFT JOIN events e ON c.event_id = e.event_id 
     WHERE c.user_id = ? AND c.reply IS NOT NULL)

    UNION ALL

    (SELECT 'lost_item' as type, li.lost_item_id as id, li.item_name as ename, NULL as subject, li.status, li.created_at 
     FROM lost_items li 
     WHERE li.reported_by = ?)

    ORDER BY created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $user_id, $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$stmt->close();
$conn->close();
?>