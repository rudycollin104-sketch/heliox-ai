# Heliox AI — TODO

## Setup & Branding
- [x] Générer le logo Heliox AI
- [x] Configurer le thème couleurs (violet/cyan)
- [x] Mettre à jour app.config.ts avec le nom et logo
- [x] Configurer tailwind.config.js avec les couleurs Heliox

## Navigation & Structure
- [x] Configurer la tab bar (Home, Explorer, Favoris, Paramètres)
- [x] Créer les icônes dans icon-symbol.tsx
- [x] Écran Home avec catégories et outils récents
- [x] Écran Explorer avec filtres par catégorie
- [x] Écran Favoris
- [x] Écran Paramètres

## Modules IA — Musique & Audio
- [x] Assistant Rappeur IA
- [x] Compositeur Musical IA
- [x] Générateur de Voix & Doublages IA

## Modules IA — Écriture & Contenu
- [x] Générateur d'Histoires Interactives
- [x] Créateur de Contenus Réseaux Sociaux
- [x] Correcteur Orthographique & Grammatical
- [x] Assistant Juridique IA

## Modules IA — Jeux & Divertissement
- [x] Créateur de Personnages RPG
- [x] Générateur de Mondes & Quêtes RPG
- [x] Créateur de Scénarios Jeux Vidéo
- [x] IA Compagnon Virtuel

## Modules IA — Création Visuelle
- [x] Générateur d'Images IA
- [x] Créateur de Logos & Designs IA

## Modules IA — Productivité & Business
- [x] Assistant de Productivité & Tâches
- [x] Conseiller Financier IA
- [x] Chatbot Service Client IA
- [x] Assistant de Programmation IA

## Modules IA — Apprentissage & Éducation
- [x] Assistant Scolaire IA
- [x] Traducteur Multilingue en Temps Réel
- [x] IA d'Apprentissage des Langues
- [x] Générateur de Quiz & Examens

## Modules IA — Santé & Bien-être
- [x] Coach Sportif IA Personnalisé

## Modules IA — Voyage & Exploration
- [x] IA de Planification de Voyages

## Modules IA — Analyse & Tech
- [x] IA d'Analyse de Données & Statistiques
- [x] IA de Montage Vidéo Automatique

## Infrastructure
- [x] Intégration LLM via server built-in
- [x] Système de favoris (AsyncStorage)
- [x] Historique des conversations (AsyncStorage)
- [x] Interface de chat réutilisable
- [x] Composant de prompt suggestions


## Améliorations v1.1

### Authentification Utilisateur
- [x] Intégrer Manus OAuth pour la connexion
- [x] Créer l'écran de login
- [x] Synchroniser les favoris et historique avec le serveur
- [x] Ajouter un bouton de déconnexion dans Paramètres

### Streaming des Réponses
- [x] Modifier l'endpoint LLM pour supporter le streaming
- [x] Afficher les réponses token par token
- [x] Ajouter un indicateur de streaming visuel
- [x] Implémenter l'arrêt du streaming

### Partage & Export
- [x] Ajouter un bouton de copie pour chaque message
- [x] Créer une fonction d'export en Markdown
- [x] Implémenter le partage via système de partage native
- [x] Ajouter un bouton de téléchargement de conversation


## Améliorations v1.2 — Production Ready

### Optimisations & Polissages
- [x] Composant LoadingIndicator avec animation
- [x] Composant ErrorBoundary pour gestion des erreurs
- [x] Composant Toast pour notifications
- [x] Écran d'accueil amélioré avec statistiques
- [x] Hook useNotifications pour notifications push
- [x] Hook useSearch pour recherche globale
- [x] Page de recherche complète

### Synchronisation Cloud
- [x] Créer les tables PostgreSQL pour les conversations
- [x] Ajouter un endpoint pour sauvegarder les conversations
- [x] Implémenter la synchronisation automatique
- [x] Récupérer l'historique cloud au login

### Recherche & Filtres
- [x] Ajouter une barre de recherche dans l'historique
- [x] Implémenter la recherche par contenu
- [x] Ajouter des filtres par date
- [x] Filtrer par outil utilisé

### Corrections de Bugs
- [x] Icône manquante pour Historique (clock.fill)
- [x] Erreur de provider pour thèmes
- [x] Fonction de partage incompatible


## Améliorations v1.3 — Final Features

### Webhooks & Synchronisation
- [x] Créer les tables webhooks et events
- [x] Implémenter les endpoints de gestion des webhooks
- [x] Ajouter les hooks pour les événements clés
- [x] Tester la synchronisation en temps réel

### Système de Recommandations
- [x] Analyser l'historique d'utilisation
- [x] Créer l'algorithme de scoring des outils
- [x] Ajouter un écran "Recommandé pour vous"
- [x] Tester les recommandations

### Collaboration en Temps Réel
- [x] Créer les tables pour les collaborations
- [x] Implémenter le partage d'accès
- [x] Ajouter les permissions (lecture/écriture)
- [x] Tester la collaboration multi-utilisateurs
