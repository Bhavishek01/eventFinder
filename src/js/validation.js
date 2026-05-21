/*
    validates college email format and password requirements for signup form
    also validates login 
    validates non-college email and tell them to wait for admin approval
*/

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const emailRegex = /^[a-zA-Z]+\d+(bit|bca)\d+@kcc\.edu\.np$/i;
const phoneRegex = /^(98|97)\d{8}$/;


function isValidCollegeEmail(email) {
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return passwordRegex.test(password);
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

function isValidPhone(phone) {
    return phoneRegex.test(phone);
}

function handleLoginSubmit(event) {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email) {
        event.preventDefault();
        alert("Please enter your email");
        return false;
    }

    if (!password) {
        event.preventDefault();
        alert("Please enter your password");
        return false;
    }

    return true;

}

function handleSignupSubmit(event) {
    const fullname = document.getElementById('fullname').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    

    if (!fullname) {
        event.preventDefault();
        alert("Please enter your full name");
        return false;
    }
        
    if (!address) {
        event.preventDefault();
        alert("Please enter your address");
        return false;
    }

    if(!isValidPhone(phone)) {
        event.preventDefault();
        alert("Please enter a valid phone number (98XXXXXXXX or 97XXXXXXXX)");
        return false;
    }
    
    if (!isValidPassword(password)) {
        event.preventDefault();
        const errors = getPasswordErrors(password);
        alert("Password requirements not met");
        return false;
    }else if (password !== confirmPassword) {
        event.preventDefault();
        alert("Passwords do not match");
        return false;
    }

    if (!isValidCollegeEmail(email)) {
        event.preventDefault();
        const proceed = confirm("Do you want to proceed with a non-college email?");
        if (proceed) {
            location.href = "non_college_signup.html";
        }
        return false;
    }
    return true;
}

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
