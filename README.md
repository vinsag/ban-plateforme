# Plateforme Base Adresse Nationale

Ce dépôt regroupe l'essentiel des briques faisant partie de la plateforme Base Adresse Nationale, à savoir :

- les routines d'import ;
- les routines de consolidation ;
- les routines de production des fichiers ;
- un service "worker" réagissant en temps réel à toute modification.

## Installer un environnement de développement

### Pré-requis

- Node.js 16 ou supérieur
- MongoDB 4 ou supérieur
- Redis
- yarn ou npm

### Configuration

Pour mettre en place un environnement fonctionnel, vous pouvez partir du fichier `.env.sample` et le copier en le renommant `.env`.

Compte-tenu de la puissance de calcul nécessaire pour effectuer les traitements sur France entière il est conseillé de restreindre à un seul département pour les développements. Par exemple `DEPARTEMENTS=57`.

### Installation des dépendances

```bash
yarn
```

### Préparation des contours administratifs

```bash
yarn prepare-contours
```
Prepare les contours France entière sans prendre en compte le .env.

### Téléchargement des données nécessaires

```bash
yarn download-datasets
```
Télécharge fantoir.sqlite, gazetteer.sqlite, communes-locaux-adresses.json.

### Import des différentes sources

```bash
yarn import:ign-api-gestion
yarn import:cadastre
yarn import:ftth
```
Prend en compte le .env pour ne télécharger les données que sur le département concerné.

### Consolidation des adresses

```bash
yarn compose
```

### Production des fichiers

```bash
yarn dist
```

## Opérations d’exploitation

### Appliquer la mise à jour de la liste des communes certifiées d'office

```bash
yarn apply-batch-certification
```
