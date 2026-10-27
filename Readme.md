# La Pince — Front

> Application web gratuite de gestion de budget personnel, pensée pour celles et ceux qui ne sont pas experts en finance.

🌐 **Démo en ligne : [lapince.belema.uk](https://lapince.belema.uk)**
⚙️ API : [LemOclock/lapinceisback](https://github.com/LemOclock/lapinceisback)

Ce dépôt contient l'**interface web** de La Pince, une application React monopage.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Pages](#pages)
- [Structure du projet](#structure-du-projet)
- [Installation en local](#installation-en-local)
- [Production](#production)
- [Équipe](#équipe)

## Fonctionnalités

- **Inscription et connexion**, avec avertissement quand la session est sur le point d'expirer.
- **Configuration du compte** bancaire : banque, devise, solde initial.
- **Tableau de bord** : solde courant, graphiques de répartition des dépenses et calendrier des opérations.
- **Gestion des opérations** : ajout, modification et suppression de revenus et de dépenses, vue calendrier.
- **Budgets mensuels par catégorie**, avec barres de progression.
- **Alertes** sur le tableau de bord quand un budget dépasse 50 %, 80 % puis 100 %.
- **Profil** : modification des informations et du mot de passe, suppression du compte.
- Interface **responsive** avec menu burger sur mobile.

## Stack technique

| Domaine | Outils |
|---|---|
| Interface | React 19, React Router 7 |
| Build | Parcel 2, Sass |
| Requêtes HTTP | Axios |
| Graphiques | Chart.js, react-chartjs-2 |
| Calendrier | react-big-calendar, Moment |
| Production | Nginx (image Docker), derrière Cloudflare Tunnel |

## Pages

| Route | Page | Connexion requise |
|---|---|---|
| `/` | Accueil | |
| `/login` | Connexion / inscription | |
| `/about` | À propos | |
| `/contact` | Contact | |
| `/legal` | Conditions générales d'utilisation | |
| `/config` | Configuration du compte bancaire | ✅ |
| `/dashboard` | Tableau de bord | ✅ |
| `/account` | Gestion des opérations | ✅ |
| `/budget` | Budgets | ✅ |
| `/profile` | Profil | ✅ |

Les pages protégées redirigent vers `/login` si l'utilisateur n'est pas connecté.

## Structure du projet

```
lapinceisfront/
├── index.html            # Point d'entrée Parcel
├── src/
│   ├── index.js          # Montage de l'application React
│   ├── global.scss       # Styles globaux
│   ├── api/              # Appels à l'API (Axios) : auth, compte, budgets, opérations, profil
│   ├── pages/            # Une page par dossier (jsx + scss) et app.jsx (routes)
│   └── components/       # Navbar, footer, graphiques, barres de progression, alertes…
├── static/               # Fichiers copiés tels quels dans le build
├── nginx.conf            # Configuration Nginx de production
└── Dockerfile            # Build Parcel puis image Nginx
```

## Installation en local

Prérequis : Node.js ≥ 20 et l'[API](https://github.com/LemOclock/lapinceisback) lancée en local.

```bash
git clone https://github.com/LemOclock/lapinceisfront.git
cd lapinceisfront
npm install
cp .env.exemple .env
npm start              # http://localhost:1234
```

Si l'API tourne sur `http://localhost:3000`, mettre dans le `.env` du front :

```
API_URL=http://localhost:3000
```

et dans le `.env` de l'API : `CORS_ORIGIN=http://localhost:1234`.

| Script | Rôle |
|---|---|
| `npm start` | Serveur de développement avec rechargement automatique |
| `npm run build` | Build de production dans `dist/` |

## Production

Le build (`dist/`) est un site statique servi par **Nginx**, défini par le `Dockerfile` et `nginx.conf`. Nginx :

- renvoie `index.html` pour toutes les routes inconnues (application monopage) ;
- redirige `/api/*` vers l'API, ce qui place le site et l'API sur le même domaine (pas de CORS) ;
- ajoute les en-têtes de sécurité (CSP, HSTS, X-Frame-Options…) et met en cache les fichiers versionnés.

Le déploiement complet (base de données, API et front) se fait avec Docker Compose depuis le dépôt de l'API : voir [deploy/DEPLOY.md](https://github.com/LemOclock/lapinceisback/blob/main/deploy/DEPLOY.md).

## Équipe

Projet de fin de formation réalisé en équipe :

| Rôle | Nom |
|---|---|
| Product Owner | Benoit |
| Scrum Master | Elyes |
| Lead dev back | Isahia |
| Lead dev front | Andy |
