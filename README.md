# CashManager

[![Node.js CI](https://github.com/ArnaudFlaesch/CashManager/actions/workflows/ci.yml/badge.svg)](https://github.com/ArnaudFlaesch/CashManager/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ArnaudFlaesch_CashManager&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ArnaudFlaesch_CashManager)
[![codecov](https://codecov.io/gh/ArnaudFlaesch/CashManager/branch/main/graph/badge.svg?token=9NEN97P2Y1)](https://codecov.io/gh/ArnaudFlaesch/CashManager)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudFlaesch/CashManager/badge.svg)](https://snyk.io/test/github/ArnaudFlaesch/CashManager)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

## Description

L'application a pour but de proposer à un utilisateur de créer un dashboard sur lequel il peut créer plusieurs widgets, comme par exemple un lecteur de flux RSS, un calendrier listant des évènements à partir d'un lien ICal et un affichage de prévisions météorologiques et les répartir sur plusieurs onglets.

Le projet est déployé via Github Pages et accessible à cette addresse : https://arnaudflaesch.github.io/CashManager/.

## Démarrage

- Récupération de l'image Docker de la base de données
  > docker pull postgres:13.2-alpine
- Démarrage de la base de données

  > docker run -p 5432:5432 -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=dash postgres:13.2-alpine

- Récupération de l'image Docker du backend

  > docker pull arnaudf93/dashwebservices:latest

Cette étape permet de récupérer la version équivalente au code présent sur la branche master du projet https://github.com/ArnaudFlaesch/Dash-WebServices. Il est aussi possible de cloner directement ce projet et de le lancer via les sources.

- Démarrage du backend

  > docker run -p 8080:8080 -d -e POSTGRES_URL=jdbc:postgresql://localhost:5432/dash arnaudf93/dashwebservices:latest

- Installation des dépendances

  > npm install

- Démarrage de l'application
  > npm start

L'application est ensuite accessible à l'addresse http://localhost:4200.

## Commandes utiles

> npm run test

Exécute les tests Jest (\*.spec.ts) présents dans le répertoire **src**.

> npm run test:watch

Même chose que la commande précédente, mais les tests seront réexécutés à chaque changement du code pour vérifier que l'application fonctionne toujours correctement.

> npm run cy:open

Lance le dashboard Cypress pour pouvoir exécuter manuellement les tests End-to-End.

> npm run eslint

Affiche la liste des erreurs liées au code Typescript à partir des règles définies dans le fichier **.eslintrc.js**.

> npm run linst:styles

Affiche la liste des erreurs liées au code CSS/Sass à partir des conventions et règles définies dans le fichier **.stylelintrc.json**.

### Coverage

![Coverage](https://codecov.io/gh/ArnaudFlaesch/CashManager/branch/main/graphs/sunburst.svg)
