// ====================== HISTORY HANDLER ======================
// Handles history modals for: Event Requests, Complaints, Feedback, Reported Items

// ── Config: maps history type → { title, phpUrl, renderRow, renderDetail } ──

const history_types = {

    eventRequest: {
        title: 'Event Request History',
        url: '../../php/student/get_my_event_requests.php',
        searchKey: 'event_name',
        renderRow(item) {
            const statusClass = {
                pending:  'status-pending',
                approved: 'status-approved',
                rejected: 'status-rejected'
            }[item.status?.toLowerCase()] || 'status-pending';

            return `
                <div class="history-item">
                    <div class="list-info">
                        <h4>${item.ename || 'Unnamed Event'}</h4>
                        <p>${item.date || 'No date'} | ${(item.category) || 'N/A'}</p>
                        <span class="history-status ${statusClass}">${(item.status) || 'Pending'}</span>
                    </div>
                    <button class="ok_btn" onclick="openHistoryDetail('eventRequest', ${item.request_id})">View</button>
                </div>`;
        },
        renderDetail(item) {
            const photoHTML = item.photo
                ? `<img src="../../${item.photo}" alt="${item.ename}"
                        onerror="this.style.display='none'"
                        style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-bottom:12px;">`
                : '';
            const typeLabel = item.item_type === 'lost' ? '🔴 Lost Item' : '🟢 Found Item';
            return `
                <div class="history-detail">
                    <h3>${item.ename || 'Unnamed Event'}</h3>
                    <div class="detail-grid">
                        <div class="detail-row"><strong>Category</strong><span>${(item.category) || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Date</strong><span>${item.date || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Time</strong><span>${item.time || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Venue</strong><span>${item.venue || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Volunteers Needed</strong><span>${item.volunteers_needed ?? 'N/A'}</span></div>
                        <div class="detail-row"><strong>Status</strong><span>${(item.status) || 'Pending'}</span></div>
                        <div class="detail-row"><strong>Submitted On</strong><span>${(item.created_at)}</span></div>
                    </div>
                    <div class="detail-section">
                        <strong>Description</strong>
                        <p>${item.description || 'No description provided.'}</p>
                    </div>
                </div>`;
        }
    },

    complaint: {
        title: 'My Complaints',
        url: '../../php/student/get_my_complaints.php',
        searchKey: 'subject',
        renderRow(item) {
            const statusClass = item.reply ? 'status-approved' : 'status-pending';
            const statusLabel = item.reply ? 'Replied' : 'Pending';
            return `
                <div class="history-item">
                    <div class="list-info">
                        <h4>${item.subject || 'No Subject'}</h4>
                        <p>${item.ename} | ${(item.date)}</p>
                        <span class="history-status ${statusClass}">${statusLabel}</span>
                    </div>
                    <button class="ok_btn" onclick="openHistoryDetail('complaint', ${item.complaint_id})">View</button>
                </div>`;
        },
        renderDetail(item) {
            const replySection = item.reply
                ? `<div class="detail-section reply-section">
                        <strong>Admin Reply</strong>
                        <p>${item.reply}</p>
                        <small>By ${item.replied_by_name || 'Admin'} on ${(item.replied_at)}</small>
                   </div>`
                : `<div class="detail-section"><p style="color:#999; font-style:italic;">No reply yet.</p></div>`;

            return `
                <div class="history-detail">
                    <h3>${item.subject || 'No Subject'}</h3>
                    <div class="detail-grid">
                        <div class="detail-row"><strong>Event</strong><span>${item.ename || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Event Date</strong><span>${item.date || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Submitted On</strong><span>${(item.created_at)}</span></div>
                        <div class="detail-row"><strong>Status</strong>
                            <span>${item.reply ? 'Replied' : 'Pending'}</span>
                        </div>
                    </div>
                    <div class="detail-section">
                        <strong>Your Complaint</strong>
                        <p>${item.complaint || ''}</p>
                    </div>
                    ${replySection}
                </div>`;
        }
    },

    feedback: {
        title: 'My Feedback',
        url: '../../php/student/get_my_feedback.php',
        searchKey: 'event_name',
        renderRow(item) {
            const stars = '★'.repeat(item.rating || 0) + '☆'.repeat(5 - (item.rating || 0));
            return `
                <div class="history-item">
                    <div class="list-info">
                        <h4>${item.ename || 'N/A'}</h4>
                        <p>${item.date || 'N/A'} | ${item.category || 'N/A'}</p>
                        <span class="history-stars">${stars}</span>
                    </div>
                    <button class="ok_btn" onclick="openHistoryDetail('feedback', ${item.feedback_id})">View</button>
                </div>`;
        },
        renderDetail(item) {
            const stars = '★'.repeat(item.rating || 0) + '☆'.repeat(5 - (item.rating || 0));
            return `
                <div class="history-detail">
                    <h3>${item.ename || 'N/A'}</h3>
                    <div class="detail-grid">
                        <div class="detail-row"><strong>Category</strong><span>${(item.category) || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Venue</strong><span>${item.venue || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Event Date</strong><span>${item.date || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Submitted On</strong><span>${(item.created_at)}</span></div>
                        <div class="detail-row"><strong>Rating</strong><span class="history-stars">${stars}</span></div>
                    </div>
                    <div class="detail-section">
                        <strong>Your Feedback</strong>
                        <p>${item.feedback || 'No comments.'}</p>
                    </div>
                </div>`;
        }
    },

    reportedItem: {
        title: 'My Reported Items',
        url: '../../php/student/get_reported_items.php',
        searchKey: 'item_name',
        renderRow(item) {
            const typeClass  = item.item_type === 'lost' ? 'status-rejected' : 'status-approved';
            const typeLabel  = item.item_type === 'lost' ? '🔴 Lost' : '🟢 Found';
            const statusBadge = item.status
                ? `<span class="history-status status-pending">${(item.status)}</span>`
                : '';
            return `
                <div class="history-item">
                    <div class="list-info">
                        <h4>${item.item_name || 'Unnamed Item'}</h4>
                        <p>${item.location || 'N/A'} | ${item.report_date || 'N/A'}</p>
                        <span class="history-status ${typeClass}">${typeLabel}</span>
                        ${statusBadge}
                    </div>
                    <button class="ok_btn" onclick="openHistoryDetail('reportedItem', ${item.item_id})">View</button>
                </div>`;
        },
        renderDetail(item) {
            const photoHTML = item.item_photo
                ? `<img src="../../${item.item_photo}" alt="${item.item_name}"
                        onerror="this.style.display='none'"
                        style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-bottom:12px;">`
                : '';
            const typeLabel = item.item_type === 'lost' ? '🔴 Lost Item' : '🟢 Found Item';
            return `
                <div class="history-detail">
                    ${photoHTML}
                    <h3>${item.item_name || 'Unnamed Item'}</h3>
                    <div class="detail-grid">
                        <div class="detail-row"><strong>Type</strong><span>${typeLabel}</span></div>
                        <div class="detail-row"><strong>Location</strong><span>${item.location || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Date</strong><span>${item.report_date || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Status</strong><span>${(item.status) || 'N/A'}</span></div>
                        <div class="detail-row"><strong>Reported On</strong><span>${(item.created_at)}</span></div>
                    </div>
                    <div class="detail-section">
                        <strong>Description</strong>
                        <p>${item.description || 'No description provided.'}</p>
                    </div>
                </div>`;
        }
    }
};

// ── Internal state ──────────────────────────────────────────
let _historyType = '';
let _historyData = [];


function openHistoryModal(type) {
    const config = history_types[type];
    if (!config) { console.error('Unknown history type:', type); return; }

    _historyType = type;
    _historyData = [];

    // Build modal HTML inline (no extra HTML file needed)
    let modal = document.getElementById('historyListModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'historyListModal';
        modal.className = 'modal modal-large';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content modal-content-large">
            <div class="modal-header">
                <h2 id="historyModalTitle">${config.title}</h2>
                <span class="close" onclick="closeModal('historyListModal')">✕</span>
            </div>
            <input type="text" id="historySearchInput" class="student-list-search"
                   placeholder="Search..." oninput="filterHistoryList()" 
                   style="width:100%; padding:10px 12px; margin-bottom:16px; border:1.5px solid #ddd; border-radius:6px; font-size:0.95rem; font-family:inherit; background:var(--light-bg);">
            <div id="historyListContent" style="max-height:65vh; overflow-y:auto;">
                <p style="text-align:center; padding:40px; color:#666;">Loading…</p>
            </div>
        </div>`;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    _fetchHistoryData(type);
}

async function _fetchHistoryData(type) {
    const config  = history_types[type];
    const content = document.getElementById('historyListContent');
    if (!content) return;

    try {
        const res  = await fetch(config.url);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        _historyData = Array.isArray(data) ? data : [];
        _renderHistoryList(_historyData);
    } catch (err) {
        console.error('History fetch error:', err);
        content.innerHTML = `<p style="color:red; text-align:center; padding:40px;">Failed to load history. Please try again.</p>`;
    }
}

function _renderHistoryList(data) {
    const config  = history_types[_historyType];
    const content = document.getElementById('historyListContent');
    if (!content || !config) return;

    if (!data.length) {
        content.innerHTML = `<p style="text-align:center; padding:60px; color:#999; font-style:italic;">No records found.</p>`;
        return;
    }

    content.innerHTML = data.map(item => config.renderRow(item)).join('');
}

function filterHistoryList() {
    const term   = document.getElementById('historySearchInput')?.value.toLowerCase().trim() || '';
    const config = history_types[_historyType];
    if (!config) return;

    const key      = config.searchKey;
    const filtered = _historyData.filter(item =>
        (item[key] || '').toLowerCase().includes(term)
    );
    _renderHistoryList(filtered);
}


function openHistoryDetail(type, id) {
    const config = history_types[type];
    if (!config) return;

    // Find the record in _historyData (works even if filtered list was shown)
    const idKey = { eventRequest: 'request_id', complaint: 'complaint_id', feedback: 'feedback_id', reportedItem: 'item_id' }[type];
    const item  = _historyData.find(r => String(r[idKey]) === String(id));
    if (!item) { console.warn('Detail record not found for id', id); return; }

    // Build / reuse detail modal
    let detailModal = document.getElementById('historyDetailModal');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'historyDetailModal';
        detailModal.className = 'modal modal-large';
        document.body.appendChild(detailModal);
    }

    detailModal.innerHTML = `
        <div class="modal-content modal-content-large">
            <div class="modal-header">
                <h2>Details</h2>
                <span class="close" onclick="closeModal('historyDetailModal')">✕</span>
            </div>
            <div id="historyDetailContent">
                ${config.renderDetail(item)}
            </div>
        </div>`;

    // Inject detail styles once
    _injectHistoryStyles();

    detailModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function _injectHistoryStyles() {
    if (document.getElementById('historyHandlerStyles')) return;
    const style = document.createElement('style');
    style.id = 'historyHandlerStyles';
    style.textContent = `
        /* History list item */
        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            padding: 14px 10px;
            border-bottom: 1px solid #eee;
        }
        .history-item:last-child { border-bottom: none; }

        /* Status badges */
        .history-status {
            display: inline-block;
            margin-top: 4px;
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
        }
        .status-pending  { background: #fff3cd; color: #856404; }
        .status-approved { background: #d1e7dd; color: #0f5132; }
        .status-rejected { background: #f8d7da; color: #842029; }

        /* Star rating */
        .history-stars { color: #f5a623; font-size: 1rem; letter-spacing: 2px; }

        /* Detail view */
        .history-detail h3 {
            color: var(--dark-green, #184430);
            margin-bottom: 14px;
            font-size: 1.25rem;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 20px;
            margin-bottom: 16px;
        }
        @media (max-width: 520px) { .detail-grid { grid-template-columns: 1fr; } }

        .detail-row {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .detail-row strong {
            font-size: 0.8rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .detail-row span {
            font-size: 0.95rem;
            color: inherit;
        }

        .detail-section {
            margin-top: 14px;
            padding: 12px;
            background: rgba(0,0,0,0.03);
            border-radius: 8px;
        }
        .detail-section strong {
            display: block;
            margin-bottom: 6px;
            font-size: 0.85rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .detail-section p { margin: 0; line-height: 1.6; }

        /* Admin reply block */
        .reply-section {
            background: rgba(24, 68, 48, 0.05);
            border-left: 3px solid var(--dark-green, #184430);
        }
        .reply-section small {
            display: block;
            margin-top: 6px;
            font-size: 0.8rem;
            color: #999;
        }

        /* Dark mode compatibility */
        body.dark-mode .history-item { border-bottom-color: #444; }
        body.dark-mode .detail-section { background: rgba(255,255,255,0.05); }
        body.dark-mode .reply-section  { background: rgba(248,200,148,0.08); }
        body.dark-mode .history-status.status-pending  { background: #433d1a; color: #ffd700; }
        body.dark-mode .history-status.status-approved { background: #1a3328; color: #6fcf97; }
        body.dark-mode .history-status.status-rejected { background: #3d1a1a; color: #eb5757; }
    `;
    document.head.appendChild(style);
}

_injectHistoryStyles();