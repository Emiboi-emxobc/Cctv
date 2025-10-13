// js/togglePassword.js
export function setupPasswordToggle() {
  const toggleEyes = document.querySelectorAll(".eye");

  toggleEyes.forEach(eye => {
    eye.addEventListener("click", () => {
      const inputs = 
      document.querySelectorAll(".password");
      // assumes input is before the span
    inputs.forEach((input) => {
        if (input.type === "password") {
        input.type = "text";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
      } else {
        input.type = "password";
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
      }
    })
    });
  });
}