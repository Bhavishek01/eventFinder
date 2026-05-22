// ==================== STUDENT GENERIC LIST MODAL ====================

let currentStudentListType = '';
let currentStudentListData = [];

function openStudentListModal(type) {
    currentStudentListType = type;
    
    openModal('../../frontends/student/student_list_modal.html', 'studentListModal', function(modal) {
        attachModalCloseEvents(modal, 'studentListModal'); 
        loadStudentListData(type);
    });
}

function viewEventDetailOnly(eventId) {
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

async function loadStudentListData(type) {
    const contentDiv = document.getElementById('studentListContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading...</p>';

    let url = '';

    switch(type) {
        case 'participated':
            url = '../../php/student/get_participated_events.php';
            break;
        case 'registrations':
            url = '../../php/student/get_my_registrations.php';
            break;
        case 'complaints':
            url = '../../php/student/get_past_participated_events.php';
            break;
        case 'feedback':
            url = '../../php/student/get_past_participated_events.php';
            break;
        case 'items_reported':
            url = '../../php/student/get_past_participated_events.php';
            break;
        case 'admin_replies':
            url = '../../php/student/get_admin_replies.php';
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
        'items_reported': 'Report Item - Past Events',
        'complaints': 'Complaints - Past Events',
        'feedback': 'Feedback - Past Events'
    };
    titleEl.textContent = titles[type] || 'My List';

    let extraHTML = '';
    if (type === 'items_reported' ) {
        extraHTML = `<button class="btn btn-action" style="margin-bottom:15px; margin-top:15px; width:100%;" 
                            onclick="openStudentListModal('itemReportHistoryModal')">history </button>`;
    }

    if (type === 'complaints') {
        extraHTML = `<button class="btn btn-action" style="margin-bottom:15px; margin-top:15px; width:100%;" 
                            onclick="openStudentListModal('eventRequestHistoryModal')">history </button>`;
    }

        if (type === 'feedback') {
        extraHTML = `<button class="btn btn-action" style="margin-bottom:15px; margin-top:15px; width:100%;" 
                            onclick="openStudentListModal('eventRequestHistoryModal')">history </button>`;
    }

    if (!data || data.length === 0) {
        contentDiv.innerHTML = extraHTML + `<p style="text-align:center; padding:60px; color:#666;">No past events found.</p>`;
        return;
    }

    let html = extraHTML;

    data.forEach(item => {
        let info = `
            <div>
                <h4>${item.ename}</h4>
                <p>${item.date} | ${item.category || ''}</p>
            </div>`;

        let buttonText = type === 'items_reported' ? 'Report Item' : 'View Details';
        let onclick = type === 'items_reported' 
            ? `openReportForEvent(${item.event_id})` 
            : `viewEventDetailsFromList(${item.event_id}, '${type}')`;

        if (type === 'complaints') {
            buttonText = 'Complain';
            onclick = `ComplaintModal(${item.event_id})`;
        } else if (type === 'feedback') {
            buttonText = 'Review';
            onclick = `FeedbackModal(${item.event_id})`;
        }

        html += `
            <div class="student-list-item">
                <div>
                    <h4>${item.ename}</h4>
                    <p>${item.date} | ${item.category || ''} | ${item.venue || ''}</p>
                </div>
                <button class="ok_btn" onclick="${onclick}">${buttonText}</button>
            </div>`;
    });

    contentDiv.innerHTML = html;
}

function viewEventDetailsFromList(eventId, listType) {
    closeModal('studentListModal');
    viewEventDetailOnly(eventId);               
}

function filterStudentList() {
    const searchTerm = document.getElementById('studentListSearch').value.toLowerCase().trim();
    
    const filtered = currentStudentListData.filter(item => {
        const name = (item.ename || item.item_name || item.subject || '').toLowerCase();
        return name.includes(searchTerm);
    });

    renderStudentList(filtered, currentStudentListType);
}

// ====================== REQUEST EVENT ======================

function openRequestEventModal() {
    openModal('../../frontends/student/request_event.html', 'requestEventModal', function(modal) {
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
        const response = await fetch('../../php/student/request_event.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ Event requested successfully!');
            closeModal('requestEventModal');
        } else {
            alert('❌ Error: ' + (data.message || 'Failed to submit request'));
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
    openModal('../../frontends/student/edit_profile.html', 'editProfileModal', function(modal) {
        loadCurrentUserForEditing(modal);
        attachEditProfileFormEvents(modal);
        attachModalCloseEvents(modal, 'editProfileModal');
    });
}

async function loadCurrentUserForEditing(modal) {
    try {
        const res = await fetch('../../php/student/get_user_detail.php');
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

// ====================== REPORT ITEM (LOST / FOUND) ======================

// Fetch event details and open report modal with event date
async function openReportForEvent(eventId) {
    closeModal('studentListModal');

    try {
        const res = await fetch(`../../php/get_event_details.php?event_id=${eventId}`);
        const event = await res.json();

        openReportItemModal(event);
    } catch (err) {
        console.error(err);
        openReportItemModal();
    }
}

function openReportItemModal(event = null) {
    openModal('../../frontends/student/report_item.html', 'reportItemModal', function(modal) {
        if (event) {
            document.getElementById('reportEventId').value = event.event_id || '';
            document.getElementById('reportEventDate').value = event.date || '';
        }
        attachModalCloseEvents(modal, 'reportItemModal');
    });
}

async function submitItemReport(type) {
    const form = document.getElementById('reportItemForm');
    if (!form) return;

    const formData = new FormData(form);
    formData.append('item_type', type);

    const submitBtns = form.querySelectorAll('button');
    submitBtns.forEach(btn => btn.disabled = true);

    try {
        const response = await fetch('../../php/student/report_item.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert(`✅ Item reported successfully as ${type.toUpperCase()}!`);
            closeModal('reportItemModal');
        } else {
            alert('❌ Error: ' + (data.message || 'Failed to report item'));
        }
    } catch (error) {
        console.error(error);
        alert('Network error. Please try again.');
    } finally {
        submitBtns.forEach(btn => btn.disabled = false);
    }
}

// ====================== COMPLAINTS ======================

async function ComplaintModal(eventId) {
    closeModal('studentListModal');

    try {
        const res = await fetch(`../../php/get_event_details.php?event_id=${eventId}`);
        const event = await res.json();

        openComplaintModal(event);
    } catch (err) {
        console.error(err);
        openComplaintModal();``
    }
}

function openComplaintModal(event = null) {
    openModal('../../frontends/student/complaint_modal.html', 'complaintModal', function(modal) {
        if (event) {
            document.getElementById('complaintEventId').value = event.event_id || '';
        }
        attachComplaintFormEvents(modal);
    });
}

function attachComplaintFormEvents(modal) {
    const form = modal.querySelector('#complaintForm');
    form.addEventListener('submit', handleComplaintSubmit);
}

async function handleComplaintSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('../../php/student/submit_complaint.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (data.success) {
            alert('✅ Complaint submitted successfully!');
            closeModal('complaintModal');
        } else {
            alert('❌ ' + (data.message || 'Failed to submit complaint'));
        }
    } catch (err) {
        alert('Network error');
    }
}

// ====================== FEEDBACK ======================

async function FeedbackModal(eventId) {
    closeModal('studentListModal');

    try {
        const res = await fetch(`../../php/get_event_details.php?event_id=${eventId}`);
        const event = await res.json();

        openFeedbackModal(event);
    } catch (err) {
        console.error(err);
        openFeedbackModal();``
    }
}

function openFeedbackModal(event = null) {
    openModal('../../frontends/student/feedback_modal.html', 'feedbackModal', function(modal) {
        if (event) {
            document.getElementById('feedbackEventId').value = event.event_id || '';
        }
        attachFeedbackFormEvents(modal);
    });
}

function attachFeedbackFormEvents(modal) {
    const form = modal.querySelector('#feedbackForm');
    form.addEventListener('submit', handleFeedbackSubmit);
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('../../php/student/submit_feedback.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (data.success) {
            alert('✅ Feedback submitted successfully!');
            closeModal('feedbackModal');
        } else {
            alert('❌ ' + (data.message || 'Failed to submit feedback'));
        }
    } catch (err) {
        alert('Network error');
    }
}

// ====================== CLOSE MODAL ======================

function attachModalCloseEvents(modal, modalId) {
    modal.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modalId));
    });

}