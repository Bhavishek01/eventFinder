// Sample event data
const eventsData = [
    {
        id: 1,
        title: "Annual Tech Conference 2026",
        date: "April 15, 2026",
        location: "Kantipur City College",
        time: "9:00 AM - 5:00 PM",
        description: "Join industry leaders and innovators for a day of inspiring talks, workshops, and networking opportunities.",
        attendees: 250,
        spots_available: 50
    },
    {
        id: 2,
        title: "Spring Music Festival",
        date: "May 10, 2026",
        location: "City Amphitheater",
        time: "6:00 PM - 11:00 PM",
        description: "Experience live performances from local and international artists. A three-day celebration of music.",
        attendees: 500,
        spots_available: 200
    },
    {
        id: 3,
        title: "Community Sports Day",
        date: "March 28, 2026",
        location: "City Sports Complex",
        time: "7:00 AM - 3:00 PM",
        description: "Participate in various sports activities and compete with community members. All skill levels welcome!",
        attendees: 150,
        spots_available: 100
    },
    {
        id: 4,
        title: "Art Exhibition Opening",
        date: "April 5, 2026",
        location: "City Art Gallery",
        time: "5:00 PM - 8:00 PM",
        description: "Explore contemporary art from talented local artists. Opening reception with refreshments.",
        attendees: 120,
        spots_available: 80
    },
    {
        id: 5,
        title: "Business Networking Night",
        date: "April 20, 2026",
        location: "Downtown Business Hub",
        time: "6:30 PM - 9:30 PM",
        description: "Connect with entrepreneurs and business professionals. Perfect for startups and corporates.",
        attendees: 100,
        spots_available: 40
    },
    {
        id: 6,
        title: "Cooking Workshop",
        date: "May 2, 2026",
        location: "Community Kitchen",
        time: "2:00 PM - 5:00 PM",
        description: "Learn culinary skills from professional chefs. This workshop covers international cuisine.",
        attendees: 40,
        spots_available: 20
    }
];

// Initialize events on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

// Load and display events
function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    eventsData.forEach(event => {
        const eventCard = `
            <div class="event-card">
                <div class="event-card-header">
                    <h3>${event.title}</h3>
                    <span class="event-card-date">${event.date}</span>
                </div>
                <div class="event-card-body">
                    <p>${event.description}</p>
                </div>
                <div class="event-card-footer">
                    <button class="btn btn-more" onclick="viewEventDetails(${event.id})">View Details</button>
                </div>
            </div>
        `;
        eventsGrid.innerHTML += eventCard;
    });
}

// Navigate to login page
function goToLogin() {
    window.location.href = 'login.html';
}

// Navigate to signup page
function goToSignup() {
    window.location.href = 'signup.html';
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
}

// Close login modal
function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
}

// Open signup modal
function openSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('show');
}

// Close signup modal
function closeSignup() {
    const modal = document.getElementById('signupModal');
    modal.classList.remove('show');
}

// Switch from login to signup
function switchToSignup() {
    closeLogin();
    openSignupModal();
}

// Switch from signup to login
function switchToLogin() {
    closeSignup();
    openLoginModal();
}

// View event details
function viewEventDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const content = `
        <div class="event-details">
            <h2>${event.title}</h2>
            
            <div class="event-meta">
                <div class="meta-item">
                    <strong>📅 Date</strong>
                    <span>${event.date}</span>
                </div>
                <div class="meta-item">
                    <strong>🕐 Time</strong>
                    <span>${event.time}</span>
                </div>
                <div class="meta-item">
                    <strong>📍 Location</strong>
                    <span>${event.location}</span>
                </div>
                <div class="meta-item">
                    <strong>👥 Attendees</strong>
                    <span>${event.attendees} registered</span>
                </div>
            </div>
            
            <div class="event-description">
                <h3>About This Event</h3>
                <p>${event.description}</p>
            </div>
            
            <div class="event-meta" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
                <div class="meta-item">
                    <strong style="color: #059669;">Available Spots</strong>
                    <span>${event.spots_available} seats left</span>
                </div>
            </div>
            
            <div class="event-actions">
                <h3>Register for Event</h3>
                <div class="registration-options">
                    <button class="registration-btn" onclick="registerEvent(${eventId})">
                        Register Now
                    </button>
                    <button class="registration-btn pre-register" onclick="preRegisterEvent(${eventId})">
                        Pre-Register (Interested)
                    </button>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('eventDetailsModal');
    const contentDiv = document.getElementById('eventDetailsContent');
    contentDiv.innerHTML = content;
    modal.classList.add('show');
}

// Close event details modal
function closeEventDetailsModal() {
    const modal = document.getElementById('eventDetailsModal');
    modal.classList.remove('show');
}

// Register for event
function registerEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    alert(`✓ You have successfully registered for "${event.title}"!\n\nA confirmation email has been sent.`);
    closeEventDetailsModal();
}

// Pre-register for event
function preRegisterEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    alert(`✓ You have pre-registered for "${event.title}"!\n\nYou will receive notifications when registration opens.`);
    closeEventDetailsModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const eventDetailsModal = document.getElementById('eventDetailsModal');

    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === signupModal) {
        closeSignup();
    }
    if (event.target === eventDetailsModal) {
        closeEventDetailsModal();
    }

    // Close profile dropdown if clicking outside
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.btn-profile');
    if (profileMenu && profileBtn && event.target !== profileBtn && event.target.closest('.profile-dropdown') === null) {
        profileMenu.classList.remove('show');
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) themeOptions.style.display = 'none';
    }
}

// Toggle profile dropdown menu visibility
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('show');
        // Hide theme options when opening dropdown
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) themeOptions.style.display = 'none';
    }
}

// Toggle appearance/theme submenu visibility
function toggleAppearance() {
    const themeOptions = document.getElementById('themeOptions');
    if (themeOptions) {
        themeOptions.style.display = themeOptions.style.display === 'none' ? 'block' : 'none';
    }
}

// Set theme (light or dark)
function setTheme(theme) {
    const body = document.body;
    
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    
    // Close theme options after selection
    const themeOptions = document.getElementById('themeOptions');
    if (themeOptions) themeOptions.style.display = 'none';
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Navigate to profile page
function goToProfile() {
    // Will navigate to profile.html when created
    alert('Profile page will be available soon!');
    // window.location.href = 'profile.html';
}

// Logout user
function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('theme');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});
