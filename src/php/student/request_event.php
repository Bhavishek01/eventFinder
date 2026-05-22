<?php
require_once('../../database/db_con.php');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$ename = trim($_POST['eventName'] ?? '');
$student_name = $_SESSION['user_name'] ?? null;  
$student_id = $_SESSION['user_id'] ?? null;
$category = trim($_POST['eventCategory'] ?? '');
$venue = trim($_POST['eventLocation'] ?? '');
$description = trim($_POST['eventDescription'] ?? '');
$date = $_POST['eventDate'] ?? '';
$time = $_POST['eventTime'] ?? '';
$volunteers_needed = (int)($_POST['volunteersNeeded'] ?? 0);
$photoPath = null;

$photoPath = null;
if (isset($_FILES['eventPhoto']) && $_FILES['eventPhoto']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['eventPhoto'];
    $uploadDir = __DIR__ . '/../../uploads/req_event_photos/';

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'event_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
    $targetPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $photoPath = '../uploads/req_event_photos/' . $newFileName;
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save uploaded photo.']);
        exit;
    }
}

if(!$time)
    {
        $time = '10:00:00';
    }

try {
    $sql = "INSERT INTO event_requests (student_id, student_name, ename, category, description, date, time, venue, volunteers_needed, photo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssis", $student_id, $student_name, $ename, $category, $description, $date, $time, $venue, $volunteers_needed, $photoPath);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Request submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit request']);
    }
    $stmt->close();
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
    exit;
}

$conn->close();

?>