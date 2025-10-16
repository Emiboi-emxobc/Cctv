// js/handlers/formHandler.js

import { loader, toggleLoader } from "../utils/loader.js";
import { feedbackFactory } from "../utils/helpers.js";
import { logSequence } from "../utils/logger.js";
import { sendAuthRequest } from "../api/auth.js";

/**
 * Handles form submissions for login or signup
 * @param {string} formId - The ID of the form element
 * @param {string} endpoint - API endpoint (e.g., "/api/auth/login")
 * @param {string} redirectTo - URL to redirect to after success
 */
export function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return console.warn(`⚠️ Form with ID '${formId}' not found.`);

  const showFeedback = feedbackFactory(); // initialize feedback system

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ⛏️ Gather input data dynamically
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

      // 🧠 Store token and redirect
      localStorage.setItem("token", result.token);
      window.location.href = redirectTo;

    } catch (err) {
      console.error("❌ Auth error:", err);
      showFeedback("danger", err.message || "Connection failed!");
      logSequence(["Error: Unable to connect"]);
    } finally {
      toggleLoader(false);
    }
  });
}