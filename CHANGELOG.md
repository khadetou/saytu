# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### Ajouté

- Interface utilisateur moderne avec thème sombre professionnel
- Éditeur Markdown avec commandes slash (/) intégrées
- Sélecteur de dates avec localisation française
- Architecture modulaire extensible
- Système d'authentification avec Better-auth
- Module Todo complet avec vues multiples (Tree, Kanban, Form)

### Modifié

- Migration vers Next.js 15.2.3 avec App Router et Turbopack
- Upgrade vers React 19.0.0 avec les dernières fonctionnalités
- Mise à jour Prisma 6.9.0 et NestJS 11 pour de meilleures performances
- Amélioration des performances avec Server Components
- Optimisation du bundle avec code splitting
- Upgrade Tailwind CSS 4.0.8 avec nouvelles fonctionnalités

### Corrigé

- Problèmes de responsive design sur mobile
- Gestion des erreurs dans les formulaires
- Validation des données côté client et serveur

## [0.1.0] - 2025-07-June

### Ajouté

- Configuration initiale du monorepo avec pnpm
- Structure de base avec Next.js, NestJS et Prisma
- Composants UI avec shadcn/ui
- Système de modules de base
- Documentation complète du projet

### Sécurité

- Authentification sécurisée avec JWT
- Validation des entrées utilisateur
- Protection CSRF et XSS
- Chiffrement des données sensibles

---

## Légende des Types de Changements

- **Ajouté** pour les nouvelles fonctionnalités
- **Modifié** pour les changements dans les fonctionnalités existantes
- **Déprécié** pour les fonctionnalités qui seront supprimées prochainement
- **Supprimé** pour les fonctionnalités supprimées
- **Corrigé** pour les corrections de bugs
- **Sécurité** en cas de vulnérabilités
