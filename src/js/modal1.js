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
