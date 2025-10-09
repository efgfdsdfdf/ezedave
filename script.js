// ================= USER MANAGEMENT ================= //
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function signup(username, password) {
  if (!username || !password) {
    alert("Please fill all fields!");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("User already exists!");
    return;
  }
  users[username] = { password, notes: [], timetable: [], gpa: [], profile: {} };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  window.location.href = "index.html";
}

function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    alert("Login successful!");
    window.location.href = "homepage.html";
  } else {
    alert("Invalid username or password.");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

/* =========================
   Notes Module (Add / Edit / Delete)
   Paste this into your script.js (replace old notes code)
   ========================= */

(function () {
  // internal state
  let editingIndex = -1; // -1 when creating, >=0 when editing

  // helpers
  function getCurrentUser() {
    return localStorage.getItem("currentUser")
        || localStorage.getItem("loggedInUser")
        || null;
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // DOM elements (resolved at runtime)
  function els() {
    return {
      noteInput: document.getElementById("noteInput"),
      saveBtn: document.getElementById("saveNoteBtn") || document.getElementById("addNoteBtn"),
      cancelBtn: document.getElementById("cancelNoteEditBtn"),
      notesList: document.getElementById("notesList"),
      noteForm: document.getElementById("noteForm") // optional
    };
  }

  // render the user's notes list
  function renderNotes() {
    const { notesList } = els();
    if (!notesList) {
      console.warn("Notes: #notesList not found in DOM.");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      notesList.innerHTML = "<li>Please log in to manage notes.</li>";
      return;
    }

    const users = getUsers();
    const notes = Array.isArray(users[user]?.notes) ? users[user].notes : [];

    notesList.innerHTML = "";
    if (notes.length === 0) {
      notesList.innerHTML = '<li style="opacity:.8">No notes yet — add one above.</li>';
      return;
    }

    notes.forEach((noteText, i) => {
      const li = document.createElement("li");
      li.className = "note-item";
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.gap = "8px";

      const textDiv = document.createElement("div");
      // preserve newlines in display
      textDiv.innerHTML = (String(noteText)).replace(/\n/g, "<br>");
      textDiv.style.flex = "1";
      textDiv.style.textAlign = "left";

      const actions = document.createElement("div");
      actions.style.display = "flex";
      actions.style.gap = "6px";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Edit";
      editBtn.onclick = () => startEdit(i);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️ Delete";
      delBtn.className = "delete-btn";
      delBtn.onclick = () => {
        if (!confirm("Delete this note?")) return;
        deleteNote(i);
      };

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(textDiv);
      li.appendChild(actions);
      notesList.appendChild(li);
    });
  }

  // start editing -> copy note text into textarea, toggle button
  function startEdit(index) {
    const { noteInput, saveBtn, cancelBtn } = els();
    const user = getCurrentUser();
    if (!user) return alert("Please login to edit notes.");

    const users = getUsers();
    const notes = users[user]?.notes || [];
    if (!notes[index]) return console.warn("startEdit: invalid index", index);

    noteInput.value = notes[index];
    editingIndex = index;

    if (saveBtn) saveBtn.textContent = "🔁 Update Note";
    if (cancelBtn) cancelBtn.style.display = "inline-block";

    noteInput.focus();
    // move cursor to end
    noteInput.selectionStart = noteInput.selectionEnd = noteInput.value.length;
  }

  // cancel edit
  function cancelEdit() {
    const { noteInput, saveBtn, cancelBtn } = els();
    editingIndex = -1;
    if (noteInput) noteInput.value = "";
    if (saveBtn) saveBtn.textContent = "💾 Save Note";
    if (cancelBtn) cancelBtn.style.display = "none";
  }

  // save (create or update)
  function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();

    const { noteInput, saveBtn } = els();
    if (!noteInput) return console.warn("Notes: #noteInput not found.");

    const text = noteInput.value.trim();
    if (!text) {
      alert("Please type a note before saving.");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      alert("Please login to save notes.");
      return;
    }

    const users = getUsers();
    if (!users[user]) users[user] = { password: "", notes: [], timetable: [], gpa: [], profile: {} };
    if (!Array.isArray(users[user].notes)) users[user].notes = [];

    if (editingIndex === -1) {
      users[user].notes.push(text);
      console.log("Notes: added note for", user);
    } else {
      users[user].notes[editingIndex] = text;
      console.log("Notes: updated note index", editingIndex, "for", user);
      editingIndex = -1;
      if (saveBtn) saveBtn.textContent = "💾 Save Note";
    }

    saveUsers(users);
    if (noteInput) noteInput.value = "";
    if (els().cancelBtn) els().cancelBtn.style.display = "none";

    renderNotes();
    // try to update dashboard if function exists
    try { if (typeof updateDashboard === "function") updateDashboard(); } catch (e) { /* no-op */ }
  }

  // delete
  function deleteNote(index) {
    const user = getCurrentUser();
    if (!user) return;
    const users = getUsers();
    if (!users[user] || !Array.isArray(users[user].notes)) return;
    users[user].notes.splice(index, 1);
    saveUsers(users);

    // if deleting note currently being edited, cancel edit
    if (editingIndex === index) cancelEdit();
    // if deleting earlier item, adjust editingIndex
    if (editingIndex > index) editingIndex--;

    renderNotes();
    try { if (typeof updateDashboard === "function") updateDashboard(); } catch (e) {}
  }

  // init: attach handlers
  function init() {
    const { noteInput, saveBtn, cancelBtn, noteForm } = els();

    // attach to form submit if present, else button click
    if (noteForm) {
      noteForm.addEventListener("submit", handleSave);
    } else if (saveBtn) {
      // make sure saveBtn doesn't submit a form accidentally
      saveBtn.type = "button";
      saveBtn.addEventListener("click", handleSave);
    } else {
      // fallback: try to find any button with Save Note text
      const possible = Array.from(document.querySelectorAll("button")).find(b => /save note|add note/i.test(b.textContent));
      if (possible) possible.addEventListener("click", handleSave);
    }

    // Cancel edit button (optional)
    if (cancelBtn) {
      cancelBtn.type = "button";
      cancelBtn.addEventListener("click", cancelEdit);
      cancelBtn.style.display = "none";
    }

    // Allow Ctrl+Enter to save
    if (noteInput) {
      noteInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          handleSave();
        }
      });
    }

    // initial render
    renderNotes();
    console.log("Notes module initialized.");
  }

  document.addEventListener("DOMContentLoaded", init);

  // expose for debugging
  window.__notes = {
    renderNotes,
    startEdit,
    deleteNote,
    handleSave,
    cancelEdit
  };
})();



// ================= TIMETABLE ================= //
// === TIMETABLE FUNCTIONS ===

let editingIndex = null;

// Save timetable class
function addClass(e) {
  e.preventDefault();

  const user = getCurrentUser();
  if (!user) return;

  const course = document.getElementById("classCourse").value.trim();
  const day = document.getElementById("classDay").value;
  const time = document.getElementById("classTime").value;
  const notifyBefore = parseInt(document.getElementById("notifyBefore").value);

  if (!course || !day || !time) {
    alert("Please fill in all fields.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[user].timetable) users[user].timetable = [];

  if (editingIndex === null) {
    // Add new
    users[user].timetable.push({ course, day, time, notifyBefore });
  } else {
    // Update existing
    users[user].timetable[editingIndex] = { course, day, time, notifyBefore };
    editingIndex = null;
    document.getElementById("addClassBtn").textContent = "➕ Add Class";
    document.getElementById("cancelEditBtn").style.display = "none";
  }

  localStorage.setItem("users", JSON.stringify(users));

  // Reset form
  document.getElementById("timetableForm").reset();

  loadTimetable();
}

// Load timetable classes
function loadTimetable() {
  const user = getCurrentUser();
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  const timetable = users[user].timetable || [];

  const list = document.getElementById("timetableList");
  if (!list) return;

  list.innerHTML = "";
  timetable.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><b>${item.course}</b> - ${item.day}, ${item.time} (⏰ ${item.notifyBefore} min before)</span>
    `;

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editClass(index);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteClass(index);

    li.appendChild(editBtn);
    li.appendChild(delBtn);

    list.appendChild(li);

    // Schedule notification
    scheduleNotification(item.course, item.day, item.time, item.notifyBefore);
  });
}

// Edit class
function editClass(index) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  const item = users[user].timetable[index];

  document.getElementById("classCourse").value = item.course;
  document.getElementById("classDay").value = item.day;
  document.getElementById("classTime").value = item.time;
  document.getElementById("notifyBefore").value = item.notifyBefore;

  editingIndex = index;
  document.getElementById("addClassBtn").textContent = "Update Class";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

// Cancel editing
document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      editingIndex = null;
      document.getElementById("timetableForm").reset();
      document.getElementById("addClassBtn").textContent = "➕ Add Class";
      cancelBtn.style.display = "none";
    });
  }
});

// Delete class
function deleteClass(index) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  users[user].timetable.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadTimetable();
}

// Schedule notifications
function scheduleNotification(course, day, time, notifyBefore) {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      const [hours, minutes] = time.split(":").map(Number);
      const classDate = new Date();

      const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const today = classDate.getDay();
      const targetDay = daysOfWeek.indexOf(day);
      let diff = targetDay - today;
      if (diff < 0) diff += 7;

      classDate.setDate(classDate.getDate() + diff);
      classDate.setHours(hours, minutes, 0, 0);

      const notifyTime = classDate.getTime() - notifyBefore * 60000;
      const delay = notifyTime - Date.now();

      // Show in homepage notifications
      const list = document.getElementById("homeNotifications");
      if (list) {
        const li = document.createElement("li");
        li.textContent = `⏰ ${course} at ${time} on ${day} (reminder ${notifyBefore} min before)`;
        list.appendChild(li);
      }

      // Send real notification
      if (delay > 0) {
        setTimeout(() => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              title: "Class Reminder",
              body: `${course} starts at ${time} on ${day}. Get ready!`
            });
          } else {
            new Notification("Class Reminder", {
              body: `${course} starts at ${time} on ${day}. Get ready!`,
              icon: "📘"
            });
          }
        }, delay);
      }
    }
  });
}
function loadTodayNotifications() {
  const user = getCurrentUser();
  if (!user) return;

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const data = users[user] || { timetable: [] };

  const notifList = document.getElementById("homeNotifications");
  if (!notifList) return;

  notifList.innerHTML = "";

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];

  // Get today’s classes
  const todayClasses = data.timetable.filter(c => c.day === today);

  if (todayClasses.length === 0) {
    notifList.innerHTML = "<li>No classes today 🎉</li>";
    return;
  }

  todayClasses.forEach(cls => {
    if (!cls.time) return;

    // Add to homepage
    const li = document.createElement("li");
    li.textContent = `📘 ${cls.subject} at ${cls.time}`;
    notifList.appendChild(li);

    // Schedule reminder 30 minutes before
    scheduleNotification(cls.subject, cls.day, cls.time, 30);
  });
}

// Attach form submit
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timetableForm");
  if (form) form.addEventListener("submit", addClass);

  loadTimetable();
});
// Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html"; // redirect to login page
    });
  }

// ====== GPA Calculator ======
const gpaForm = document.getElementById('gpaForm');
const courseNameInput = document.getElementById('courseName');
const courseGradeInput = document.getElementById('courseGrade');
const courseUnitsInput = document.getElementById('courseUnits');
const gpaList = document.getElementById('gpaList');
const gpaResult = document.getElementById('gpaResult');
const cancelEditBtn = document.getElementById('cancelCourseEditBtn');

let courses = JSON.parse(localStorage.getItem('courses')) || [];
let editIndex = null;

// Map letter grades to numeric points
const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

// ====== Render Courses ======
function renderCourses() {
  gpaList.innerHTML = '';
  courses.forEach((course, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${course.name}</strong> - Grade: ${course.grade} (${gradePoints[course.grade]}) - Units: ${course.units}
      <button onclick="editCourse(${index})" class="btn" style="background:#ffc107;margin-left:5px;">✏️</button>
      <button onclick="deleteCourse(${index})" class="btn" style="background:#dc3545;margin-left:5px;">🗑️</button>
    `;
    gpaList.appendChild(li);
  });
  calculateGPA();
}

// ====== Calculate GPA ======
function calculateGPA() {
  if (courses.length === 0) {
    gpaResult.textContent = '0.00';
    return;
  }
  let totalPoints = 0, totalUnits = 0;
  courses.forEach(c => {
    totalPoints += gradePoints[c.grade] * c.units;
    totalUnits += c.units;
  });
  const gpa = totalPoints / totalUnits;
  gpaResult.textContent = gpa.toFixed(2);
}

// ====== Add or Edit Course ======
gpaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = courseNameInput.value.trim();
  const grade = courseGradeInput.value;
  const units = parseInt(courseUnitsInput.value);

  if (!name || !grade || !units) return;

  if (editIndex !== null) {
    courses[editIndex] = { name, grade, units };
    editIndex = null;
    cancelEditBtn.style.display = 'none';
  } else {
    courses.push({ name, grade, units });
  }

  localStorage.setItem('courses', JSON.stringify(courses));
  gpaForm.reset();
  renderCourses();
});

// ====== Edit Course ======
function editCourse(index) {
  const course = courses[index];
  courseNameInput.value = course.name;
  courseGradeInput.value = course.grade;
  courseUnitsInput.value = course.units;
  editIndex = index;
  cancelEditBtn.style.display = 'inline-block';
}

// ====== Cancel Edit ======
cancelEditBtn.addEventListener('click', () => {
  gpaForm.reset();
  editIndex = null;
  cancelEditBtn.style.display = 'none';
});

// ====== Delete Course ======
function deleteCourse(index) {
  if (confirm(`Delete ${courses[index].name}?`)) {
    courses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();
  }
}

// ====== Initial Render ======
renderCourses();

// ====== Logout Button ======
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  alert('You have been logged out!');
  window.location.href = 'homepage.html';
});


// ==========================
// PROFILE PAGE JS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("currentUser") || localStorage.getItem("loggedInUser");
  if (!user) {
    alert("No user logged in!");
    window.location.href = "index.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[user]) users[user] = {};

  const profileUsername = document.getElementById("profileUsername");
  const profilePic = document.getElementById("profilePic");
  const uploadBtn = document.getElementById("uploadBtn");
  const resetPicBtn = document.getElementById("resetPicBtn");
  const uploadPic = document.getElementById("uploadPic");

  const bioText = document.getElementById("bioText");
  const bioInput = document.getElementById("bioInput");
  const editBioBtn = document.getElementById("editBioBtn");
  const saveBioBtn = document.getElementById("saveBioBtn");

  // Display username
  profileUsername.textContent = user;

  // Display profile picture
  profilePic.src = users[user].profilePic || "default-profile.png";

  // Display bio
  bioText.textContent = users[user].bio || "Your bio goes here...";
  bioInput.style.display = "none";
  saveBioBtn.style.display = "none";

  // Upload profile picture
  uploadBtn.addEventListener("click", () => uploadPic.click());
  uploadPic.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
      users[user].profilePic = reader.result;
      localStorage.setItem("users", JSON.stringify(users));
    };
    reader.readAsDataURL(file);
  });

  // Reset picture
  resetPicBtn.addEventListener("click", () => {
    profilePic.src = "default-profile.png";
    users[user].profilePic = "";
    localStorage.setItem("users", JSON.stringify(users));
  });

  // Edit bio
  editBioBtn.addEventListener("click", () => {
    bioInput.value = users[user].bio || "";
    bioText.style.display = "none";
    bioInput.style.display = "block";
    editBioBtn.style.display = "none";
    saveBioBtn.style.display = "inline-block";

    // Auto-adjust textarea height
    bioInput.style.height = "auto";
    bioInput.style.height = bioInput.scrollHeight + "px";
    bioInput.focus();
  });

  // Save bio
  saveBioBtn.addEventListener("click", () => {
    const newBio = bioInput.value.trim() || "Your bio goes here...";
    users[user].bio = newBio;
    localStorage.setItem("users", JSON.stringify(users));

    bioText.textContent = newBio;
    bioText.style.display = "block";
    bioInput.style.display = "none";
    saveBioBtn.style.display = "none";
    editBioBtn.style.display = "inline-block";
  });

  // Optional: auto-expand textarea while typing
  bioInput.addEventListener("input", () => {
    bioInput.style.height = "auto";
    bioInput.style.height = bioInput.scrollHeight + "px";
  });
});
// Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html"; // redirect to login page
    });
  }


// ================= HOMEPAGE ================= //
// === HOME FUNCTIONS ===
// === HOME FUNCTIONS ===

function loadHome() {
  const user = getCurrentUser();
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  let data = users[user];

  // Welcome message
  const welcomeMsg = document.getElementById("welcomeMsg");
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome, ${user} 👋`;
  }

  // Calculate counts
  const notesCount = (data.notes || []).length;
  const classCount = (data.timetable || []).length;
  const gpaCount = (data.gpa || []).length;

  // Update counts on page
  if (document.getElementById("notesCount")) {
    document.getElementById("notesCount").textContent = notesCount;
    document.getElementById("classCount").textContent = classCount;
    document.getElementById("gpaCount").textContent = gpaCount;
  }

  // Progress (max 100%)
  let total = notesCount + classCount + gpaCount;
  let progress = total > 0 ? Math.min(100, total * 20) : 0; 

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  if (progressBar && progressText) {
    progressBar.style.width = progress + "%";
    progressText.textContent = `Your overall progress: ${progress}%`;
  }

  // Notifications
  const notifList = document.getElementById("homeNotifications");
  if (notifList) {
    notifList.innerHTML = "";
    let notifs = data.notifications || [];
    if (notifs.length === 0) {
      notifList.innerHTML = "<li>No notifications yet.</li>";
    } else {
      notifs.slice(-3).reverse().forEach(n => {
        const li = document.createElement("li");
        li.textContent = n;
        notifList.appendChild(li);
      });
    }
  }
}
//=========================================
// Add notification
// ==========================
function addNotification(message) {
  const user = getCurrentUser();
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[user].notifications) users[user].notifications = [];

  users[user].notifications.push(message);
  localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("welcomeMsg")) {
    loadHome();
  }
});
// Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html"; // redirect to login page
    });
  }



function updateNotifications() {
  const user = getCurrentUser();
  if (!user) return;

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const data = users[user] || { timetable: [] };

  const notificationsList = document.getElementById("homeNotifications");
  if (!notificationsList) return;

  notificationsList.innerHTML = "";

  if (!data.timetable || data.timetable.length === 0) {
    notificationsList.innerHTML = "<li>No classes scheduled yet.</li>";
    return;
  }

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];

  const todayClasses = data.timetable.filter(c => c.day === today);

  if (todayClasses.length === 0) {
    notificationsList.innerHTML = "<li>No classes today 🎉</li>";
    return;
  }

  const now = new Date();
  let hasUpcoming = false;

  todayClasses.forEach(cls => {
    if (!cls.time) return;

    const [h, m] = cls.time.split(":").map(Number);
    const classTime = new Date();
    classTime.setHours(h, m, 0);

    // Calculate difference in minutes
    const diffMins = Math.floor((classTime - now) / 60000);

    if (diffMins > 0 && diffMins <= 60) {
      const li = document.createElement("li");
      li.textContent = `⏰ ${cls.subject} starts in ${diffMins} min`;
      notificationsList.appendChild(li);
      hasUpcoming = true;

      // Trigger browser notification if permission granted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Upcoming Class: ${cls.subject}`, {
          body: `Starts in ${diffMins} minute(s)`,
          icon: "default-profile.png" // optional icon
        });
      }
    }
  });

  if (!hasUpcoming) {
    notificationsList.innerHTML = "<li>No upcoming classes within the next hour.</li>";
  }
}

// Request permission for notifications on page load
if ("Notification" in window) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// Call every minute to update dynamically
setInterval(updateNotifications, 60000);
updateNotifications();

// ================= INIT ================= //
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("notesList")) loadNotes();
  if (document.getElementById("timetableList")) loadTimetable();
  if (document.getElementById("gpaList")) loadGPA();
  if (document.getElementById("profileName")) loadProfile();
  if (document.getElementById("welcomeMsg")) {
    loadHomepage();
    updateDashboard();
    updateNotifications();
    setInterval(updateNotifications, 60000); // auto-refresh notifications every 1 min
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("✅ Service Worker registered!");
  });
}
// Replace with your public VAPID key
const publicVapidKey = "BHWjwl2zi4E9SSqkga8Q1udL2G98sXZScnr_PSz04zn0PlCLu33rPQdd7r2l_wQAcEa-iuu07TZukVt-WUvTaJo";

function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      messaging.getToken({ vapidKey: publicVapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            // 🔹 Send this token to your backend to save it for later use
          } else {
            console.log("No registration token available.");
          }
        })
        .catch((err) => {
          console.error("Error retrieving token:", err);
        });
    } else {
      console.log("Notification permission denied.");
    }
  });
}

requestNotificationPermission();










