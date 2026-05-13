// ../js/remember-me.js

document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    const rememberMeCheckbox = document.querySelector('.remember-forgot input[type="checkbox"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Function to save credentials in cookie
    function saveCredentials() {
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
            const email = emailInput.value.trim();
            
            if (email) {
                // Save email for 30 days
                setCookie('remember_email', email, 30);
                
                // Optional: You can also save a "remember me" flag
                setCookie('remember_me', 'true', 30);
            }
        } else {
            // Clear cookies if "Remember Me" is not checked
            deleteCookie('remember_email');
            deleteCookie('remember_me');
        }
    }

    // Function to load saved email
    function loadSavedCredentials() {
        const savedEmail = getCookie('remember_email');
        if (savedEmail) {
            emailInput.value = savedEmail;
            if (rememberMeCheckbox) {
                rememberMeCheckbox.checked = true;
            }
        }
    }

    // Helper: Set Cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" 
                        + expires + ";path=/;SameSite=Strict";
    }

    // Helper: Get Cookie
    function getCookie(name) {
        const cName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cName) === 0) {
                return c.substring(cName.length, c.length);
            }
        }
        return "";
    }

    // Helper: Delete Cookie
    function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Load saved email when page loads
    loadSavedCredentials();

    // Save credentials before form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function () {
            saveCredentials();
        });
    }
});