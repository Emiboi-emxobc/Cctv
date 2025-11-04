import { showPage, renderStudentsList, showLoader, hideLoader } from "./ui.js";
import { Store } from "./store.js";
import {setupLoginForm,setupSignupForm, setupVerifyForm } from './form.js';
import * as Auth from "./auth.js";
import * as API from "./api.js";
import { fetchStudents } from "./api.js";

// ---------------- ROUTER ----------------
function initRouter() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-role='nav']");
    if (!btn) return;

    const targetId = btn.getAttribute("data-target");
    if (!targetId) return;

    const pages = document.querySelectorAll(".page");
    pages.forEach((p) => p.classList.remove("active"));

    const targetPage = document.getElementById(targetId);
    if (targetPage) targetPage.classList.add("active");

    const allNavBtns = document.querySelectorAll("[data-role='nav']");
    allNavBtns.forEach((b) => b.classList.remove("active"));
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

  // --- AUTO LOGIN ---
  if (Store.token) {
    console.log("🔑 Token found. Attempting auto-login...");
    try {
      showLoader("Verifying admin...");
      const profile = await API.fetchProfile(Store.token);
      hideLoader();

      if (profile && profile.success) {
        console.log("✅ Auto-login success.");
        Store.setAdmin(profile.profile);

        // redirect to dashboard only if not already there
        if (!window.location.href.includes("admin-panel.html")) {
          window.location.href = "admin-panel.html";
        } else {
          await loadDashboardData();
        }

        return;
      } else {
        console.warn("⚠️ Invalid token. Clearing store.");
        
      }
    } catch (e) {
      hideLoader();
      console.error("💥 Auto-login failed:", e);
      Store.clearAll();
    }
  } else {
    console.log("ℹ️ No saved token found. Stay on welcome/login.");
  }
}

// ---------------- SIGNUP ----------------



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


function setUpAdmin(param) {
  const admin = Store.admin;
   const name = document.querySelector(".admin-username");
   if (name) {
     name.textContent = admin?.name||admin?.firstname + " " + admin?.lastname;
   }
   const bio = 
   document.querySelector(".admin-bio");
   if (bio) {
     bio.textContent = admin?.bio || admin?.username;
   }
   const refLink = 
   document.getElementById("ref-link");
   if (refLink) {
     refLink.value = `https://cctv-ujg4.vercel.app?ref=${admin?.referralCode}`;
   }
   
   const votes = 
   document.querySelector(".vote-details");
   if (vote) {
     vote.textContent = admin?.votes;
   }
   alert(admin)
   
}
setUpAdmin();


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

