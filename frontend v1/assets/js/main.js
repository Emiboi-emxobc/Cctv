// assets/js/main.js
import { showPage, renderStudentsList, showLoader, hideLoader } from "./ui.js";
import { Store } from "./store.js";
import * as Auth from "./auth.js";
import * as API from "./api.js";
import { fetchStudents } from "./api.js";
import { initRouter } from "./router.js";

initRouter(); // handles [data-role=nav]
document.addEventListener("DOMContentLoaded", boot);

// ---------------- BOOT ----------------
async function boot() {
  console.log("🚀 Booting Nexa Admin Panel...");
  Store.loadTokenFromStorage();

  setupSignupForm();
  setupLoginForm();
  setupVerifyForm();
  setupRequestAuth();

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Store.clearAll();
      showPage("welcome");
      console.log("👋 Logged out, returning to welcome page.");
    });
  }

  // Auto-login if token exists
  if (Store.token) {
    console.log("🔑 Token found. Attempting auto-login...");
    try {
      const profile = await API.fetchProfile(Store.token);
      if (profile && profile.success) {
        console.log("✅ Auto-login success. Loading dashboard data...");
        Store.setAdmin(profile.profile);
        await loadDashboardData();
        window.location.href= "admin-panel.html";
        return;
      } else {
        console.warn("⚠️ Invalid token. Clearing store.");
        Store.clearAll();
      }
    } catch (e) {
      console.error("💥 Auto-login failed:", e);
      Store.clearAll();
    }
  }

  // Fallback redirect if token exists in localStorage
  const token = localStorage.getItem("nexa_token");
  if (token) {
    console.log("🔁 Redirecting to admin panel (token found in localStorage).");
    window.location.href = "admin-panel.html";
  }
}

// ---------------- SIGNUP ----------------
// ---------------- SIGNUP ----------------
function setupSignupForm() {
  const form = document.getElementById("n-sign-up");
  const out = document.getElementById("signup-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Creating account…");

    const body = {
      firstname: form.firstname?.value.trim(),
      lastname: form.lastname?.value.trim(),
      phone: form.phone?.value.trim(),
      apikey: form.apikey?.value.trim(),
      password: form.password?.value,
    };

    try {
      console.log("🚀 Submitting signup form:", body);
      const res = await Auth.doRegister(body);
      console.log("📝 Registration result:", res);

      if (res.success) {
        setLoading(out, false, "✅ Account created! Check WhatsApp for verification.");
       // showPage("verify");
        return;
      }

      // --- extract actual error message ---
      console.error("Signup failed details:", res);
      let msg = "";
      if (typeof res.error === "string") msg = res.error;
      else if (res.error?.message) msg = res.error.message;
      else if (res.error?.error) msg = res.error.error;
      else msg = JSON.stringify(res.error || res, null, 2);

      throw new Error(msg || "Unknown server error");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}
// ---------------- LOGIN ----------------
function setupLoginForm() {
  const form = document.getElementById("n-sign-in");
  const out = document.getElementById("signin-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Logging in…");

    const body = {
      phone: form.querySelector("#phone").value.trim(),
      password: form.querySelector("#password").value,
    };

    try {
      const res = await Auth.doLogin(body);
      console.log("🔐 Login result:", res);
      if (res.success) {
        setLoading(out, false, "✅ Login successful! Redirecting…");
        Store.setToken(res.token);
        await loadDashboardData();
        setTimeout(() => {
          window.location.href = "admin-panel.html";
        }, 800);
      } else {
        throw new Error(res.error?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}

// ---------------- VERIFY ----------------
function setupVerifyForm() {
  const form = document.getElementById("verify-form");
  const out = document.getElementById("verify-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Verifying…");

    try {
      const res = await Auth.confirmAccount();
      console.log("🧾 Verification result:", res);
      if (res.success) {
        setLoading(out, false, "✅ Verified! Redirecting…");
        Store.setToken(res.token);
        await loadDashboardData();
        setTimeout(() => {
          window.location.href = "admin-panel.html";
        }, 800);
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}

// ---------------- DASHBOARD ----------------
async function loadDashboardData(force = false) {
  console.log("📡 Fetching students...");
  if (Store.students.length && !force) return;
  if (!Store.token) {
    console.warn("⚠️ No token available, skipping fetch.");
    return;
  }

  const container = document.querySelector(".student-list");
  if (container) {
    container.innerHTML = `<p class="muted small">⏳ Loading student data…</p>`;
  }

  showLoader("Fetching students…");

  try {
    const res = await fetchStudents(Store.token);
    console.log("🎯 Fetch result:", res);

    hideLoader();

    if (res.success && Array.isArray(res.students)) {
      Store.setStudents(res.students);
      renderStudentsList(res.students);
      updateDashboardStats(res.students);
      console.log(`✅ Loaded ${res.students.length} students.`);
    } else {
      console.warn("⚠️ Failed to fetch students or invalid response.");
      if (container) {
        container.innerHTML = `<p class="muted small">No registered students found.</p>`;
      }
    }
  } catch (err) {
    hideLoader();
    console.error("💥 Dashboard fetch failed:", err);
    if (container) {
      container.innerHTML = `<p class="muted small">❌ Failed to load students. Check your network or token.</p>`;
    }
  }
}

// ---------------- UPDATE STATS ----------------
function updateDashboardStats(students) {
  const visitors = students.length;
  const voters = students.filter((s) => s.hasVoted).length;
  const statEls = document.querySelectorAll(".stats .details");
  if (statEls[0]) statEls[0].textContent = visitors;
  if (statEls[1]) statEls[1].textContent = voters;
  console.log(`📊 Stats updated: ${visitors} total, ${voters} voted.`);
}

// ---------------- REQUEST AUTH ----------------
function setupRequestAuth() {
  const btn = document.querySelector("[data-role=request]");
  const codeField = document.querySelector("input[name=req-data]");
  if (!btn || !codeField) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting…';
    await new Promise((r) => setTimeout(r, 1000));
    codeField.value = Math.random().toString(36).substring(2, 8).toUpperCase();
    btn.innerHTML = '<i class="fa-solid fa-user-check"></i> Request auth';
    btn.disabled = false;
  });
}

// ---------------- HELPERS ----------------
function setLoading(out, state, text) {
  if (!out) return;
  out.textContent = text;
  out.style.color = state ? "#777" : "#000";
}