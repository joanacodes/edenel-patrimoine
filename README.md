# Edenel Patrimoine & Gestion — site web

Site vitrine statique (HTML, CSS, JavaScript, sans framework ni build) pour l'agence immobilière Edenel Patrimoine & Gestion, Île-de-France. Prêt pour GitHub Pages.

## Structure

```
index.html              Accueil
biens.html              Liste des biens (filtres vente / location, type, département, tri)
bien.html               Fiche d'un bien (?id=…) générée depuis js/data.js
services.html           Transaction, gestion locative, conseil patrimonial, syndic + FAQ
a-propos.html           L'agence, valeurs, équipe, repères
estimation.html         Formulaire d'estimation avec fourchette indicative
contact.html            Coordonnées, formulaire, recrutement
honoraires.html         Barème des honoraires (affichage obligatoire)
mentions-legales.html   Mentions légales (loi Hoguet, LCEN, médiation)
confidentialite.html    Politique de confidentialité (RGPD)
404.html                Page introuvable (GitHub Pages l'utilise automatiquement)
css/style.css           Styles, animations, responsive
js/data.js              Les biens (à éditer pour ajouter / retirer des annonces)
js/main.js              Navigation, animations, filtres, fiche bien, formulaires
assets/img/             Images (voir PROMPTS-IMAGES.md)
PROMPTS-IMAGES.md       Prompts de génération pour chaque visuel, avec emplacement exact
```

## Publier sur GitHub Pages

1. Créez un dépôt (par ex. `edenel-patrimoine`) et poussez le contenu de ce dossier à la racine.
2. Dans *Settings → Pages*, choisissez *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. Le site est en ligne sous `https://<utilisateur>.github.io/edenel-patrimoine/` en une à deux minutes.
4. Pour un nom de domaine, ajoutez un fichier `CNAME` contenant le domaine et configurez le DNS chez votre registrar.

Tous les liens sont relatifs : le site fonctionne à la racine ou dans un sous-dossier.

## Avant la mise en ligne

- **Mentions légales et pied de page :** remplacez toutes les mentions `[À COMPLÉTER]` (SIREN, capital, siège, carte professionnelle, garant, assureur, médiateur) avec les données du Kbis.
- **Coordonnées :** remplacez `01 00 00 00 00`, `contact@edenel-patrimoine.fr` et l'adresse dans `contact.html`, le menu mobile et le pied de page (chercher « 01 00 00 00 00 » dans tous les fichiers).
- **Honoraires :** le barème de `honoraires.html` est un exemple ; mettez votre barème réel.
- **Équipe et repères :** noms, fonctions et dates dans `a-propos.html` sont fictifs.
- **Chiffres :** les statistiques de l'accueil (`data-count`) sont indicatives.
- **Biens :** éditez `js/data.js`. Chaque bien a un `id` (utilisé dans l'URL), un `statut` (`vente` ou `location`), un prix en euros (mensuel pour la location) et trois images. Retirez la mention « biens fictifs » des mentions légales et du pied de page une fois les vrais biens en place.

## Formulaires

GitHub Pages n'exécute pas de code serveur. Les formulaires fonctionnent en mode démonstration (message de confirmation sans envoi). Pour recevoir les messages :

- **Formspree** (gratuit jusqu'à 50 envois/mois) : créez un formulaire sur formspree.io puis ajoutez `action="https://formspree.io/f/VOTRE_ID" method="POST"` à la balise `<form>` de `contact.html` (et `estimation.html` si souhaité). Le script détecte l'attribut `action` et laisse le navigateur envoyer normalement.
- Alternatives : Netlify Forms (si hébergé sur Netlify), Basin, Getform, ou votre propre back-office.

## Carte

Le visuel de la page contact peut être remplacé par une carte. Exemple avec OpenStreetMap (sans cookie) :

```html
<div class="map"><iframe title="Plan d'accès" src="https://www.openstreetmap.org/export/embed.html?bbox=2.33,48.85,2.35,48.86&layer=mapnik&marker=48.855,2.34" style="border:0;width:100%;height:100%" loading="lazy"></iframe></div>
```

Google Maps fonctionne aussi, mais dépose des cookies : il faudra alors un bandeau de consentement.

## Polices

Marcellus et Manrope sont chargées depuis Google Fonts. Pour éviter tout appel vers Google (RGPD strict), téléchargez les fichiers `.woff2` depuis google-webfonts-helper, placez-les dans `assets/fonts/`, remplacez la balise `<link>` Google Fonts par des règles `@font-face` dans `css/style.css`, et supprimez la phrase correspondante dans `confidentialite.html`.

## Animations

- Séquence d'ouverture de l'accueil : rideau sur l'image, titre qui monte ligne par ligne.
- Révélation des images au défilement, compteurs, en-tête qui se solidifie, menu mobile en plein écran.
- Toutes les animations respectent `prefers-reduced-motion`.

## Licence

Code et textes : propriété d'Edenel Patrimoine & Gestion. Typographies sous licence SIL Open Font License.
