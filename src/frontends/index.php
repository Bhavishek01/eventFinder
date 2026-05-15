<?php

include '../database/db_con.php';
session_start();

// if (isset($_SESSION['user_id']) || isset($_COOKIE['remember_login'])) {
//     if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
//         header('Location: ../frontends/admin_homepage.html');
//     } else {
//         header('Location: ../frontends/student_homepage.html');
//     }
//     exit();
// }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventFinder - Discover Events</title>
    <link rel="stylesheet" href="../css/homepage.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <h2>Event Finder</h2>
            </div>
            <div class="nav-buttons">
                <a href="login.html" class="btn login">Login</a>
                <a href="signup.html" class="btn signup">Sign Up</a>
                <button class="btn theme-toggle-btn" id="themeToggleBtn" type="button" aria-label="Toggle theme"></button>
            </div>
        </div>
    </nav>

    <!-- header Section -->
    <section class="header">
        <div class="header-content">
            <h1>Discover College Events</h1>
            <p>Find and attend the best events happening in your college</p>
            <div class="header-buttons">
                <a href="#footer" class="btn btn-pri">Explore Events</a>
                <a href="#footer" class="btn btn-pri">About us</a>
                <a href="#footer" class="btn btn-pri">Contact</a>
                <a href="signup.html" class="btn btn-sec">Get Started</a>
            </div>
        </div>
    </section>

        <!-- Home Section -->
    <section class="events-section content-section active" id="homeSection" role="tabpanel">
        <div class="container">
            <h2 class="section-title">Upcoming Events</h2>
            <div class="events-grid" id="eventsGrid">
                
            </div>

            <div class="home-subsection">
                <h2 class="section-title">Popular Events</h2>
                <div class="events-grid" id="popularEventsGrid">
                    
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>EventFinder</h4>
                    <p>A platform to discover and join events organized by our college department and clubs.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 EventFinder. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../js/toggle_modes.js"></script>
    <script src="../js/homepage_only.js"></script>
    <script src="../js/modal.js"></script>
</body>
</html>