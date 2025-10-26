// ======================= Loader =======================
export function toggleLoader(show = true) {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
  }
  loader.classList.toggle("hidden", !show);
}

// ======================= Logger =======================
export async function log(messages) {
  let consoleBox = document.querySelector(".terminal");
  if (!consoleBox) {
    consoleBox = document.createElement("div");
    consoleBox.classList.add("terminal");
    document.querySelector(".base")?.appendChild(consoleBox);
  }

  for (const msg of messages) {
    const line = document.createElement("p");
    line.textContent = `> ${msg}`;
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
    await new Promise((res) => setTimeout(res, 600));
  }
}
