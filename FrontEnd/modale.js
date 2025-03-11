import { getWorks } from "./works.js";
import { getCategories, regexFilter } from "./buttons.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();
});

/*** Centralisation des sélections DOM ***/
const domElements = {
  btnEdit: document.querySelector(".edit-header"),
  divTitle: document.querySelector(".title-modale"),
  modales: document.querySelector(".modales"),
  modale1: document.querySelector("#modale-1"),
  modale2: document.querySelector("#modale-2"),
  galleryModale: document.querySelector(".gallery-modale"),
  addPhotoForm: document.querySelector(".add-photo-form input[type=file]"),
  imgIcone: document.querySelector(".img-icone"),
  btnAddPicture: document.querySelector(".btn-add-picture"),
  pictureFormat: document.querySelector(".picture-format"),
  categorySelect: document.querySelector("#category"),
  modaleForm: document.querySelector(".modale-form"),
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

export function isUserAuthenticated() {
  return localStorage.getItem("token") !== null;
}

function activeHeaderLinksEdit() {
  if (isUserAuthenticated()) {
    domElements.btnEdit.style.display = "flex";
    const linkModale = document.createElement("a");
    linkModale.classList.add("btn-open-modale");
    linkModale.href = "#";
    linkModale.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>modifier`;
    domElements.divTitle.appendChild(linkModale);
    linkModale.addEventListener("click", (event) => {
      event.preventDefault();
      displayModale(domElements.modale1);
    });
  }
}

function displayModalesSection() {
  domElements.modales.style.display = "flex";
}

function hiddenModalesSection() {
  domElements.modales.style.display = "none";
}

function displayModale(modale) {
  domElements.modales.removeAttribute("aria-hidden");
  modale.removeAttribute("aria-hidden");
  modale.setAttribute("aria-modal", "true");
  modale.style.display = "flex";
  modale.style.opacity = "1";
  modale.style.visibility = "visible";
}

function closeModale(modale) {
  domElements.modales.setAttribute("aria-hidden", "true");
  modale.removeAttribute("aria-modal");
  modale.setAttribute("aria-hidden", "true");
  modale.style.display = "none";
}

function openModalesOnClick() {
  document.addEventListener("click", (event) => {
    if (event.target.closest(".btn-open-modale")) {
      event.preventDefault();
      displayModale(domElements.modale1);
      displayModalesSection(domElements.modales);
    }
    if (event.target.closest(".btn-open-modale2")) {
      event.preventDefault();
      displayModale(domElements.modale2);
      closeModale(domElements.modale1);
    }
  });
}

function closeModalesOnClick() {
  document.addEventListener("click", (event) => {
    if (event.target.closest(".close-modale")) {
      event.preventDefault();
      hiddenModalesSection();
      closeModale(domElements.modales, domElements.modale1, domElements.modale2);
      emptyTheForm();
    }
  });
}

function createModaleGallery(work) {
  return `
    <figure>
      <div class="img-container" data-id="${work.id}">
        <img src="${work.imageUrl}" alt="${work.title}" data-id="${work.id}">
        <i class="fa-sharp fa-solid fa-trash-can" data-id="${work.id}"></i>
      </div>
    </figure>`;
}

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
    await displayModaleGallery();
  } catch (error) {
    console.error(error);
  }
}

function deleteWorkOnClick() {
  document.querySelectorAll(".fa-trash-can").forEach((icon) => {
    icon.addEventListener("click", async () => {
      const workId = icon.getAttribute("data-id");
      await deleteWork(workId);
    });
  });
}

function backToModale1() {
  document.querySelector(".back").addEventListener("click", () => {
    displayModale(domElements.modale1);
    domElements.modale2.style.display = "none";
    emptyTheForm();
  });
}

function emptyTheForm() {
  document
    .querySelectorAll(".data-form input, .add-photo-form input")
    .forEach((input) => (input.value = ""));
}

function previewPicture() {
  domElements.addPhotoForm.addEventListener("change", () => {
    const file = domElements.addPhotoForm.files[0];
    if (file) {
      hideElementsIfPicture();
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.classList.add("img-preview");
        domElements.imgIcone.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
}

function hideElementsIfPicture() {
  [
    domElements.imgIcone,
    domElements.btnAddPicture,
    domElements.pictureFormat,
  ].forEach((element) => (element.style.display = "none"));
}

function createOption(category) {
  return `<option value="${category.name}">${category.name}</option>`;
}

async function displayOptions() {
  let categories = await getCategories();
  if (!domElements.categorySelect) return;
  domElements.categorySelect.innerHTML = categories.map(createOption).join("");
}
