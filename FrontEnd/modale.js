// FrontEnd/js/modale.js
import { getWorksAPI, deleteWorkAPI, createWorkAPI } from './api.js';
import { displayWorks } from './works.js';
import { getCategoriesAPI } from './api.js';

const dom = {
  btnEdit: document.querySelector(".edit-header"),
  divTitle: document.querySelector(".title-modale"),
  modales: document.querySelector(".modales"),
  modale1: document.getElementById("modale-1"),
  galleryModale: document.querySelector(".gallery-modale"),
  modale2: document.getElementById("modale-2"),
  inputFile: document.getElementById("file"),
  divPhotoContainer: document.querySelector(".photo-container"),
  addPhotoForm: document.querySelector(".add-photo-form"),
  pictureFormat: document.querySelector(".picture-format"),
  categorySelect: document.querySelector("#category"),
  titleInput: document.querySelector("#title"),
  submitBtn: document.querySelector(".btn-submit-modal-form"),
};

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
  if (localStorage.getItem("token")) activateEditing();
  displayModaleGallery();
  setupModals();
  setupForm();
}

function activateEditing() {
  dom.btnEdit.style.display = "flex";
  const link = document.createElement("a");
  link.className = "btn-open-modale1";
  link.href = "#";
  link.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>modifier`;
  dom.divTitle.appendChild(link);
}

async function displayModaleGallery() {
  const works = await getWorksAPI();
  dom.galleryModale.innerHTML = works
    .map(w => `
      <figure>
        <div class="img-container" data-id="${w.id}">
          <img src="${w.imageUrl}" alt="${w.title}">
          <i class="fa-solid fa-trash-can" data-id="${w.id}"></i>
        </div>
      </figure>`)
    .join("");
  attachDeleteHandlers();
}

function attachDeleteHandlers() {
  dom.galleryModale.querySelectorAll(".fa-trash-can").forEach(icon => {
    icon.addEventListener("click", async () => {
      const id = icon.dataset.id;
      try {
        await deleteWorkAPI(id);
        displayModaleGallery();
        displayWorks(await getWorksAPI());
      } catch (e) {
        console.error(e);
      }
    });
  });
}

function setupModals() {
  document.addEventListener("click", e => {
    if (e.target.closest(".btn-open-modale1")) {
      openModal(dom.modale1);
      closeModal(dom.modale2);
    }
    if (e.target.closest(".btn-open-modale2")) {
      openModal(dom.modale2);
      closeModal(dom.modale1);
    }
    if (e.target.closest(".close-modale") || e.target.classList.contains("modale")) {
      closeModal(dom.modale1);
      closeModal(dom.modale2);
      resetForm();
    }
  });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal(dom.modale1);
      closeModal(dom.modale2);
      resetForm();
    }
  });
}

function openModal(modal) {
  dom.modales.style.display = "flex";
  modal.style.display = "flex";
  modal.removeAttribute("inert");
}

function closeModal(modal) {
  modal.setAttribute("inert", "true");
  modal.style.display = "none";
  if (![...document.querySelectorAll(".modale")].some(m => m.style.display === "flex")) {
    dom.modales.style.display = "none";
  }
}

function setupForm() {
  // preview image
  dom.inputFile.addEventListener("change", () => {
    const file = dom.inputFile.files[0];
    if (!file || !validateImage(file)) return;
    const reader = new FileReader();
    reader.onload = () => {
      dom.divPhotoContainer.innerHTML = `<img src="${reader.result}" class="img-preview">`;
      dom.pictureFormat.style.display = "none";
      dom.addPhotoForm.style.display = "none";
    };
    reader.readAsDataURL(file);
  });

  // fill categories
  getCategoriesAPI().then(cats => {
    dom.categorySelect.innerHTML =
      '<option value="default"></option>' +
      cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  });

  // enable/disable submit
  dom.submitBtn.addEventListener("click", onSubmit);
  document.addEventListener("change", () => {
    const valid = dom.titleInput.value && dom.categorySelect.value !== "default" && dom.inputFile.files.length;
    dom.submitBtn.disabled = !valid;
    dom.submitBtn.classList.toggle("btn-green-white", valid);
  });
}

function validateImage(file) {
  const max = 4 * 1024 * 1024;
  if (!['image/jpeg','image/png'].includes(file.type)) {
    alert("Image JPEG/PNG uniquement.");
    return false;
  }
  if (file.size > max) {
    alert("Max 4 Mo.");
    return false;
  }
  return true;
}

async function onSubmit(e) {
  e.preventDefault();
  if (dom.submitBtn.disabled) return;
  const formData = new FormData();
  formData.append("image", dom.inputFile.files[0]);
  formData.append("title", dom.titleInput.value.trim());
  formData.append("category", dom.categorySelect.value);
  try {
    await createWorkAPI(formData);
    alert("Work créé !");
    resetForm();
    displayModaleGallery();
    displayWorks(await getWorksAPI());
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout.");
  }
}

function resetForm() {
  dom.inputFile.value = "";
  dom.titleInput.value = "";
  dom.categorySelect.value = "default";
  dom.divPhotoContainer.innerHTML = '';
  dom.addPhotoForm.style.display = "flex";
  dom.pictureFormat.style.display = "flex";
}