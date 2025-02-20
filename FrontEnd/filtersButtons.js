import { getWorks,displayWorks } from './works.js'; // Importe la fonction getWorks depuis works.js
/************ Lancement du code ************/
document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

/************ Initialisation ************/
async function init() {
  let categories = await getCategories();
  displayButtons(categories); // Génère dynamiquement les boutons de filtre
  btnFiltersEvents(); // Ajoute les événements aux boutons
  filterWorks("Tous"); // Affiche tous les travaux par défaut
} 

/************ Récupérer les catégories ************/
async function getCategories() {
  let categories = localStorage.getItem("categories");
  if (!categories) {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    localStorage.setItem("categories", JSON.stringify(categories));
  } else {
    categories = JSON.parse(categories);
  }
  return categories;
}

/************ Nettoyer le nom de la catégorie ************/
function regexFilter(name) {
  return `btn-${name
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^a-zA-Z0-9-]/g, "") // Supprime caractères spéciaux sauf -
    .toLowerCase()}`;
}

/************ Création d'un bouton ************/
function createBtn(categorie) {
  const btn = document.createElement("button");
  btn.classList.add(regexFilter(categorie.name));
  btn.textContent = categorie.name;
  return btn;
}

/************ Gérer les événements des boutons ************/
async function btnFiltersEvents() {
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
  const divBtnFilter = document.querySelector(".btn-filters");
  divBtnFilter.innerHTML = "";

  const btnAll = createBtn({ name: "Tous" });
  btnAll.classList.add("btn-tous");
  divBtnFilter.appendChild(btnAll);

  categories.forEach((categorie) => {
    const btn = createBtn(categorie);
    divBtnFilter.appendChild(btn);
  });

  filterWorks("Tous");// Affiche tous les travaux par défaut
}
