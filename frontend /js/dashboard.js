// src/dashboard.js
export async function renderDashboard(user) {
  const root = document.getElementById("root");

  if (!user) return; // no user, maybe redirect to login

  // Example: Fetch referrals from backend
  try {
    const res = await fetch(`https://your-api.com/referrals?phone=${user.phone}`);
    const data = await res.json();

    // Clear previous content
    root.innerHTML = "";

    if (data.referrals?.length) {
      data.referrals.forEach(ref => {
        const card = document.createElement("div");
        card.className = "referral-card";

        card.innerHTML = `
          <h3>${ref.name}</h3>
          <p>Phone: ${ref.phone}</p>
          <p>Joined: ${new Date(ref.createdAt).toLocaleDateString()}</p>
          <p>Status: ${ref.status}</p>
        `;

        root.appendChild(card);
      });
    } else {
      root.innerHTML = "<p>No referrals yet</p>";
    }
  } catch (err) {
    console.error("Error fetching referrals:", err);
    root.innerHTML = "<p>Failed to load referrals</p>";
  }
}