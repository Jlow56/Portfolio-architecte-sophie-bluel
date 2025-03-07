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
function isValidEmail(email) {
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Vérifie si l'email et le mot de passe sont valides
function validateForm(emailInput, passwordInput) {
    let isEmailValid = emailInput.value.trim() !== "" && isValidEmail(emailInput.value);
    let isPasswordValid = passwordInput.value.trim() !== "";

    if (!isEmailValid || !isPasswordValid) {
        window.alert("Erreur dans l’identifiant ou le mot de passe.");
        return false;
    }
    return true;
}

// Fait une requête POST pour authentifier l'utilisateur
async function authPost(email, password) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            console.log("Connexion réussie !");
            window.location.href = "index.html"; 
        } else {
            alert("Erreur dans l’identifiant ou le mot de passe.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue, veuillez réessayer plus tard.");
    }
}

// Envoie la requête POST lors de la soumission du formulaire 
function submitForm(form, emailInput, passwordInput) { 
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (validateForm(emailInput, passwordInput)) {
            await authPost(emailInput.value.trim(), passwordInput.value.trim());
        }
    });
}


