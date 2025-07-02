// FrontEnd/js/api.js
export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://portfolio-architecte-sophie-bluel-cx5e.onrender.com'; // URL de votre API Render

/**
 * Récupère tous les works
 * @returns {Promise<Array>}
 */
export async function getWorksAPI() {
  const res = await fetch(`${API_URL}/api/works`);
  if (!res.ok) throw new Error('Impossible de récupérer les works');
  return res.json();
}

/**
 * Récupère toutes les catégories
 * @returns {Promise<Array>}
 */
export async function getCategoriesAPI() {
  const res = await fetch(`${API_URL}/api/categories`);
  if (!res.ok) throw new Error('Impossible de récupérer les catégories');
  return res.json();
}

/**
 * Authentifie un utilisateur
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Erreur d’authentification');
  }
  return res.json();
}

/**
 * Supprime un work
 * @param {number|string} id
 */
export async function deleteWorkAPI(id) {
  const res = await fetch(`${API_URL}/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error('Échec de la suppression');
  return res.json();
}

/**
 * Crée un nouveau work via FormData
 * @param {FormData} formData
 */
export async function createWorkAPI(formData) {
  const res = await fetch(`${API_URL}/api/works`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  if (!res.ok) throw new Error('Échec de la création');
  return res.json();
}