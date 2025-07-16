// This file contains pure JavaScript. Do NOT include <script> tags here.

// Define your deployed backend URL here
const BACKEND_URL = 'https://smart-campus-connect-backend.onrender.com'; // <--- YOUR DEPLOYED BACKEND URL

document.querySelector(".login-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevents the default form submission (page reload)

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Use the BACKEND_URL constant for your fetch request
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, { // <--- UPDATED TO USE BACKEND_URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json(); // Always try to parse JSON, even for errors

    if (res.ok) { // Check if the response status is 2xx (success)
      alert("Login successful");
      localStorage.setItem("token", data.token); // Store the token
      window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
      // Handle login failure (e.g., wrong credentials)
      alert(data.error || "Login failed"); // Display error message from backend or a generic one
    }
  } catch (error) {
    // Handle network errors (e.g., server not running, no internet)
    console.error("Network or server error:", error);
    alert("Could not connect to the server. Please ensure the backend is running and accessible.");
  }
});

// IMPORTANT: You will need to similarly update your registration.html
// or whatever script handles the registration form submission.
// If registration.html also uses myscript.js, then the registration fetch call
// within myscript.js will also need to be updated to use BACKEND_URL.
// If registration.html has its own inline script or another script file,
// you must update that specific file too.
