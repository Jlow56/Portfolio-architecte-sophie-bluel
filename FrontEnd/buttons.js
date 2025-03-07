import { getWorks, displayWorks } from "./works.js";
import { isUserAuthenticated } from "./modale.js"; 
/************ Lancement du code ************/
document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

/************ Initialisation ************/
async function init() {
  let categories = await getCategories();
  displayButtons(categories); // Génère dynamiquement les boutons de filtres
  btnFiltersEvents(); // Ajoute les événements aux boutons
  filterWorks("Tous"); // Affiche tous les travaux par défaut
  updateLoginLogoutLink(); // Met à jour le lien de connexion/déconnexion
 
}

/************ Récupérer les catégories ************/
export async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  let categories = await response.json();
  return categories;
}

/************ Nettoyer le nom de la catégorie ************/
export function regexFilter(name) {
  return `btn-${name
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^a-zA-Z0-9-]/g, "") // Supprime caractères spéciaux sauf -
    .toLowerCase()}`;
}

/************ Création d'un bouton des filtres ************/
function createBtn(categorie) {
  const btn = document.createElement("button");
  btn.classList.add(regexFilter(categorie.name));
  btn.textContent = categorie.name;
  return btn;
}

/************ Mettre à jour le lien de connexion/déconnexion ************/
function updateLoginLogoutLink() {
  const loginLink = document.querySelector('nav ul li a[href="login.html"]');
  if (isUserAuthenticated()) {
    const logoutLink = loginLink.cloneNode(true);
    logoutLink.textContent = "Logout";
    logoutLink.href = "#";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.reload(); // Recharge la page après déconnexion
    });

    loginLink.parentNode.replaceChild(logoutLink, loginLink); // Remplace le lien
  }
}

/************ Gérer les événements des boutons filters ************/
async function btnFiltersEvents() {
  if (!(isUserAuthenticated())){
    const categories = await getCategories();
    // Gestion du bouton "Tous" pour afficher tous les travaux sans filtre de catégorie
    document.querySelector(".btn-tous").addEventListener("click", () => {
      filterWorks("Tous");
    });

    categories.forEach((categorie) => {
      const btn = document.querySelector(`.${regexFilter(categorie.name)}`);
      if (btn) {
        btn.addEventListener("click", () => {
          filterWorks(categorie.name);
        });
      }
    });
  }
}

/************ Filtrer les travaux en fonction des catégories sélectionnées ************/
async function filterWorks(categoryName) {
  let works = await getWorks(); // Récupère les travaux
  if (categoryName !== "Tous") {
    works = works.filter((work) => work.category.name === categoryName); // Filtre les travaux selon la catégorie cliquée
  }
  displayWorks(works); // Réaffiche les travaux filtrés
}

/************ Afficher les boutons ************/
function displayButtons(categories) {
  if (!(isUserAuthenticated())){
    const divBtnFilter = document.querySelector(".btn-filters");
    divBtnFilter.innerHTML = "";
  
    const btnAll = createBtn({ name: "Tous" });
    btnAll.classList.add("btn-tous");
    divBtnFilter.appendChild(btnAll);
  
    categories.forEach((categorie) => {
      const btn = createBtn(categorie);
      divBtnFilter.appendChild(btn);
    });
  }
  filterWorks("Tous"); // Affiche tous les travaux par défaut
}



