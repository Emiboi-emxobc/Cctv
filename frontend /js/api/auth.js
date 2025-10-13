// js/api/auth.js
const API_BASE = "https://nexa-mini.onrender.com/api/auth"; // change later

export async function sendAuthRequest(endpoint, data) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(JSON.stringify(result));
  if (!res.ok) throw new Error(result.message);
  return result;
}