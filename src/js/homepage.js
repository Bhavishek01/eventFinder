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

async function loadCurrentUserProfile() {
    try {
        const res = await fetch('../php/get_current_user.php');
        const data = await res.json();

        if (data.success && data.user) {
            const profilePic = document.getElementById('userProfilePic');
            if (profilePic) {
                profilePic.src = '../' + data.user.photo;
            }
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }
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
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) themeOptions.style.display = 'none';
    }
}


function goToProfile() {

    alert('Profile page will be available soon!');
    
}


function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('theme');
        
        window.location.href = 'index.php';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEvents();
    loadRecentEvents();
    switchMainSection('home');
    loadCurrentUserProfile();
});