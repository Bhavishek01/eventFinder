<?php
session_start();
require_once '../../database/db_con.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$item_id = (int)$_GET['item_id'];
$item_type = $_GET['type'] ?? '';

if (!$item_id || !in_array($item_type, ['lost', 'found'])) {
    echo json_encode(['error' => 'Invalid parameters']);
    exit;
}

if ($item_type === 'lost') {
    $stmt = $conn->prepare("SELECT *
                           FROM lost_items 
                           WHERE lost_item_id = ?");
} else {
    $stmt = $conn->prepare("SELECT *
                           FROM found_items
                           WHERE found_item_id = ?");
}

$stmt->bind_param("i", $item_id);
$stmt->execute();
$result = $stmt->get_result();
$item = $result->fetch_assoc();

if ($item) {
    $item['item_type'] = $item_type;
    echo json_encode($item);
} else {
    echo json_encode(['error' => 'Item not found']);
}

$stmt->close();
$conn->close();
?>