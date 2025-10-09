const themeToggleBtn = document.getElementById("theme-toggle");

// Load theme from localStorage
function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.className = theme + "-theme";
  if (themeToggleBtn) themeToggleBtn.textContent = theme === "light" ? "🌙" : "☀️";
}

// Toggle theme
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.body.className = newTheme + "-theme";
    localStorage.setItem("theme", newTheme);
    themeToggleBtn.textContent = newTheme === "light" ? "🌙" : "☀️";
  });
}

loadTheme();
