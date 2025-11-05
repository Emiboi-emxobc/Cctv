// assets/js/api.js
// 🔥 Nexa API Helper — connects frontend to backend (local or hosted)
import { Store } from "./store.js";
// Auto-detect environment
export const API_BASE =
  "https://nexa-mini.onrender.com"; // 👈 fallback to live server when hosted

/**
 * 🧠 Universal fetch wrapper for API requests
 * @param {string} url - endpoint (e.g., "/admin/register")
 * @param {object} opts - fetch options
 * @param {string|null} token - optional Bearer token for protected routes
 */
async function req(url, opts = {}, token = null) {
  const headers = opts.headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...opts, headers });
    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid JSON response" };
      }
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message =
        (data && (data.error?.message || data.error || data.message)) ||
        (typeof data === "string" ? data : "Server returned an unknown error");
      throw new Error(message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`💥 API request failed (${url}):`, err.message || err);
    return { success: false, error: err.message || "Network error" };
  }
}
// ---------------- PUBLIC ENDPOINTS ----------------

export async function registerAdmin(body) {
  console.log("📤 Sending signup request:", body);
  const res = await req("/admin/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.log("📥 Signup server response:", res);
  return res;
}

export async function loginAdmin(body) {
  console.log("📤 Sending login request:", body);
  const res = await req("/admin/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.log("📥 Login server response:", res);
  return res;
}

// ---------------- PROTECTED ENDPOINTS ----------------

async function req(url, opts = {}, token = null) {
  const headers = opts.headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...opts, headers });
    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid JSON response" };
      }
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message =
        (data && (data.error?.message || data.error || data.message)) ||
        (typeof data === "string" ? data : "Server returned an unknown error");
      throw new Error(message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`💥 API request failed (${url}):`, err.message || err);
    return { success: false, error: err.message || "Network error" };
  }
}
export async function fetchProfile(token = null) {
  try {
    const t = token || localStorage.getItem("nexa_token");
    if (!t) {
      console.warn("⚠️ No token provided for profile fetch");
      return null;
    }

    // 🔁 Sync latest admin data
    const profile = await syncAdminData();
    if (!profile) {
      console.warn("⚠️ Could not fetch admin profile");
      return null;
    }

    console.log("👤 Current admin profile:", profile);
    return profile;
  } catch (err) {
    console.error("💥 fetchProfile failed:", err.message);
    return null;
  }
}

export async function fetchStudents(token) {
  return req("/admin/students", { method: "GET" }, token);
}

export async function updateAdmin(data, token) {
  return req("/admin/update", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function sendAuthRequest(token) {
  return req("/admin/request-auth", { method: "POST" }, token);
}