function loadUpcomingEvents() {
    fetch('../../php/get_upcoming_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('eventsGrid');
            if (!grid) return;

            grid.innerHTML = events.map(event => {
                const photoPath = event.photo 
                    ? '../../' + event.photo 
                    : '';

                return `
                    <div class="event-card-new">
                        <div class="event-card-header" ${photoPath ? `style="background-image: url('${photoPath}'); border-radius: 5px;"` : '' }>
                            <h3>${event.ename}</h3>
                            <span class="event-category">${event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'N/A'}</span>
                            <span class="event-card-date">${event.date}</span>
                        </div>
                        <div class="event-card-body">
                            <p>${event.description.substring(0, 100)}…</p>
                        </div>
                        <div class="event-card-footer">
                            <button class="btn btn-more" onclick="viewEventDetails(${event.event_id})">View Details</button>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => console.error(err));
}

function loadRecentEvents() {
    fetch('../../php/get_recent_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('recentEventsGrid');
            if (!grid) return;
            grid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-card-header">
                        <h3>${event.ename}</h3>
                        <span class="event-category">${event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'N/A'}</span>
                        <span class="event-card-date">${event.date}</span>
                    </div>
                    <div class="event-card-body">
                        <p>${event.description.substring(0, 100)}…</p>
                    </div>
                    <div class="event-card-footer">
                        <button class="btn btn-more" onclick="viewEventDetails(${event.event_id})">View Details</button>
                    </div>
                </div>
            `).join('');
        });
}

function viewEventDetails(eventId) {
    // modal.js handles fetching the HTML shell, injecting it, and showing the overlay
    openModal('../../frontends/event_details_modal.html', 'eventDetailsModal', function() {
        fetch(`../../php/get_event_details.php?event_id=${eventId}`)
            .then(res => res.json())
            .then(event => {
                const photoPath = event.photo
                    ? '../../' + event.photo
                    : '../../uploads/event_photos/default.jpg';

                const eventDate = new Date(event.date);
                const currentDate = new Date();

                currentDate.setHours(0, 0, 0, 0);
                eventDate.setHours(0, 0, 0, 0);

                let status = "";

                if (eventDate > currentDate) {
                    status = "Upcoming";
                } else if (eventDate < currentDate) {
                    status = "Completed";
                } else {
                    status = "Today";
                }

                // Volunteer button: disabled when volunteers_needed is falsy (0 / null / undefined)
                const volunteersNeeded = parseInt(event.volunteers_needed) || 0;
                const volunteerDisabled  = volunteersNeeded === 0 ? 'disabled' : '';
                const volunteerTitle     = volunteersNeeded === 0
                    ? 'title="No volunteers needed for this event"'
                    : `title="Register as  volunteer"`;
                
                const content = `
                    <div class="event-photo">
                        <img
                            src="${photoPath}"
                            alt="${event.ename}"
                            onerror="this.src='../../uploads/event_photos/default.jpg'"
                            style="width:100%; height:250px; object-fit:cover; border-radius:5px;">
                    </div>

                    <div class="event-details">
                        <h2>${event.ename}</h2>

                        <div class="event-meta">
                            <div class="meta-item">
                                <strong>Category</strong>
                                <span>${event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Date</strong>
                                <span>${event.date}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Time</strong>
                                <span>${event.time || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Location</strong>
                                <span>${event.venue || event.location || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Status</strong>
                                <span >${status}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Volunteers Needed</strong>
                                <span>${volunteersNeeded > 0 ? volunteersNeeded : 'None'}</span>
                            </div>
                        </div>

                        <div class="event-description">
                            <h3>About This Event</h3>
                            <p>${event.description}</p>
                        </div>

                        <div class="action-buttons">
                            <button
                                class="registration-btn"
                                onclick="registerForEvent(${event.event_id}, 'participant')"
                                title="Register as a participant">
                                ✅ Participate
                            </button>
                            <button
                                class="volunteer-btn"
                                onclick="registerForEvent(${event.event_id}, 'volunteer')"
                                ${volunteerDisabled}
                                ${volunteerTitle}>
                                🙋 Volunteer
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('eventDetailsContent').innerHTML = content;
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
                document.getElementById('eventDetailsContent').innerHTML =
                    `<p style="color:red; text-align:center;">Failed to load event details.</p>`;
            });
    });
}

function switchMainSection(sectionName) {
    const homeSection      = document.getElementById('homeSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const homeTabBtn       = document.getElementById('homeTabBtn');
    const dashboardTabBtn  = document.getElementById('dashboardTabBtn');

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
        const res  = await fetch('../../php/get_current_user.php');
        const data = await res.json();
        if (data.success && data.user) {
            const profilePic = document.getElementById('userProfilePic');
            if (profilePic) profilePic.src = '../../' + data.user.photo;
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
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
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('theme');

        window.location.href = '../index.php';
    }
}

function initializeEscapeKeyHandler() {
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        const openModal = document.querySelector('.modal.show');
        if (openModal) closeModal(openModal.id);
    });
}

function initializeBackdropClickHandler() {
    document.addEventListener('click', function(e) {
        // Only trigger when the click lands directly on the overlay (not its children)
        if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
            closeModal(e.target.id);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEvents();
    loadRecentEvents();
    switchMainSection('home');
    loadCurrentUserProfile();

    initializeEscapeKeyHandler();
    initializeBackdropClickHandler();
});

function registerForEvent(eventId, pType) {
    fetch('../../php/student/register_event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, p_type: pType })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(`Successfully registered as ${pType} for this event!`);
            // closeModal() is provided by modal.js
            closeModal('eventDetailsModal');
            if (typeof loadUpcomingEvents === 'function') loadUpcomingEvents();
            if (typeof loadRecentEvents   === 'function') loadRecentEvents();
        } else {
            alert('Error: ' + (data.message || 'Failed to register for event'));
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert('Network error: Could not register for event. Please try again.');
    });
}

// ── window.onclick: delegate to modal.js for event-details, keep rest ─────
window.onclick = function(event) {
    const loginModal   = document.getElementById('loginModal');
    const signupModal  = document.getElementById('signupModal');

    if (loginModal  && event.target === loginModal)  closeLogin();
    if (signupModal && event.target === signupModal) closeSignup();

    // Profile dropdown close
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn  = document.querySelector('.btn-profile');
    if (profileMenu && profileBtn
        && event.target !== profileBtn
        && event.target.closest('.profile-dropdown') === null) {
        profileMenu.classList.remove('show');
        const themeOptions = document.getElementById('themeOptions');
        if (themeOptions) themeOptions.style.display = 'none';
    }
    // Note: eventDetailsModal backdrop click is handled by modal.js initializeBackdropClickHandler()
};