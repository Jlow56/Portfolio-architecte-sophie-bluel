/************ Initialisation ************/
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Ping du backend pour réveiller Render (évite erreur à froid)
    await fetch("https://portfolio-architecte-sophie-bluel-cx5e.onrender.com/api/works", { method: "HEAD" });

    // Lancement de l'initialisation après réveil
    await init();
  } catch (error) {
    console.error("Erreur de connexion au backend :", error);

    // Retente après 2 secondes si échec
    setTimeout(() => {
      console.warn("Nouvelle tentative de connexion...");
      init();
    }, 2000);
  }
});

/************ Fonction d'initialisation ************/
async function init() {
  try {
    const works = await getWorks();
    displayWorks(works);
  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
    displayError("Impossible de charger les travaux pour le moment.");
  }
}

/************ Récupération des travaux via l'API ************/
export async function getWorks() {
  const response = await fetch("https://portfolio-architecte-sophie-bluel-cx5e.onrender.com/api/works");
  if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
  const works = await response.json();
  return works;
}

/************ Création d’un élément <figure> pour un travail ************/
function createWork(work) {
  const figure = document.createElement("figure");
  figure.classList.add("work");
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>`;
  return figure;
}

/************ Affichage des travaux dans la galerie ************/
export function displayWorks(works) {
  const divGallery = document.querySelector(".gallery");
  if (!divGallery) return;

  divGallery.innerHTML = ""; // Nettoyage
  works.forEach(work => {
    const figure = createWork(work);
    divGallery.appendChild(figure);
  });
}

/************ Mise à jour dynamique des travaux ************/
export async function updateWorks() {
  const works = await getWorks();
  displayWorks(works);
}

/************ Affichage d’un message d’erreur dans la page ************/
function displayError(message) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  gallery.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}
