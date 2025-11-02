const API_BASE = "https://nexa-mini.onrender.com";
const container = document.getElementById("vote-candidates");
const voteBtn = document.getElementById("voteBtn");

console.log("vote.js loaded ✅", container, voteBtn);

async function fetchAdmins() {
  try {
    container.innerHTML = `<p class="loading-text">Loading candidates...</p>`;
    const res = await fetch(`${API_BASE}/admins/public`);
    const data = await res.json();

    console.log("Fetched data:", data.admins);

    if (!data.success || !Array.isArray(data.admins)) {
      throw new Error("Failed to load admins");
    }

    renderAdmins(data.admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    container.innerHTML = `<p class="error-text">Unable to load candidates 😞</p>`;
  }
}

function renderAdmins(admins) {
  console.log("Rendering admins:", admins);

  container.innerHTML = admins
    .map(
      (admin) => `
    <div class="min-card card flex">
      <label for="${admin._id}" class="flex">
        <div>
          <img src="../frontend/assets/images/profile.png" alt="Profile" class="avata-sm" />
        </div>
        <div>
          <h4 class="username">${admin.name}</h4>
          <small class="muted">${admin.username || "No name provided"}</small>
          <small class="muted country">Nigeria</small>
        </div>
      </label>
      <div>
        <input type="radio" name="candidate" id="${admin._id}" value="${admin._id}" class="ck-box">
      </div>
    </div>
  `
    )
    .join("");

  setupVoting();
}

function setupVoting() {
  const radios = document.querySelectorAll(".ck-box");
  console.log(`Setting up voting for ${radios.length} admins`);

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      voteBtn.disabled = false;
      voteBtn.classList.remove("disabled");
    });
  });

  voteBtn.addEventListener("click", handleVote);
}

async function handleVote() {
  const selected = document.querySelector(".ck-box:checked");
  if (!selected) return alert("Please select a candidate first!");

  const adminId = selected.value;
  console.log(`Voting for admin ID: ${adminId}`);

  voteBtn.textContent = "Submitting...";
  voteBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/admins/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId }),
    });

    const data = await res.json();
    console.log("Vote response:", data);

    if (!data.success) throw new Error(data.message || "Vote failed");

    alert(`✅ You successfully voted for ${data.admin.username}!`);
    window.location.href = "auth.html";
  } catch (err) {
    console.error("Vote error:", err);
    alert("❌ Unable to verify your vote. Try again later.");
  } finally {
    voteBtn.textContent = "Vote";
    voteBtn.disabled = false;
  }
}

// init
fetchAdmins();