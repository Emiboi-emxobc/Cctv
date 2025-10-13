// js/handlers/formHandler.js
import { toggleLoader } from "../utils/loader.js";
import { logSequence } from "../utils/logger.js";
import { sendAuthRequest } from "../api/auth.js";

export function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      firstname:form.firstname.value,
      lastname : form.lastname.value,
      apikey :form.apikey.value,
      phone :form.phone.value,
      password:form.password.value,
      referredById :form.firstname.value+Math.random.toString(16).substring(2,8)
    };

    try {
      toggleLoader(true);
      await logSequence([
        "Connecting to secure server...",
        "Encrypting session...",
        "Verifying credentials...",
        "Fetching user data...",
        "Building dashboard...",
        "Almost there..."
      ]);

      const result = await sendAuthRequest(endpoint, data);

      await logSequence(["✅ Access granted", "Redirecting..."]);
      localStorage.setItem("token", result.token);
      window.location.href = redirectTo;
    } catch (err) {
      alert(`❌ ${err.message}`);
      logSequence([" error: unable to connect"]);
    } finally {
      toggleLoader(false);
    }
  });
}