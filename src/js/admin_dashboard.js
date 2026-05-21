// ==================== GENERIC ADMIN LIST MODAL ====================

let currentListType = '';
let currentListData = [];

function openAdminListModal(type) {
    currentListType = type;
    
    openModal('../../frontends/admin/admin_list_modal.html', 'adminListModal', function(modal) {
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
            url = '../../php/admin/get_all_events.php';
            break;
        case 'active_users':
        case 'edit_users':
            url = '../../php/admin/get_all_users.php';
            break;
        case 'complaints':
        case 'feedback':
        case 'items_reported':
            url = '../../php/admin/get_all_events.php';
            break;
        case 'event_requests':
            url = '../../php/admin/get_event_requests.php';
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
        'items_reported': 'Reported Items',
        'event_requests': 'Event Requests'
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
            case 'complaints':
            case 'feedback':
                infoHTML = `
                    <div class="list-info">
                        <h4>${item.ename}</h4>
                        <p>${item.date}</p>
                    </div>`;
                buttonText = type === 'complaints' ? 'View Complaint' : 'View';
                onclick = `viewEventInList(${item.event_id}, '${type}')`;
                break;

            case 'items_reported':
                infoHTML = `
                    <div class="list-info">
                        <h4>${item.ename}</h4>
                        <p>${item.date}</p>
                    </div>`;
                buttonText = 'View Reported Item';
                onclick = `viewEventInList(${item.event_id}, '${type}')`;
                break;
            case 'event_requests':
                infoHTML = `
                    <div class="list-info">
                        <h4>${item.ename}</h4>
                        <p>${item.date}</p>
                    </div>`;
                buttonText = 'View Event Request';
                onclick = `viewEventInList(${item.request_id}, '${type}')`;
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

function viewEventInList(eventId, type) {

    if (type === 'edit_event') {
        openEditEventModal(eventId);
    } 
    else if (type === 'total_events') {
        viewEventDetailOnly(eventId);        // This will open the nice existing modal
    }
    else if (type === 'complaints') {
        viewEventComplaints(eventId);
    }
    else if (type === 'feedback') {
        // For now, we will reuse the complaint modal to view feedback details (without reply form)
        viewEventFeedback(eventId);
    }
    else if (type === 'items_reported') {
        // For now, we will reuse the complaint modal to view reported item details (without reply form)
        openReplyComplaintModal(eventId);
    }
    else if (type === 'event_requests') { 
        // For now, we will reuse the complaint modal to view event request details (without reply form)
        viewEventRequest(eventId);
    }
    else {
        alert(`Not implemented yet for type: ${type}`);
    }
}

// ======================  COMPLAINTS + FEEDBACK ======================

async function viewEventComplaints(eventId) {
    closeModal('adminListModal'); // close previous list

    openModal('../../frontends/admin/admin_complaints_list.html', 'adminComplaintsListModal', function(modal) {
        loadEventComplaints(eventId, modal);
    });
}

async function loadEventComplaints(eventId, modal) {
    const contentDiv = modal.querySelector('#complaintsListContent');
    contentDiv.innerHTML = '<p>Loading complaints...</p>';

    try {
        const res = await fetch(`../../php/admin/get_event_complaints.php?event_id=${eventId}`);
        const complaints = await res.json();

        if (!complaints || complaints.length === 0) {
            contentDiv.innerHTML = '<p>No complaints found for this event.</p>';
            return;
        }

        let html = '';
        complaints.forEach(c => {
            html += `
                <div class="admin-list-item">
                    <div>
                        <strong>${c.subject}</strong><br>
                        <small>By: ${c.uname} | ${c.created_at}</small><br>
                        <p style="margin:8px 0;">${c.complaint}</p>
                    </div>
                    <button class="btn btn-action" onclick="openReplyComplaintModal(${c.complaint_id})">Reply</button>
                </div>`;
        });

        contentDiv.innerHTML = html;
    } catch (err) {
        contentDiv.innerHTML = '<p style="color:red;">Failed to load complaints.</p>';
    }
}

function openReplyComplaintModal(complaintId) {
    openModal('../../frontends/admin/reply_complaint.html', 'replyComplaintModal', function(modal) {
        loadComplaintForReply(complaintId, modal);
        attachReplyFormEvents(modal);
    });
}

async function loadComplaintForReply(complaintId, modal) {
    const detailsDiv = modal.querySelector('#complaintDetails');
    detailsDiv.innerHTML = '<p>Loading complaint...</p>';

    try {
        const res = await fetch(`../../php/admin/get_complaint_details.php?complaint_id=${complaintId}`);
        const complaint = await res.json();

        const html = `
            <div style="background:#f8f1e3; padding:15px; border-radius:8px;">
                <strong>Event:</strong> ${complaint.ename || 'General Issue'}<br>
                <strong>Student:</strong> ${complaint.uname}<br>
                <strong>Subject:</strong> ${complaint.subject}<br><br>
                <strong>Complaint:</strong><br>
                <p style="margin:8px 0;">${complaint.complaint}</p>
            </div>
        `;
        detailsDiv.innerHTML = html;
        document.getElementById('complaintId').value = complaint.complaint_id;
    } catch (err) {
        detailsDiv.innerHTML = `<p style="color:red;">Failed to load complaint details.</p>`;
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
        const response = await fetch('../../php/admin/reply_complaint.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ Reply sent successfully!');
            closeModal('replyComplaintModal');
            loadListData('complaints'); // refresh list
        } else {
            alert('❌ ' + (data.message || 'Failed to send reply'));
        }
    } catch (error) {
        alert('Network error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ====================== CREATE EVENT ======================

function openCreateEventModal() {
    openModal('../../frontends/admin/create_event.html', 'createEventModal', function(modal) {
        attachCreateEventFormEvents(modal);
        attachModalCloseEvents(modal, 'createEventModal');
    });
}

function attachCreateEventFormEvents(modal) {
    const form = modal.querySelector('#createEventForm');
    if (!form) return;

    // Remove any previous listeners to prevent duplicates
    form.removeEventListener('submit', handleCreateEventSubmit);
    form.addEventListener('submit', handleCreateEventSubmit);
}

async function handleCreateEventSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Event...';

    const formData = new FormData(form);

    try {
        const response = await fetch('../../php/admin/add_event.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ Event created successfully!');
            closeModal('createEventModal');
            
        } else {
            alert('❌ Error: ' + (data.message || 'Failed to create event'));
        }
    } catch (error) {
        console.error(error);
        alert('Network error. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ====================== VIEW TOTAL + EVENTS EDIT EVENT ======================

function openEditEventModal(eventId) {
    openModal('../../frontends/admin/edit_event.html', 'editEventModal', function(modal) {
        loadEventForEditing(eventId, modal);
        attachEditEventFormEvents(modal);
        
        // Explicitly attach close events (important for dynamically loaded modals)
        attachModalCloseEvents(modal, 'editEventModal');
    });
}

function viewEventDetailOnly(eventId) {
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

                const volunteersNeeded = parseInt(event.volunteers_needed) || 0;
                
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
        const response = await fetch('../../php/admin/update_event.php', {
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

// ====================== ADMIN FEEDBACK (Two Level) ======================

function viewEventFeedback(eventId) {
    closeModal('adminListModal');   // Close main list

    openModal('../../frontends/admin/admin_feedback_list.html', 'adminFeedbackListModal', function(modal) {
        loadEventFeedback(eventId, modal);
    });
}

async function loadEventFeedback(eventId, modal) {
    const contentDiv = modal.querySelector('#feedbackListContent');
    contentDiv.innerHTML = '<p>Loading feedback...</p>';

    try {
        const res = await fetch(`../../php/admin/get_event_feedback.php?event_id=${eventId}`);
        const feedbacks = await res.json();

        if (!feedbacks || feedbacks.length === 0) {
            contentDiv.innerHTML = '<p>No feedback received for this event yet.</p>';
            return;
        }

        let html = '';
        feedbacks.forEach(f => {
            const stars = '★'.repeat(parseInt(f.rating)) + '☆'.repeat(5 - parseInt(f.rating));
            html += `
                <div class="feedback-item">
                    <div><strong>Rating:</strong> <span class="rating-stars">${stars}</span> (${f.rating}/5)</div>
                    <div><strong>By:</strong> ${f.uname}</div>
                    <div><small>${f.created_at}</small></div>
                    ${f.feedback ? `<p style="margin-top:10px; background:#f8f1e3; padding:10px; border-radius:6px;">${f.feedback}</p>` : ''}
                </div>`;
        });

        contentDiv.innerHTML = html;
    } catch (err) {
        contentDiv.innerHTML = '<p style="color:red;">Failed to load feedback.</p>';
    }
}

// ====================== EVENT REQUEST DETAILS ======================

function viewEventRequest(requestId) {
    closeModal('adminListModal');

    openModal('../../frontends/admin/event_request_details.html', 'eventRequestDetailsModal', function(modal) {
        loadEventRequestDetails(requestId, modal);
    });
}

async function loadEventRequestDetails(requestId, modal) {
    const contentDiv = modal.querySelector('#requestDetailsContent');
    contentDiv.innerHTML = '<p>Loading request details...</p>';

    try {
        const res = await fetch(`../../php/admin/get_event_request.php?request_id=${requestId}`);
        const req = await res.json();

        const photoPath = req.photo
                    ? '../' + req.photo
                    : '../../uploads/req_event_photos/default.jpg';

        const html = `
            <div class="event-photo">
                <img src="${photoPath}" alt="${req.ename}" 
                     style="width:100%; height:250px; object-fit:cover; border-radius:5px;">
            </div>

            <div class="event-details">
                <h2>${req.ename}</h2>

                <div class="event-meta">
                    <div class="meta-item">
                        <strong>Requested By</strong>
                        <span>${req.student_name}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Category</strong>
                        <span>${req.category}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Proposed Date</strong>
                        <span>${req.date}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Proposed Time</strong>
                        <span>${req.time}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Venue</strong>
                        <span>${req.venue}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Volunteers Needed</strong>
                        <span>${req.volunteers_needed || 'None'}</span>
                    </div>
                </div>

                <div class="event-description">
                    <h3>About This Event</h3>
                    <p>${req.description}</p>
                </div>

                <div class="action-buttons" style="margin-top:25px;">
                    <button id="approveBtn" onclick="EventRequest(${req.request_id}, 'approve')" 
                            class="btn btn-action" style="background:#28a745; flex:1;">
                        ✅ Approve & Create Event
                    </button>
                    <button id="rejectBtn" onclick="EventRequest(${req.request_id}, 'reject')" 
                            class="btn btn-action" style="background:#dc3545; flex:1;">
                        ❌ Reject Request
                    </button>
                </div>
            </div>
        `;

        contentDiv.innerHTML = html;
    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = `<p style="color:red; text-align:center;">Failed to load request details.</p>`;
    }
}

// Approve Request
async function EventRequest(requestId, operation) {

    if (operation === 'approve') {
        if (!confirm("Approve this request and create the event?")) return;
    } else if (operation === 'reject') {
        if (!confirm("Reject this event request?")) return;
    }

    const formData = new URLSearchParams();
    formData.append('request_id', requestId);
    formData.append('doThis', operation);

    

    try {
        const res = await fetch('../../php/admin/conclude_event_request.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData.toString()
        });
        const data = await res.json();

        if (data.success) {
            if(data.message === "approved") 
            {
                alert("✅ Event approved and created successfully!");
                closeModal('eventRequestDetailsModal');
                loadListData('event_request');
            } 
            else if(data.message === "rejected") {
                alert("✅ Request rejected successfully");
                closeModal('eventRequestDetailsModal');
                loadListData('event_request');
            }
        }
        else {
            alert("❌ " + (data.message || "Failed to approve and reject request"));
        }
    } catch (err) {
        alert("Network error");
    }
}

// ====================== VIEW USER DETAILS + EDIT USER ======================

function viewUserInList(userId, type) {
    console.log(`[DEBUG] viewUserInList called - ID: ${userId}, Type: ${type}`);

    if (type === 'edit_users') {
        openEditUserModal(userId);
    } else if (type === 'active_users') {
        openUserDetailsModal(userId);
    }
}

function openUserDetailsModal(userId) {
    openModal('../../frontends/admin/user_details_modal.html', 'userDetailsModal', function(modal) {
        loadUserDetails(userId, modal);
        attachModalCloseEvents(modal, 'userDetailsModal');
    });
}

async function loadUserDetails(userId, modal) {
    const contentDiv = modal.querySelector('#userDetailsContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading user details...</p>';

    try {
        const res = await fetch(`../../php/admin/get_user_details.php?user_id=${userId}`);
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

function openEditUserModal(userId) {
    openModal('../../frontends/admin/edit_user.html', 'editUserModal', function(modal) {
        loadUserForEditing(userId, modal);
        attachEditUserFormEvents(modal);
        attachModalCloseEvents(modal, 'editUserModal');
    });
}

async function loadUserForEditing(userId, modal) {
    try {
        const res = await fetch(`../../php/admin/get_user_details.php?user_id=${userId}`);
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

// ====================== ISSUE NOTICE ======================

function openIssueNoticeModal() {
    openModal('../../frontends/admin/create_notice.html', 'createNoticeModal', function(modal) {
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
        const response = await fetch('../../php/admin/add_notice.php', {
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

// ====================== CLOSE MODAL ======================

function attachModalCloseEvents(modal, modalId) {
    modal.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modalId));
    });

}