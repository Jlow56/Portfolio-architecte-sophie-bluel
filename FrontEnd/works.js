/************ Lancement du code ************/
// Attend que le DOM soit chargé et lance la fonction init
/**
 * @description Attend que le DOM soit chargé et lance la fonction init
 * @param {Function} init - Fonction qui récupère les travaux depuis l'API ou le cache
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  init();
});

/************ Fonction qui initialise la page ************/
async function init() {
  let works = await getWorks(); 
  displayWorks(works); 
}
  
/************ Fonction qui récupère l'API des works ************/
/***
 * @description Fonction qui récupère l'API des works 
 * @returns {Promise<Array>} works - Tableau d'objets
 */
export async function getWorks() {
  const response = await fetch("https://portfolio-architecte-sophie-bluel-cx5e.onrender.com/api/works"); 
  let  works = await response.json();// Convertit la réponse en JSON (tableau d'objets)
  return works;
}
  
/************ Fonction qui cree la structure de l'image ************/
/***
 * @description Fonction qui cree la structure de l'image la figure avec la classe work et l'image avec comme url l'url de l'image et comme alt le titre de l'image
 * @param {Object} work - Objet contenant les données du travail
 * @returns {HTMLElement} figure - Element HTML de la figure
 */
function createWork(work) {
  const figure = document.createElement("figure");
  figure.classList.add("work");
  figure.innerHTML = `  
  <img src="${work.imageUrl}" alt="${work.title}">
  <figcaption>${work.title}</figcaption>`;
  return figure;
}
  
/************ Fonction qui affiche les travaux ************/
/***
 * @description Fonction qui affiche les travaux dans la div gallery à partir de mon tableau works
 * @param {Array} works - Tableau d'objets
 * @returns {void}
 */
export function displayWorks(works) {
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";
  // boucle pour afficher les travaux à partir de mon tableau works
  works.forEach((work) => {
    const figure = createWork(work);
    divGallery.appendChild(figure);
  });
}

/**
 * @description Fonction qui met à jour les travaux en appelant getWorks et displayWorks avec les nouvelles données
 * @returns {void}
 */
export async function updateWorks() {
  let works = await getWorks();
  displayWorks(works);
} 


