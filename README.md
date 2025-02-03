# Projet Api

## Présentation

Ce projet contient un frontend en Nuxt et un backend en Fastify avec Prisma.  
Auteur : Rakotovelo Sandarisoa  
Base de donnée : SQLite  
ORM utilisé : Prisma

## Pré-requis

- Node.js (version x.x.x)
- npm ou yarn

## Installation

1. Cloner le dépôt :
   ```
   git clone
   ```
2. Installer les dépendances pour chaque partie :
   ```
   cd frontend
   npm install
   ```
   ```
   cd backend
   npm install
   ```

## Configuration de Prisma

1. Générer le client Prisma :
   ```
   cd backend
   npx prisma generate
   ```

### Variables requises

Assurez-vous que les variables d'environnement suivantes sont configurées :  

    ```
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    JWT_SECRET=
    NODE_ENV=development
    ```

## Lancement

- Pour lancer le frontend :
  ```
  cd frontend
  npm run dev
  ```
- Pour lancer le backend :
  ```
  cd backend
  npm run dev
  ```
  Le serveur écoute sur `http://localhost:3000/` et l'interface frontend sur `http://localhost:3001/`.

## Environnement

# Fastify API - Documentation des Routes

## Introduction

Cette API est construite avec [Fastify](https://www.fastify.io/) et propose des fonctionnalités d'authentification via Google et GitHub OAuth, ainsi que la gestion des utilisateurs et des annonces.

## Table des Matières

- [Authentification](#authentification)
- [Utilisateurs](#utilisateurs)
- [Annonces](#annonces)

## Authentification

### 1. Connexion avec identifiants

**Endpoint**: `POST /api/auth/login`

**Description**: Permet aux utilisateurs de se connecter via email et mot de passe.

**Corps de la requête**:

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Réponses**:

- `201 Created` : Authentification réussie, renvoie un JWT dans un cookie.
- `400 Bad Request` : Champs manquants.
- `401 Unauthorized` : Email ou mot de passe incorrect.
- `500 Internal Server Error` : Erreur interne.

### 2. Connexion via Google OAuth

**Endpoint**: `GET /api/auth/google`

**Description**: Redirige l'utilisateur vers la page de connexion Google.

**Callback**: `GET /api/auth/google/callback`

**Réponses**:

- `302 Found` : Redirection vers la page d'authentification.
- `500 Internal Server Error` : Erreur de connexion.

### 3. Connexion via GitHub OAuth

**Endpoint**: `GET /api/auth/github`

**Description**: Redirige l'utilisateur vers la page de connexion GitHub.

**Callback**: `GET /api/auth/github/callback`

**Réponses**:

- `302 Found` : Redirection vers la page d'authentification.
- `500 Internal Server Error` : Erreur de connexion.

---

## Utilisateurs

### 1. Inscription d'un utilisateur

**Endpoint**: `POST /api/register`

**Description**: Permet à un utilisateur de créer un compte.

**Corps de la requête**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Réponses**:

- `201 Created` : Utilisateur créé avec succès.
- `400 Bad Request` : Champs obligatoires manquants.
- `500 Internal Server Error` : Erreur interne.

---

## Annonces

### 1. Publier une annonce

**Endpoint**: `POST /api/ads/publish`

**Description**: Permet à un utilisateur authentifié de publier une annonce.

**Headers**:

```
Authorization: Bearer <JWT>
```

**Corps de la requête**:

```json
{
  "title": "Vente de voiture",
  "description": "Voiture en très bon état, faible kilométrage.",
  "image": "image_url"
}
```

**Réponses**:

- `201 Created` : Annonce publiée avec succès.
- `400 Bad Request` : Champs requis manquants.
- `401 Unauthorized` : Utilisateur non authentifié.
- `500 Internal Server Error` : Erreur interne.

### 2. Modifier une annonce

**Endpoint**: `PUT /api/ads/edit/:id`

**Description**: Permet à un utilisateur authentifié de modifier son annonce.

**Headers**:

```
Authorization: Bearer <JWT>
```

**Corps de la requête**:

```json
{
  "title": "Vente de voiture d'occasion",
  "description": "Voiture en excellent état, faible kilométrage.",
  "imageUrl": "updated_image_url"
}
```

**Réponses**:

- `200 OK` : Annonce modifiée avec succès.
- `400 Bad Request` : Champs requis manquants.
- `401 Unauthorized` : Utilisateur non authentifié.
- `403 Forbidden` : Modification non autorisée.
- `404 Not Found` : Annonce non trouvée.
- `500 Internal Server Error` : Erreur interne.

### 3. Supprimer une annonce

**Endpoint**: `DELETE /api/ads/delete/:id`

**Description**: Permet à un utilisateur authentifié de supprimer son annonce.

**Headers**:

```
Authorization: Bearer <JWT>
```

**Réponses**:

- `200 OK` : Annonce supprimée avec succès.
- `401 Unauthorized` : Utilisateur non authentifié.
- `403 Forbidden` : Suppression non autorisée.
- `404 Not Found` : Annonce non trouvée.
- `500 Internal Server Error` : Erreur interne.

### 4. Lister toutes les annonces

**Endpoint**: `GET /api/ads/list`

**Description**: Retourne la liste des annonces disponibles.

**Réponses**:

- `200 OK` : Liste des annonces.
- `500 Internal Server Error` : Erreur interne.

### 5. Détails d'une annonce

**Endpoint**: `GET /api/ads/details/:id`

**Description**: Retourne les détails d'une annonce spécifique.

**Réponses**:

- `200 OK` : Détails de l'annonce.
- `404 Not Found` : Annonce non trouvée.
- `500 Internal Server Error` : Erreur interne.

---

## Sécurité

L'API utilise les éléments suivants pour sécuriser les requêtes :

- **JWT (JSON Web Token)** pour l'authentification.
- **Cookies sécurisés** (`httpOnly`, `sameSite=strict`, `secure` en production).
- **Protection CSRF** via le paramètre `sameSite` des cookies.
- **Limitation de requêtes** avec `@fastify/rate-limit`.
- **Mise en cache** pour optimiser les performances.

---
