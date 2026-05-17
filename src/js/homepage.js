/**
 * Register the current user for an event.
 * p_type is passed directly ('participant' or 'volunteer') — no confirm() dialog needed
 * because the user already clicked the specific button.
 */
function registerForEvent(eventId, pType) {
    fetch('../../php/register_event.php', {
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
// ====================== REQUEST EVENT ======================

function openRequestEventModal() {
    openModal('../../frontends/request_event.html', 'requestEventModal', function(modal) {
        attachRequestEventFormEvents(modal);
        attachModalCloseEvents(modal, 'requestEventModal');
    });
}

function attachRequestEventFormEvents(modal) {
    const form = modal.querySelector('#requestEventForm');
    if (!form) return;
    
    form.removeEventListener('submit', handleRequestEventSubmit);
    form.addEventListener('submit', handleRequestEventSubmit);
}

async function handleRequestEventSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Request...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../../php/request_event.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Event request submitted successfully! Waiting for admin approval.');
            closeModal('requestEventModal');
        } else {
            alert('Error: ' + (data.message || 'Failed to submit request'));
        }
    } catch (error) {
        console.error(error);
        alert('Network error. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ====================== STUDENT PROFILE EDIT ======================

function openEditProfileModal() {
    openModal('../../frontends/edit_profile.html', 'editProfileModal', function(modal) {
        loadCurrentUserForEditing(modal);
        attachEditProfileFormEvents(modal);
        attachModalCloseEvents(modal, 'editProfileModal');
    });
}

async function loadCurrentUserForEditing(modal) {
    try {
        const res = await fetch('../../php/get_user_detail.php');
        const data = await res.json();

        if (data.success && data.user) {
            const user = data.user;
            
            document.getElementById('profileUserId').value = user.user_id;
            document.getElementById('profileName').value = user.uname || '';
            document.getElementById('profilePhone').value = user.phone || '';
            document.getElementById('profileAddress').value = user.address || '';
        } else {
            console.error("Profile load failed:", data.message);
            alert("Failed to load profile data. Please login again.");
        }
    } catch (err) {
        console.error("Error loading profile:", err);
        alert("Failed to load profile data. Please check your connection.");
    }
}
function attachEditProfileFormEvents(modal) {
    const form = modal.querySelector('#editProfileForm');
    if (!form) return;
    
    form.removeEventListener('submit', handleEditProfileSubmit);
    form.addEventListener('submit', handleEditProfileSubmit);
}

async function handleEditProfileSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../../php/update_user.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Profile updated successfully!');
            closeModal('editProfileModal');
            // Refresh profile picture if changed
            if (typeof loadCurrentUserProfile === 'function') loadCurrentUserProfile();
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

// ==================== STUDENT GENERIC LIST MODAL ====================

let currentStudentListType = '';
let currentStudentListData = [];

function openStudentListModal(type) {
    currentStudentListType = type;
    
    openModal('../../frontends/student/student_list_modal.html', 'studentListModal', function(modal) {
        attachModalCloseEvents(modal, 'studentListModal');   // ← Important fix
        loadStudentListData(type);
    });
}

async function loadStudentListData(type) {
    const contentDiv = document.getElementById('studentListContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading...</p>';

    let url = '';

    switch(type) {
        case 'participated':
            url = '../../php/get_participated_events.php';
            break;
        case 'registrations':
            url = '../../php/get_my_registrations.php';
            break;
        case 'complaints':
            url = '../../php/get_my_complaints.php';
            break;
        case 'feedback':
            url = '../../php/get_my_feedback.php';
            break;
        case 'items_reported':
            url = '../../php/get_my_reported_items.php';
            break;
        default:
            contentDiv.innerHTML = '<p>Unknown list type.</p>';
            return;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        currentStudentListData = Array.isArray(data) ? data : [];
        renderStudentList(currentStudentListData, type);
    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = '<p style="color:red; text-align:center;">Failed to load data.</p>';
    }
}

function renderStudentList(data, type) {
    const contentDiv = document.getElementById('studentListContent');
    const titleEl = document.getElementById('studentListTitle');

    const titles = {
        'participated': 'Events Participated',
        'registrations': 'My Registrations',
        'complaints': 'My Complaints',
        'feedback': 'My Feedback',
        'items_reported': 'Reported Items'
    };
    titleEl.textContent = titles[type] || 'My List';

    if (!data || data.length === 0) {
        contentDiv.innerHTML = `<p style="text-align:center; padding:60px; color:#666;">
            No records found.<br><small>You haven't ${type === 'registrations' ? 'registered' : 'participated'} in any events yet.</small>
        </p>`;
        return;
    }

    let html = '';

    data.forEach(item => {
        let info = '';
        let buttonText = 'View Details';
        let onclick = `viewEventDetails(${item.event_id})`;

        info = `
            <div>
                <h4>${item.ename}</h4>
                <p>${item.date} | ${item.category || ''} | ${item.venue || ''}</p>
                ${item.p_type ? `<small><strong>Type:</strong> ${item.p_type}</small>` : ''}
                ${item.status ? `<small> | Status: ${item.status}</small>` : ''}
            </div>`;

        html += `
            <div class="student-list-item">
                ${info}
                <button class="btn btn-action" onclick="${onclick}">${buttonText}</button>
            </div>`;
    });

    contentDiv.innerHTML = html;
}

function filterStudentList() {
    const searchTerm = document.getElementById('studentListSearch').value.toLowerCase().trim();
    
    const filtered = currentStudentListData.filter(item => {
        const name = (item.ename || item.item_name || item.subject || '').toLowerCase();
        return name.includes(searchTerm);
    });

    renderStudentList(filtered, currentStudentListType);
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
    openModal('../../frontends/edit_user.html', 'editUserModal', function(modal) {
        loadUserForEditing(userId, modal);
        attachEditUserFormEvents(modal);
        attachModalCloseEvents(modal, 'editUserModal');
    });
}

async function loadUserForEditing(userId, modal) {
    try {
        const res = await fetch(`../../php/get_user_details.php?user_id=${userId}`);
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
        const response = await fetch('../../php/update_user.php', {
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

// ====================== COMPLAINTS ======================

function viewEventInList(eventId, type) {
    console.log(`[DEBUG] viewEventInList called - ID: ${eventId}, Type: ${type}`);

    if (type === 'edit_event') {
        openEditEventModal(eventId);
    } else if (type === 'total_events') {
        viewEventDetails(eventId);
    } else {
        alert(`Not implemented yet for type: ${type}`);
    }
}

function viewUserInList(userId, type) {
    console.log(`[DEBUG] viewUserInList called - ID: ${userId}, Type: ${type}`);

    if (type === 'edit_users') {
        openEditUserModal(userId);
    } else if (type === 'active_users') {
        openUserDetailsModal(userId);
    }
}

// New: Open Complaints List (already handled by openAdminListModal('complaints'))

async function openReplyComplaintModal(complaintId) {
    openModal('../../frontends/reply_complaint.html', 'replyComplaintModal', function(modal) {
        loadComplaintForReply(complaintId, modal);
        attachReplyFormEvents(modal);
    });
}

async function loadComplaintForReply(complaintId, modal) {
    const detailsDiv = modal.querySelector('#complaintDetails');
    try {
        const res = await fetch(`../../php/get_complaint_details.php?complaint_id=${complaintId}`);
        const complaint = await res.json();

        const html = `
            <div style="background:#f8f1e3; padding:15px; border-radius:8px; margin-bottom:20px;">
                <strong>Event:</strong> ${complaint.ename || 'General Issue'}<br>
                <strong>Student:</strong> ${complaint.uname}<br>
                <strong>Subject:</strong> ${complaint.subject}<br><br>
                <strong>Complaint:</strong><br>
                <p>${complaint.complaint}</p>
            </div>
        `;
        detailsDiv.innerHTML = html;
        document.getElementById('complaintId').value = complaint.complaint_id;
    } catch (err) {
        detailsDiv.innerHTML = `<p style="color:red;">Failed to load complaint.</p>`;
    }
}

function attachReplyFormEvents(modal) {
    const form = modal.querySelector('#replyComplaintForm');
    if (!form) return;
    form.removeEventListener('submit', handleReplySubmit);
    form.addEventListener('submit', handleReplySubmit);
}

async function handleReplySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../../php/reply_complaint.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Reply sent successfully!');
            closeModal('replyComplaintModal');
            closeModal('adminListModal');
            loadListData('complaints'); // refresh list
        } else {
            alert('Error: ' + (data.message || 'Failed to send reply'));
        }
    } catch (error) {
        alert('Network error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ====================== VIEW USER DETAILS ======================

function viewUserInList(userId, type) {
    console.log(`[DEBUG] viewUserInList called - ID: ${userId}, Type: ${type}`);

    if (type === 'edit_users') {
        openEditUserModal(userId);
    } else if (type === 'active_users') {
        openUserDetailsModal(userId);
    }
}

// New function for viewing user details
function openUserDetailsModal(userId) {
    openModal('../../frontends/user_details_modal.html', 'userDetailsModal', function(modal) {
        loadUserDetails(userId, modal);
        attachModalCloseEvents(modal, 'userDetailsModal');
    });
}

async function loadUserDetails(userId, modal) {
    const contentDiv = modal.querySelector('#userDetailsContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading user details...</p>';

    try {
        const res = await fetch(`../../php/get_user_details.php?user_id=${userId}`);
        const user = await res.json();

        const html = `
            <div style="text-align:center; margin-bottom:20px;">
                <img src="../../${user.photo || 'uploads/profile_photos/default.jpg'}" 
                     alt="${user.uname}" 
                     style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid #184430;">
            </div>
            
            <div class="event-details">
                <h2>${user.uname}</h2>
                
                <div class="event-meta">
                    <div class="meta-item">
                        <strong>Email</strong>
                        <span>${user.email}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Role</strong>
                        <span>${user.role}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Phone</strong>
                        <span>${user.phone || 'Not provided'}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Address</strong>
                        <span>${user.address || 'Not provided'}</span>
                    </div>
                </div>
            </div>
        `;

        contentDiv.innerHTML = html;

    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = `<p style="color:red; text-align:center;">Failed to load user details.</p>`;
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
    openModal('../../frontends/edit_event.html', 'editEventModal', function(modal) {
        loadEventForEditing(eventId, modal);
        attachEditEventFormEvents(modal);
        
        // Explicitly attach close events (important for dynamically loaded modals)
        attachModalCloseEvents(modal, 'editEventModal');
    });
}

async function loadEventForEditing(eventId, modal) {
    try {
        const res = await fetch(`../../php/get_event_details.php?event_id=${eventId}`);
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
        const response = await fetch('../../php/update_event.php', {
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

