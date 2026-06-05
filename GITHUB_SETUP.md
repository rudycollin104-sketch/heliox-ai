# 🚀 Heliox AI - Configuration GitHub Actions

## Instructions pour Compiler l'APK via GitHub

### 1️⃣ Créez un Repository GitHub

1. Allez sur **https://github.com/new**
2. Remplissez :
   - **Repository name** : `heliox-ai`
   - **Description** : `Heliox AI - 25+ AI Tools Mobile App`
   - **Visibility** : Public (ou Private)
3. Cliquez sur **"Create repository"**

### 2️⃣ Uploadez le Code

#### Option A : Via Git CLI (Recommandé)
```bash
cd heliox-ai
git init
git add .
git commit -m "Initial commit: Heliox AI application"
git branch -M main
git remote add origin https://github.com/rudycollin104-croquis/heliox-ai.git
git push -u origin main
```

#### Option B : Via GitHub Web Interface
1. Cliquez sur **"uploading an existing file"**
2. Décompressez le ZIP et uploadez tous les fichiers
3. Commitez les changements

### 3️⃣ Configurez le Secret EXPO_TOKEN

1. Allez dans votre repository
2. Cliquez sur **Settings** (en haut)
3. Dans le menu de gauche, cliquez sur **Secrets and variables → Actions**
4. Cliquez sur **"New repository secret"**
5. Remplissez :
   - **Name** : `EXPO_TOKEN`
   - **Secret** : `BaWJzLq__zlGQCHi8iJ32kc14YVDEDZZdusMfJqA`
6. Cliquez sur **"Add secret"**

### 4️⃣ Lancez la Compilation

1. Allez dans l'onglet **"Actions"** de votre repository
2. Cliquez sur **"Build APK with EAS"** dans le menu de gauche
3. Cliquez sur **"Run workflow"** → **"Run workflow"**
4. Attendez 15-20 minutes que la compilation se termine

### 5️⃣ Téléchargez l'APK

1. Quand la compilation est terminée, cliquez sur le workflow
2. Allez dans **"Artifacts"** en bas
3. Téléchargez **"heliox-ai-apk"**
4. Extrayez le fichier `.apk`

### 6️⃣ Installez sur votre Téléphone

1. Transférez le fichier `.apk` sur votre téléphone Android
2. Ouvrez le fichier
3. Acceptez l'installation
4. Lancez **Heliox AI** ! 🎉

---

## ✅ Fichiers Inclus

- ✨ Code source complet (TypeScript, React Native, Expo)
- 🤖 25+ outils IA intégrés
- 🔐 Authentification OAuth Manus
- ☁️ Synchronisation cloud PostgreSQL
- 📱 Configuration multi-plateforme
- 🎨 Interface cyberpunk futuriste
- 📊 21+ tests passants
- 0 erreurs TypeScript

---

## 🆘 Troubleshooting

### La compilation échoue
- Vérifiez que le token `EXPO_TOKEN` est correct
- Vérifiez que le repository est public (EAS a besoin d'accès)
- Attendez quelques minutes et réessayez

### L'APK n'apparaît pas dans Artifacts
- La compilation peut prendre 20-30 minutes
- Vérifiez l'onglet "Actions" pour voir la progression
- Cliquez sur le workflow pour voir les logs

### L'APK ne s'installe pas
- Vérifiez que votre téléphone autorise l'installation d'applications non-store
- Allez dans Paramètres → Sécurité → Sources inconnues
- Réessayez l'installation

---

**Besoin d'aide ?** Consultez : https://docs.expo.dev/build/

