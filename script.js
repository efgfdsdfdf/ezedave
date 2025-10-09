// ================= AUTH =================
function getCurrentUser() {
  return localStorage.getItem("currentUser") || null;
}

// Signup
function signup(username, password) {
  if (!username || !password) return alert("Please fill all fields!");

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) return alert("User already exists!");

  users[username] = { password, notes: [], timetable: [], gpa: [], profile: {} };
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created! Please login.");
  window.location.href = "index.html";
}

// Login
function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    window.location.href = "homepage.html";
  } else {
    alert("Invalid username or password.");
  }
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ================= NOTES =================
const NotesModule = (() => {
  let editingIndex = -1;

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function els() {
    return {
      noteInput: document.getElementById("noteInput"),
      saveBtn: document.getElementById("saveNoteBtn") || document.getElementById("addNoteBtn"),
      cancelBtn: document.getElementById("cancelNoteEditBtn"),
      notesList: document.getElementById("notesList"),
      noteForm: document.getElementById("noteForm")
    };
  }

  function renderNotes() {
    const { notesList } = els();
    if (!notesList) return;
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

  function startEdit(index) {
    const { noteInput, saveBtn, cancelBtn } = els();
    const user = getCurrentUser();
    if (!user) return alert("Please login to edit notes.");

    const users = getUsers();
    const notes = users[user]?.notes || [];
    if (!notes[index]) return;

    noteInput.value = notes[index];
    editingIndex = index;

    saveBtn.textContent = "🔁 Update Note";
    cancelBtn.style.display = "inline-block";
    noteInput.focus();
    noteInput.selectionStart = noteInput.selectionEnd = noteInput.value.length;
  }

  function cancelEdit() {
    const { noteInput, saveBtn, cancelBtn } = els();
    editingIndex = -1;
    noteInput.value = "";
    saveBtn.textContent = "💾 Save Note";
    cancelBtn.style.display = "none";
  }

  function handleSave(e) {
    e?.preventDefault();
    const { noteInput, saveBtn, cancelBtn } = els();
    if (!noteInput.value.trim()) return alert("Please type a note before saving.");

    const user = getCurrentUser();
    if (!user) return alert("Please login to save notes.");

    const users = getUsers();
    if (!users[user].notes) users[user].notes = [];

    if (editingIndex === -1) {
      users[user].notes.push(noteInput.value.trim());
    } else {
      users[user].notes[editingIndex] = noteInput.value.trim();
      editingIndex = -1;
      saveBtn.textContent = "💾 Save Note";
    }

    saveUsers(users);
    noteInput.value = "";
    cancelBtn.style.display = "none";
    renderNotes();
  }

  function deleteNote(index) {
    const user = getCurrentUser();
    const users = getUsers();
    users[user].notes.splice(index, 1);
    saveUsers(users);
    if (editingIndex === index) cancelEdit();
    renderNotes();
  }

  function init() {
    const { noteInput, saveBtn, cancelBtn, noteForm } = els();
    if (noteForm) noteForm.addEventListener("submit", handleSave);
    else if (saveBtn) {
      saveBtn.type = "button";
      saveBtn.addEventListener("click", handleSave);
    }

    if (cancelBtn) {
      cancelBtn.type = "button";
      cancelBtn.addEventListener("click", cancelEdit);
      cancelBtn.style.display = "none";
    }

    if (noteInput) {
      noteInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
      });
    }

    renderNotes();
  }

  document.addEventListener("DOMContentLoaded", init);
  return { renderNotes, startEdit, deleteNote, handleSave, cancelEdit };
})();

// ================= TIMETABLE =================
const TimetableModule = (() => {
  let editingIndex = null;

  function addClass(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const course = document.getElementById("classCourse").value.trim();
    const day = document.getElementById("classDay").value;
    const time = document.getElementById("classTime").value;
    const notifyBefore = parseInt(document.getElementById("notifyBefore").value || "0");

    if (!course || !day || !time) return alert("Please fill in all fields.");

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[user].timetable) users[user].timetable = [];

    if (editingIndex === null) users[user].timetable.push({ course, day, time, notifyBefore });
    else {
      users[user].timetable[editingIndex] = { course, day, time, notifyBefore };
      editingIndex = null;
      document.getElementById("addClassBtn").textContent = "➕ Add Class";
      document.getElementById("cancelEditBtn").style.display = "none";
    }

    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("timetableForm").reset();
    loadTimetable();
  }

  function loadTimetable() {
    const user = getCurrentUser();
    if (!user) return;
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const timetable = users[user].timetable || [];
    const list = document.getElementById("timetableList");
    if (!list) return;
    list.innerHTML = "";

    timetable.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${item.course}</b> - ${item.day}, ${item.time} (⏰ ${item.notifyBefore} min before)`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editClass(index);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteClass(index);

      li.appendChild(editBtn);
      li.appendChild(delBtn);
      list.appendChild(li);

      scheduleNotification(item.course, item.day, item.time, item.notifyBefore);
    });
  }

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

  function deleteClass(index) {
    const user = getCurrentUser();
    let users = JSON.parse(localStorage.getItem("users"));
    users[user].timetable.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadTimetable();
  }

  function scheduleNotification(course, day, time, notifyBefore) {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") return;

      const [hours, minutes] = time.split(":").map(Number);
      const classDate = new Date();
      const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      let diff = daysOfWeek.indexOf(day) - classDate.getDay();
      if (diff < 0) diff += 7;

      classDate.setDate(classDate.getDate() + diff);
      classDate.setHours(hours, minutes, 0, 0);

      const delay = classDate.getTime() - notifyBefore * 60000 - Date.now();
      if (delay > 0) setTimeout(() => {
        new Notification("Class Reminder", { body: `${course} starts at ${time} on ${day}`, icon: "default-profile.png" });
      }, delay);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("timetableForm");
    if (form) form.addEventListener("submit", addClass);

    const cancelBtn = document.getElementById("cancelEditBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => {
      editingIndex = null;
      document.getElementById("timetableForm").reset();
      document.getElementById("addClassBtn").textContent = "➕ Add Class";
      cancelBtn.style.display = "none";
    });

    loadTimetable();
  });

  return { loadTimetable, addClass, editClass, deleteClass };
})();









