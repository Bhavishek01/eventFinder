<?php

$conn = new mysqli("localhost", "root", "", "eventfinder0");

if ($conn->connect_error) 
    {
        echo("Database connection unsuccessful!");
    }
else 
    {
        $msg = "Connected to database 'eventfinder0' successfully!";
        echo "<script>alert('" . addslashes($msg) . "');</script>";
    }

?>