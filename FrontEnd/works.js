/************ Lancement du code ************/
// Attend que le DOM soit chargé et lance la fonction init
document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() { // Récupère les travaux depuis l'API ou le cache
  let works = await getWorks(); // Affiche les travaux 
  displayWorks(works); 
}
  
/************ Fonction qui récupère l'API des works ou le cache ************/
export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works"); 
  let  works = await response.json();// Convertit la réponse en JSON (tableau d'objets)
  return works;
}
  
/************ Fonction qui cree la structure de l'image ************/
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
  // boucle pour afficher les travaux à partir de mon tableau works
  works.forEach((work) => {
    const figure = createWork(work);
    divGallery.appendChild(figure);
  });
}

export async function updateWorks() {
  let works = await getWorks();
  displayWorks(works);
} 


