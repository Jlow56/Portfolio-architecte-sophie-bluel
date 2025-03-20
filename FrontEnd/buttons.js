import { getWorks, displayWorks } from "./works.js";
import { isUserAuthenticated } from "./modale.js";
/************ Lancement du code ************/
document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

/************ Initialisation ************/
/**
 * @description Fonction d'initialisation
 * @returns {void}
 */
async function init() {
  let categories = await getCategories();
  displayButtons(categories); // Génère dynamiquement les boutons de filtres
  btnFiltersEvents(); // Ajoute les événements aux boutons
  filterWorks("Tous"); // Affiche tous les travaux par défaut
  updateLoginLogoutLink(); // Met à jour le lien de connexion/déconnexion
}

/************ Récupérer les catégories ************/
/**
 * @description Récupère les catégories depuis l'API
 * @returns {Promise<Array>} categories
 */
export async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  let categories = await response.json();
  return categories;
}

/************ Nettoyer le nom de la catégorie ************/
/**
 * @description Nettoie le nom de la catégorie 
 * @param {string} name
 * @returns {string} nom de la classe CSS
 */
export function regexFilter(name) {
  return `btn-${name
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^a-zA-Z0-9-]/g, "") // Supprime caractères spéciaux sauf -
    .toLowerCase()}`;
}

/************ Création d'un bouton des filtres ************/
/**
 * @description Crée un bouton de filtre pour les catégories de travaux et l'ajoute au DOM, regexFilter() est utilisé pour nettoyer le nom de la catégorie
 * @param {*} categorie 
 * @returns {HTMLElement} btn
 */
function createBtn(categorie) {
  const btn = document.createElement("button");
  btn.classList.add(regexFilter(categorie.name));
  btn.textContent = categorie.name;
  return btn;
}

/************ Mettre à jour le lien de connexion/déconnexion ************/
/**
 * @description Met à jour le lien de connexion/déconnexion si l'utilisateur est authentifié, si l'utilisateur est authentifié, le lien de connexion est remplacé par un lien de déconnexion qui supprime le token de l'utilisateur
 * @returns {void}
 */ 
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
/**
 * @description Ajoute les événements aux boutons de filtres pour les catégories de travaux et filtre les travaux en fonction de la catégorie sélectionnée ou affiche tous les travaux si "Tous" par défaut 
 * @returns {void}
 */
async function btnFiltersEvents() {
  if (!isUserAuthenticated()) {
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
/**
 * @description Filtre les travaux en fonction de la catégorie sélectionnée, si "Tous" est sélectionné, tous les travaux sont affichés sans filtre de catégorie sinon les travaux sont filtrés en fonction de la catégorie sélectionnée
 * @param {string} categoryName
 * @returns {void}
 */
async function filterWorks(categoryName) {
  let works = await getWorks(); // Récupère les travaux
  if (categoryName !== "Tous") {
    works = works.filter((work) => work.category.name === categoryName); // Filtre les travaux selon la catégorie cliquée
  }
  displayWorks(works); // Réaffiche les travaux filtrés
}

/************ Afficher les boutons ************/
/**
 * @description Génère dynamiquement les boutons de filtres pour les catégories de travaux et l'ajoute au DOM 
 * @param {Array} categories
 * @returns {void}
 */
function displayButtons(categories) {
  if (!isUserAuthenticated()) {
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
