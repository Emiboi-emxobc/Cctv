// main.js — full integrated version
document.addEventListener("DOMContentLoaded", () => {

  // ========== 🧱 UTILS ==========

  function createElement({ tag = "div", className = "", id = "" }, callback) {
    const el = document.createElement(tag);
    el.className = className;
    if (id) el.id = id;
    if (callback) callback(el);
    return el;
  }

  function feedbackFactory(theme = {}) {
    const colors = {
      success: theme.success || "bg-[#18902C] text-white",
      danger: theme.danger || "bg-[#D0313D] text-white",
      warning: theme.warning || "bg-[#EA9534] text-white",
      info: theme.info || "bg-[#DF7737] text-white",
    };

    return (type = "info", message = "Notification", time = 3000) => {
      const el = createElement({
        tag: "div",
        className: `${colors[type]} p-3 rounded-md fixed top-5 right-5 shadow-md z-50`,
      });
      el.innerText = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), time);
    };
  }

  const showFeedback = feedbackFactory();

  async function logSequence(messages) {
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
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  function toggleLoader(show = true) {
    let loader = document.getElementById("global-loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "global-loader";
      loader.innerHTML = `<div class="spinner"></div>`;
      document.body.appendChild(loader);
    }
    loader.style.display = show ? "flex" : "none";
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showFeedback("success", "Copied to clipboard ✅");
    } catch (e) {
      showFeedback("danger", "Unable to copy this text");
    }
  }

  // ========== 🔐 PASSWORD TOGGLE ==========

  function setupPasswordToggle() {
    const toggleEyes = document.querySelectorAll(".eye");

    toggleEyes.forEach((eye) => {
      eye.addEventListener("click", () => {
        const input = eye.previousElementSibling;
        if (!input) return;

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
  }

  // ========== 📄 PAGE SWITCH ==========

  function setupPageSwitch() {
    const viewButtons = document.querySelectorAll(".view-page");
    const pages = document.querySelectorAll(".page");

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.value;
        pages.forEach((p) => p.classList.remove("active"));
        const nextPage = document.getElementById(target);
        if (nextPage) nextPage.classList.add("active");
      });
    });
  }

  // ========== 🌐 AUTH HANDLER ==========

  const API_BASE = "https://nexa-mini.onrender.com/api/auth";

  async function sendAuthRequest(endpoint, data) {
    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, data);
      return res.data;
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      showFeedback("danger", err.response?.data?.message || "Connection failed!");
      throw err;
    }
  }

  function handleForm(formId, endpoint, redirectTo) {
    const form = document.getElementById(formId);
    if (!form) return console.warn(`⚠️ Form '${formId}' not found.`);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const isSignup = formId === "n-sign-up";
      const data = isSignup
        ? {
            firstname: form.firstname.value.trim(),
            lastname: form.lastname.value.trim(),
            apikey: form.apikey.value.trim(),
            phone: form.phone.value.trim(),
            password: form.password.value.trim(),
          }
        : {
            phone: form.phone.value.trim(),
            password: form.password.value.trim(),
          };

      try {
        toggleLoader(true);
        await logSequence([
          "Creating secure connection...",
          "Encrypting session...",
          "Verifying credentials...",
          "Fetching user data...",
          "Building dashboard...",
          "Almost there...",
        ]);

        const result = await sendAuthRequest(endpoint, data);

        await logSequence(["✅ Access granted", "Redirecting..."]);
        showFeedback("success", `Welcome, ${data.firstname || "Admin"}!`);

        localStorage.setItem("token", result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            firstname: result.firstname,
            lastname: result.lastname,
            phone: result.phone,
            apikey: result.apikey || null,
          })
        );

        window.location.href = redirectTo;
      } catch (err) {
        logSequence(["Error: Unable to connect"]);
      } finally {
        toggleLoader(false);
      }
    });
  }

  // ========== 🧭 DASHBOARD ==========

  async function renderDashboard(user) {
    const root = document.getElementById("root");
    if (!root || !user) return;

    try {
      const res = await fetch(
        `https://nexa-mini.onrender.com/referrals?phone=${user.phone}`
      );
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

  // ========== 🚀 INITIALIZATION ==========

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Only render dashboard if token exists
  if (token && user) renderDashboard(user);

  setupPasswordToggle();
  setupPageSwitch();

  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");

  const copyBtns = document.querySelectorAll(".copy");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      const text = targetEl?.value || targetEl?.textContent || "";
      copyText(text);
    });
  });
});