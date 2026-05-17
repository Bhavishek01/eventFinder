<?php
session_start();
if (!isset($_SESSION['user_role'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once '../../database/db_con.php';

// FIX 1: Read event_id from POST (form data), not GET
$event_id = isset($_POST['event_id']) ? intval($_POST['event_id']) : 0;

if (!$event_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid event ID']);
    exit;
}

$user_name = $_SESSION['user_name'] ?? null;
$item_name  = trim($_POST['item_name']    ?? '');
$description = trim($_POST['description'] ?? '');
$location   = trim($_POST['location']     ?? '');
$item_type  = $_POST['item_type']         ?? '';

// FIX 2: Correct the inverted condition — fetch event date when event_id IS valid
try {
    $sql = "SELECT date FROM events WHERE event_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $event_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $event_date = $row['date'];  // use actual event date from DB
    } else {
        echo json_encode(['success' => false, 'message' => 'Event not found']);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error fetching event']);
    exit;
}

$photoPath = null;
if (isset($_FILES['item_photo']) && $_FILES['item_photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['item_photo'];
    $uploadDir = __DIR__ . '/../../uploads/item_photos/';
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'item_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
    $targetPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $photoPath = 'uploads/item_photos/' . $newFileName;
    }
}

try {
    if ($item_type === 'lost') {
        $sql = "INSERT INTO lost_items (reported_by, item_name, description, lost_location, lost_date, item_photo) 
                VALUES (?, ?, ?, ?, ?, ?)";
    } else {
        $sql = "INSERT INTO found_items (reported_by, item_name, description, found_location, found_date, item_photo) 
                VALUES (?, ?, ?, ?, ?, ?)";
    }

    $stmt = $conn->prepare($sql);
    // FIX 3: Use $event_date (not the undefined $item_date)
    $stmt->bind_param("ssssss", $user_name, $item_name, $description, $location, $event_date, $photoPath);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item reported successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$stmt->close();
$conn->close();
?>