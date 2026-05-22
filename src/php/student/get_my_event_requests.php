<?php
// php/student/get_my_event_requests.php
// Returns all event requests submitted by the logged-in student,
// including current approval status.

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
            request_id,
            ename          AS event_name,
            category,
            description,
            date           AS event_date,
            time           AS event_time,
            venue,
            volunteers_needed,
            status,
            created_at
        FROM event_requests
        WHERE student_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId]);
    $rows = $stmt->get_result()->fetch_all(PDO::FETCH_ASSOC);

    echo json_encode($rows);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}