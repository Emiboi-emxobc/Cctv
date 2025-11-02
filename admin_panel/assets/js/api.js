// assets/js/api.js
// 🔥 Nexa API Helper — connects frontend to backend (local or hosted)

// Auto-detect environment
export const API_BASE = // 👈 your local IP and port for Termux/Node testing
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
    const type = res.headers.get("content-type") || "";

    let data;
    if (type.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      // backend responded with error (like validation or duplicate phone)
      const message =
        data?.error?.message ||
        data?.error ||
        data?.message ||
        typeof data === "string"
          ? data
          : "Server returned an error";
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("💥 API request failed:", err);
    // return a consistent error object instead of breaking execution
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

export async function fetchProfile(token) {
  return req("/admin/profile", { method: "GET" }, token);
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