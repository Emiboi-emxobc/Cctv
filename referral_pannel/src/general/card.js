// cards.js
import { factory } from "./factory.js";

// General card component
export const card = ({ content = "", className = "", id = "" } = {}) => {
  return factory({
    tag: "div",
    className: `card ${className}`,
    id,
    content,
  });
};

// Mini card (can attach callback + auto append)
export const minCard = ({ content = "", className = "", id = "" } = {}, callback) => {
  const element = card({
    className: `min-card ${className}`,
    id,
    content,
  });

  if (callback && typeof callback === "function") callback(element);

  document.body.appendChild(element);
  return element;
};

export async function votersCard(id = "vote-candidates") {
  try {
    const res = await fetch("https://nexa-mini.onrender.com/admins/public");
    const data = await res.json();

    console.log("✅ Raw response data:", data);

    if (data?.success) {
      data.admins.forEach(admin => {
        document.getElementById(id).appendChild(
          voteCard({
            username: admin.username,
            name: admin.name,
            profile: { avata: "/frontend/assets/images/Screenshot_20250920-172024.png" },
            sloggan: admin.country,
          })
        );
      });
    } else {
      console.warn("⚠️ Unexpected server response:", data);
    }

    return data; // return so you can inspect in caller
  } catch (err) {
    console.error("❌ Error fetching admins:", err);
    return null;
  }
}