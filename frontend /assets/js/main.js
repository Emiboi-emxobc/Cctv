// /frontend/assets/js/main.js

import { showPage, renderStudentsList, showLoader, hideLoader } from "./ui.js";
import { Store } from "./store.js";
import { setupLoginForm, setupSignupForm, setupVerifyForm } from "./form.js";
import * as API from "./api.js";

// ---------------- ROUTER ----------------
function initRouter() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-role='nav']");
    if (!btn) return;

    const targetId = btn.getAttribute("data-target");
    if (!targetId) return;

    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.getElementById(targetId)?.classList.add("active");

    document.querySelectorAll("[data-role='nav']").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    console.log(`🧭 Navigated to ${targetId}`);
  });
}

// ---------------- BOOT ----------------
document.addEventListener("DOMContentLoaded", boot);

async function boot() {
  console.log("🚀 Booting Nexa Admin Panel...");

  Store.loadTokenFromStorage();
  initRouter();
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

  // -------- AUTO LOGIN CHECK --------
  if (!Store.token) {
    console.log("ℹ️ No token found. Redirecting to login.");
    showPage("welcome");
    return;
  }

  console.log("🔑 Token found. Verifying admin profile...");

  try {
    showLoader("Verifying admin...");
    const profile = await API.fetchProfile(Store.token);
    hideLoader();

    if (profile) {
      console.log("✅ Auto-login success.");
      Store.setAdmin(profile);
      setUpAdmin();

      // redirect to dashboard if not already there
      if (!window.location.href.includes("admin-panel.html")) {
        window.location.href = "admin-panel.html";
      } else {
        await loadDashboardData();
      }
    } else {
      console.warn("⚠️ Invalid token. Clearing store. ",Store.token);
      console.log(profile)
      
      showPage("welcome");
    }
  } catch (err) {
    hideLoader();
    console.error("💥 Auto-login failed:", err);
    Store.clearAll();
    showPage("welcome");
  }
}

// ---------------- DASHBOARD ----------------
async function loadDashboardData(force = false) {
  console.log("📡 Fetching students...");

  if (!Store.token) {
    console.warn("⚠️ No token available, skipping fetch.");
    return;
  }

  if (Store.students.length && !force) return;

  const container = document.querySelector(".student-list");
  if (container) {
    container.innerHTML = `<p class="muted small">⏳ Loading student data…</p>`;
  }

  showLoader("Fetching students…");

  try {
    const res = await API.fetchStudents(Store.token);
    hideLoader();

    if (res.success && Array.isArray(res.students)) {
      Store.setStudents(res.students);
      renderStudentsList(res.students);
      updateDashboardStats(res.students);
      console.log(`✅ Loaded ${res.students.length} students.`);
    } else {
      console.warn("⚠️ Failed to fetch students or invalid response.");
      if (container) container.innerHTML = `<p class="muted small">No registered students found.</p>`;
    }
  } catch (err) {
    hideLoader();
    console.error("💥 Dashboard fetch failed:", err);
    if (container)
      container.innerHTML = `<p class="muted small">❌ Failed to load students. Check your network or token.</p>`;
  }
}

// ---------------- ADMIN SETUP ----------------
function setUpAdmin() {
  const admin = Store.admin;
  if (!admin) return console.warn("⚠️ No admin data available yet.");

  const nameEl = document.querySelector(".admin-username");
  if (nameEl) nameEl.textContent = admin.firstname ? `${admin.firstname} ${admin.lastname}` : admin.username;

  const bioEl = document.querySelector(".admin-bio");
  if (bioEl) bioEl.textContent = admin.bio || admin.username || "Admin";

  const refEl = document.getElementById("ref-link");
  if (refEl) refEl.value = `https://cctv-ujg4.vercel.app?ref=${admin.referralCode || "N/A"}`;

  const voteEl = document.querySelector(".vote-details");
  if (voteEl) voteEl.textContent = admin.votes ?? 0;

  console.log("👤 Admin loaded:", admin);
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