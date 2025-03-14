import { getWorks } from "./works.js";
import { getCategories } from "./buttons.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();
});

/*** Centralisation des sélections DOM ***/
const domElements = {
  /*** Boutons ouvrir modales1 ***/
  btnModale1: document.querySelector(".btn-open-modale1"), /*bouton ouvrir modale 1*/
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
  categorySelect: document.querySelector("#category"),  /*select modale 2*/
};

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
}

/**
 *  @description Fonction qui permet de savoir si l'utilisateur est connecté si token dans localStorage
 *  @returns {boolean}
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

/**
 * @description Masquer la section des modals avec display: none
 * @returns {void}
 */
function hiddenModalesSection() {
  domElements.modales.style.display = "none";
}

/***
 * @description Afficher les modals
 * @returns {void}
 */
function displayModale(modale) {
  domElements.modales.removeAttribute("aria-hidden");
  modale.removeAttribute("aria-hidden");
  modale.setAttribute("aria-modal", "true");
  modale.style.display = "flex";
}

/***
 * @description Fermer les modals
 * @returns {void}
 */
function closeModale(modale) {
  domElements.modales.setAttribute("aria-hidden", "true");
  modale.removeAttribute("aria-modal");
  modale.setAttribute("aria-hidden", "true");
  modale.style.display = "none";
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
      closeModale(domElements.modale2); // Ferme la modale 2 si elle était ouverte
    }
    
    if (event.target.closest(".btn-open-modale2")) {
      event.preventDefault();
      displayModale(domElements.modale2);
      closeModale(domElements.modale1); // Ferme la modale 1
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
      closeModale(domElements.modale1, domElements.modale2);
      hiddenModalesSection();
      resetForm();
      
    }
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModale(domElements.modale1, domElements.modale2);
      hiddenModalesSection();
      resetForm()
    }
   
  });
}

/************ modal 1  ************/
/**
 * @description Create a gallery item for the modal
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
 * @description  
 * @returns 
 */
async function displayModaleGallery() {
  let works = await getWorks();
  if (!domElements.galleryModale) return;
  domElements.galleryModale.innerHTML = works.map(createModaleGallery).join("");
  deleteWorkOnClick();
}

async function deleteWork(workId) {
  try {
    await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.ok) {
      displayModaleGallery(works);
      console.log("Work deleted successfully");
    };
  } catch (error) {
    console.error(error);
  }
}

/**
 * Gestion du clic sur l'icone de suppression
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
    emptyTheForm();
    resetForm();
  });
}

/**
 * @description Fonction pour prévisualiser l'image sélectionnée
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
 * Vérifie que le fichier est une image valide (JPEG/PNG, < 4 Mo)
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
 * 
 * @returns 
 */
async function displayOptions() {
  let categories = await getCategories();
  domElements.categorySelect.innerHTML = `<option value="default"></option>` + 
  categories.map(category => `<option value="${category.name}">${category.name}</option>`).join("");
}

/**
 * @description Réinitialise le formulaire
 */
function resetForm() {
  if (domElements.dataForm) domElements.dataForm.reset();
  if (domElements.addPhotoForm) domElements.addPhotoForm.reset();
  if (domElements.categorySelect) domElements.categorySelect.value = "default";
  if (domElements.imgIcone) domElements.imgIcone.innerHTML = '<i class="fa-solid fa-image"></i>';

  if (domElements.divPhotoContainer) domElements.divPhotoContainer.style.display = "none";
  if  (domElements.imgPrewiew) {
    domElements.imgPrewiew.remove();
    domElements.imgPrewiew.removeAttribute("src");
  }
  

  if (domElements.imgIcone) domElements.imgIcone.style.display = "flex";
  if (domElements.addPhotoForm) domElements.addPhotoForm.style.display = "flex";
  if (domElements.pictureFormat) domElements.pictureFormat.style.display = "flex";
}

/**
 *@description Vérifie que le formulaire est correctement rempli
 */
 function checkForm() {
  return domElements.dataForm.title.value.trim() !== "" && domElements.categorySelect.value !== "" && domElements.inputPhotoFile.files.length > 0;
}

function validateForm() {
  if (checkForm()) {
    formData = new FormData();
    formData.append("title", domElements.title.value);
    formData.append("category", domElements.categorySelect.value);
    formData.append("image", domElements.inputPhotoFile.files[0]);
    return true;
  } else {
    alert("Veuillez remplir tous les champs");
    return false;
  }
}

/**
 *@description Créé un objet `FormData` à partir du formulaire
 */
 function createFormData() {
  const formData = new FormData();
  formData.append("title", domElements.dataForm.title.value);
  formData.append("category", domElements.categorySelect.value);
  formData.append("image", domElements.inputPhotoFile.files[0]);
  return formData;
}

function activeModaleBtnSubmit() {
  if (validateForm()) {
    domElements.submitBtn.disabled = false;
  } else {
    domElements.submitBtn.disabled = true;
  }
}

/**
 * Gère la soumission du formulaire
 */
function submitForm() {
  domElements.dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = createFormData();
    
    let response = await fetch(`${url}/works`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Work created successfully");
      resetForm();
      await displayModaleGallery();
    } else {
      alert("Erreur lors de l'envoi du formulaire.");
    }
  });
}
