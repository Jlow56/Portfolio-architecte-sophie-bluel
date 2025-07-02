````markdown
# Portfolio Architecte d’Intérieur – Front‑End

## 📋 Description du projet

Dans le cadre de votre mission chez **ArchiWebos**, vous allez développer la partie Front‑End d’un site portfolio pour une architecte d’intérieur. Ce projet a pour objectif de :

- Créer une page web **dynamique** en JavaScript.
- Intégrer une **page de connexion** selon la maquette.
- Développer une **modale d’upload** et gérer la suppression et l’ajout de médias.
- Communiquer avec une API fournie (Node.js/Express).

---

## 🎯 Objectifs pédagogiques

- **DOM & événements** : gestion des interactions et manipulation dynamiques.
- **Fetch & API** : appels GET, POST, DELETE et gestion des réponses.
- **Authentification** : construction et sécurisation du login.
- **Modale multi‑vue** : upload, prévisualisation, séparation Galerie/Ajout.
- **Workflow Git & GitHub** : versionnage et collaboration.

---

## 🧰 Prérequis

- Cours JavaScript (fonctions, DOM, fetch, FormData).
- **Node.js** (≥14.x) et **npm** installés.
- Cloner ce dépôt :
  ```bash
  git clone https://github.com/votre-compte/portfolio-architecte.git
````

---

## ⚙️ Installation

1. **Back‑End**

   ```bash
   cd backend
   npm install
   npm run start  # http://localhost:5678
   ```

   * Doc Swagger : [http://localhost:5678/api-docs](http://localhost:5678/api-docs)

2. **Front‑End**

   ```bash
   cd ../frontend
   npm install
   npm run dev    # http://localhost:5173
   ```

---

## 🚀 Étapes & Critères d’acceptation

### 1. Galerie dynamique

* **Avant** : page d’accueil statique.
* **Après** : galerie fonctionnelle + filtres catégories dynamiques.

### 2. Intégration de la page de connexion

> **Avant de démarrer :**
>
> * Galerie dynamique prête.
>
> **Objectif d’intégration :**
>
> * Intégrer la page de login selon la maquette (HTML/CSS).
>
> **Critère de fin :**
>
> * Page de login visible et conforme à la maquette (non fonctionnelle).
>
> **Recommandations :**
>
> * Vérifier le rendu (polices, espacements, couleurs, boutons).

### 3. Fonctionnalité d’authentification

> **Avant :**
>
> * Formulaire de login intégré.
>
> **Après :**
>
> * Formulaire fonctionnel :
>
>   * POST `/login` avec Fetch.
>   * Stockage du token en `sessionStorage`.
>   * Redirection vers la page d’accueil sur succès.
>   * Message d’erreur en cas d’échec.
>
> **Points de vigilance :**
>
> * Utiliser la bonne méthode HTTP (POST).
> * Gérer l’état de connexion (sessionStorage).
> * Afficher clairement les erreurs.

### 4. Création de la modale d’upload

> **Avant :**
>
> * Authentification fonctionnelle.
>
> **Après :**
>
> * Modale multi‑vue (Galerie / Ajout) :
>
>   * Ouverture au clic sur "Modifier".
>   * Fermeture au clic hors modale ou croix.
>
> **Recommandations :**
>
> * Respecter la structure unique (une seule modale dans le DOM).
> * Intégrer les deux vues au sein d’une même fenêtre.

### 5. Suppression de travaux

> **Avant :**
>
> * Modale d’upload opérationnelle.
>
> **Après :**
>
> * Bouton de suppression sur chaque vignette.
> * DELETE `/works/:id` via Fetch.
> * Mise à jour du DOM sans rechargement.

> **Attention :**
>
> * Consulter Swagger pour la route DELETE.
> * Retirer immédiatement l’élément du DOM après succès.

### 6. Ajout de nouveaux médias

> **Avant :**
>
> * Suppression fonctionnelle.
>
> **Après :**
>
> * Formulaire d’ajout (FormData) :
>
>   * Vérification des champs.
>   * POST `/works` avec média et métadonnées.
>   * Affichage d’un message d’erreur ou de succès.
>   * Nouveau projet visible dans la galerie après rechargement.

> **Recommandations :**
>
> * Utiliser `FormData` pour l’envoi de fichiers.

### 7. Ajout dynamique sans rechargement

> **Avant :**
>
> * API retourne la nouvelle entrée.
>
> **Après :**
>
> * Insertion immédiate du nouveau projet dans la galerie.
> * Mise à jour de la liste d’images dans la modale.

> **Ressource :**
>
> * Chapitre "Créez un nouvel élément dans une page web".

---

## 🗂️ Arborescence

```plaintext
/
├─ backend/
├─ frontend/
│   ├─ index.html
│   ├─ login.html
│   ├─ js/
│   │   ├─ api.js
│   │   ├─ gallery.js
│   │   ├─ auth.js
│   │   └─ modal.js
│   └─ css/styles.css
└─ README.md
```

---

## 📝 Licence

Ce projet est distribué sous la [Licence MIT](LICENSE).

```
```
