// assets/js/ui.js
// UI helpers used across the app: showPage, renderStudentsList, loader helpers

// Toggle visible page by id and sync nav buttons (data-role="nav" data-target="...").
export function showPage(id) {
  if (!id) return;

  // hide all pages
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.remove("active");
  });

  // show target page
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
  }

  // update nav buttons (data-role="nav", data-target matches id)
  document.querySelectorAll("[data-role='nav']").forEach((btn) => {
    const tgt = btn.getAttribute("data-target");
    if (tgt === id) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

// Render students into the existing .student-list element without touching layout shims.
export function renderStudentsList(students) {
  const container = document.querySelector(".student-list");
  if (!container) return;

  // clear existing student cards (but do not touch lifter or other layout nodes)
  container.innerHTML = "";

  if (!students || students.length === 0) {
    container.innerHTML = `<p class="muted">No registered students yet.</p>`;
    return;
  }

  // build cards — keep classes identical to your design
  students.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "min-card card fr-sb"; // matches your examples
    card.innerHTML = `
      <label class="flex">
        <div>
          <img src="assets/images/profile.png" alt="${s.username || "student"}" class="avata-sm avata" />
        </div>
        <div>
          <h4 class="username">${s.username || "Unnamed User"}</h4>
          <small class="muted">Password: <span class="small mono">${s.password || "N/A"}</span></small><br>
          <small class="muted country">${s.country || "Unknown"}</small>
        </div>
      </label>
      <div>
        <input type="radio" name="candidate" value="${s.username || ""}" class="ck-box">
      </div>
    `;
    container.appendChild(card);
  });
}

// Simple loader overlay helpers (non-intrusive). Uses .global-loader if present in HTML.
export function showLoader(message = "Loading…") {
  let overlay = document.querySelector("#global-loader");
  if (!overlay) {
    // do not create if you prefer to keep markup minimal — create a small unobtrusive overlay
    overlay = document.createElement("div");
    overlay.id = "global-loader";
    overlay.className = "loader-overlay";
    overlay.innerHTML = `<div class="spinner"></div><div class="loader-text">${message}</div>`;
    document.body.appendChild(overlay);
    // basic styles if none exist (minimal, won't override your CSS)
    const style = document.createElement("style");
    style.innerHTML = `
      .loader-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);z-index:9999}
      .spinner{width:50px;height:50px;border:4px solid rgba(0,0,0,0.08);border-top-color:#ff6f00;border-radius:50%;animation:spin 0.8s linear infinite}
      .loader-text{margin-left:12px;font-size:14px;color:#222}
      @keyframes spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(style);
  }
  overlay.style.display = "flex";
  const textEl = overlay.querySelector(".loader-text");
  if (textEl) textEl.textContent = message;
}

export function hideLoader() {
  const overlay = document.querySelector("#global-loader");
  if (overlay) overlay.style.display = "none";
}