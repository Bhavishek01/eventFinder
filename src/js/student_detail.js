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