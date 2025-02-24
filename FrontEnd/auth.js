document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Vérifie si l'email a un format valide
    function isValidEmail(email) {
        let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Validation complète des champs
    function validateForm() {
        let isEmailValid = emailInput.value.trim() !== "" && isValidEmail(emailInput.value);
        let isPasswordValid = passwordInput.value.trim() !== "";

        if (!isEmailValid || !isPasswordValid) {
            window.alert("Erreur dans l’identifiant ou le mot de passe.");
            return false; 
        }
        return true;
    }

    // Fonction pour envoyer la requête de connexion
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
                console.log(localStorage);
                window.location.href = "index.html";  //Redirige vers l'accueil
            } else {
                alert("Erreur dans l’identifiant ou le mot de passe.");
            }
        } 
        catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue, veuillez réessayer plus tard.");
        }
    }

    // Gère la soumission du formulaire
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (validateForm()) {
            await authPost(emailInput.value.trim(), passwordInput.value.trim());
        }
    });
});