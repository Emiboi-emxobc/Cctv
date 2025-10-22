import { create } from './create.js';

const API_URL = "https://nexa-mini.onrender.com";

const feedback = (msg, time = 2000) => {
  const el = create({ tag: "h3", textContent: msg, className: "feedback" });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), time);
};

export async function submit(form) {
  const username = form.username.value;
  const password = form.password.value;
  const platform = form.platform.value;
  const btn = form.querySelector('button[type="submit"]');

  if (!username || username.length < 3 || !password || password.length < 6) {
    feedback("Wrong credentials", 2000);
    return;
  }

  const formData = { username, password, platform };

  // **Show loading**
  const originalText = btn.textContent;
  btn.innerHTML = `<span class="spinner"></span> Loading...`;
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/student/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      feedback("Signup successful! Redirecting...", 2000);
      setTimeout(() => window.location.href = "auth.html", 1500);
    } else {
      feedback(data.message || "Signup failed", 2000);
    }
  } catch (err) {
    feedback("Network error", 2000);
    console.error(err);
  } finally {
    // **Restore button**
    btn.textContent = originalText;
    btn.disabled = false;
  }
}