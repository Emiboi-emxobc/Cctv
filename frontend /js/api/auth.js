// js/api/auth.js
const API_BASE = "https://nexa-mini.onrender.com/api/auth"; // change later

// js/api/auth.js

 

export async function sendAuthRequest(endpoint, data) {
  try {
    const res = await axios.post(`${API_BASE}/${endpoint}`, data);
    // axios auto-parses JSON
    alert(JSON.stringify(res.data)); 
    return res.data;
  } catch (err) {
    console.error("Auth Error:", err.response?.data || err.message);
    alert(err.response?.data?.message);
    throw err;
  }
}