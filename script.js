/* ---------- GLOBAL STYLES ---------- */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1e1e2f, #252547, #3b3b98, #7d5fff);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Background animation */
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Fade-in effect */
.fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-in forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- NAVBAR ---------- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.6);
  padding: 15px 25px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .brand {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffde59;
}

.navbar div {
  display: flex;
  gap: 15px;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.navbar a:hover, .navbar a.active {
  color: #ffde59;
}

/* ---------- CONTAINERS ---------- */
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  background: rgba(255,255,255,0.05);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.card {
  background: rgba(0,0,0,0.5);
}

/* ---------- INPUTS & BUTTONS ---------- */
input, select, textarea {
  width: 90%;
  padding: 12px;
  margin: 10px auto;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  display: block;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

button, .btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 8px;
  transition: 0.3s;
}

button:hover, .btn:hover {
  background: #ff6b81;
  transform: scale(1.05);
}

/* Delete buttons */
.delete-btn {
  background: #e63946;
}
.delete-btn:hover {
  background: #d62828;
}

/* ---------- TABLES (GPA & Timetable) ---------- */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
}
th, td {
  padding: 12px;
  text-align: center;
}
thead {
  background: rgba(0,0,0,0.7);
}
tbody tr {
  background: rgba(255,255,255,0.1);
  transition: 0.3s;
}
tbody tr:hover {
  background: rgba(255,255,255,0.2);
}

/* ---------- NOTES ---------- */
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body + Background */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1e1e2f, #2b2b4b, #1e1e2f);
  color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  animation: fadeIn 1s ease-in;
}

/* Fade-In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.navbar a {
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar a:hover {
  color: #ffd369;
}

.navbar .active {
  border-bottom: 2px solid #ffd369;
  padding-bottom: 3px;
}

/* Container */
.container {
  width: 90%;
  max-width: 900px;
  margin: 30px auto;
  background: rgba(255, 255, 255, 0.08);
  padding: 25px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Headings */
h1, h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffd369;
}

/* Notes Page */
textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  outline: none;
  resize: vertical;
  margin-bottom: 15px;
  background: #2f2f4f;
  color: #fff;
}

.note-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: transform 0.2s ease, background 0.3s ease;
}

#saveNoteBtn {
  background: #28a745;
  color: white;
}

#cancelNoteEditBtn {
  background: #dc3545;
  color: white;
  display: none;
}

button:hover {
  transform: scale(1.05);
}

/* Notes List */
ul {
  list-style: none;
  padding: 0;
}

li {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 15px;
  margin: 8px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(3px);
}

li span {
  flex: 1;
  margin-right: 10px;
}

li button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ffd369;
  font-weight: bold;
}

li button:hover {
  text-decoration: underline;
}

/* Footer */
footer {
  margin-top: auto;
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  color: #aaa;
}


/* ---------- PROFILE ---------- */
.profile-container {
  max-width: 500px;
  margin: 30px auto;
  text-align: center;
}
.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  display: block;
  margin: 20px auto;
}
#aboutInput {
  width: 100%;
  min-height: 120px;
}

/* ---------- HOMEPAGE ---------- */
.welcome-msg {
  font-size: 2rem;
  font-weight: bold;
  color: #ffde59;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
  margin-bottom: 20px;
}

/* Progress Bar */
.progress-container {
  margin: 20px auto;
  max-width: 500px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 20px;
  width: 0;
  background: #ffde59;
  transition: width 0.5s ease;
}

/* ---------- FOOTER ---------- */
footer {
  margin-top: auto;
  padding: 15px;
  text-align: center;
  background: rgba(0,0,0,0.6);
  border-radius: 12px;
  color: #fff;
  font-size: 0.9rem;
}
.dashboard-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255,255,255,0.1);
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: scale(1.05);
}

