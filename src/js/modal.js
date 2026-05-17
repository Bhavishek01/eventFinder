// Modal Dialog Handler
// Dynamically loads external HTML files into modal overlays.
// Add future modals by calling openModal(htmlPath, modalId).

/**
 * Generic modal loader — fetches an HTML file and injects its
 * .modal-content into a modal overlay with the given id.
 *
 * @param {string} htmlPath  - Path to the HTML file to load
 * @param {string} modalId   - id to assign to the modal overlay div
 * @param {function} onReady - Optional callback after content is injected
 */
function openModal(htmlPath, modalId, onReady) {
    // Reuse existing overlay or create a fresh one
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal modal-large';
        document.body.appendChild(modal);
    }

    fetch(htmlPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.status}`);
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const modalContent = doc.querySelector('.modal-content');

            if (!modalContent) {
                throw new Error(`No .modal-content found in ${htmlPath}`);
            }

            modal.innerHTML = modalContent.outerHTML;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Execute any <script> tags that were inside the loaded HTML
            modal.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
            });

            if (typeof onReady === 'function') onReady(modal);
        })
        .catch(error => {
            console.error('Modal load error:', error);
            alert(`Could not load the form. Please try again.\n\n(${error.message})`);
        });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        modal.innerHTML = ''; // Clear so next open gets a fresh load
    }
}

// ─── Create Event Modal ────────────────────────────────────────────────────

function openCreateEventModal() {
    openModal('../../frontends/create_event.html', 'createEventModal', function(modal) {
        attachCreateEventFormEvents(modal);
        attachModalCloseEvents(modal, 'createEventModal');
    });
}

function closeCreateEventModal() {
    closeModal('createEventModal');
}

/**
 * Wire up the Create Event form submit handler.
 * Uses the modal container as scope so IDs don't clash if multiple
 * modals are ever open simultaneously.
 */
function attachCreateEventFormEvents(modal) {
    const form = modal.querySelector('#createEventForm');
    if (!form) return;

    // Remove any existing submit listeners to avoid duplicates
    form.removeEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const modal = form.closest('.modal');
    
    // Get form data
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    
    try {
        // Send data to PHP backend
        const response = await fetch('../../php/admin/add_event.php', {
            method: 'POST',
            body: formData
        });
        
        // Get response text
        const responseText = await response.text();
        
        // Check if response contains a script with alert
        if (responseText.includes('<script>')) {
            // Extract alert message from response
            const alertMatch = responseText.match(/alert\('([^']+)'\)/);
            if (alertMatch) {
                const message = alertMatch[1];
                
                if (message.includes('successfully')) {
                    alert(message);
                    closeCreateEventModal();
                    // Refresh the page or reload events list if needed
                    if (typeof refreshEvents === 'function') {
                        refreshEvents();
                    } else {
                        window.location.reload();
                    }
                } else {
                    alert('Error: ' + message);
                }
            } else {
                alert('Event created successfully!');
                closeCreateEventModal();
                window.location.reload();
            }
        } else {
            // If response is JSON or plain text
            try {
                const data = JSON.parse(responseText);
                if (data.success) {
                    alert(data.message || 'Event created successfully!');
                    closeCreateEventModal();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.message || 'Unknown error occurred'));
                }
            } catch (jsonError) {
                console.error('Response:', responseText);
                alert('Event created successfully!');
                closeCreateEventModal();
                window.location.reload();
            }
        }
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Network error: Could not connect to server. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// ─── Add future modals below in the same pattern ──────────────────────────

// ─── Shared Utilities ──────────────────────────────────────────────────────

/**
 * Wire up close (✕) and cancel buttons inside a modal.
 * Also resets any form found inside.
 */
function attachModalCloseEvents(modal, modalId) {
    // ✕ close buttons
    modal.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modalId));
    });

    // Cancel buttons
    modal.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modalId));
    });
}

/**
 * Close the topmost visible modal when clicking the dark backdrop
 */
function initializeBackdropClickHandler() {
    document.addEventListener('click', function(e) {
        // Only trigger when the click lands directly on the overlay (not its children)
        if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
            closeModal(e.target.id);
        }
    });
}

/**
 * Close the topmost visible modal on Escape key
 */
function initializeEscapeKeyHandler() {
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        const openModal = document.querySelector('.modal.show');
        if (openModal) closeModal(openModal.id);
    });
}

// ─── Init ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    // Ensure the createEventModal overlay exists in the DOM from the start
    if (!document.getElementById('createEventModal')) {
        const overlay = document.createElement('div');
        overlay.id = 'createEventModal';
        overlay.className = 'modal modal-large';
        document.body.appendChild(overlay);
    }

    initializeBackdropClickHandler();
    initializeEscapeKeyHandler();
});