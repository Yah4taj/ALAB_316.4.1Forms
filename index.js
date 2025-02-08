

const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");
const errorDisplay = document.getElementById("errorDisplay");

// Show errors and set focus
function showError(message, element) {
    errorDisplay.style.display = "block";
    errorDisplay.textContent = message;
    if (element) {
        element.focus();
    }
}

//Registration Form: Username validation 

function hasAtLeastTwoUniqueChars(str) {                 
    return new Set(str.toLowerCase()).size >= 2;
}

function isValidUsername(username) {
    // // The username cannot be blank.
    if (!username) {
        return "Username cannot be blank.";
    }
    // The username must be at least four characters long.
    if (username.length < 4) {
        return "Username must be at least four characters long.";
    }
    // The username must have two unique characters.
    if (!hasAtLeastTwoUniqueChars(username)) {
        return "Username must contain at least two unique characters.";
    }
    // The username cannot have special characters and whitespace
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return "Username cannot contain any special characters or whitespace.";
    }
    return null;
}

// Registration Form: Email validation 
// The email must be a valid email address.
// The email must not be from the domain "example.com.

function isValidEmail(email) {
    if (!email) {
        return "Email cannot be blank.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return "Email must be a valid email address.";
    }
    if (email.toLowerCase().endsWith("@example.com")) {
        return "Email cannot be from the domain 'example.com'.";
    }
    return null;
}

//Registration Form: Password Validation
// Password validation 
// Passwords must be at least 12 characters long.
// Passwords must have at least one uppercase and one lowercase letter.
// Passwords must contain at least one number.
// Passwords must contain at least one special character.
// Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).
// Passwords cannot contain the username.
// Both passwords must match.

function isValidPassword(password, username) {
    if (password.length < 12) {
        return "Passwords must be at least 12 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Passwords must have at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
        return "Passwords must have at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
        return "Passwords must contain at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Passwords must contain at least one special character.";
    }
    if (password.toLowerCase().includes("password")) {
        return "Passwords cannot contain the word 'password'.";
    }
    if (password.toLowerCase().includes(username.toLowerCase())) {
        return "Passwords cannot contain the username.";
    }
    return null;
}

// Local storage 
function isUsernameTaken(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users.hasOwnProperty(username.toLowerCase());
}

function storeUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[username.toLowerCase()] = {
        email: email.toLowerCase(),
        password: password
    };
    localStorage.setItem("users", JSON.stringify(users));
}

// Registration form handler
registrationForm.addEventListener("submit", function(e) {
    e.preventDefault();
    errorDisplay.style.display = "none";

    const username = this.elements.username.value;
    const email = this.elements.email.value;
    const password = this.elements.password.value;
    const passwordCheck = this.elements.passwordCheck.value;
    const terms = this.elements.terms.checked;

    // Username validation
    const usernameError = isValidUsername(username);
    if (usernameError) {
        return showError(usernameError, this.elements.username);
    }
    if (isUsernameTaken(username)) {
        return showError("That username is already taken.", this.elements.username);
    }

    // Email validation
    const emailError = isValidEmail(email);
    if (emailError) {
        return showError(emailError, this.elements.email);
    }

    // Password validation
    const passwordError = isValidPassword(password, username);
    if (passwordError) {
        return showError(passwordError, this.elements.password);
    }

    // Password match validation
    if (password !== passwordCheck) {
        return showError("Both passwords must match.", this.elements.passwordCheck);
    }

    // Terms validation
    if (!terms) {
        return showError("The terms and conditions must be accepted.", this.elements.terms);
    }

    // Store user data
    storeUser(username, email, password);
    
    // Clear form and show success
    this.reset();
    errorDisplay.style.display = "block";
    errorDisplay.textContent = "Registration successful!";
});

// Login form handler
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    errorDisplay.style.display = "none";

    const username = this.elements.username.value;
    const password = this.elements.password.value;
    const keepLoggedIn = this.elements.persist.checked;

    // Username validation
    if (!username) {
        return showError("Username cannot be blank.", this.elements.username);
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users.hasOwnProperty(username.toLowerCase())) {
        return showError("Username does not exist.", this.elements.username);
    }

    // Password validation
    if (!password) {
        return showError("Password cannot be blank.", this.elements.password);
    }

    const user = users[username.toLowerCase()];
    if (user.password !== password) {
        return showError("Incorrect password.", this.elements.password);
    }

    // Success
    this.reset();
    errorDisplay.style.display = "block";
    errorDisplay.textContent = `Login successful!${keepLoggedIn ? " You will be kept logged in." : ""}`;
});