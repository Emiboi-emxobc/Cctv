// assets/js/auth.js
import * as api from "./api.js";
import { Store } from "./store.js";
import { showPage } from "./ui.js";

/** do admin registration */
export async function doRegister(formData) {
  // formData: { firstname, lastname, phone, apikey, password }
  try {
    const res = await api.registerAdmin(formData);
    if (res && res.token) {
      Store.setToken(res.token);
      Store.setAdmin(res.admin || null);
      // Note: server already sends WhatsApp — we show verify UI now
      showPage("verify");
      return { success: true, admin: res.admin };
    }
    return { success: false, error: res };
  } catch (err) {
    return { success: false, error: err };
  }
}

/** do login */
export async function doLogin(creds) {
  try {
    const res = await api.loginAdmin(creds);
    if (res && res.token) {
      Store.setToken(res.token);
      Store.setAdmin(res.admin || null);
      // after login, fetch profile & students in main bootstrap
      return { success: true, admin: res.admin };
    }
    return { success: false, error: res };
  } catch (err) {
    return { success: false, error: err };
  }
}

/** confirm by calling profile endpoint to validate token */
export async function confirmAccount() {
  try {
    const token = Store.token;
    if (!token) throw { error: "no token" };
    //verifyOTP();
    const res = await api.fetchProfile(token);
    if (res ) {
      Store.setAdmin(profile);
      return { success: true, profile: res.profile };
    }
    return { success: false, error: res };
  } catch (err) {
    return { success: false, error: err };
  }
}