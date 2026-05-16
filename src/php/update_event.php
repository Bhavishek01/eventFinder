<?php
require_once('../database/db_con.php');
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$event_id = (int)$_POST['event_id'];
$ename = trim($_POST['eventName'] ?? '');
$category = trim($_POST['eventCategory'] ?? '');
$venue = trim($_POST['eventLocation'] ?? '');
$description = trim($_POST['eventDescription'] ?? '');
$date = $_POST['eventDate'] ?? '';
$time = $_POST['eventTime'] ?? '';
$volunteers_needed = (int)($_POST['volunteersNeeded'] ?? 0);
$updated_by = $_SESSION['user_id'] ?? null;

if (!$event_id || empty($ename) || empty($category) || empty($date)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$photoPath = null;

// Handle photo upload if provided
if (isset($_FILES['eventPhoto']) && $_FILES['eventPhoto']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['eventPhoto'];
    $uploadDir = __DIR__ . '/../uploads/event_photos/';
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'event_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
    $targetPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $photoPath = 'uploads/event_photos/' . $newFileName;
    }
}

try {
    if ($photoPath) {
        $sql = "UPDATE events SET ename=?, category=?, description=?, date=?, time=?, 
                venue=?, volunteers_needed=?, updated_by=?, photo=? WHERE event_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssissi", $ename, $category, $description, $date, $time, 
                         $venue, $volunteers_needed, $updated_by, $photoPath, $event_id);
    } else {
        $sql = "UPDATE events SET ename=?, category=?, description=?, date=?, time=?, 
                venue=?, volunteers_needed=?, updated_by=? WHERE event_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssisi", $ename, $category, $description, $date, $time, 
                         $venue, $volunteers_needed, $updated_by, $event_id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Event updated successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>