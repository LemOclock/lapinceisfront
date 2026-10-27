# La Pince — Front

Application React (Parcel) de gestion de budget.

## Installation

```bash
npm install
cp .env.exemple .env   # API_URL : URL de l'API (par défaut /api)
npm start              # serveur de développement
npm run build          # build de production dans dist/
```

En développement, si l'API tourne sur `http://localhost:3000`, mettre dans `.env` :

```
API_URL=http://localhost:3000
```

et dans le `.env` de l'API : `CORS_ORIGIN=http://localhost:1234`.

## Production

Le dossier `dist/` est un site statique. Toutes les routes inconnues doivent renvoyer `index.html`
(application monopage), et `/api/` doit être redirigé vers l'API.
