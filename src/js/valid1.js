/*
    Real-time validation for signup & login forms.
    - Inline feedback below each field (red), no layout shift
    - Submit button disabled until all fields pass
    - College email: button enabled immediately
    - Non-college email: button enabled, but modal fires on submit
    - Login: basic non-empty checks, no inline feedback needed
*/

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const collegeEmailRegex = /^[a-zA-Z]+\d+(bit|bca)\d+@kcc\.edu\.np$/i;
const phoneRegex = /^(98|97)\d{8}$/;

/* ─── helpers ─────────────────────────────────────────────────────────── */

function isCollegeEmail(email) { return collegeEmailRegex.test(email); }
function isValidEmail(email)   { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPassword(pw)   { return passwordRegex.test(pw); }
function isValidPhone(phone)   { return phoneRegex.test(phone); }

/**
 * Show or clear the feedback <p> for a field.
 * msg = null/'' → clear (success / neutral)
 */
function setFeedback(fieldName, msg, level = 'error') {
    const el = document.querySelector(`[data-feedback="${fieldName}"]`);
    if (!el) return;
    if (msg) {
        el.textContent = msg;
        el.className = `field-feedback ${level}`;
    } else {
        el.textContent = '';
        el.className = 'field-feedback';
    }
}

function setInputState(input, hasError) {
    if (!input) return;
    input.classList.toggle('input-error',   hasError);
    input.classList.toggle('input-success', !hasError);
}

/* ─── per-field validators ────────────────────────────────────────────── */

// Returns error string or '' if valid
function validateFullname(val) {
    if (!val) return 'Full name is required.';
    if (val.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z\s'-]+$/.test(val)) return 'Name can only contain letters, spaces, hyphens, or apostrophes.';
    return '';
}

// Returns { error, info } — error blocks submit, info is just a warning
function validateEmail(val) {
    if (!val) return { error: 'Email address is required.', info: '' };
    if (!isValidEmail(val)) return { error: 'Please enter a valid email address.', info: '' };
    if (!isCollegeEmail(val)) return { error: '', info: 'not college email.' };
    return { error: '', info: '' };
}

function validateAddress(val) {
    if (!val) return 'Address is required.';
    if (val.length < 3) return 'Enter valid address.';
    return '';
}

function validatePhone(val) {
    if (!val) return 'Phone number is required.';
    if (!isValidPhone(val)) return '(98XXXXXXXX or 97XXXXXXXX).';
    return '';
}

function validatePassword(val) {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Add at least one uppercase letter.';
    if (!/[a-z]/.test(val)) return 'Add at least one lowercase letter.';
    if (!/\d/.test(val)) return 'Add at least one digit (0–9).';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) return 'Add at least one symbol (!@#$%…).';
    return '';
}

function validateConfirmPassword(val, pw) {
    if (!val) return 'Please confirm your password.';
    if (val !== pw) return 'Passwords do not match.';
    return '';
}

/* ─── submit-button state ─────────────────────────────────────────────── */

let nonCollegeAcknowledged = false; // set true when user clicks "Wait for Approval"

function updateSubmitButton() {
    const btn = document.getElementById('signupSubmitBtn');
    if (!btn) return;

    const fullname = document.getElementById('fullname')?.value.trim()        ?? '';
    const email    = document.getElementById('email')?.value.trim()            ?? '';
    const address  = document.getElementById('address')?.value.trim()          ?? '';
    const phone    = document.getElementById('phone')?.value.trim()             ?? '';
    const password = document.getElementById('password')?.value                 ?? '';
    const confirm  = document.getElementById('confirm-password')?.value         ?? '';

    const allValid =
        !validateFullname(fullname) &&
        !validateEmail(email).error &&
        isValidEmail(email) &&
        !validateAddress(address) &&
        !validatePhone(phone) &&
        !validatePassword(password) &&
        !validateConfirmPassword(confirm, password);

    btn.disabled = !allValid;
}

/* ─── non-college modal ───────────────────────────────────────────────── */

function showNonCollegeModal(email, onProceed) {
    document.getElementById('nonCollegeModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'nonCollegeModal';
    modal.className = 'nc-modal-overlay';
    modal.innerHTML = `
        <div class="nc-modal">
            <h3>Non-College Email Detected</h3>
            <p>The email <strong>${email}</strong> is not a registered KCC college email.</p>
            <p>You can't' sign up, but you can change your email or go back to homepage.</p>
            <div class="nc-modal-actions">
                <button id="ncProceed" class="btn btn-primary">Go back to Homepage</button>
                <button id="ncCancel"  class="btn btn-secondary">Use a Different Email</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('ncProceed').addEventListener('click', () => {
        nonCollegeAcknowledged = true;
        modal.remove();
        onProceed(); // actually submit the form
    });

    document.getElementById('ncCancel').addEventListener('click', () => {
        modal.remove();
        document.getElementById('email').focus();
    });
}

/* ─── login handler ───────────────────────────────────────────────────── */

function handleLoginSubmit(event) {
    const email    = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        event.preventDefault();
        if (!email)    alert('Please enter your email.');
        else if (!password) alert('Please enter your password.');
        return false;
    }
    return true;
}

/* ─── signup handler ──────────────────────────────────────────────────── */

function handleSignupSubmit(event) {
    // Run all validators one more time on submit as a safety net
    const fullname = document.getElementById('fullname').value.trim();
    const email    = document.getElementById('email').value.trim();
    const address  = document.getElementById('address').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm  = document.getElementById('confirm-password').value;

    const emailResult = validateEmail(email);
    setFeedback('fullname',         validateFullname(fullname));
    setFeedback('email',            emailResult.error || emailResult.info, emailResult.error ? 'error' : 'info');
    setFeedback('address',          validateAddress(address));
    setFeedback('phone',            validatePhone(phone));
    setFeedback('password',         validatePassword(password));
    setFeedback('confirm-password', validateConfirmPassword(confirm, password));

    const hasErrors =
        validateFullname(fullname) ||
        emailResult.error ||
        !isValidEmail(email) ||
        validateAddress(address) ||
        validatePhone(phone) ||
        validatePassword(password) ||
        validateConfirmPassword(confirm, password);

    if (hasErrors) {
        event.preventDefault();
        return false;
    }

    // Non-college email: show modal, hold submission
    if (!isCollegeEmail(email) && !nonCollegeAcknowledged) {
        event.preventDefault();
        const form = event.target;
        showNonCollegeModal(email, () => goToHomepage());
        return false;
    }

    return true;
}

/* ─── password visibility toggle ─────────────────────────────────────── */

function togglePasswordVisibility(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    if (!inputField || !toggleIcon) return;

    if (inputField.type === 'password') {
        inputField.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        inputField.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

/* ─── DOMContentLoaded wiring ─────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {

    /* ── Login form ── */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);

        document.getElementById('toggleLoginPassword')
            ?.addEventListener('click', () => togglePasswordVisibility('password', 'toggleLoginPassword'));
    }

    /* ── Signup form ── */
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', handleSignupSubmit);

    // Password visibility
    document.getElementById('toggleSignupPassword')
        ?.addEventListener('click', () => togglePasswordVisibility('password', 'toggleSignupPassword'));
    document.getElementById('toggleConfirmPassword')
        ?.addEventListener('click', () => togglePasswordVisibility('confirm-password', 'toggleConfirmPassword'));

    /* ── Real-time field listeners ── */

    const fullnameEl  = document.getElementById('fullname');
    const emailEl     = document.getElementById('email');
    const addressEl   = document.getElementById('address');
    const phoneEl     = document.getElementById('phone');
    const passwordEl  = document.getElementById('password');
    const confirmEl   = document.getElementById('confirm-password');

    function wire(el, fieldName, validator, extraArg) {
        if (!el) return;

        const runValidation = () => {
            const val = el.value;
            const err = typeof extraArg === 'function'
                ? validator(val, extraArg())   // e.g. confirm-password needs current pw
                : validator(val);
            setFeedback(fieldName, err);
            setInputState(el, !!err);
            updateSubmitButton();
        };

        el.addEventListener('input', runValidation);
        el.addEventListener('blur',  runValidation);
    }

    wire(fullnameEl, 'fullname', validateFullname);

    // Email has its own handler since it returns { error, info }
    if (emailEl) {
        const runEmailValidation = () => {
            const result = validateEmail(emailEl.value);
            if (result.error) {
                setFeedback('email', result.error, 'error');
                setInputState(emailEl, true);
            } else if (result.info) {
                setFeedback('email', result.info, 'info');
                setInputState(emailEl, false);
            } else {
                setFeedback('email', '');
                setInputState(emailEl, false);
            }
            updateSubmitButton();
        };
        emailEl.addEventListener('input', runEmailValidation);
        emailEl.addEventListener('blur',  runEmailValidation);
    }
    wire(addressEl,  'address',          validateAddress);
    wire(phoneEl,    'phone',            validatePhone);
    wire(passwordEl, 'password',         validatePassword);

    // Confirm-password also re-validates whenever the main password changes
    wire(confirmEl,  'confirm-password', validateConfirmPassword, () => passwordEl?.value ?? '');
    passwordEl?.addEventListener('input', () => {
        if (confirmEl?.value) {
            const err = validateConfirmPassword(confirmEl.value, passwordEl.value);
            setFeedback('confirm-password', err);
            setInputState(confirmEl, !!err);
            updateSubmitButton();
        }
    });

    // Email: reset nonCollegeAcknowledged if user edits the email after modal
    emailEl?.addEventListener('input', () => {
        nonCollegeAcknowledged = false;
    });

    // Initial button state
    updateSubmitButton();
});

function goToHomepage()
{
    window.location.href = `index.php`;
}