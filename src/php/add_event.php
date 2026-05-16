<?php

// Include database connection
require_once('../database/db_con.php');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set header to return JSON
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get the form data
$eventName = trim($_POST['eventName'] ?? '');
$category = trim($_POST['eventCategory'] ?? '');
$location = trim($_POST['eventLocation'] ?? '');
$description = trim($_POST['eventDescription'] ?? '');
$date = $_POST['eventDate'] ?? '';
$time = $_POST['eventTime'] ?? '';
$volunteersNeeded = (int)($_POST['volunteersNeeded'] ?? 0);
$photoPath = null;

$createdBy = $_SESSION['user_id'] ?? null;

if (isset($_FILES['eventPhoto']) && $_FILES['eventPhoto']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['eventPhoto'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!in_array($file['type'], $allowedTypes)) {
            die('Only JPG, PNG, GIF and WebP images are allowed.');
        }

        $uploadDir = __DIR__ . '/../uploads/event_photos/';
        
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newFileName = 'event_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
        $targetPath = $uploadDir . $newFileName;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $photoPath = 'uploads/event_photos/' . $newFileName; // relative path to store in DB
        } else {
            die('Failed to upload photo.');
            exit;
        }
}

try {
    // Prepare the SQL statement
    $sql = "INSERT INTO events (category, ename, description, date, time, venue, volunteers_needed, created_by, photo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    // Bind parameters
    $stmt->bind_param(
        'ssssssiss',
        $category,
        $eventName,
        $description,
        $date,
        $time,
        $location,
        $volunteersNeeded,
        $createdBy,
        $photoPath
    );

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Event created successfully!',
            'event_id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating event: ' . $stmt->error]);
    }

    $stmt->close();
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
    exit;
}

$conn->close();
?>