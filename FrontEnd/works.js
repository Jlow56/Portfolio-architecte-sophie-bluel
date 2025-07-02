// FrontEnd/js/works.js
import { getWorksAPI } from './api.js';

/************ Lancement du code ************/
document.addEventListener("DOMContentLoaded", () => init());

/************ Fonction qui initialise la page ************/
async function init() {
  const works = await getWorksAPI(); 
  displayWorks(works); 
}

/************ Fonction qui crée la carte d’un work ************/
function createWork(work) {
  const figure = document.createElement("figure");
  figure.classList.add("work");
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>`;
  return figure;
}

/************ Fonction qui affiche les travaux ************/
export function displayWorks(works) {
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";
  works.forEach(work => {
    divGallery.appendChild(createWork(work));
  });
}

/**
 * @description Met à jour l’affichage des works
 */
export async function updateWorks() {
  const works = await getWorksAPI();
  displayWorks(works);
}


