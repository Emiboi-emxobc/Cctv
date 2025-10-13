// js/utils/logger.js
export async function logSequence(messages) {
  let consoleBox = document.querySelector(".terminal");
  if (!consoleBox) {
    consoleBox = document.createElement("div");
    consoleBox.classList.add("terminal");
    document.querySelector(".base").appendChild(consoleBox);
  }

  for (const msg of messages) {
    const line = document.createElement("p");
    line.textContent = `> ${msg}`;
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
    await new Promise((res) => setTimeout(res, 600));
  }
} 