<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Please login to register for events']);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

require_once '../../database/db_con.php';

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

$event_id = isset($data['event_id']) ? intval($data['event_id']) : 0;
$p_type = isset($data['p_type']) ? trim($data['p_type']) : 'participant';
$user_id = $_SESSION['user_id'];

// Validate inputs
if (!$event_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid event ID']);
    exit;
}

if (!in_array($p_type, ['participant', 'volunteer'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid participation type']);
    exit;
}

// Check if event exists
$stmt = $conn->prepare("SELECT event_id FROM events WHERE event_id = ?");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Event not found']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Check if user is already registered for this event
$stmt = $conn->prepare("SELECT p_id FROM participators WHERE user_id = ? AND event_id = ?");
$stmt->bind_param("ii", $user_id, $event_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'You are already registered for this event']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Insert registration into participators table
$stmt = $conn->prepare("INSERT INTO participators (user_id, event_id, p_type, status) VALUES (?, ?, ?, 'pending')");
$stmt->bind_param("iis", $user_id, $event_id, $p_type);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Successfully registered for event',
        'p_type' => $p_type
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to register for event']);
}

$stmt->close();
$conn->close();
?>
