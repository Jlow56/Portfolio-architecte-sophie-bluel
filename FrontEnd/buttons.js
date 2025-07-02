// FrontEnd/js/buttons.js
import { getCategoriesAPI } from './api.js';
import { displayWorks } from './works.js';

/**
 * Génére dynamiquement le menu de catégories et gère le filtre
 */
document.addEventListener("DOMContentLoaded", () => initButtons());

async function initButtons() {
  const categories = await getCategoriesAPI();
  const btnContainer = document.querySelector(".categories");
  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.addEventListener("click", async () => {
    const works = await getCategoriesAPI(); // en réalité, on veut tous les works
    displayWorks(await fetchAllWorks());
  });
  btnContainer.appendChild(allBtn);
  // Boutons par catégorie
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.addEventListener("click", async () => {
      const works = await fetchAllWorks();
      displayWorks(works.filter(w => w.categoryId === cat.id));
    });
    btnContainer.appendChild(btn);
  });
}

/**
 * Helper pour récupérer tous les works
 */
async function fetchAllWorks() {
  const { getWorksAPI } = await import('./api.js');
  return getWorksAPI();
}