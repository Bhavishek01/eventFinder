function loadUpcomingEventsforOther() {
    fetch('../php/get_upcoming_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('eventsGrid');
            if(!grid) return;
            grid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-card-header"><h3>${event.ename}</h3><span class="event-card-date">${event.date}</span></div>
                    <div class="event-card-body"><p>${event.description.substring(0,100)}...</p></div>
                    <div class="event-card-footer"><button class="btn btn-more" onclick="goToLogin()">View Details</button></div>
                </div>
            `).join('');
        });
}

function loadPopularEvents() {
    fetch('../php/get_popular_events.php')
        .then(res => res.json())
        .then(events => {
            const grid = document.getElementById('popularEventsGrid');
            if(!grid) return;
            grid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-card-header"><h3>${event.ename}</h3><span class="event-card-date">${event.date}</span></div>
                    <div class="event-card-body"><p>${event.description.substring(0,100)}...</p></div>
                    <div class="event-card-footer"><button class="btn btn-more" onclick="goToLogin()">View Details</button></div>
                </div>
            `).join('');
        });
}


document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEventsforOther();
    loadPopularEvents();
});