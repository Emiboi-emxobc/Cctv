import {setLoading} from './loader.js';
import * as Auth from "./auth.js";
import { Store } from "./store.js";

// ---------------- VERIFY ----------------
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
      apikey: form.apikey?.value.trim(),
      password: form.password?.value,
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

      throw new Error(res.error?.message || "Unknown server error");
    } catch (err) {
      console.error("❌ Signup error:", err);
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
        Store.setAdmin(res.admin);
        Store.setToken(res.token);
        setTimeout(() => {
          window.location.href = "admin-panel.html";
        }, 800);
      } else {
        throw new Error(res.error?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoading(out, false, "❌ " + err.message);
    }
  });
}
