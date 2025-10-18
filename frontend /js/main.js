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
        const nextPage =