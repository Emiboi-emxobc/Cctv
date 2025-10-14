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
      firstname:form.firstname.value.trim(),
      lastname : form.lastname.value.trim(),
      apikey :form.apikey.value.trim(),
      phone :form.phone.value.trim(),
      password:form.password.value.trim()
    };
    } else {
      data = {
      phone :form.phone.value.trim(),
      password:form.password.value.trim()
    }
    }

    try {
      alert("DATA SENT:"+JSON.stringify(data));
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