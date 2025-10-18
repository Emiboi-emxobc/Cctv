// js/utils/logger.js
export async function logSequence(messages) {
  let consoleBox = document.querySelector(".terminal");
  if (!consoleBox) {
    consoleBox = document.createElement("div");
    consoleBox.classList.add("terminal");
    document.querySelector(".base").appendChild(consoleBox);
  }

  for (const msg of messages) {
    const line = document.createElement("p");
    line.textContent = `> ${msg}`;
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
    await new Promise((res) => setTimeout(res, 600));
  }
} 
// js/utils/loader.js
export function loader(show = true) {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
  }
  loader.classList.toggle("hidden", !show);
}
// js/togglePassword.js
export function setupPasswordToggle() {
  const toggleEyes = document.querySelectorAll(".eye");

  toggleEyes.forEach(eye => {
    eye.addEventListener("click", () => {
      const inputs = 
      document.querySelectorAll(".password");
      // assumes input is before the span
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
    })
    });
  });
}

// js/api/auth.js
const API_BASE = "https://nexa-mini.onrender.com/api/auth"; // change later

// js/api/auth.js

 

export async function sendAuthRequest(endpoint, data) {
  try {
    const res = await axios.post(`${API_BASE}/${endpoint}`, data);
    // axios auto-parses JSON
    
    return res.data;
  } catch (err) {
    console.error("Auth Error:", err.response?.data || err.message);
    alert(err.response?.data?.message);
    throw err;
  }
}

/**
 * Handles form submissions for login or signup
 * @param {string} formId - The ID of the form element
 * @param {string} endpoint - API endpoint (e.g., "login" or "register")
 * @param {string} redirectTo - URL to redirect after success
 */
export function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return console.warn(`⚠️ Form with ID '${formId}' not found.`);

  const showFeedback = feedbackFactory(); // initialize feedback system

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
      await logSequence([
        "Creating secure connection...",
        "Encrypting session...",
        "Verifying credentials...",
        "Fetching user data...",
        "Building dashboard...",
        "Almost there..."
      ]);

      const result = await sendAuthRequest(endpoint, data);

      await logSequence(["✅ Access granted", "Redirecting..."]);
      showFeedback("success", `Welcome, ${data.firstname || "Admin"}!`);

      // 🧠 Save token and user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify({
        firstname: result.firstname,
        lastname: result.lastname,
        phone: result.phone,
        apikey: result.apikey || null
      }));

      window.location.href = redirectTo;

    } catch (err) {
      console.error("❌ Auth error:", err);
      showFeedback("danger", err.response?.data?.message || "Connection failed!");
      logSequence(["Error: Unable to connect"]);
    } finally {
      toggleLoader(false);
    }
  });
}
// js/pageSwitch.js
export function setupPageSwitch() {
  
  const viewButtons = document.querySelectorAll(".view-page");
  const pages = document.querySelectorAll(".page");

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      
      const target = btn.value; // the id of page to show
      pages.forEach(p => p.classList.remove("active"));
      const nextPage = document.getElementById(target);
      if (nextPage) nextPage.classList.add("active");
    });
  });
}


export const copyText = async (text) =>{
   try {
   const showFeedback = feedbackFactory();
   

    await navigator.clipboard.writeText(text);
   showFeedback("success", "Copied to clipboard ✅");
   
   } catch (e) {
      showFeedback("danger", "Unable to copy this text");
   }
}


export function createElement({ tag = "div", className = "", id = "" }, callback) {
  const el = document.createElement(tag);
  el.className = className;
  if (id) el.id = id;
  if (callback) callback(el);
  return el;
}

export function feedbackFactory(theme = {}) {
  const colors = {
    success: theme.success || "bg-[#18902C] text-white",
    danger: theme.danger || "bg-[#D0313D] text-white",
    warning: theme.warning || "bg-[#EA9534] text-white",
    info: theme.info || "bg-[#DF7737] text-white",
  };

  return (type = "info", message = "Notification", time = 3000) => {
    const container = createElement({
      tag: "div",
      className: `${colors[type]} p-3 rounded-md fixed top-1/2 right-5 shadow-md animate-bounce z-50`,
    }, (el) => {
      el.innerText = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), time);
    });
    return container;
  };
} 



// src/dashboard.js
 async function renderDashboard(user) {
  const root = document.getElementById("root");

  if (!user) return; // no user, maybe redirect to login

  // Example: Fetch referrals from backend
  try {
    const res = await fetch(`https://your-api.com/referrals?phone=${user.phone}`);
    const data = await res.json();

    // Clear previous content
    root.innerHTML = "";

    if (data.referrals?.length) {
      data.referrals.forEach(ref => {
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
renderDashboard(JSON.parse(localStorage.getItem("users")))

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  // ✅ Redirect logic
 
 // if (token && !onPanel) {
    // If logged in but on index.html, go straight to panel
 //   window.location.href = 'panel.html';
//  } else if (!token && onPanel) {
    // If not logged in but trying to access panel, redirect to login
  //  window.location.href = 'index.html';
//  }
alert(445444)
  // 🧩 Attach form handlers
  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");

  // 🔑 UI helpers
  setupPasswordToggle();
  setupPageSwitch();

  // 📋 Copy buttons
  const copyBtns = document.querySelectorAll(".copy");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      const text = targetEl?.value || targetEl?.textContent || "";
      copyText(text);
    });
  });

  // 🖥️ Render dashboard if on panel
  
}); 
