// Define your deployed backend URL here
const BACKEND_URL = 'https://smart-campus-connect-backend.onrender.com'; // <--- YOUR DEPLOYED BACKEND URL

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".register-form");

  // Register form submission
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return; // Stop the function if passwords don't match
    }

    try {
      // Use the BACKEND_URL constant for your fetch request
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, { // <--- UPDATED TO USE BACKEND_URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! You can now log in.");
        window.location.href = "index.html"; // Redirect to login page after successful registration
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  });
});
