// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received: ", payload);

  const title = (payload.notification && payload.notification.title) || "Student Companion 📘";
  const body = (payload.notification && payload.notification.body) || "You have a new notification!";
  const icon = (payload.notification && payload.notification.icon) || "/icon.png";

  self.registration.showNotification(title, { body, icon });

  // ✅ Save notification to IndexedDB/localStorage-like system
  self.registration.getNotifications().then(() => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: "NEW_NOTIFICATION",
          message: `${title} - ${body}`
        });
      });
    });
  });
});
