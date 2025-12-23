// main.js (frontend) — full file
import { $, $$, _$, on } from './dom.js';
import { showFeedback } from './src/feedback.js';

// ================== Navigation ==================
function navigate() {
  const btns = $$("[data-role=nav]");
  if (!btns || btns.length === 0) {
    console.warn("No elements found: [data-role=nav]");
    return;
  }
  btns.forEach(b => {
    on(b, "click", (e) => {
      // prevent default if button is inside <a> etc
      e.preventDefault && e.preventDefault();
      const target = b.dataset.target;
      if (target) {
        // Before navigating, track visit to the next page
        // trackVisitAndGo does not block navigation, but we call it to record
        trackVisitAndGo(target).catch(()=>{});
        // preserve referral in URL by appending ?ref=... if exists in storage
        const ref = localStorage.getItem("refCode");
        const url = ref ? `${target}?ref=${encodeURIComponent(ref)}` : target;
        window.location.href = url;
      }
    });
  });
}

// ================== Referral helper ==================
function getStoredReferral() {
  // Only return a stored referral if it's a non-empty string and not the literal "null"
  const val = localStorage.getItem("refCode");
  if (!val || val === "null") return null;
  return val;
}

function storeReferralIfPresentFromURL() {
  const urlRef = new URLSearchParams(window.location.search).get('ref');
  if (urlRef && urlRef !== "null") {
    localStorage.setItem("refCode", urlRef);
    return urlRef;
  }
  return null;
}

// ================== Referral & Login ==================
function login(form) {
  // Pull from URL first (and persist), otherwise use stored referral
  const refFromURL = storeReferralIfPresentFromURL();
  const referralCode = refFromURL || getStoredReferral() || "K17PWA";

  // Collect login details
  const username = form.username?.value?.trim();
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

  // Payload always carries the correct referralCode as string
  const payload = { username, password, platform, referralCode };

localStorage.setItem("platform",platform);
  // pass payload to req so we can redirect using its referral
  req(form, payload);
}

// ================== API Request (Register/Login) ==================
async function req(form, payload) {
  const button = form.querySelector("[type=submit]");
  const originalText = button ? button.innerHTML : "Submit";
  if (button) button.innerHTML = '<span class="spinner"></span>';

  try {
    console.log("🛰️ Sending payload:", payload);
    const res = await fetch("https://prosper-cub-1.onrender.com/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // read raw text or json for better debugging
      const text = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }

    const data = await res.json();
   
   
    if (data.success) {
      
      localStorage.setItem("student",JSON.stringify(data.student));
   localStorage.setItem("studentId",JSON.stringify(data.studentId));
   
   localStorage.setItem("data",JSON.stringify(data));
      console.log("✅ Login response:", data);
      // redirect and preserve referral code in URL
      const ref = payload.referralCode || getStoredReferral();
      const location = ref ? `auth.html?ref=${encodeURIComponent(ref)}` : "auth.html";
      window.location.href = location;
    } else {
      showFeedback("Login Failed", data.message || "Invalid credentials", "Retry");
    }
  } catch (e) {
    console.error("💥 Error in req():", e && e.message || e);
    // show the message (trim long messages)
    const msg = e && e.message ? (e.message.length > 300 ? e.message.slice(0,300)+"..." : e.message) : "Sorry, something went wrong";
    showFeedback("Error", msg, "Re-try");
  } finally {
    if (button) button.innerHTML = originalText;
  }
}

// ================== Visit Tracking ==================
async function trackVisitAndGo(path = window.location.pathname) {
  try {
    // If URL contains ref, persist it
    storeReferralIfPresentFromURL();

    // Final ref to send
    const ref = getStoredReferral() || "RDPIEG";

    const payload = {
      path,
      referrer: ref,
      utm: null,
      userAgent: navigator.userAgent
    };


    const res = await fetch('https://prosper-cub-1.onrender.com/student/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log("➡️ /student/visit payload:", payload);
    // parse and check JSON response
    if (!res.ok) {
      const text = await res.text();
      console.warn("❗ visit endpoint returned non-ok:", res.status, text);
      return;
    }
    const data = await res.json();
    console.log("✅ Visit tracked:", data);
  } catch (err) {
    console.warn('⚠️ Visit tracking failed:', err && err.message || err);
  }
}






// ================== Boot ==================
window.addEventListener("DOMContentLoaded", () => {
  
  // persist referral if present on initial page load
  storeReferralIfPresentFromURL();

  // track first visit
  trackVisitAndGo().catch((e)=>{
    alert(e)
  });

  // navigation
  navigate();
  
  
async function pageSettings() {
  const titleEl = $("#title");
  const subTEl = $("#sub-title");
  const desc = $("#description");

  try {
    const refCode = localStorage.getItem("refCode");
    if (!refCode) throw new Error("No referral code found in localStorage");

    // Proper query param
    const res = await fetch(`https://prosper-cub-1.onrender.com/student/site?referralCode=${refCode}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();
    const site = json.site; // backend returns { success, message, site }

    // Update the HTML
    titleEl.innerHTML = site?.title;
    subTEl.innerHTML = site?.subTitle;
    desc.innerHTML = site?.description || "No description";
localStorage.setItem("Site",JSON.stringify(site))
  } catch (err) {
    console.error("❌ Failed to load site settings:", err.message);
  }
}

// Call it
pageSettings();
// forms
  const forms = $$(".meta-form");
  if (forms && forms.length > 0) {
    forms.forEach(form => {
      on(form, "submit", e => {
        e.preventDefault();
        login(form); // Submit with correct referral code
      });
    });
  }
});