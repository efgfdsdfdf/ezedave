// ====== BLACK AI ASSISTANT ======
if (window.location.pathname.endsWith("ai.html")) {
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  function appendMessage(sender, message) {
    const p = document.createElement("p");
    p.className = sender;
    p.textContent = message;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function getAIResponse(userMessage) {
    // Simple placeholder logic; can be replaced with AI API
    const msg = userMessage.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) return "Hello! How can I assist you today?";
    if (msg.includes("gpa")) return "You can calculate your GPA in the GPA section.";
    if (msg.includes("timetable")) return "Check your timetable in the Timetable section.";
    return "I'm Black AI! I can help you navigate your dashboard, GPA, timetable, and notes.";
  }

  sendBtn.addEventListener("click", () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    appendMessage("user-msg", "You: " + userMessage);
    chatInput.value = "";
    setTimeout(() => {
      const aiMessage = getAIResponse(userMessage);
      appendMessage("ai-msg", "Black: " + aiMessage);
    }, 500);
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
}
