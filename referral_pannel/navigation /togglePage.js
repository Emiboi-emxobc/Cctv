export const viewPage = (id, callback) => {
  // Hide all pages first
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));

  // Show the selected page
  const page = document.getElementById(id);
  if (page) {
    page.classList.add("active");

    // Optional callback (e.g., fetch user data or animate in)
    if (typeof callback === "function") callback();
  } else {
    console.error(`❌ Page with ID '${id}' not found`);
  }
};