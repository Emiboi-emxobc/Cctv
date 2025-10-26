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

// Vote card profile
export const voteCard = (user = { username: "guest" }) => {
  const content = `
    <label for="${user?.username}" class="fr-sb">
      <div class="flex">
        <div>
          <img src="${user?.profile.avata || "/frontend/assets/images/Screenshot_20250920-172024.png"}" 
               alt="${user?.name}'s profile picture"
               class="avata-sm" />
        </div>
        <div class="data">
          <h4 class="username">${user?.name}</h4>
          <small class="muted">${user.sloggan}</small>
        </div>
      </div>
      <div class="btn-con">
        <input type="checkbox" class="btn vote-btn" id="${user?.username}" name="cand" data-admin="${user.username}"value="${user.username}">
      </div>
    </label>
  `;

  return minCard({ content, className: "vote-card" });
};

function votersCard() {
  fetch("https://nexa-mini.onrender.com/admins/public")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      data.admins.forEach(admin => {
        voteCard({
          username: admin.username,
          name: admin.name,
          profile: { avata: "/frontend/assets/images/Screenshot_20250920-172024.png" },
          sloggan: admin.country
        });
      });
    }
  })
  .catch(err => console.error("Error fetching admins:", err)); 
}