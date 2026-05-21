<?php
session_start();
require_once '../../database/db_con.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

// Get all Lost + Found items, sorted by date (newest first)
$sql = "
    (SELECT 'lost' as item_type, lost_item_id as id, item_name, description, lost_location as location, 
            lost_date as report_date, item_photo, created_at, status
     FROM lost_items WHERE status != 'claimed')
    
    UNION ALL
    
    (SELECT 'found' as item_type, found_item_id as id, item_name, description, found_location as location, 
            found_date as report_date, item_photo, created_at, status
     FROM found_items WHERE status != 'returned')
    
    ORDER BY report_date DESC, created_at DESC
";

$result = $conn->query($sql);
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

$conn->close();
?>