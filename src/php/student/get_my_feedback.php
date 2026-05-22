<?php
// php/student/get_my_feedback.php
// Returns all feedback submitted by the logged-in student,
// joined with event name and date.

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
            f.feedback_id,
            f.rating,
            f.feedback,
            f.created_at,
            e.ename,
            e.date,
            e.category,
            e.venue
        FROM feedback f
        JOIN events e ON e.event_id = f.event_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
    ");
    $stmt->execute([$userId]);
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode($rows);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}