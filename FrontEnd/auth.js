// FrontEnd/js/auth.js
import { loginUser } from './api.js';

document.addEventListener("DOMContentLoaded", async () => {
  initLogin();
});

function initLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const form = document.querySelector(".form-login");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!validateForm(emailInput, passwordInput)) return;
    try {
      const { token } = await loginUser(
        emailInput.value.trim(),
        passwordInput.value.trim()
      );
      localStorage.setItem("token", token);
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      document.getElementById("error-message").style.display = "flex";
    }
  });
}

function isValidEmail(email) {
  const regex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

function validateForm(emailInput, passwordInput) {
  const okEmail = emailInput.value.trim() && isValidEmail(emailInput.value);
  const okPass = passwordInput.value.trim();
  if (!okEmail || !okPass) {
    alert("Erreur dans l’identifiant ou le mot de passe.");
    return false;
  }
  return true;
}