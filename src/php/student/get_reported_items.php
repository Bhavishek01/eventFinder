<?php
// php/student/get_reported_items.php
// Returns all lost & found items reported by the logged-in user.
// lost_items and found_items store reporter name as string (reported_by),
// so we match against the session user's uname.

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once '../../database/db_con.php';

try {
    $userId = (int) $_SESSION['user_id'];

    // Fetch the logged-in user's name (reported_by is stored as string)
    $stmtUser = $conn->prepare("SELECT uname FROM users WHERE user_id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->get_result()->fetch_assoc();

    if (!$user) {
        echo json_encode([]);
        exit;
    }

    $uname = $user['uname'];

    // Lost items reported by this user
    $stmtLost = $conn->prepare("
        SELECT
            lost_item_id   AS item_id,
            item_name,
            description,
            lost_location  AS location,
            item_photo,
            lost_date      AS report_date,
            status,
            created_at,
            'lost'         AS item_type
        FROM lost_items
        WHERE reported_by = ?
        ORDER BY created_at DESC
    ");
    $stmtLost->execute([$uname]);
    $lostItems = $stmtLost->get_result()->fetch_all(MYSQLI_ASSOC);

    // Found items reported by this user
    $stmtFound = $conn->prepare("
        SELECT
            found_item_id  AS item_id,
            item_name,
            description,
            found_location AS location,
            item_photo,
            found_date     AS report_date,
            status,
            created_at,
            'found'        AS item_type
        FROM found_items
        WHERE reported_by = ?
        ORDER BY created_at DESC
    ");
    $stmtFound->execute([$uname]);
    $foundItems = $stmtFound->get_result()->fetch_all(MYSQLI_ASSOC);

    // Merge and sort by created_at descending
    $all = array_merge($lostItems, $foundItems);
    usort($all, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));

    echo json_encode($all);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}