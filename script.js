/* ====================== AUTH ====================== */
function signup(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("Username already exists!");
    return;
  }
  users[username] = { password, notes: [], timetable: [], gpa: [], bio: "", pic: "default-profile.png", notifications: [] };
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", username);
  window.location.href = "homepage.html";
}

function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username] && users[username].password === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "homepage.html";
  } else {
    alert("Invalid login details!");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function getCurrentUser() {
  return localStorage.getItem("loggedInUser");
}

/* ====================== NOTES ====================== */
let notesEditingIndex = null;

function saveNote() {
  const user = getCurrentUser();
  if (!user) return;
  const noteInput = document.getElementById("noteInput").value.trim();
  if (!noteInput) return;

  let users = JSON.parse(localStorage.getItem("users"));
  if (notesEditingIndex !== null) {
    users[user].notes[notesEditingIndex] = noteInput;
    notesEditingIndex = null;
  } else {
    users[user].notes.push(noteInput);
  }

  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("noteInput").value = "";
  loadNotes();
}

function loadNotes() {
  const user = getCurrentUser();
  if (!user) return;
  let users = JSON.parse(localStorage.getItem("users"));
  let notes = users[user].notes || [];
  const notesList = document.getElementById("notesList");
  if (!notesList) return;

  notesList.innerHTML = "";
  notes.forEach((note, i) => {
    let li = document.createElement("li");
    li.innerHTML = `<span>${note}</span>
      <button onclick="editNote(${i})">✏️</button>
      <button onclick="deleteNote(${i})">🗑️</button>`;
    notesList.appendChild(li);
  });
}

function editNote(i) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  document.getElementById("noteInput").value = users[user].notes[i];
  notesEditingIndex = i;
}

function deleteNote(i) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  users[user].notes.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadNotes();
}

/* ====================== TIMETABLE ====================== */
let timetableEditingIndex = null;

function addTimetable() {
  const user = getCurrentUser();
  if (!user) return;
  const course = document.getElementById("course").value;
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;
  const notifyBefore = document.getElementById("notifyBefore").value;

  let users = JSON.parse(localStorage.getItem("users"));
  if (timetableEditingIndex !== null) {
    users[user].timetable[timetableEditingIndex] = { course, day, time, notifyBefore };
    timetableEditingIndex = null;
  } else {
    users[user].timetable.push({ course, day, time, notifyBefore });
  }

  localStorage.setItem("users", JSON.stringify(users));
  loadTimetable();
}

function loadTimetable() {
  const user = getCurrentUser();
  if (!user) return;
  let users = JSON.parse(localStorage.getItem("users"));
  const timetable = users[user].timetable || [];
  const list = document.getElementById("timetableList");
  if (!list) return;

  list.innerHTML = "";
  timetable.forEach((item, i) => {
    let li = document.createElement("li");
    li.innerHTML = `${item.course} - ${item.day} at ${item.time}
      <button onclick="editTimetable(${i})">✏️</button>
      <button onclick="deleteTimetable(${i})">🗑️</button>`;
    list.appendChild(li);
  });
}

function editTimetable(i) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  let item = users[user].timetable[i];
  document.getElementById("course").value = item.course;
  document.getElementById("day").value = item.day;
  document.getElementById("time").value = item.time;
  document.getElementById("notifyBefore").value = item.notifyBefore;
  timetableEditingIndex = i;
}

function deleteTimetable(i) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  users[user].timetable.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadTimetable();
}

/* ====================== GPA ====================== */
function addCourse() {
  const user = getCurrentUser();
  if (!user) return;
  const name = document.getElementById("courseName").value;
  const grade = document.getElementById("courseGrade").value;
  const units = parseInt(document.getElementById("courseUnits").value);

  let users = JSON.parse(localStorage.getItem("users"));
  users[user].gpa.push({ name, grade, units });
  localStorage.setItem("users", JSON.stringify(users));
  loadGPA();
}

function loadGPA() {
  const user = getCurrentUser();
  if (!user) return;
  let users = JSON.parse(localStorage.getItem("users"));
  const gpaData = users[user].gpa || [];
  const list = document.getElementById("gpaList");
  const gpaDisplay = document.getElementById("gpaDisplay");
  if (!list) return;

  list.innerHTML = "";
  let totalPoints = 0, totalUnits = 0;
  gpaData.forEach((course, i) => {
    let gradePoints = { A: 5, B: 4, C: 3, D: 2, F: 0 }[course.grade] * course.units;
    totalPoints += gradePoints;
    totalUnits += course.units;

    let li = document.createElement("li");
    li.innerHTML = `${course.name} - ${course.grade} (${course.units} units)
      <button onclick="deleteCourse(${i})">🗑️</button>`;
    list.appendChild(li);
  });

  let gpa = totalUnits ? (totalPoints / totalUnits).toFixed(2) : "0.00";
  gpaDisplay.textContent = `Your GPA: ${gpa}`;
}

function deleteCourse(i) {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem("users"));
  users[user].gpa.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadGPA();
}

/* ====================== PROFILE ====================== */
function loadProfile() {
  const user = getCurrentUser();
  if (!user) return;
  let users = JSON.parse(localStorage.getItem("users"));
  const data = users[user];

  document.getElementById("profileUsername").textContent = user;
  document.getElementById("profilePic").src = data.pic;
  document.getElementById("bioText").textContent = data.bio || "No bio yet.";
}

/* ====================== HOMEPAGE ====================== */
function updateDashboard() {
  const user = getCurrentUser();
  if (!user) return;
  let users = JSON.parse(localStorage.getItem("users"));
  const data = users[user];

  const noteCount = data.notes.length;
  const classCount = data.timetable.length;
  const gpaCount = data.gpa.length;

  document.getElementById("notesStat").textContent = noteCount;
  document.getElementById("timetableStat").textContent = classCount;
  document.getElementById("gpaStat").textContent = gpaCount;
}

function updateNotifications() {
  const user = getCurrentUser();
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("users"));
  const data = users[user];
  const notificationsList = document.getElementById("homeNotifications");
  if (!notificationsList) return;

  notificationsList.innerHTML = "";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const now = new Date();

  const todayClasses = data.timetable.filter(c => c.day === today);
  todayClasses.forEach(cls => {
    if (!cls.time) return;
    const [h, m] = cls.time.split(":").map(Number);
    const classTime = new Date();
    classTime.setHours(h, m, 0);

    const diffMins = Math.floor((classTime - now) / 60000);
    if (diffMins > 0 && diffMins <= 60) {
      const msg = `⏰ ${cls.course} starts in ${diffMins} min`;
      const li = document.createElement("li");
      li.textContent = msg;
      notificationsList.appendChild(li);
    }
  });

  if (!notificationsList.hasChildNodes()) {
    notificationsList.innerHTML = "<li>No upcoming classes within the next hour.</li>";
  }
}

setInterval(updateNotifications, 60000);

/* ====================== INIT ====================== */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("notesList")) loadNotes();
  if (document.getElementById("timetableList")) loadTimetable();
  if (document.getElementById("gpaList")) loadGPA();
  if (document.getElementById("profileUsername")) loadProfile();
  if (document.getElementById("welcomeMsg")) {
    updateDashboard();
    updateNotifications();
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});






