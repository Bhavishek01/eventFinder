<?php
// php/student/get_my_complaints.php
// Returns all complaints filed by the logged-in student,
// including admin reply, replier name, and linked event name.

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once '../../database/db_con.php';

try {
    $userId = (int) $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT
            c.complaint_id,
            c.subject,
            c.complaint,
            c.reply,
            c.replied_at,
            c.created_at,
            e.ename,
            e.date,
            u.uname        

        FROM complaints c
        LEFT JOIN events  e ON e.event_id  = c.event_id
        LEFT JOIN users   u ON u.user_id   = c.replied_by
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    ");
    $stmt->execute([$userId]);
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode($rows);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}