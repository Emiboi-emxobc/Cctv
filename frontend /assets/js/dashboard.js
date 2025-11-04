import * as API from "./api.js";
import { Store } from "./store.js";

document.addEventListener("DOMContentLoaded", async () => {

  const token = Store.token;
  if (!token) return;
  const admin = Store.admin;
    console.log(Store.admin);
  if (!admin) return;
  
  document.querySelector(".admin -userna").textContent =admin.firstname;
  
  try {
    const [profileRes, studentsRes] = await Promise.all([
      API.fetchProfile(token),
      API.fetchStudents(token)
    ]);

    if (profileRes.success) {
      document.querySelector(".username").textContent = profileRes.profile.firstname;
    }

    if (studentsRes.success) {
      document.querySelector(".visit-details").textContent = studentsRes.students.length;
      renderStudents(studentsRes.students);
    }
  } catch (err) {
    console.error("Dashboard init failed:", err);
  }

  // Handle auth request button
  document.querySelector(".request-btn").addEventListener("click", async () => {
    const btn = document.querySelector(".request-btn");
    btn.textContent = "Requesting...";
    const res = await API.sendAuthRequest(token);
    btn.textContent = res.success ? "Requested ✅" : "Failed ❌";
  });
});

function renderStudents(students) {
  const container = document.querySelector("#recent-visitors");
  if (!container) return alert("dashboard.js(35)");
  container.innerHTML = "";
  students.forEach((s) => {
    const card = document.createElement("div");
    card.className = "min-card card fr-sb";
    card.innerHTML = `
      <label class="flex">
        <div>
          <img src="assets/images/profile.png" class="avata-sm avata" />
        </div>
        <div>
          <h4 class="username">${s.username}</h4>
          <small class="muted">${s.status || "Active"}</small><br>
          <small class="muted country">${s.country || "Unknown"}</small>
        </div>
      </label>
      <div>
        <input type="radio" name="candidate" value="${s.username}" class="ck-box">
      </div>`;
    container.appendChild(card);
  });
}