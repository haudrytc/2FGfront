# 2F Général — Front (site vitrine)

Site public + espace d'administration de la **Sarl 2F Général** (maçonnerie, Marignane).
React · Vite · TypeScript · TailwindCSS · Framer Motion.

## Aperçu

- 🏠 **Accueil** : hero en parallaxe, animations au scroll, savoir-faire, réalisations, compteurs
- 🧱 **Réalisations** : galerie filtrable par catégorie + page détail avec lightbox
- 👷 **L'équipe** : présentation fun de l'entreprise et de l'équipe
- ✉️ **Contact** : formulaire (anti-spam) + coordonnées
- 🔐 **Admin** (`/admin`) : gestion des réalisations, services, équipe, messages et réglages du site

## Démarrage local

```bash
npm install
npm run dev        # http://localhost:5173
```

> Le backend doit tourner sur `http://localhost:4000` (voir le repo `2FGBack`).
> En dev, Vite proxifie automatiquement `/api` et `/uploads` vers le backend.

Connexion admin : `/admin/login` (identifiants définis dans le seed du backend).

## Configuration

| Variable | Rôle |
|----------|------|
| `VITE_API_URL` | URL de l'API en production (ex: `https://2fg-api.onrender.com`). Vide en dev. |

## Déploiement sur Render

Le fichier `render.yaml` décrit un **site statique** :

1. Render → **New → Static Site** (ou Blueprint) → ce repo.
2. Build : `npm install && npm run build` · Publish : `dist`.
3. Variable `VITE_API_URL` = URL du backend.
4. La règle de réécriture `/* → /index.html` est déjà incluse (SPA).

## Personnalisation rapide

- 🎨 Couleurs et polices : `tailwind.config.js` (accent « clay » ocre/brique).
- 🖼️ Les contenus (textes, photos, équipe, réalisations) se gèrent depuis l'**espace admin**, pas dans le code.
