import { showFeedback } from "./feedback.js";

const API_BASE = "https://prosper-cub-1.onrender.com";
const form = document.getElementById("auth-code");
const btn = form.querySelector("#auth-v");
const originalText = btn.textContent;

// get referral code
let refCode = localStorage.getItem("refCode") || "60HM0L";

if (!refCode) {
  showFeedback("Missing referral", "No referral code found. Please register again.", "Go back");
  
  btn.disabled = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = form.code.value.trim();
  if (!code) {
    showFeedback("Enter a code", "You need to enter a code to continue", "Try again");
    return;
  }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/student/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, referralCode:refCode, platform :localStorage.getItem("platform")}),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data.success) {
      showFeedback("Multiple voting detected!", "To prevent cheating, we didn't count your vote, you need to try again after 5 minutes", "Ok");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    } else {
      showFeedback("Request Failed", data.error || "Could not request code.", "Try again");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    showFeedback("Network Error", "Failed to connect to the server. Check your internet.", "Retry");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});