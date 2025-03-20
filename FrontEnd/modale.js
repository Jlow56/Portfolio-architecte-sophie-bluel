import { displayWorks, getWorks } from "./works.js";
import { getCategories } from "./buttons.js";

document.addEventListener("DOMContentLoaded", async function() {
  initializeApp();
});

/*** Centralisation des sélections DOM ***/
/**
 * @description Contient les éléments DOM utilisés dans le script modale.js
 * @property {HTMLElement} btnOpenModale1 - Bouton pour ouvrir la première modale
 * @property {HTMLElement} btnEdit - Div contenant le lien d'édition dans le header pour ouvrir la modale créée en JavaScript
 * @property {HTMLElement} divTitle - Div contenant le lien d'édition avec le titre h2 "mes projets" pour ouvrir la modale créée en JavaScript
 * @property {HTMLElement} modales - Section contenant les modales
 * @property {HTMLElement} modale1 - Élément aside de la première modale
 * @property {HTMLElement} galleryModale - Galerie photo de la première modale
 * @property {HTMLElement} modale2 - Élément aside de la deuxième modale
 * @property {HTMLElement} imgIcone - Icône image lorsqu'une image n'est pas choisie dans la deuxième modale
 * @property {HTMLElement} pictureFormat - Paragraphe indiquant le format de la photo dans la deuxième modale
 * @property {HTMLElement} imgPrewiew - Image de prévisualisation dans la deuxième modale
 * @property {HTMLElement} divPhotoContainer - Div contenant la photo en prévisualisation dans la deuxième modale
 * @property {HTMLElement} addPhotoForm - Formulaire pour ajouter une photo dans la deuxième modale
 * @property {HTMLElement} inputPhotoFile - Input file pour ajouter une photo dans la deuxième modale
 * @property {HTMLElement} labelFile - Label pour ajouter une photo dans la deuxième modale
 * @property {HTMLElement} modaleForm - Div contenant le deuxième formulaire dans la deuxième modale
 * @property {HTMLElement} dataForm - Deuxième formulaire dans la deuxième modale
 * @property {HTMLElement} titleInput - Input pour le titre dans la deuxième modale
 * @property {HTMLElement} categorySelect - Select pour la catégorie dans la deuxième modale
 * @property {HTMLElement} submitModalBtn - Bouton de soumission du formulaire dans la deuxième modale
 */
const domElements = {
  /*** Boutons ouvrir modales1 ***/
  btnOpenModale1: document.querySelector(".btn-open-modale1"), /*bouton ouvrir modale 1*/
  // ***Header***//
  btnEdit: document.querySelector(".edit-header"), /*div contenant le lien d'édition dans le header  pour ouvrir la modale créé en js*/
  // ***Main Portfolio***//
  divTitle: document.querySelector(".title-modale"), /* div contenant le lien  d'édition avec le titre h2 mes projets pour ouvrir la modale créé en js*/
  /*** Section des modales */
  modales: document.querySelector(".modales"), /*section contenant les modales*/
  // ***Modale-1 ***//
  modale1: document.getElementById("modale-1"), /* aside modale 1 */
  galleryModale: document.querySelector(".gallery-modale"), /* galerie pphoto de la modale 1 */

  // ***Modale-2 ***//
  modale2: document.getElementById("modale-2"), /* aside modale 2 */
  imgIcone: document.querySelector(".img-icone"), /*icone image lorsqu'une image n'est pas choisie modale 2*/
  pictureFormat: document.querySelector(".picture-format"), /*paragraph format de la photo modale 2*/
  imgPrewiew: document.querySelector(".img-preview"), /*image preview modale 2*/
  /* -Divs modale 2- */
  divPhotoContainer: document.querySelector(".photo-container"), /* div qui contient la photo en prewiew de la modale 2*/ 
  /* -Form modale 2- */
  // form1
  addPhotoForm: document.querySelector(".add-photo-form"), /*form ajouter une photo modale 2*/
  inputPhotoFile: document.getElementById("file"), /* input file modale 2  ajouter une photo */
  labelFile: document.querySelector(".label-file"), /* label ajouter une photo modale 2*/
  // form2
  modaleForm: document.querySelector(".modale-form-container"), /*div qui contient le 2ème form modale 2*/
  dataForm: document.querySelector(".data-form"), /*form modale 2*/ 
  titleInput: document.querySelector("#title"), /*input title modale 2*/
  categorySelect: document.querySelector("#category"),  /*select modale 2*/
  submitModalBtn: document.querySelector(".btn-submit-modal-form"), /*bouton submit modale 2*/

};

/**
 * @description Initialisation de l'application
 * @returns {void}
 */
async function initializeApp() {
  let works = await getWorks();
  let categories = await getCategories();
  displayModaleGallery(works);
  displayOptions(categories);
  activeHeaderLinksEdit();
  openModalesOnClick();
  closeModalesOnClick();
  deleteWorkOnClick();
  backToModale1();
  previewPicture();
  updateSubmitButton();
  submitForm();
  
}

/**
 *  @description Fonction qui permet de savoir si l'utilisateur est connecté si le token est present token dans localStorage
 *  @returns {boolean}
 */
export function isUserAuthenticated() {
  return localStorage.getItem("token") !== null;
}

/************ Activer/Créer les liens d'édition si l'utilisateur est connecté via token dans localStorage ************/
/***
 * @description Activer/Créer les liens d'édition si l'utilisateur n'est pas connecté les cacher si l'utilisateur n'est pas connecté, si l'utilisateur est connecté, le lien d'édition est créé et ajouté au DOM en utilisant display: flex 
 * @returns {void}
 */
function activeHeaderLinksEdit() {
  if (isUserAuthenticated()) {
    domElements.btnEdit.style.display = "flex";
    const linkModale = document.createElement("a");
    linkModale.classList.add("btn-open-modale1");
    linkModale.href = "#";
    linkModale.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>modifier`;
    domElements.divTitle.appendChild(linkModale);
    linkModale.addEventListener("click", (event) => {
      event.preventDefault();
      displayModale(domElements.modale1);
    });
  }
}

/************   Afficher/Masquer les modals  ************/
/**
 * @description Activer la section des modals en utilisant display: flex
 * @returns {void}
 */
function displayModalesSection() {
  domElements.modales.style.display = "flex";
}

/***
 * @description Afficher les modals en utilisant display: flex et aria-modal 
 * @param {HTMLElement} modale - La modale à afficher
 * @returns {void}
 */
function displayModale(modale) {
  modale.style.display = "flex";
  modale.removeAttribute("inert"); // Active la modale
  modale.setAttribute("aria-modal", "true");
  modale.focus(); // Déplace le focus sur la modale
}

/***
 * @description Fermer les modals en utilisant display: none et inert includes sert pour savoir si la modale est en display flex si "non" il ferme la section des modales en display none
 * @param {HTMLElement} modale - La modale à fermer
 * @returns {void}
 */
function closeModale(modale) {
  if (!modale) return;

  // Déplacer le focus sur un bouton visible, sinon sur le body
  const focusTarget = domElements.btnOpenModale1 || document.body;
  focusTarget.focus();

  // Désactive la modale
  modale.setAttribute("inert", "true");
  modale.removeAttribute("aria-modal");
  modale.style.display = "none";

  // Vérifie si toutes les modales sont fermées avant de masquer la section
  if (!domElements.modale1.style.display.includes("flex") &&
      !domElements.modale2.style.display.includes("flex")) {
    domElements.modales.style.display = "none";
  }
}

/************* Gestion du clic Ouverture/Fermeture des modals ************/
/***
 * @description à l'évenement click sur les différents liens, ouvrir la modal-1, ouvrir la modal-2
 * @returns {void}
 */
function openModalesOnClick() {
  document.addEventListener("click", (event) => {
    if (event.target.closest(".btn-open-modale1")) {
      event.preventDefault();
      displayModalesSection();
      displayModale(domElements.modale1);

      // Vérifie avant de fermer l'autre modale
      if (domElements.modale2.style.display === "flex") {
        closeModale(domElements.modale2);
      }
    }

    if (event.target.closest(".btn-open-modale2")) {
      event.preventDefault();
      displayModale(domElements.modale2);

      if (domElements.modale1.style.display === "flex") {
        closeModale(domElements.modale1);
      }
    }
  });
}

/**
 * @description Fermer les modales en cliquant sur la croix ou à l'extérieur de la modale ouverte
 * @returns {void}
 */
function closeModalesOnClick() {
  document.addEventListener("click", (event) => {
    if (event.target.closest(".close-modale") || event.target.classList.contains("modale")) {
      event.preventDefault();
      closeModale(domElements.modale1);
      closeModale(domElements.modale2);
      resetForm();
    }
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModale(domElements.modale1);
      closeModale(domElements.modale2);
      resetForm();
    }
  });
}

/************ modal 1  ************/
/**
 * @description Créer un élément HTML pour chaque travail dans la galerie modale
 * @param {Object} work - The work object containing image details
 * @returns {string} - The HTML string for the gallery item
 */
function createModaleGallery(work) {
  return `
    <figure>
      <div class="img-container" data-id="${work.id}">
        <img src="${work.imageUrl}" alt="${work.title}" data-id="${work.id}">
        <i class="fa-sharp fa-solid fa-trash-can" data-id="${work.id}"></i>
      </div>
    </figure>`;
}

/**
 * @description Afficher la galerie modale en récupérant les travaux et en créant les éléments HTML pour chaques travaux  
 * @returns {void}
 */
async function displayModaleGallery() {
  let works = await getWorks();
  if (!domElements.galleryModale) return;
  domElements.galleryModale.innerHTML = works.map(createModaleGallery).join("");
  deleteWorkOnClick();
}

/**
 * @description Supprimer un travail avec la methode DELETE en envoyant le token pour authentifier l'utilisateur  et mettre à jour la galerie modale, afficher un message de confirmation
 * @param {string} workId - L'ID du travail
 * @returns {void}
 */
async function deleteWork(workId) {
  try {
    const response =await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.ok) {
      let works = await getWorks();
      displayModaleGallery();
      displayWorks(works);
      alert("Work deleted successfully");
    };
  } catch (error) {
    console.error(error);
  }
}

/**
 * @description Gestion du clic sur l'icone de suppression, suppression du travail en fonction de son ID et mise à jour de la galerie modale 
 * @param {string} workId - L'ID du travail
 * @returns {void}
 */
function deleteWorkOnClick() {
  document.querySelectorAll(".fa-trash-can").forEach((icon) => {
    icon.addEventListener("click", async () => {
      const workId = icon.getAttribute("data-id");
      await deleteWork(workId);
    });
  });
}

/************ modal 2 ************/
/**
 * @description Au clique sur le bouton back, afficher la modale 1 et vider le formulaire
 * @returns {void}
 */
function backToModale1() {
  document.querySelector(".back").addEventListener("click", () => {
    displayModale(domElements.modale1);
    closeModale(domElements.modale2);
    resetForm();
  });
}

/**
 * @description Fonction pour prévisualiser l'image sélectionnée, vérifier le format et la taille de l'image   
 * @param {string} workId - L'ID du travail
 * @returns {void} 
 */
function previewPicture() {
  domElements.inputPhotoFile.addEventListener("change", () => {
    const file = domElements.inputPhotoFile.files[0];
    
    if (!file) return;

    if (!validateImage(file)) return; // Vérification format et taille
    
    const reader = new FileReader();
    reader.onload = () => {
      domElements.divPhotoContainer.innerHTML = "";
      domElements.divPhotoContainer.style.display = "flex";
      domElements.imgIcone.style.display = "none";
      domElements.addPhotoForm.style.display = "none";
      domElements.pictureFormat.style.display = "none";
      const img = document.createElement("img");
      img.src = reader.result;
      img.classList.add("img-preview");
      domElements.divPhotoContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * @description Vérifie que le fichier est une image valide (JPEG/PNG, < 4 Mo) et affiche un message d'erreur sinon pour l'utilisateur
 * @param {File} file - Le fichier à verifier
 * @returns {boolean} - Retourne `true` si le fichier est valide, sinon `false`. 
 */
function validateImage(file) {
  const maxFileSize = 4 * 1024 * 1024; // 4 Mo
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("Veuillez choisir une image au format JPEG ou PNG.");
    return false;
  }
  if (file.size > maxFileSize) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return false;
  }
  return true;
}

/**
 * @description Récupère les catégories pour les options du formulaire
 * @returns {void}
 */
async function displayOptions() {
  let categories = await getCategories();
  domElements.categorySelect.innerHTML = `<option value="default"></option>` + 
  categories.map(category => `<option value="${category.id}">${category.name}</option>`);
}

/**
 * @description Réinitialise le formulaire de la modale 2 
 * @returns {void}
 */
function resetForm() {
  if (domElements.dataForm) domElements.dataForm.reset();
  if (domElements.addPhotoForm) domElements.addPhotoForm.reset();
  if (domElements.categorySelect) domElements.categorySelect.value = "default";

  if (domElements.imgIcone) {
    domElements.imgIcone.innerHTML = '<i class="fa-solid fa-image"></i>';
    domElements.imgIcone.style.display = "flex";
  }

  if (domElements.divPhotoContainer) domElements.divPhotoContainer.style.display = "none";
  
  if  (domElements.imgPrewiew) {
    domElements.imgPrewiew.remove(); 
    domElements.imgPrewiew.removeAttribute("src");
  }

  if (domElements.addPhotoForm) domElements.addPhotoForm.style.display = "flex";
  if (domElements.pictureFormat) domElements.pictureFormat.style.display = "flex";
}

/**
 * @description Vérifie que le formulaire est correctement remplit pour activer le bouton de soumission
 * @returns {boolean} 
 */
function checkForm() {
  addEventListener("change", updateSubmitButton);
  return (
    domElements.titleInput.value.trim() !== "" && domElements.categorySelect.value !== "default" && domElements.inputPhotoFile.files.length > 0
    );
}

/**
 * @description Créé un objet `FormData` à partir du formulaire pour l'envoi au serveur 
 * @returns {FormData}
 */
function createFormData() {
  const formData = new FormData();
  formData.append("image", domElements.inputPhotoFile.files[0]);
  formData.append("title", domElements.titleInput.value);
  formData.append("category", domElements.categorySelect.value);
  
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  return formData;
}

/**
 * @description Met à jour le bouton de soumission du formulaire avec toggle en fonction de la validité du formulaire 
 * @returns {void}
 */
function updateSubmitButton() {
  const isValid = checkForm();
  domElements.submitModalBtn.disabled = !isValid;
  domElements.submitModalBtn.style.cursor = isValid ? "pointer" : "not-allowed";
  // Ajoute la classe "btn-green-white" si valide, sinon l'enlève
  domElements.submitModalBtn.classList.toggle("btn-green-white", isValid);
  // Ajoute la classe "btn-disabled" si non valide, sinon l'enlève
  domElements.submitModalBtn.classList.toggle("btn-disabled", !isValid);
}

/** 
 * @description Gestion de la soumission du formulaire : envoi des données au serveur, récupération des travaux et affichage de la galerie modale 
 * @param {Event} event - L'événement de soumission du formulaire
 * @returns {void}
 */
async function submitHandler(event) {
  event.preventDefault();
  if (!checkForm()) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  const formData = createFormData();
  try {
    let response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    if (response.ok) {
      let works = await getWorks();
      alert("Work created successfully");
      resetForm();
      await displayModaleGallery();
      displayWorks(works);
    } else {
      alert("Erreur lors de l'envoi du formulaire.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Problème de connexion au serveur.");
  }
}

/**
 * @description Ajoute un écouteur d'événement sur le bouton de soumission du formulaire
 * @returns {void}
 */
async function submitForm() {
  domElements.submitModalBtn.removeEventListener("click", submitHandler);
  domElements.submitModalBtn.addEventListener("click", submitHandler);
}