// js/handlers/formHandler.js
import { toggleLoader } from "../utils/loader.js";
import { logSequence } from "../utils/logger.js";
import { sendAuthRequest } from "../api/auth.js";

export function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let data;
    if (formId === "n-sign-up") {
      data = {
      firstname:form.firstname.value,
      lastname : form.lastname.value,
      apikey :form.apikey.value,
      phone :form.phone.value,
      password:form.password.value
    };
    } else {
      data = {
      phone :form.phone.value,
      password:form.password.value
    };
    }
console.log("DATA SENT:", data);
    try {
      toggleLoader(true);
      await logSequence([
        "Creating account ",
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