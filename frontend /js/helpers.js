// ======================= Copy Text =======================
async function copyText(text) {
  const showFeedback = feedbackFactory();
  try {
    await navigator.clipboard.writeText(text);
    showFeedback("success", "Copied to clipboard ✅");
  } catch (e) {
    showFeedback("danger", "Unable to copy this text");
  }
}

// ======================= Page Switch =======================
export function setupPageSwitch() {
  const viewButtons = document.querySelectorAll(".view-page");
  const pages = document.querySelectorAll(".page");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.value || btn.dataset.target;
      pages.forEach((p) => p.classList.remove("active"));
      const nextPage = document.getElementById(target);
      if (nextPage) nextPage.classList.add("active");
    });
  });
}


