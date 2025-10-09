<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile | Student Companion</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="light-theme">
  <header class="topbar">
    <div class="brand">Student Companion — Team Black 🖤</div>
    <nav class="topbar-actions">
      <button id="theme-toggle">🌙</button>
      <span id="user-greeting"></span>
      <a href="home.html" class="btn">Home</a>
      <a href="notes.html" class="btn">Notes</a>
      <a href="timetable.html" class="btn">Timetable</a>
      <a href="gpa.html" class="btn">GPA</a>
      <a href="ai.html" class="btn">Black AI</a>
      <a href="profile.html" class="btn">Profile</a>
      <button id="logout-btn" class="btn">Logout</button>
    </nav>
  </header>

  <main class="container">
    <h1>Profile</h1>
    <p>Username: <span id="profile-username"></span></p>
    <p>Email: <span id="profile-email">example@example.com</span></p>
    <p>Profile picture placeholder:</p>
    <div class="profile-pic">🖼️</div>
  </main>

  <script src="js/theme.js"></script>
  <script src="js/auth.js"></script>
</body>
</html>
