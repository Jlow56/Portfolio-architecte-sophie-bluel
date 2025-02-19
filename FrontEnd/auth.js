
async function handeleLogin() {
    const form = document.getElementById("login-form");
    
    document.getElementById("login").addEventListener("click", async (event) => {
        event.preventDefault();// Empêche le rechargement de la page
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        if (!emailRegex(email)) {
            alert("Veuillez entrer un email valide");
            return;
        }
    });
    async function authPost() {
        let token;
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( {
                email: "email",
                password: "password",
            }), 
        });
        
        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            window.alert("Erreur dans l’identifiant ou le mot de passe");
        }
    }


    function validateInput(input) {
       if (input.value === "" || input.value === null) {
            alert("Veuillez remplir tous les champs");
            InputEvent.classList.add("error");
        } else {
            input.classList.remove("error");
        }   
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        validateInput(email);
        validateInput(password);
    });

    form.addEventListener("change",  () => {
        validateInput(email);
        validateInput(password);
    });
     function emailRegex(email) {
        let emailRegex = new RegExp("[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]+");
    } 
}

