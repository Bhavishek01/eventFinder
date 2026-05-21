<?php
require_once '../../database/db_con.php';
session_start();
header('Content-Type: application/json');

$item_id   = isset($_GET['item_id'])  ? intval($_GET['item_id'])        : 0;
$item_type = isset($_GET['type'])     ? strtolower(trim($_GET['type']))  : '';

$body      = json_decode(file_get_contents('php://input'), true);
$new_status = isset($body['status']) ? trim($body['status']) : '';


try {
    if ($item_type === 'lost') {
        $stmt = $conn->prepare("UPDATE lost_items SET status = ? WHERE lost_item_id = ?");
    } else {
        $stmt = $conn->prepare("UPDATE found_items SET status = ? WHERE found_item_id = ?");
    }

    $stmt->bind_param("si", $new_status, $item_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update status']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>