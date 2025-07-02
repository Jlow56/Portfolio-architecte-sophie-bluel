document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

// Initialisation
async function init() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const form = document.querySelector(".form-login");
  submitForm(form, emailInput, passwordInput);
}

// Vérifie si l'email a un format valide
/**
 * @param {string} email - L'adresse e-mail à vérifier.
 * @returns {boolean} - Retourne `true` si l'e-mail est valide, sinon `false`.
 */
function isValidEmail(email) {
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Vérifie si l'email et le mot de passe sont valides
/**
 * @description Vérifie si l'email et le mot de passe sont valides
 * @param {HTMLInputElement} emailInput - L'élément input de l'e-mail.
 * @param {HTMLInputElement} passwordInput - L'élément input du mot de passe.
 * @returns {boolean} - Retourne `true` si les deux champs sont valides, sinon `false`.
 */
function validateForm(emailInput, passwordInput) {
  let isEmailValid =
    emailInput.value.trim() !== "" && isValidEmail(emailInput.value);
  let isPasswordValid = passwordInput.value.trim() !== "";

  if (!isEmailValid || !isPasswordValid) {
    window.alert("Erreur dans l’identifiant ou le mot de passe.");
    return false;
  }
  return true;
}

// Fait une requête POST pour authentifier l'utilisateur
/**
 * @description Fait une requête POST pour authentifier l'utilisateur, stocke le token en cas de succès pour maintenir la session. Affiche un message d’erreur en cas d’identifiants incorrects, redirige l'utilisateur vers la page d'accueil en cas de succès.
 * @param {string} email - L'adresse e-mail de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 */
async function authPost(email, password) {
  try {
    const response = await fetch("https://portfolio-architecte-sophie-bluel-cx5e.onrender.com/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
      document.getElementById("error-message").style.display = "none";
    } else {
      document.getElementById("error-message").style.display = "flex";
      document.querySelector('label[for="email"]').style.marginTop = "1rem";
      alert("Erreur dans l’identifiant ou le mot de passe.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    alert("Une erreur est survenue, veuillez réessayer plus tard.");
  }
}

// Envoie la requête POST lors de la soumission du formulaire
/**
 * @description Ajoute un écouteur d'événement sur le formulaire pour gérer la soumission.
 * @param {HTMLFormElement} form - L'élément `<form>` contenant les champs d'entrée.
 * @param {HTMLInputElement} emailInput - L'input de l'e-mail.
 * @param {HTMLInputElement} passwordInput - L'input du mot de passe.
 */
function submitForm(form, emailInput, passwordInput) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (validateForm(emailInput, passwordInput)) {
      await authPost(emailInput.value.trim(), passwordInput.value.trim());
    }
  });
}
