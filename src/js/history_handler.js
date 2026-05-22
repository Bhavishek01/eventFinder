// ====================== STUDENT HISTORY MODAL ======================

let currentHistoryType = '';
let currentHistoryData = [];

const historyConfig = {
    report: {
        title: 'Reported Items History',
        url: '../../php/student/get_reported_items.php',
        empty: 'No reported items found.'
    },
    complaint: {
        title: 'Complaints History',
        url: '../../php/student/get_my_complaints.php',
        empty: 'No complaints found.'
    },
    feedback: {
        title: 'Feedback History',
        url: '../../php/student/get_my_feedback.php',
        empty: 'No feedback found.'
    },
    request: {
        title: 'Event Requests History',
        url: '../../php/student/get_my_event_requests.php',
        empty: 'No event requests found.'
    }
};

function handleReportHistory() {
    openHistoryModal('report');
}

function handleComplaintHistory() {
    openHistoryModal('complaint');
}

function handleFeedbackHistory() {
    openHistoryModal('feedback');
}

function handleRequestHistory() {
    openHistoryModal('request');
}

function openHistoryModal(type) {
    currentHistoryType = type;

    openModal('../../frontends/student/history_modal.html', 'historyModal', function(modal) {
        attachModalCloseEvents(modal, 'historyModal');
        loadHistoryData(type);
    });
}

async function loadHistoryData(type) {
    currentHistoryType = type;

    const config = historyConfig[type];
    const titleEl = document.getElementById('historyModalTitle');
    const contentDiv = document.getElementById('historyModalContent');
    const searchEl = document.getElementById('historySearch');

    if (!config || !contentDiv) return;

    if (titleEl) titleEl.textContent = config.title;
    if (searchEl) searchEl.value = '';

    contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading...</p>';

    try {
        const res = await fetch(config.url);
        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || 'Failed to load history.');
        }

        currentHistoryData = Array.isArray(data) ? data : [];
        renderHistoryList(currentHistoryData, type);
    } catch (err) {
        console.error(err);
        contentDiv.innerHTML = '<p style="color:red; text-align:center; padding:40px;">Failed to load history.</p>';
    }
}

function filterHistoryList(term) {
    const q = (term || '').toLowerCase().trim();
    const filtered = currentHistoryData.filter(item => {
        return [
            item.item_name,
            item.subject,
            item.complaint,
            item.feedback,
            item.description,
            item.event_name,
            item.category,
            item.status,
            item.item_type,
            item.location,
            item.venue
        ].filter(Boolean).join(' ').toLowerCase().includes(q);
    });

    renderHistoryList(filtered, currentHistoryType);
}

function renderHistoryList(data, type) {
    const contentDiv = document.getElementById('historyModalContent');
    const config = historyConfig[type];

    if (!contentDiv || !config) return;

    if (!data || data.length === 0) {
        contentDiv.innerHTML = `<p style="text-align:center; padding:60px; color:#666;">${config.empty}</p>`;
        return;
    }

    contentDiv.innerHTML = data.map((item, index) => renderHistoryRow(item, type, index)).join('');
}

function renderHistoryRow(item, type, index) {
    const title = getHistoryTitle(item, type);
    const meta = getHistoryMeta(item, type);
    const badge = getHistoryBadge(item, type);

    return `
        <div class="student-list-item">
            <div class="list-info">
                <h4 style="margin:0 0 4px;">${escapeHtml(title)}</h4>
                <p style="margin:0 0 6px; font-size:0.85rem; color:#667;">${escapeHtml(meta)}</p>
                ${badge}
            </div>
            <button class="ok_btn" onclick="viewHistoryDetail('${type}', ${index})">View</button>
        </div>`;
}

function getHistoryTitle(item, type) {
    if (type === 'report') return item.item_name || 'Unnamed Item';
    if (type === 'complaint') return item.subject || 'Complaint';
    if (type === 'feedback') return item.event_name || 'Event Feedback';
    if (type === 'request') return item.event_name || 'Requested Event';
    return 'History Item';
}

function getHistoryMeta(item, type) {
    if (type === 'report') {
        return [capitalize(item.item_type), item.location, item.report_date || item.created_at].filter(Boolean).join(' | ');
    }
    if (type === 'complaint') {
        return [item.event_name, item.created_at].filter(Boolean).join(' | ');
    }
    if (type === 'feedback') {
        return [item.category, item.venue, item.event_date || item.created_at].filter(Boolean).join(' | ');
    }
    if (type === 'request') {
        return [item.category, item.venue, item.event_date].filter(Boolean).join(' | ');
    }
    return '';
}

function getHistoryBadge(item, type) {
    if (type === 'feedback') {
        const rating = Math.max(0, Math.min(5, parseInt(item.rating, 10) || 0));
        return `<span style="font-size:1rem; color:#e8a000;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>`;
    }

    const label = type === 'report' ? (item.item_type || item.status || 'reported') : (item.status || 'pending');
    const normalized = label.toLowerCase();
    const colors = {
        lost: ['#fdecea', '#b00020'],
        found: ['#e8f5e9', '#184430'],
        approved: ['#e8f5e9', '#184430'],
        rejected: ['#fdecea', '#b00020'],
        replied: ['#e3f0ff', '#1e64c8'],
        pending: ['rgba(185,122,0,0.12)', '#7a5000']
    };
    const [bg, color] = colors[normalized] || ['rgba(24,68,48,0.09)', '#184430'];

    return `<span style="background:${bg};color:${color};font-size:0.75rem;font-weight:700;padding:2px 10px;border-radius:999px;text-transform:capitalize;">${escapeHtml(label)}</span>`;
}

function viewHistoryDetail(type, index) {
    const item = currentHistoryData[index];
    const contentDiv = document.getElementById('historyModalContent');
    const titleEl = document.getElementById('historyModalTitle');
    const searchEl = document.getElementById('historySearch');

    if (!item || !contentDiv) return;

    if (titleEl) titleEl.textContent = getHistoryDetailTitle(type);
    if (searchEl) searchEl.style.display = 'none';

    contentDiv.innerHTML = `
        <button class="btn btn-action" style="margin-bottom:16px;" onclick="showHistoryListAgain()">Back to list</button>
        ${renderHistoryDetail(item, type)}
    `;
}

function showHistoryListAgain() {
    const config = historyConfig[currentHistoryType];
    const titleEl = document.getElementById('historyModalTitle');
    const searchEl = document.getElementById('historySearch');

    if (titleEl && config) titleEl.textContent = config.title;
    if (searchEl) {
        searchEl.style.display = '';
        searchEl.value = '';
    }

    renderHistoryList(currentHistoryData, currentHistoryType);
}

function getHistoryDetailTitle(type) {
    const titles = {
        report: 'Reported Item Detail',
        complaint: 'Complaint Detail',
        feedback: 'Feedback Detail',
        request: 'Event Request Detail'
    };
    return titles[type] || 'History Detail';
}

function renderHistoryDetail(item, type) {
    if (type === 'report') {
        return detailLayout([
            ['Item Name', item.item_name],
            ['Type', capitalize(item.item_type)],
            ['Location', item.location],
            ['Reported Date', item.report_date],
            ['Status', item.status],
            ['Submitted', item.created_at]
        ], [
            ['Description', item.description]
        ], item.item_photo);
    }

    if (type === 'complaint') {
        const hasReply = item.reply && item.reply.trim() !== '';
        return detailLayout([
            ['Subject', item.subject],
            ['Event', item.event_name],
            ['Event Date', item.event_date],
            ['Submitted', item.created_at],
            ['Status', hasReply ? 'Replied' : 'Pending']
        ], [
            ['Your Complaint', item.complaint],
            ['Admin Reply', hasReply ? item.reply : 'No reply yet. Your complaint is being reviewed.'],
            ['Replied By', item.replied_by_name],
            ['Replied At', item.replied_at]
        ]);
    }

    if (type === 'feedback') {
        return detailLayout([
            ['Event', item.event_name],
            ['Event Date', item.event_date],
            ['Category', item.category],
            ['Venue', item.venue],
            ['Rating', `${item.rating || 0} / 5`],
            ['Submitted', item.created_at]
        ], [
            ['Feedback', item.feedback]
        ]);
    }

    if (type === 'request') {
        return detailLayout([
            ['Event Name', item.event_name],
            ['Category', item.category],
            ['Date', item.event_date],
            ['Time', item.event_time],
            ['Venue', item.venue],
            ['Volunteers Needed', item.volunteers_needed],
            ['Status', item.status],
            ['Requested On', item.created_at]
        ], [
            ['Description', item.description]
        ]);
    }

    return '';
}

function detailLayout(fields, blocks, photoPath = '') {
    const photo = photoPath
        ? `<div style="margin-bottom:16px;"><img src="../../${escapeHtml(photoPath)}" alt="Reported item" onerror="this.style.display='none'" style="width:100%;max-height:260px;object-fit:cover;border-radius:8px;"></div>`
        : '';

    const fieldHtml = fields
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([label, value]) => `
            <div class="meta-item">
                <strong>${escapeHtml(label)}</strong>
                <span>${escapeHtml(value)}</span>
            </div>
        `).join('');

    const blockHtml = blocks
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([label, value]) => `
            <div style="margin-top:14px;">
                <h4 style="color:#184430; margin-bottom:8px;">${escapeHtml(label)}</h4>
                <div style="padding:12px 14px;background:rgba(24,68,48,0.05);border-left:4px solid #184430;border-radius:0 8px 8px 0;font-size:0.93rem;color:#1d3228;line-height:1.6;">
                    ${escapeHtml(value)}
                </div>
            </div>
        `).join('');

    return `
        ${photo}
        <div class="event-meta">${fieldHtml}</div>
        ${blockHtml}
    `;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function capitalize(value) {
    if (!value) return '';
    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1);
}
