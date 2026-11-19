# The Wizel Wedding — site prêt à héberger

Site statique (HTML/CSS, sans outil de build). Il suffit de déposer le contenu de ce dossier à la racine d'un hébergement (Netlify, Vercel, OVH, GitHub Pages…).

## Structure
- `index.html`, `programme.html`, `hebergement.html`, `rsvp.html` : version ordinateur (maquette 1440 px).
- `m/` : mêmes 4 pages, version iPhone (maquette 390 px).
- `assets/` : toutes les images.
- Chaque page redirige automatiquement vers la bonne version selon la largeur d'écran (< 820 px = mobile). Ajouter `?force` à l'adresse désactive la redirection.
- La mise en page est à largeur fixe puis réduite/agrandie à l'écran (propriété CSS `zoom`) : c'est fidèle à la maquette, mais un développeur peut la rendre pleinement responsive.

## À brancher par un développeur
1. **Envoi du RSVP** : le formulaire de `rsvp.html` et `m/rsvp.html` (`<form class="step2" onsubmit="return false">`) n'envoie encore rien. Retirer `onsubmit`, ajouter `action`/`method`, ou le relier à Formspree, Netlify Forms, etc. Champs : `mairie`, `welcome`, `houppa`, `absent`, `mot`, et le QCM `q1`, `q2`, `q3`.
2. **Le OUI/NON et le QCM** fonctionnent en CSS pur (cases cachées + sélecteurs). Les réponses du QCM ne sont pas corrigées.
3. **Polices** chargées depuis Google Fonts (Instrument Serif, Inter Tight, Anybody) : à héberger soi-même si besoin (RGPD).
4. Ajouter un nom de domaine, le HTTPS et, au besoin, des balises de partage (Open Graph).

## Charte
Rouge `#C03325`, fond écru `#FCF7EC`, encre noire.
