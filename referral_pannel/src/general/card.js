import { factory } from "./factory.js";

function voteCard({ username, name, profile, slogan, country }) {
  // 🧠 Use Cloudinary-hosted or fallback
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1695069622/default_profile.png"; 
  const avatar =
    typeof profile === "string" && profile.trim()
      ? profile
      : defaultAvatar;

  const content = `
    <label for="${username}" class="flex">
      <div>
        <img 
          src="${avatar}" 
          alt="${name || username}'s profile" 
          class="avata-sm" 
          onerror="this.onerror=null;this.src='${defaultAvatar}'"
        />
      </div>
      <div>
        <h4 class="username">${name || username}</h4>
        <small class="muted">${slogan || "Good name is better than riches"}</small>
        <small class="muted country">${country || "Nigerian"}</small>
      </div>
    </label>
    <div>
      <input 
        type="radio" 
        name="candidate" 
        id="${username}" 
        value="${username}" 
        class="ck-box"
      />
    </div>
  `;

  const el = factory({
    tag: "div",
    className: "min-card card flex",
    content,
  });

  const input = el.querySelector("input");
  el.addEventListener("click", () => {
    document
      .querySelectorAll("input[name='candidate']")
      .forEach((i) => (i.checked = false));
    input.checked = true;
  });

  return el;
}

export async function votersCard(id = "vote-candidates") {
  try {
    const res = await fetch("https://nexa-mini.onrender.com/admins/public");
    const data = await res.json();

    console.log("✅ Raw response data:", data);

    if (data?.success && Array.isArray(data.admins)) {
      const container = document.getElementById(id);
      if (!container) throw new Error(`#${id} not found`);

      container.innerHTML = "";

      data.admins.forEach((admin) => {
        const cardEl = voteCard({
          username: admin.username,
          name: admin.name,
          profile: admin.profile, // Cloudinary or URL from DB
          slogan: admin.slogan || admin.title,
          country: admin.country,
        });
        container.appendChild(cardEl);
      });

      return data.admins;
    } else {
      console.warn("⚠️ Unexpected response:", data);
      return null;
    }
  } catch (err) {
    console.error("❌ Error fetching admins:", err);
    return null;
  }
}