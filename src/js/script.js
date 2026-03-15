// Sample Events Data
const events = [
    {
        id: 1,
        title: "Web Development Workshop",
        date: "March 20, 2026",
        time: "2:00 PM",
        location: "Room 301, Main Building",
        category: "Workshop",
        description: "Learn modern web development techniques including HTML5, CSS3, and JavaScript. Perfect for beginners and intermediate developers.",
        fullDescription: "This comprehensive workshop will cover all aspects of modern web development. You'll learn responsive design, CSS frameworks, JavaScript ES6+, and best practices for creating professional websites. The workshop includes hands-on projects and real-world examples.",
        capacity: 50,
        registered: 32,
        image: "event-1.jpg"
    },
    {
        id: 2,
        title: "Mobile App Development",
        date: "March 25, 2026",
        time: "3:30 PM",
        location: "Tech Lab, Building B",
        category: "Seminar",
        description: "Explore cross-platform mobile app development using React Native and Flutter frameworks.",
        fullDescription: "Discover how to build mobile applications that work on both iOS and Android platforms. This seminar covers React Native, Flutter, native development, and app deployment strategies. Industry experts will share their insights and experiences.",
        capacity: 40,
        registered: 28,
        image: "event-2.jpg"
    },
    {
        id: 3,
        title: "AI and Machine Learning Basics",
        date: "March 28, 2026",
        time: "1:00 PM",
        location: "Auditorium, Main Campus",
        category: "Lecture",
        description: "Introduction to artificial intelligence and machine learning concepts with practical applications.",
        fullDescription: "Get introduced to the world of AI and ML. Learn about neural networks, supervised and unsupervised learning, and see practical applications in real-world scenarios. This beginner-friendly lecture requires basic Python knowledge.",
        capacity: 100,
        registered: 75,
        image: "event-3.jpg"
    },
    {
        id: 4,
        title: "Cloud Computing Summit",
        date: "April 1, 2026",
        time: "10:00 AM",
        location: "Convention Center",
        category: "Summit",
        description: "Discover AWS, Azure, and Google Cloud platforms with industry leaders.",
        fullDescription: "Join us for a full-day summit on cloud computing where industry leaders will discuss AWS, Microsoft Azure, Google Cloud Platform, and emerging cloud technologies. Network with tech professionals and explore career opportunities in cloud computing.",
        capacity: 200,
        registered: 156,
        image: "event-4.jpg"
    },
    {
        id: 5,
        title: "Cybersecurity Workshop",
        date: "April 5, 2026",
        time: "2:00 PM",
        location: "Security Lab, Building C",
        category: "Workshop",
        description: "Learn essential cybersecurity practices and ethical hacking fundamentals.",
        fullDescription: "This hands-on workshop covers network security, penetration testing, vulnerability assessment, and security best practices. Learn how to protect systems and data from cyber threats. Includes live demonstrations and interactive exercises.",
        capacity: 35,
        registered: 22,
        image: "event-5.jpg"
    },
    {
        id: 6,
        title: "Data Science Bootcamp",
        date: "April 10, 2026",
        time: "9:00 AM",
        location: "Computer Lab, Building A",
        category: "Bootcamp",
        description: "Intensive training in data analysis, visualization, and predictive modeling.",
        fullDescription: "A comprehensive bootcamp covering data collection, cleaning, analysis, and visualization using Python, R, and popular libraries like Pandas and Matplotlib. Learn to build predictive models and extract insights from data.",
        capacity: 30,
        registered: 25,
        image: "event-6.jpg"
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    populateEvents();
    setupFormHandlers();
});

// Populate events grid
function populateEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-card-header">
            <h3>${event.title}</h3>
            <div class="event-card-date">${event.date} at ${event.time}</div>
        </div>
        <div class="event-card-body">
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <p>${event.description}</p>
            <p><strong>Capacity:</strong> ${event.registered}/${event.capacity} registered</p>
        </div>
        <div class="event-card-footer">
            <button class="btn btn-more" onclick="showEventDetails(${event.id})">View Details</button>
        </div>
    `;
    return card;
}

// Show event details modal
function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const detailsContent = document.getElementById('eventDetailsContent');
    detailsContent.innerHTML = `
        <div class="event-details">
            <h2>${event.title}</h2>
            <div class="event-meta">
                <div class="meta-item">
                    <strong>Date & Time</strong>
                    <span>${event.date} at ${event.time}</span>
                </div>
                <div class="meta-item">
                    <strong>Location</strong>
                    <span>${event.location}</span>
                </div>
                <div class="meta-item">
                    <strong>Category</strong>
                    <span>${event.category}</span>
                </div>
                <div class="meta-item">
                    <strong>Capacity</strong>
                    <span>${event.registered}/${event.capacity} registered</span>
                </div>
            </div>
            <div class="event-description">
                <h3>About This Event</h3>
                <p>${event.fullDescription}</p>
            </div>
            <div class="event-actions">
                <h3>Registration</h3>
                <div class="registration-options">
                    <button class="btn registration-btn" onclick="registerEvent(${event.id})">Register Now</button>
                    <button class="btn registration-btn pre-register" onclick="preRegisterEvent(${event.id})">Pre-Register</button>
                </div>
            </div>
        </div>
    `;
    
    openModal('eventDetailsModal');
}

// Modal functions
function login() {
    openModal('loginModal');
}

function signup() {
    openModal('signupModal');
}

function closeLogin() {
    closeModal('loginModal');
}

function closeSignup() {
    closeModal('signupModal');
}

function closeEventDetailsModal() {
    closeModal('eventDetailsModal');
}

function switchToLogin() {
    closeModal('signupModal');
    openModal('loginModal');
}

function switchToSignup() {
    closeModal('loginModal');
    openModal('signupModal');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const eventDetailsModal = document.getElementById('eventDetailsModal');
    
    if (event.target === loginModal) {
        closeModal('loginModal');
    }
    if (event.target === signupModal) {
        closeModal('signupModal');
    }
    if (event.target === eventDetailsModal) {
        closeModal('eventDetailsModal');
    }
};

// Form handlers
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // Here you would typically send this to your backend
    console.log('Login attempt:', { email, password });
    alert('Login successful! (Demo mode)');
    
    closeModal('loginModal');
    e.target.reset();
}

function handleSignup(e) {
    e.preventDefault();
    const fullName = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelectorAll('input[type="email"]')[0].value;
    const type = e.target.querySelector('select').value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Here you would typically send this to your backend
    console.log('Signup attempt:', { fullName, email, type, password });
    alert('Registration successful! (Demo mode)');
    
    closeModal('signupModal');
    e.target.reset();
}

// Event registration
function registerEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event && event.registered < event.capacity) {
        event.registered++;
        alert(`You have successfully registered for "${event.title}"!`);
        closeModal('eventDetailsModal');
        populateEvents();
    } else {
        alert('This event is at full capacity!');
    }
}

function preRegisterEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        alert(`You have been added to the waitlist for "${event.title}"!`);
        closeModal('eventDetailsModal');
    }
}
