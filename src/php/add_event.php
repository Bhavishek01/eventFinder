<?php

// Include database connection
require_once('../database/db_con.php');

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
$status = $_POST['eventStatus'] ?? '';
$volunteersNeeded = (int)($_POST['volunteersNeeded'] ?? 0);


$createdBy = 'admin1';

try {
    // Prepare the SQL statement
    $sql = "INSERT INTO events (category, ename, description, status, date, time, venue, volunteers_needed, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    // Bind parameters
    $stmt->bind_param(
        'sssssssis',
        $category,
        $eventName,
        $description,
        $status,
        $date,
        $time,
        $location,
        $volunteersNeeded,
        $createdBy
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