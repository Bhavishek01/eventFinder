<?php

$conn = new mysqli("localhost", "root", "", "eventfinder0");

if ($conn->connect_error) 
    {
        alert("Database connection unsuccessful!");
    }
else 
    {
        alert("Database connection successful!");
    }

?>