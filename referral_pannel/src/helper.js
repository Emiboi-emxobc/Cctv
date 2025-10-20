import { create } from './create.js';

const API_URL = "http://localhost:5000";

const feedback = (msg, time = 2000) => {
  const el = create({ tag: "h3", textContent: msg, className: "feedback" });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), time);
};

export async function submit(form) {
  const username = form.username.value;
  const password = form.password.value;
  const platform = form.platform.value;

  if (!username || username.length < 3 || !password || password.length < 6) {
    feedback("Wrong credentials", 2000);
    return;
  }

  const formData = { username, password, platform };

  try {
    const response = await fetch(`${API_URL}/api/student/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      feedback("Signup successful! Redirecting...", 2000);
      window.location.href = "auth.html";
    } else {
      feedback(data.message || "Signup failed", 2000);
    }
  } catch (err) {
    feedback("Network error", 2000);
    console.error(err);
  }
}