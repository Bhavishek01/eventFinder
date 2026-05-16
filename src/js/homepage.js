function loadUpcomingEvents() {
    fetch('../php/get_upcoming_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('eventsGrid');
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

function loadRecentEvents() {
    fetch('../php/get_recent_events.php')
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
    openModal('../frontends/event_details_modal.html', 'eventDetailsModal', function() {
        fetch(`../php/get_event_details.php?event_id=${eventId}`)
            .then(res => res.json())
            .then(event => {
                const photoPath = event.photo
                    ? '../' + event.photo
                    : '../uploads/event_photos/default.jpg';

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
                            onerror="this.src='../uploads/event_photos/default.jpg'"
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
                                <span class="status-${event.status}">${event.status}</span>
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

/**
 * Register the current user for an event.
 * p_type is passed directly ('participant' or 'volunteer') — no confirm() dialog needed
 * because the user already clicked the specific button.
 */
function registerForEvent(eventId, pType) {
    fetch('../php/register_event.php', {
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

// ── Kept exactly as-is from original ──────────────────────────────────────

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

// ====================== USER MANAGEMENT ======================

function viewUserInList(userId, type) {
    console.log(`[DEBUG] viewUserInList called - ID: ${userId}, Type: ${type}`);

    if (type === 'edit_users') {
        openEditUserModal(userId);
    } else if (type === 'active_users') {
        viewUserDetails(userId);   // We'll create this simple view
    }
}

function openEditUserModal(userId) {
    openModal('../frontends/edit_user.html', 'editUserModal', function(modal) {
        loadUserForEditing(userId, modal);
        attachEditUserFormEvents(modal);
        attachModalCloseEvents(modal, 'editUserModal');
    });
}

async function loadUserForEditing(userId, modal) {
    try {
        const res = await fetch(`../php/get_user_details.php?user_id=${userId}`);
        const user = await res.json();

        document.getElementById('userId').value = user.user_id;
        document.getElementById('userName').value = user.uname;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userRole').value = user.role;
        document.getElementById('userAddress').value = user.address || '';
    } catch (err) {
        console.error(err);
        alert("Failed to load user data");
    }
}

function attachEditUserFormEvents(modal) {
    const form = modal.querySelector('#editUserForm');
    if (!form) return;
    form.removeEventListener('submit', handleEditUserSubmit);
    form.addEventListener('submit', handleEditUserSubmit);
}

async function handleEditUserSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../php/update_user.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('User updated successfully!');
            closeModal('editUserModal');
            closeModal('adminListModal');
            loadListData(currentListType); // refresh the list
        } else {
            alert('Error: ' + (data.message || 'Update failed'));
        }
    } catch (error) {
        console.error(error);
        alert('Network error. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function loadCurrentUserProfile() {
    try {
        const res  = await fetch('../php/get_current_user.php');
        const data = await res.json();
        if (data.success && data.user) {
            const profilePic = document.getElementById('userProfilePic');
            if (profilePic) profilePic.src = '../' + data.user.photo;
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }
}

// ====================== EDIT EVENT ======================

function viewEventInList(eventId, type) {
    console.log(`[DEBUG] viewEventInList called - ID: ${eventId}, Type: ${type}`);

    if (type === 'edit_event') {
        openEditEventModal(eventId);
    } 
    else if (type === 'total_events') {
        viewEventDetails(eventId);        // This will open the nice existing modal
    } 
    else {
        alert(`Not implemented yet for type: ${type}`);
    }
}

function openEditEventModal(eventId) {
    openModal('../frontends/edit_event.html', 'editEventModal', function(modal) {
        loadEventForEditing(eventId, modal);
        attachEditEventFormEvents(modal);
        
        // Explicitly attach close events (important for dynamically loaded modals)
        attachModalCloseEvents(modal, 'editEventModal');
    });
}

async function loadEventForEditing(eventId, modal) {
    try {
        const res = await fetch(`../php/get_event_details.php?event_id=${eventId}`);
        const event = await res.json();

        // Fill the form
        document.getElementById('eventId').value = event.event_id;
        document.getElementById('eventName').value = event.ename;
        document.getElementById('eventLocation').value = event.venue || event.location || '';
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time || '';
        document.getElementById('volunteersNeeded').value = event.volunteers_needed || 0;

    } catch (err) {
        console.error(err);
        alert("Failed to load event data");
    }
}

function attachEditEventFormEvents(modal) {
    const form = modal.querySelector('#editEventForm');
    if (!form) return;

    form.removeEventListener('submit', handleEditEventSubmit);
    form.addEventListener('submit', handleEditEventSubmit);
}

async function handleEditEventSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../php/update_event.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Event updated successfully!');
            closeModal('editEventModal');
            closeModal('adminListModal'); // close list too
            loadListData(currentListType); // refresh list
        } else {
            alert('Error: ' + (data.message || 'Update failed'));
        }
    } catch (error) {
        alert('Network error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Open Issue Notice Modal Directly
function openIssueNoticeModal() {
    openModal('../frontends/create_notice.html', 'createNoticeModal', function(modal) {
        attachCreateNoticeFormEvents(modal);
    });
}

// Attach form submit handler
function attachCreateNoticeFormEvents(modal) {
    const form = modal.querySelector('#createNoticeForm');
    if (!form) return;

    form.removeEventListener('submit', handleNoticeFormSubmit);
    form.addEventListener('submit', handleNoticeFormSubmit);
}

async function handleNoticeFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../php/add_notice.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Notice published successfully!');
            closeModal('createNoticeModal');
            // Optional: refresh notices if you have a list somewhere
        } else {
            alert('Error: ' + (data.message || 'Failed to publish notice'));
        }
    } catch (error) {
        console.error(error);
        alert('Network error. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ==================== GENERIC ADMIN LIST MODAL ====================

let currentListType = '';
let currentListData = [];

function openAdminListModal(type) {
    currentListType = type;
    
    openModal('../frontends/admin_list_modal.html', 'adminListModal', function(modal) {
        loadListData(type);
    });
}

async function loadListData(type) {
    const contentDiv = document.getElementById('adminListContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading data...</p>';

    let url = '';

    switch(type) {
        case 'edit_event':
        case 'total_events':
            url = '../php/get_all_events.php';
            break;
        case 'active_users':
        case 'edit_users':
            url = '../php/get_all_users.php';
            break;
        default:
            contentDiv.innerHTML = '<p>Unknown list type.</p>';
            return;
    }

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Server error');
        
        const data = await res.json();
        
        currentListData = Array.isArray(data) ? data : [];
        
        if (currentListData.length === 0) {
            contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">No records found.</p>';
        } else {
            renderAdminList(currentListData, type);
        }
    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = `<p style="color:red; text-align:center;">Failed to load data.<br><small>${err.message}</small></p>`;
    }
}

function renderAdminList(data, type) {
    const contentDiv = document.getElementById('adminListContent');
    const titleEl = document.getElementById('listModalTitle');

    // Set dynamic title
    const titles = {
        'edit_event': 'Edit Events',
        'total_events': 'All Events',
        'active_users': 'Active Users',
        'edit_users': 'Edit Users',
        'complaints': 'Pending Complaints',
        'feedback': 'All Feedback',
        'items_reported': 'Reported Items'
    };
    titleEl.textContent = titles[type] || 'Admin List';

    if (!data || data.length === 0) {
        contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">No records found.</p>';
        return;
    }

    let html = '';

    data.forEach(item => {
        let infoHTML = '';
        let buttonText = 'View';
        let onclick = '';

        switch(type) {
            case 'edit_event':
            case 'total_events':
                infoHTML = `
                    <div class="list-info">
                        <h4>${item.ename}</h4>
                        <p>${item.date} | ${item.category} | ${item.venue}</p>
                    </div>`;
                buttonText = type === 'edit_event' ? 'Edit' : 'View';
                onclick = `viewEventInList(${item.event_id}, '${type}')`;
                break;

            case 'active_users':
            case 'edit_users':
                infoHTML = `
                    <div class="list-info">
                        <h4>${item.uname}</h4>
                        <p>${item.email} | ${item.role}</p>
                    </div>`;
                buttonText = type === 'edit_users' ? 'Edit' : 'View';
                onclick = `viewUserInList(${item.user_id}, '${type}')`;
                break;

            // We will implement others in later steps
            default:
                infoHTML = `<div class="list-info"><h4>Item ID: ${item.id || 'N/A'}</h4></div>`;
                onclick = `alert('Not implemented yet')`;
        }

        html += `
            <div class="admin-list-item">
                ${infoHTML}
                <button class="btn btn-action" onclick="${onclick}">${buttonText}</button>
            </div>`;
    });

    contentDiv.innerHTML = html;
}

function filterAdminList() {
    const searchTerm = document.getElementById('adminListSearch').value.toLowerCase().trim();
    
    const filtered = currentListData.filter(item => {
        if (currentListType.includes('event')) {
            return item.ename && item.ename.toLowerCase().includes(searchTerm);
        } else if (currentListType.includes('user')) {
            return (item.uname && item.uname.toLowerCase().includes(searchTerm)) ||
                   (item.email && item.email.toLowerCase().includes(searchTerm));
        }
        return true;
    });

    renderAdminList(filtered, currentListType);
}

function closeAdminListModal() {
    closeModal('adminListModal');
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
        window.location.href = 'index.php';
    }
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

document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEvents();
    loadRecentEvents();
    switchMainSection('home');
    loadCurrentUserProfile();
});