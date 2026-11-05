# CashManager

[![Node.js CI](https://github.com/ArnaudFlaesch/CashManager/actions/workflows/ci.yml/badge.svg)](https://github.com/ArnaudFlaesch/CashManager/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![codecov](https://codecov.io/gh/ArnaudFlaesch/CashManager/branch/main/graph/badge.svg)](https://codecov.io/gh/ArnaudFlaesch/CashManager)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/18204cf77151446889b30a2c21c49d52)](https://app.codacy.com/gh/ArnaudFlaesch/CashManager/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/18204cf77151446889b30a2c21c49d52)](https://app.codacy.com/gh/ArnaudFlaesch/CashManager/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudFlaesch/CashManager/badge.svg)](https://snyk.io/test/github/ArnaudFlaesch/CashManager)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

## Description

L'application permet à un utilisateur de suivre et d'analyser ses dépenses. Il
peut créer des étiquettes (courses, restaurant, ...), saisir ses dépenses en les
associant à une étiquette, puis les consulter :

- mois par mois, avec la liste des dépenses, leur total et leur répartition par
  étiquette ;
- sous forme de graphique montrant le total des dépenses de chaque mois et leur
  moyenne, pour l'ensemble des étiquettes ou pour une seule.

La configuration de l'utilisateur peut être exportée puis réimportée depuis le
menu utilisateur.

Le projet est déployé via Github Pages et accessible à cette
adresse : <https://arnaudflaesch.github.io/CashManager/>.

## Démarrage

- Installation des dépendances

  > npm install

- Démarrage de l'application

  > npm start

L'application est ensuite accessible à l'adresse <http://localhost:4200>.

- Démarrage du backend

Il est nécessaire d'exécuter le backend et sa base de données pour que
l'application fonctionne.
Les sources et le README sont accessibles
ici : <https://github.com/ArnaudFlaesch/Dash-WebServices>.

Pour lancer le frontend sans avoir à utiliser le backend en local, il est
possible d'exécuter la commande :

> npm run start:dev

Cette commande va permettre de se connecter directement au backend déployé sur
Google Cloud Run.

Sinon, il est possible de récupérer le backend via Docker en commençant par sa
base de données :

> docker pull postgres:18.6-alpine3.24
> docker run -p 5432:5432 -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=dash
> postgres:18.6-alpine3.24;

et son image Docker :

> docker pull ghcr.io/arnaudflaesch/dash-webservices:latest

puis de l'exécuter via la commande :

> docker run -p 8080:8080 -d -e POSTGRES_PASSWORD=postgres -e OPENWEATHERMAP_KEY=${OPENWEATHERMAP_KEY}
> -e STRAVA_CLIENT_ID=${STRAVA_CLIENT_ID}
> -e STRAVA_CLIENT_SECRET=${STRAVA_CLIENT_SECRET} -e STEAM_API_KEY=${STEAM_API_KEY}
> -e AIRPARIF_API_TOKEN=${AIRPARIF_API_TOKEN} ghcr.io/arnaudflaesch/dash-webservices:latest

en renseignant les variables d'environnement nécessaires en suivant le README du
backend ici :
<https://github.com/ArnaudFlaesch/Dash-Webservices#d%C3%A9marrage>

## Commandes utiles

> npm test

Exécute les tests unitaires Vitest (\*.spec.ts) présents dans le répertoire
**src**, et les réexécute à chaque changement du code.

> npm run test:coverage

Exécute une seule fois les tests unitaires et génère le rapport de couverture
dans le répertoire **coverage**.

> npm run cy:open

Lance le dashboard Cypress pour pouvoir exécuter manuellement les tests
End-to-End (l'application et le backend doivent être démarrés).

> npm run eslint

Affiche la liste des erreurs liées au code TypeScript et aux templates à partir
des règles définies dans le fichier **eslint.config.mjs**.

> npm run lint:styles

Affiche la liste des erreurs liées au code CSS/Sass à partir des règles
définies dans le fichier **stylelint.config.mjs**.

> npm run code:format

Formate l'ensemble du code avec Prettier.

### Couverture de code

![Coverage](https://codecov.io/gh/ArnaudFlaesch/CashManager/branch/main/graphs/sunburst.svg)
