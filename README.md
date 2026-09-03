# Edenel Patrimoine — site web

Site vitrine de l'agence immobilière Edenel Patrimoine (Île-de-France).
Site statique : HTML, CSS et JavaScript, sans framework ni étape de build.
Hébergé sur GitHub Pages, domaine : https://edenelpatrimoine.fr

## Structure du projet

```
.
├── index.html              Accueil
├── biens.html              Liste des biens (vente / location, filtres)
├── bien.html               Fiche d'un bien (?id=identifiant-du-bien)
├── services.html           Services : transaction, gestion, patrimoine, syndic
├── estimation.html         Demande d'estimation
├── honoraires.html         Barème des honoraires
├── a-propos.html           L'agence et l'équipe
├── contact.html            Contact
├── mentions-legales.html
├── confidentialite.html
├── 404.html
├── CNAME                   Domaine personnalisé GitHub Pages (ne pas supprimer)
├── css/
│   └── style.css           Tous les styles
├── js/
│   ├── data.js             Données des biens (titres, prix, photos, descriptions)
│   └── main.js             Navigation, rendu des biens, galeries, formulaires
└── assets/
    ├── favicon.svg
    └── img/
        ├── biens/          Photos des biens : bien-XX-N.jpg
        └── pages/          Photos des pages (accueil, agence, services, équipe…)
```

## Ajouter ou modifier un bien

Tout se passe dans `js/data.js`. Chaque bien est un objet avec :

- `id` : identifiant utilisé dans l'URL (`bien.html?id=…`), sans accents ni espaces
- `type` : `"vente"` ou `"location"`
- `titre`, `ville`, `quartier`, `prix`, `surface`, `pieces`, `chambres`, `dpe`, etc.
- `images` : liste des photos, dans l'ordre d'affichage. La première est la
  photo de couverture (vignette dans la liste + grande image de la fiche).

## Ajouter des photos

### Biens
Déposer les fichiers dans `assets/img/biens/` en respectant le nommage
`bien-XX-N.jpg` (XX = numéro du bien sur deux chiffres, N = ordre d'affichage),
puis référencer chaque fichier dans le tableau `images` du bien dans `js/data.js`.

Format recommandé : JPG, 3:2, 1600 px de large, qualité ~80 %.

### Pages
Les fichiers de `assets/img/pages/` sont référencés directement dans le HTML.
Emplacements attendus :

| Fichier | Page |
|---|---|
| home-hero.jpg, home-agence.jpg | Accueil |
| about-hero.jpg, about-bureau.jpg, about-equipe.jpg | L'agence |
| team-01.jpg … team-04.jpg | Portraits de l'équipe (portrait 3:4) |
| services-hero.jpg, services-transaction.jpg, services-gestion.jpg, services-patrimoine.jpg, services-syndic.jpg | Services |
| estimation.jpg | Estimation |
| contact-agence.jpg | Contact |
| og-image.jpg | Aperçu lors du partage sur les réseaux sociaux |

## Tester en local

Ouvrir `index.html` dans un navigateur suffit pour la plupart des pages.
Pour que `bien.html?id=…` fonctionne correctement, servir le dossier avec un
petit serveur, par exemple avec l'extension VS Code « Live Server », ou :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Déploiement

Le site est publié automatiquement par GitHub Pages à chaque push sur `main`
(Settings → Pages → Deploy from a branch → main / root).
Le fichier `CNAME` lie le dépôt au domaine edenelpatrimoine.fr.

## À compléter

- Portraits de l'équipe (`team-01.jpg` à `team-04.jpg`)

- Mentions légales : SIRET, carte professionnelle, garantie financière
- Formulaires : brancher un service d'envoi (Formspree, Netlify Forms, etc.)
