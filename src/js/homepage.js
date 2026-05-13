function loadUpcomingEvents() {
    fetch('../php/get_upcoming_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('eventsGrid');
            if(!grid) return;
            grid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-card-header"><h3>${event.ename}</h3><span class="event-card-date">${event.date}</span></div>
                    <div class="event-card-body"><p>${event.description.substring(0,100)}...</p></div>
                    <div class="event-card-footer"><button class="btn btn-more" onclick="viewEventDetails(${event.event_id})">View Details</button></div>
                </div>
            `).join('');
        });
}

function loadRecentEvents() {
    fetch('../php/get_recent_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('recentEventsGrid');
            if(!grid) return;
            grid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-card-header"><h3>${event.ename}</h3><span class="event-card-date">${event.date}</span></div>
                    <div class="event-card-body"><p>${event.description.substring(0,100)}...</p></div>
                    <div class="event-card-footer"><button class="btn btn-more" onclick="viewEventDetails(${event.event_id})">View Details</button></div>
                </div>
            `).join('');
        });
}

function viewEventDetails(eventId) {
    fetch(`../php/get_event_details.php?event_id=${eventId}`)
        .then(res => res.json())
        .then(event => {

            const content = `
                <div class="event-details">
                    <h2>${event.ename}</h2>
                    <div class="event-meta">
                        <div class="meta-item"><strong>Date</strong><span>${event.date}</span></div>
                        <div class="meta-item"><strong>Time</strong><span>${event.time}</span></div>
                        <div class="meta-item"><strong>Location</strong><span>${event.venue}</span></div>
                        <div class="meta-item"><strong>Status</strong><span>${event.status}</span></div>
                    </div>
                    <div class="event-description"><h3>About</h3><p>${event.description}</p></div>
                    <div class="event-actions"><button class="registration-btn" onclick="registerForEvent(${event.event_id})">Register Now</button></div>
                </div>
            `;
            document.getElementById('eventDetailsContent').innerHTML = content;
            document.getElementById('eventDetailsModal').classList.add('show');
        });
}


function switchMainSection(sectionName) {
    const homeSection = document.getElementById('homeSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const homeTabBtn = document.getElementById('homeTabBtn');
    const dashboardTabBtn = document.getElementById('dashboardTabBtn');

    if (!homeSection || !dashboardSection || !homeTabBtn || !dashboardTabBtn) return;

    if (sectionName === 'dashboard') {
        homeSection.classList.remove('active');
        dashboardSection.classList.add('active');
        homeTabBtn.classList.remove('active');
        dashboardTabBtn.classList.add('active');
        homeTabBtn.setAttribute('aria-selected', 'false');
        dashboardTabBtn.setAttribute('aria-selected', 'true');
        homeSection.setAttribute('aria-hidden', 'true');
        dashboardSection.setAttribute('aria-hidden', 'false');
    } else {
        dashboardSection.classList.remove('active');
        homeSection.classList.add('active');
        dashboardTabBtn.classList.remove('active');
        homeTabBtn.classList.add('active');
        dashboardTabBtn.setAttribute('aria-selected', 'false');
        homeTabBtn.setAttribute('aria-selected', 'true');
        dashboardSection.setAttribute('aria-hidden', 'true');
        homeSection.setAttribute('aria-hidden', 'false');
    }
}

function goToLogin() {
    window.location.href = 'login.html';
}

function goToSignup() {
    window.location.href = 'signup.html';
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('show');
}

function closeSignup() {
    const modal = document.getElementById('signupModal');
    modal.classList.remove('show');
}

function switchToSignup() {
    closeLogin();
    openSignupModal();
}

function switchToLogin() {
    closeSignup();
    openLoginModal();
}

function closeEventDetailsModal() {
    const modal = document.getElementById('eventDetailsModal');
    modal.classList.remove('show');
}

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

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('show');
        // Hide theme options when opening dropdown
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) themeOptions.style.display = 'none';
    }
}

function toggleAppearance() {
    const themeOptions = document.getElementById('themeOptions');
    if (themeOptions) {
        themeOptions.style.display = themeOptions.style.display === 'none' ? 'block' : 'none';
    }
}


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

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function goToProfile() {
    // Will navigate to profile.html when created
    alert('Profile page will be available soon!');
    // window.location.href = 'profile.html';
}


function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('theme');
        
        // Redirect to login page
        window.location.href = 'index.php';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadUpcomingEvents();
    loadRecentEvents();
    switchMainSection('home');
});