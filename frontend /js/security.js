// frontend/js/security.js - helper functions (non-destructive)
const API_BASE = "https://nexa-mini.onrender.com/api";

async function addSecurityCode(teacherId, studentId, code) {
  const res = await fetch(API_BASE + "/teacher/add-code", {
    method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({teacherId, studentId, code})
  });
  return res.json();
}

async function verifySecurityCode(phone, code) {
  const res = await fetch(API_BASE + "/student/verify-code", {
    method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({phone, code})
  });
  return res.json();
}

// expose to global for inline HTML usage without imports
window.addSecurityCode = addSecurityCode;
window.verifySecurityCode = verifySecurityCode;
