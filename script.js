// ====================== AUTHENTICATION ======================
function signup(username, password) {
  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("Username already exists. Please choose another.");
    return;
  }

  users[username] = {
    password: password,
    notes: [],
    gpa: [],
    timetable: [],
    profilePic: "images/default-avatar.png"
  };

  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully! You can now log in.");
}

function login(username, password) {
  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username]) {
    alert("User not found. Please sign up first.");
    return;
  }

  if (users[username].password !== password) {
    alert("Incorrect password. Try again.");
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ====================== NAVBAR USERNAME ======================
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const navUser = document.getElementById("navUser");
  if (currentUser && navUser) {
    navUser.textContent = "👋 " + currentUser;
    navUser.style.marginLeft = "15px";
    navUser.style.fontWeight = "bold";
  }
});

// ====================== NOTES ======================
function displayNotes() {
  const notesList = document.getElementById("notesList");
  if (!notesList) return;

  const currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[currentUser]) return;

  notesList.innerHTML = "";

  users[currentUser].notes.forEach((note, index) => {
    const li = document.createElement("li");

    // Note text
    const span = document.createElement("span");
    span.textContent = note;
    span.style.flex = "1";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => {
      const newNote = prompt("Edit your note:", note);
      if (newNote !== null && newNote.trim() !== "") {
        users[currentUser].notes[index] = newNote.trim();
        localStorage.setItem("users", JSON.stringify(users));
        displayNotes();
      }
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.classList.add("delete-btn");
    delBtn.onclick = () => {
      users[currentUser].notes.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      displayNotes();
    };

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    notesList.appendChild(li);
  });
}

document.getElementById("addNoteBtn")?.addEventListener("click", () => {
  const noteInput = document.getElementById("noteInput");
  if (!noteInput) return;

  const noteText = noteInput.value.trim();
  if (!noteText) return;

  const currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[currentUser]) return;

  users[currentUser].notes.push(noteText);
  localStorage.setItem("users", JSON.stringify(users));

  noteInput.value = "";
  displayNotes();
});

// Call displayNotes safely
window.addEventListener("DOMContentLoaded", displayNotes);

// ====================== GPA ======================
// ====================== GPA CALCULATOR ======================

// Add new course row
function addCourse() {
  const tbody = document.querySelector("#courseTable tbody");
  if (!tbody) return;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Course Code" class="course-code"></td>
    <td>
      <select class="grade">
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
      </select>
    </td>
    <td><input type="number" class="unit" min="1" max="6" value="3"></td>
  `;
  tbody.appendChild(row);
}

// Calculate GPA
function calculateGPA() {
  const rows = document.querySelectorAll("#courseTable tbody tr");
  let totalPoints = 0;
  let totalUnits = 0;

  rows.forEach(row => {
    const grade = row.querySelector(".grade").value;
    const unit = parseInt(row.querySelector(".unit").value);

    let gradePoint = 0;
    switch (grade) {
      case "A": gradePoint = 5; break;
      case "B": gradePoint = 4; break;
      case "C": gradePoint = 3; break;
      case "D": gradePoint = 2; break;
      case "F": gradePoint = 0; break;
    }

    totalPoints += gradePoint * unit;
    totalUnits += unit;
  });

  const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0;
  document.getElementById("gpaResult").textContent = "Your GPA: " + gpa;
}

// Hook up buttons after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addCourseBtn");
  const calcBtn = document.getElementById("calcGpaBtn");

  if (addBtn) addBtn.addEventListener("click", addCourse);
  if (calcBtn) calcBtn.addEventListener("click", calculateGPA);
});

// ====================== TIMETABLE ======================
// ====================== TIMETABLE ======================
document.addEventListener("DOMContentLoaded", () => {
  const addClassBtn = document.getElementById("addClassBtn");
  const classCourse = document.getElementById("classCourse");
  const classTime = document.getElementById("classTime");
  const classDay = document.getElementById("classDay");
  const timetableList = document.getElementById("timetableList");

  function displayTimetable() {
    const currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[currentUser]?.timetable) users[currentUser].timetable = [];

    timetableList.innerHTML = "";

    users[currentUser].timetable.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${entry.day} - ${entry.course} at ${entry.time}`;

      // Delete button for each class
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => {
        users[currentUser].timetable.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        displayTimetable();
      };

      li.appendChild(delBtn);
      timetableList.appendChild(li);
    });
  }

  // Add class
  addClassBtn?.addEventListener("click", () => {
    const course = classCourse.value.trim();
    const time = classTime.value;
    const day = classDay.value;

    if (!course || !time || !day) {
      alert("Please enter all fields.");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[currentUser]) users[currentUser] = {};
    if (!users[currentUser].timetable) users[currentUser].timetable = [];

    users[currentUser].timetable.push({ day, course, time });
    localStorage.setItem("users", JSON.stringify(users));

    // Reset inputs
    classCourse.value = "";
    classTime.value = "";
    classDay.value = "";

    displayTimetable();
  });

  // Display on page load
  displayTimetable();
});


// ====================== PROFILE ======================
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;
  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (document.getElementById("profileName")) {
    document.getElementById("profileName").textContent = "Welcome, " + currentUser;
  }

  if (document.getElementById("profilePic")) {
    document.getElementById("profilePic").src =
      users[currentUser]?.profilePic || "images/default-avatar.png";
  }
});
// Open file picker when clicking the button
document.getElementById("uploadBtn")?.addEventListener("click", () => {
  document.getElementById("uploadPic").click();
});

// Handle file selection
document.getElementById("uploadPic")?.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const imgData = event.target.result;
    document.getElementById("profilePic").src = imgData;

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      let users = JSON.parse(localStorage.getItem("users")) || {};
      users[currentUser].profilePic = imgData;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };
  reader.readAsDataURL(file);
});

// Reset to default picture
document.getElementById("resetPicBtn")?.addEventListener("click", function() {
  const defaultPic = "images/default-avatar.png";
  document.getElementById("profilePic").src = defaultPic;

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    users[currentUser].profilePic = defaultPic;
    localStorage.setItem("users", JSON.stringify(users));
  }
});


