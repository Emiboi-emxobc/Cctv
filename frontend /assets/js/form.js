//assets/js/form.js


import {setLoading} from './loader.js';
import * as Auth from "./auth.js";
import { Store } from "./store.js";

// ---------------- VERIFY ----------------
let refCode = 
localStorage.getItem("refCode");
export function setupVerifyForm() {
  const form = document.getElementById("verify-form");
  const out = document.getElementById("verify-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Verifying…");

    try {
      const res = await Auth.confirmAccount();
      console.log("🧾 Verification result:", res);
      if (res.success) {
        setLoading(out, false, "✅ Verified! Redirecting…");
        Store.setToken(res.token);
        setTimeout(() => {
          window.location.href = "admin-panel.html";
        }, 100);
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}




export function setupSignupForm() {
  const form = document.getElementById("n-sign-up");
  const out = document.getElementById("signup-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Creating account…");

    const body = {
      firstname: form.firstname?.value.trim(),
      lastname: form.lastname?.value.trim(),
      phone: form.phone?.value.trim(),
      chatId: form.chatId?.value.trim(),
      password: form.password?.value,
     referredByCode: refCode
    };

    try {
      console.log("🚀 Submitting signup form:", body);
      const res = await Auth.doRegister(body);
      console.log("📝 Registration result:", res);

      if (res.success) {
        setLoading(out, false, "✅ Account created! Check WhatsApp for verification.");
        showPage("verify");
        return;
      }

      throw new Error(res.error?.error || "Unknown server error");
    } catch (err) {
      console.error("❌ Signup error:", err.message);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}



// ---------------- LOGIN ----------------
 export function setupLoginForm() {
  const form = document.getElementById("n-sign-in");
  const out = document.getElementById("signin-output");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(out, true, "Logging in…");

    const body = {
      phone: form.querySelector("#phone").value.trim(),
      password: form.querySelector("#password").value,
    };

    try {
      const res = await Auth.doLogin(body);
      console.log("🔐 Login result:", res);

      if (res.success) {
        setLoading(out, false, "✅ Login successful! Redirecting…");
        Store.setToken(res.token)
        Store.setAdmin(res.admin);
        
    
        setTimeout(() => {
          window.location.href = "admin-panel.html";
        }, 1000);
      } else {
        throw new Error(res.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}
