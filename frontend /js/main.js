import { modal } from "./modal.js";

// ======================= Nexa Main.js =======================

// 🧩 Utility: Feedback messages
function createElement({ tag = "div", className = "", id = "" }, callback) {
  const el = document.createElement(tag);
  el.className = className;
  if (id) el.id = id;
  if (callback) callback(el);
  return el;
}

export function feedbackFactory(theme = {}) {
  const colors = {
    success: theme.success || "bg-[#333] bg-dark text-white",
    danger: theme.danger || "bg-[#D0313D] text-white",
    warning: theme.warning || "bg-[#EA9534] text-white",
    info: theme.info || "bg-[#DF7737] text-white",
    normal: "bg-[#111]",
  };

  return (type = "info", message = "Notification", time = 2000) => {
    const container = createElement(
      {
        tag: "div",
        className: `${colors[type]} p-3 rounded-md fixed top-1/2 right-5 shadow-md animate-bounce z-50 feedback`,
      },
      (el) => {
        el.innerText = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), time);
      }
    );
    return container;
  };
}


// ======================= Loader =======================
function toggleLoader(show = true) {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
  }
  loader.classList.toggle("hidden", !show);
}

// ======================= Logger =======================
async function log(messages) {
  let consoleBox = document.querySelector(".terminal");
  if (!consoleBox) {
    consoleBox = document.createElement("div");
    consoleBox.classList.add("terminal");
    document.querySelector(".base")?.appendChild(consoleBox);
  }

  for (const msg of messages) {
    const line = document.createElement("p");
    line.textContent = `> ${msg}`;
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
    await new Promise((res) => setTimeout(res, 600));
  }
}

// ======================= Password Toggle =======================
function setupPasswordToggle() {
  const toggleEyes = document.querySelectorAll(".eye");

  toggleEyes.forEach((eye) => {
    eye.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".password");
      inputs.forEach((input) => {
        if (input.type === "password") {
          input.type = "text";
          eye.classList.remove("fa-eye-slash");
          eye.classList.add("fa-eye");
        } else {
          input.type = "password";
          eye.classList.remove("fa-eye");
          eye.classList.add("fa-eye-slash");
        }
      });
    });
  });
}

// ======================= BASE API =======================
const BASE_URL = "https://nexa-mini.onrender.com/api";
const API_ADMIN = `${BASE_URL}/admin`;
const API_REFERRAL = `${BASE_URL}/referral`;
const API_STUDENT = `${BASE_URL}/student`;
const API_VISIT = `${BASE_URL}/visit/log`;

// ======================= Auth Request =======================
async function sendAuthRequest(endpoint, data) {
  try {
    const res = await axios.post(`${API_ADMIN}/${endpoint}`, data);
    return res.data;
  } catch (err) {
    console.error("Auth Error:", err.response?.data || err.message);
    throw err;
  }
}

// ======================= Form Handler =======================
function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return console.warn(`⚠️ Form with ID '${formId}' not found.`);

  const showFeedback = feedbackFactory();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let data;
    if (formId === "n-sign-up") {
      data = {
        firstname: form.firstname.value.trim(),
        lastname: form.lastname.value.trim(),
        apikey: form.apikey.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value.trim(),
      };
    } else {
      data = {
        phone: form.phone.value.trim(),
        password: form.password.value.trim(),
      };
    }

    try {
      toggleLoader(true);
      await log([
        "Creating secure connection...",
        "Encrypting session...",
        "Verifying credentials...",
        "Fetching user data...",
        "Building dashboard...",
        "Almost there...",
      ]);

      const result = await sendAuthRequest(endpoint, data);

      await log(["✅ Access granted", "Redirecting..."]);
      showFeedback("success", `Welcome, ${data.firstname || "Admin"}!`);

      // Save token + user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user || data));

      window.location.href = redirectTo;
    } catch (err) {
      console.error("❌ Auth error:", err);
      showFeedback("danger", err.response?.data?.message || "Connection failed! " + err.message);
      log(["Error: Unable to connect"]);
    } finally {
      toggleLoader(false);
    }
  });
}

// ======================= Page Switch =======================
function setupPageSwitch() {
  const viewButtons = document.querySelectorAll(".view-page");
  const pages = document.querySelectorAll(".page");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.value || btn.dataset.target;
      pages.forEach((p) => p.classList.remove("active"));
      const nextPage = document.getElementById(target);
      if (nextPage) nextPage.classList.add("active");
    });
  });
}

// ======================= Copy Text =======================
async function copyText(text) {
  const showFeedback = feedbackFactory();
  try {
    await navigator.clipboard.writeText(text);
    showFeedback("success", "Copied to clipboard ✅");
  } catch (e) {
    showFeedback("danger", "Unable to copy this text");
  }
}

// ======================= Dashboard =======================
async function renderDashboard(user) {
  const root = document.getElementById("root");
  if (!root || !user) return;

  try {
    const res = await fetch(`${API_REFERRAL}?phone=${user.phone}`);
    const data = await res.json();

    root.innerHTML = "";
    if (data.referrals?.length) {
      data.referrals.forEach((ref) => {
        const card = document.createElement("div");
        card.className = "referral-card";
        card.innerHTML = `
          <h3>${ref.name}</h3>
          <p>Phone: ${ref.phone}</p>
          <p>Joined: ${new Date(ref.createdAt).toLocaleDateString()}</p>
          <p>Status: ${ref.status}</p>
        `;
        root.appendChild(card);
      });
    } else {
      root.innerHTML = "<p>No referrals yet</p>";
    }
  } catch (err) {
    console.error("Error fetching referrals:", err);
    root.innerHTML = "<p>Failed to load referrals</p>";
  }
}

// ======================= INIT =======================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  if (token && window.location.pathname.endsWith("index.html")) {
    window.location.href = "panel.html";
  }

  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");
  setupPasswordToggle();
  setupPageSwitch();

  document.querySelectorAll("[data-role=copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      const text = targetEl?.value || targetEl?.textContent || "";
      copyText(text);
    });
  });

  if (window.location.pathname.endsWith("panel.html")) {
    renderDashboard(user);
  }

  const refLink = document.getElementById("reflink");
  if (user && refLink) {
    refLink.value = `https://cctv-liart.vercel.app?ref=${user.referralCode}`;
  }


});