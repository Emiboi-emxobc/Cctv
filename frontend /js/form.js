import {toggleLoader, log} from './loader.js';
import {showFeedback} from './create.js';



// ======================= BASE API =======================
const BASE_URL = "https://nexa-mini.onrender.com";
const API_ADMIN = `${BASE_URL}/admin`;
const API_REFERRAL = `${BASE_URL}/referral`;
const API_STUDENT = `${BASE_URL}/student`;
const API_VISIT = `${BASE_URL}/visit/log`;




// ======================= Form Handler =======================
export function handleForm(formId, endpoint, redirectTo) {
  const form = document.getElementById(formId);
  if (!form) return console.warn(`⚠️ Form with ID '${formId}' not found.`);

  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
      await log([
        "Creating secure connection...",
        "Encrypting session...",
        "Verifying credentials...",
        "Fetching user data...",
        "Building dashboard...",
        "Initializing...",
      ]);

      const result = await sendFormData(endpoint, data);

      await log(["✅ Access granted", "Redirecting..."]);
      showFeedback("success", `Welcome, ${data.firstname || "Admin"}!`);
alert(redirectTo)
      // Save token + user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user || data));

      window.location.href = redirectTo;
    } catch (err) {
      console.error("❌ Auth error:", err);
      showFeedback("danger", err.response?.data?.message || "Connection failed! " + err.message);
      log(["Error: Unable to connect"]);
    } finally {
      toggleLoader(false);
    }
  });
}


// ======================= Auth Request =======================
async function sendFormData(endpoint, data) {
  try {
    const res = await axios.post(`${API_ADMIN}/${endpoint}`, data);
    return res.data;
  } catch (err) {
    console.error("Auth Error:", err.response?.data || err.message);
    throw err;
  }
}

