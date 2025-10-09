// ====== AUTHENTICATION ======

// Get current logged-in user
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

// Update greeting across pages
function updateGreeting() {
  const username = getCurrentUser();
  if (username) {
    const userGreeting = document.getElementById("user-greeting");
    const userNameSpan = document.getElementById("user-name");
    const profileUsername = document.getElementById("profile-username");
    if (userGreeting) userGreeting.textContent = `Hello, ${username}`;
    if (userNameSpan) userNameSpan.textContent = username;
    if (profileUsername) profileUsername.textContent = username;
  }
}

// Redirect if logged in
function redirectIfLoggedIn() {
  if (getCurrentUser() && window.location.pathname.endsWith("index.html")) {
    window.location.href = "home.html";
  }
}

// Redirect if not logged in
function redirectIfNotLoggedIn() {
  if (!getCurrentUser() && !window.location.pathname.endsWith("index.html") && !window.location.pathname.endsWith("signup.html")) {
    window.location.href = "index.html";
  }
}

// SIGNUP
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    if (!username || !password) return alert("Please enter username and password!");

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) return alert("Username already exists!");

    users[username] = { password: password };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    window.location.href = "index.html";
  });
}

// LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
      localStorage.setItem("currentUser", username);
      window.location.href = "home.html";
    } else {
      alert("Invalid username or password!");
    }
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

// Initialize
redirectIfLoggedIn();
redirectIfNotLoggedIn();
updateGreeting();

