<?php
require_once '../../database/db_con.php';
session_start();

$request_id = (int)($_POST['request_id'] ?? 0);
$operation  = $_POST['doThis'] ?? ''; 
$current_date = date('Y-m-d H:i:s');

try {
    $stmt = $conn->prepare("SELECT * FROM event_requests WHERE request_id = ?");
    $stmt->bind_param("i", $request_id);
    $stmt->execute();
    $request = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$request) {
        echo json_encode(['success' => false, 'message' => 'Request not found']);
        exit;
    }
    if ($operation === 'approve') {
        $sql = "INSERT INTO events (ename, category, description, date, time, venue, photo, volunteers_needed, created_by, updated_by, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssiiiss",
            $request['ename'],        // s
            $request['category'],     // s
            $request['description'],  // s
            $request['date'],         // s
            $request['time'],         // s
            $request['venue'],        // s
            $request['photo'],        // s
            $request['volunteers_needed'], // i
            $request['student_id'],        // i
            $_SESSION['user_id'],          // i
            $request['created_at'],   // s
            $current_date       // s
        );
        $stmt->execute();
        $stmt->close();

        // Update request status
        $stmt = $conn->prepare("UPDATE event_requests SET status = 'approved' WHERE request_id = ?");
        $stmt->bind_param("i", $request_id);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'approved']);

    } else { // reject
        $stmt = $conn->prepare("UPDATE event_requests SET status = 'rejected' WHERE request_id = ?");
        $stmt->bind_param("i", $request_id);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'rejected']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

$conn->close();
?>