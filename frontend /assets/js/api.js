// assets/js/api.js
// 🔥 Nexa API Helper — connects frontend to backend (local or hosted)

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
    const type = res.headers.get("content-type") || "";

    let data;
    if (type.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message =
        data?.error?.message ||
        data?.error ||
        data?.message ||
        (typeof data === "string" ? data : "Server returned an error");
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("💥 API request failed:", err);
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

export async function syncAdminData() {
  const stored = localStorage.getItem("nexa_admin");
  const token = localStorage.getItem("nexa_token");

  if (!stored || !token) {
    console.warn("⚠️ No admin session found, skipping sync");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDkxNjM2NmE2ZjI0NTY1NTkyZjRmNyIsImlhdCI6MTc2MjIwMzE5MCwiZXhwIjoxNzYyODA3OTkwfQ.b6F4uoWNuzs_gKh5JjWlveks6f-qdN0VG8143Ksj55Q` },
    });

    const data = await res.json();

    if (!data.success) {
      console.error("❌ Failed to sync admin:", token+data.error );
      return null;
    }

    // Overwrite localStorage with fresh data
    localStorage.setItem("nexa_admin", JSON.stringify(data.profile));

    console.log("✅ Admin synced:", data.profile.username);
    return data.profile;
  } catch (err) {
    console.error("💥 Sync failed:", err.message);
    return null;
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