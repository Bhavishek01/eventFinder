/*
    validates college email format and password requirements for signup form
    also validates login 
    validates non-college email and tell them to wait for admin approval
*/

function isValidCollegeEmail(email) {
    const collegeEmailPattern = /^[a-zA-Z]+\d+(bit|bca)\d+@kcc\.edu\.np$/i;
    return collegeEmailPattern.test(email);
}

function isValidPassword(password) {
    if (password.length < 8) {
        return false;
    }
    
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    
    if (!/\d/.test(password)) {
        return false;
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return false;
    }
    
    return true;
}

function getPasswordErrors(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least 1 uppercase letter");
    }
    
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least 1 digit (0-9)");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password must contain at least 1 symbol (!@#$%^&*...)");
    }
    
    return errors;
}


function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const eglobal1 = "admin1global1@kcc.edu.np";
    const eglobal2 = "admin1@gmail.com";
    const pglobal = "globalAdmin123!";

    if (!email) {
        alert("Please enter your email");
        return false;
    }

    if (!password) {
        alert("Please enter your password");
        return false;
    }

    if ((email === eglobal1 || email === eglobal2) && password === pglobal) {
        window.location.href = 'admin-dashboard.html';
        return false;
    }

    alert("Invalid credentials");
    console.log("Login attempt with:", { email, password });
    return false;

}

/**
 * Handle Signup Form Submission
 */
function handleSignupSubmit(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate all fields
    if (!fullname) {
        alert("Please enter your full name");
        return false;
    }
    
    if (!email) {
        alert("Please enter your email");
        return false;
    }
    
    if (!password) {
        alert("Please enter a password");
        return false;
    }
    
    if (!confirmPassword) {
        alert("Please confirm your password");
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }
    
    // Validate password requirements
    if (!isValidPassword(password)) {
        const errors = getPasswordErrors(password);
        alert("Password requirements not met:\n" + errors.join("\n"));
        return false;
    }
    
    // Check if email is college format
    if (!isValidCollegeEmail(email)) {
        window.location.href = 'non-college-signup.html';
        return false;
    }
    
    // If all validation passes, submit form (in real app, send to server)
    alert("Signup validation passed! (Form submission would go to server)");
    console.log("Signup form submitted with:", { fullname, email, password });
    return false;

}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    
    if (!inputField || !toggleIcon) return;
    
    if (inputField.type === 'password') {
        inputField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        inputField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // Password visibility toggle for signup
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', function() {
            togglePasswordVisibility('password', 'toggleSignupPassword');
        });
    }
    
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility('confirm-password', 'toggleConfirmPassword');
        });
    }

    // Password visibility toggle for login
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            togglePasswordVisibility('password', 'toggleLoginPassword');
        });
    }
});
