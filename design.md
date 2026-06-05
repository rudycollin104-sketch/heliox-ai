# Heliox AI — Design Document

## Brand Identity
- **App Name**: Heliox AI
- **Tagline**: "Votre univers IA, tout-en-un"
- **Primary Color**: #6C3CE1 (violet profond — évoque l'IA, la créativité, le futurisme)
- **Secondary Color**: #00D4FF (cyan électrique — énergie, technologie)
- **Accent**: #FF6B6B (corail — chaleur, créativité)
- **Background Dark**: #0D0D1A (quasi-noir bleuté)
- **Background Light**: #F4F2FF (lavande très clair)
- **Surface Dark**: #1A1A2E
- **Surface Light**: #FFFFFF

---

## Screen List

1. **Splash / Onboarding** — Animation logo + 3 slides d'intro
2. **Home** — Grille de catégories + outils récents + barre de recherche
3. **Explore** — Tous les outils IA filtrables par catégorie
4. **Tool Detail / Chat** — Interface de chat IA pour chaque outil
5. **Favorites** — Outils favoris de l'utilisateur
6. **Settings** — Thème, langue, historique, préférences

---

## Categories & Tools

### 🎵 Musique & Audio
- Assistant Rappeur IA
- Compositeur Musical IA
- Générateur de Voix & Doublages IA

### ✍️ Écriture & Contenu
- Générateur d'Histoires Interactives
- Créateur de Contenus Réseaux Sociaux
- Correcteur Orthographique & Grammatical
- Assistant Juridique IA

### 🎮 Jeux & Divertissement
- Créateur de Personnages RPG
- Générateur de Mondes & Quêtes RPG
- Créateur de Scénarios Jeux Vidéo
- IA Compagnon Virtuel

### 🎨 Création Visuelle
- Générateur d'Images IA
- Créateur de Logos & Designs IA

### 💼 Productivité & Business
- Assistant de Productivité & Tâches
- Conseiller Financier IA
- Chatbot Service Client IA
- Assistant de Programmation IA

### 📚 Apprentissage & Éducation
- Assistant Scolaire IA
- Traducteur Multilingue en Temps Réel
- IA d'Apprentissage des Langues
- Générateur de Quiz & Examens

### 🏃 Santé & Bien-être
- Coach Sportif IA Personnalisé

### 🌍 Voyage & Exploration
- IA de Planification de Voyages

### 📊 Analyse & Tech
- IA d'Analyse de Données & Statistiques
- IA de Montage Vidéo Automatique
- Assistant de Programmation IA

---

## Key User Flows

### Flow 1 — Utiliser un outil IA
Home → Tap catégorie → Liste d'outils → Tap outil → Écran chat → Saisir prompt → Réponse IA → Copier/Partager

### Flow 2 — Rechercher un outil
Home → Barre de recherche → Résultats filtrés → Tap outil → Chat

### Flow 3 — Favoris
Outil → Tap ♥ → Onglet Favoris → Liste des favoris

### Flow 4 — Historique
Settings → Historique → Liste des conversations → Tap → Revoir conversation

---

## Layout Principles
- **Bottom Tab Bar**: Home | Explorer | Favoris | Paramètres
- **Cards**: Glassmorphism avec gradient subtil
- **Typography**: Inter / SF Pro — bold pour titres, regular pour corps
- **Icons**: SF Symbols (iOS) / Material Icons (Android)
- **Animations**: Fade + slide doux (200-300ms)
- **Dark Mode First**: Design pensé dark, adapté light

---

## Color Palette

| Token | Light | Dark |
|-------|-------|------|
| primary | #6C3CE1 | #8B5CF6 |
| background | #F4F2FF | #0D0D1A |
| surface | #FFFFFF | #1A1A2E |
| foreground | #1A1A2E | #F0EEFF |
| muted | #7C7C9A | #9B9BB8 |
| border | #E0DCFF | #2A2A4A |
| accent | #00D4FF | #00D4FF |
| success | #22C55E | #4ADE80 |
| warning | #F59E0B | #FBBF24 |
| error | #EF4444 | #F87171 |
