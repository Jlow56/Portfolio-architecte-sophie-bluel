import { getWorks } from "./works.js";
import { getCategories, regexFilter } from "./buttons.js";

document.addEventListener("DOMContentLoaded", async () => {
    let works = await getWorks();
    let categories = await getCategories();
    displayModaleGallery(works);
    displayOptions(categories);
    activeHeaderLinksEdit();
    openModalesOnClick(); 
    closeModalesOnClick ()
    deleteWorkOnClick()
});

/***
 * @description Fonction qui permet de savoir si l'utilisateur est connecté ou non
 * @returns {boolean}
 */
export function isUserAuthenticated() {
    return localStorage.getItem("token") !== null;
}

/************ Activer/Créer les liens d'édition si l'utilisateur est connecté via token dans localStorage ************/
/***
 * @description Activer/Créer les liens d'édition si l'utilisateur est connecté via token dans localStorage 
 * @returns {void}
 */
function activeHeaderLinksEdit() {
    const btnEdit = document.querySelector(".edit-header");
    if (isUserAuthenticated()) {
        btnEdit.style.display = "flex";
        const divTitle = document.querySelector(".title-modale");
        const linkModale = document.createElement("a");
        linkModale.classList.add("btn-open-modale");
        linkModale.href = "#";
        linkModale.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;
        divTitle.appendChild(linkModale);
    }
}

/************ Activer/désactiver la section des modales avec flex ************/
/**
 * @description Activer la section des modales
 * @returns {void}
 */
function displayModalesSection() { 
    const sectionModales = document.querySelector(".modales");
    sectionModales.style.display = "flex";
    sectionModales.removeAttribute("aria-hidden");
    sectionModales.setAttribute("aria-modal", "true");
}

/**
 * @description Masquer la section des modales
 * @returns {void}  
 */
function hiddenModalesSection() {
    const sectionModales = document.querySelector(".modales");
    sectionModales.style.display = "none";
}

/************ Ouvrir les modales avec flex + accessibilité aria ************/
/***
 * @description Ouvrir les modales
 * @returns {void}
 */
function displayModale(modale) {
    modale.removeAttribute("aria-hidden");
    modale.setAttribute("aria-modal", "true");
    modale.style.display = "flex";
}

/***
 * @description Ouvrir la modale-1
 * @returns {void}
 */
function openModale1() {
    displayModalesSection()
    const modale = document.querySelector("#modale-1");
    displayModale(modale);  
}

/***
 * @description Ouvrir la modale-2
 * @returns {void}
 */
function openModale2() {
    displayModalesSection()
    const modale = document.querySelector("#modale-2");
    displayModale(modale);
}    

/************ Fermer les modales *************/
/***
 * @description Fermer les modales
 * @returns {void}
 */
function closeModale() {
    const modales = [document.querySelector(".modales"), document.querySelector(".modale-1"), document.querySelector(".modale-2")];
    modales.forEach(modale => {
        modale.removeAttribute("aria-modal");
        modale.setAttribute("aria-hidden", "true");
        
    });
    document.removeEventListener("click", closeOnOutsideClick);
}

function closeOnOutsideClick(event) {
    if (event.target.classList.contains("modales")) {
        event.preventDefault();
        closeModale();
    }
}


/************* Gestion du clic sur les liens "modifier" ************/
/***
 * @description à l'évenement click sur les différents liens, ouvrir la modale-1, ouvrir la modale-2
 * @returns {void}
 */
function openModalesOnClick() {
    document.addEventListener("click", (event) => {
        if (event.target.closest(".btn-open-modale")) {
            event.preventDefault();
            openModale1();
        }
        if (event.target.closest(".btn-open-modale2")) {
            event.preventDefault();
            openModale2();
        }
    });
}

function closeModalesOnClick () {
    document.addEventListener("click", (event) => {
        if (event.target.closest(".close-modale")) {
            event.preventDefault();
            hiddenModalesSection();
            closeModale();
            closeOnOutsideClick();
        }
        // ajouter la logique si clic en dehors de la modale
    });
}


/************ MODALE 1 - Affichage des images ************/
/* --Fonction qui crée la structure de l'image-- */
function createModaleGallery(work) {
    const figure = document.createElement("figure");
    figure.innerHTML = `
        <div class="img-container" data-id="${work.id}">
            <img src="${work.imageUrl}" alt="${work.title}" data-id="${work.id}">
            <i class="fa-sharp fa-solid fa-trash-can" data-id="${work.id}"></i>
        </div>
    `;
    return figure;
}
/* --Fonction qui affiche les images-- */
function displayModaleGallery(works) {
    const divGalleryModale = document.querySelector(".gallery-modale");
    if (!divGalleryModale) return;
    divGalleryModale.innerHTML = "";
    works.forEach((work) => {
        divGalleryModale.appendChild(createModaleGallery(work));
    });
}

// Suppression des travaux
/* --Fonction qui supprime une image-- */
function deleteWork(workId) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => displayModaleGallery(works), updateGallery(works)) 
    .catch(error => console.log(error));
}

/**
 * Gestion du clic sur l'icone de suppression
 * @param {string} workId - L'ID du travail
 * @returns {void}
 */
function deleteWorkOnClick() {
    const deleteIcons = document.querySelectorAll(".fa-trash-can");
    deleteIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const workId = icon.getAttribute("data-id");
            deleteWork(workId);
        });
    });
}

// Mise à jour des galeries après ajout/suppression
function updateGallery () {
    const modaleGallery = document.querySelector(".gallery-modale");
    const portfolioGallery = document.querySelector(".gallery");
    if (submitPhoto === true){
        preventDefault(displayModaleGallery(works));
        preventDefault(displayWorks(works));
        submitPhoto = false;
    };
}

/************ MODALE 2 - Sélection des catégories ************/
// Gestion de la fleche retour
function backTo() {
    const arrowSelector = document.querySelector(".back");
    arrowSelector.addEventListener("click", () => {
       // if
       openModale1();
       openModale2();
    });
   }

// Désactive les éléments si une image est choisie
function hideElementsifPicture() {
    const imgIcone = document.querySelector(".img-icon");
    const btnAddPicture = document.querySelector(".btn-add-picture");
    const pictureFormat = document.querySelector(".picture-format");
    const elementsToHide = [imgIcone, btnAddPicture, pictureFormat];
    elementsToHide.forEach(element => {
        element.style.display = "none";
    });

}

// Création de l'option avec la catégorie
function createOption(categorie) {
    const option = document.createElement("option");
    option.value = categorie.name;
    option.textContent = categorie.name;
    return option;
}

// Affichage des options
function displayOptions(categories) {
    const select = document.querySelector("#category");
    if (!select) return;
    select.innerHTML = "";
    categories.forEach((categorie) => {
        select.appendChild(createOption(categorie));
    });
}

// Vérification du formulaire de la modale2 pour l'ajout d'une image
function checkForm() {
    const form = document.querySelector(".modale-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.querySelector("#title").value;
        const imageUrl = document.querySelector("#imageUrl").value;
        const category = document.querySelector("#category").value;
        if (title && imageUrl && category) {
            submitPhoto = true; 
        }
    });
}
 //************ Gestion de la soumission du formulaire ************/

function submitForm() {
    const form = document.querySelector(".modale-form");
}

// Effacement du formulaire
function emptyTheForm () {
    // Ajouter la condition si le formulaire est soumis avec succès 
    const form = document.querySelector(".modale-form");
    form.reset();
}



