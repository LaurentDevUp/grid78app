# 🚁 Drone Team App

Application de gestion pour équipe de pompiers télépilotes de drones.

## 🚀 Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI Components**: shadcn/ui
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS avec thème personnalisé pompiers

## 📋 Prérequis

- Node.js 20+ et npm
- Compte Supabase (gratuit)

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter le script `SUPABASE_SETUP.sql` dans l'éditeur SQL Supabase
3. Créer les storage buckets:
   - `avatars` (private)
   - `documents` (private)
   - `certificates` (private)

### 3. Variables d'environnement

Copier `.env.local.example` vers `.env.local` et remplir:

```bash
cp .env.local.example .env.local
```

Puis éditer `.env.local` avec vos clés Supabase (Project Settings > API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js App Router
│   ├── auth/              # Authentification (login, signup)
│   ├── dashboard/         # Page d'accueil avec calendrier
│   ├── profile/           # Gestion profils
│   ├── planning/          # Planning individuel
│   ├── missions/          # Gestion missions et vols
│   ├── formations/        # Formations et certifications
│   └── security/          # Consignes sécurité aérienne
├── components/
│   ├── ui/                # Composants shadcn/ui
│   ├── layout/            # Navigation, sidebar, header
│   └── shared/            # Composants réutilisables
├── lib/
│   ├── supabase/          # Config Supabase client
│   ├── hooks/             # Hooks React personnalisés
│   └── utils/             # Fonctions utilitaires
└── types/                 # Types TypeScript
```

## 🎯 Fonctionnalités

✅ Authentification sécurisée (email/password)
✅ Dashboard avec calendrier d'équipe temps réel
✅ Gestion profils utilisateurs avec avatars
✅ Planning individuel synchronisé avec calendrier commun
✅ Suivi missions et journal de vols
✅ Gestion formations et certifications
✅ Consignes de sécurité aérienne
✅ Interface responsive (PC + Mobile)
✅ Temps réel avec Supabase Realtime

## 👥 Rôles Utilisateurs

- **Pilot**: Télépilote (accès lecture, création disponibilités et vols)
- **Chief**: Chef d'unité (accès complet, gestion missions, validations)

## 🔒 Sécurité

- Row Level Security (RLS) Supabase activé sur toutes les tables
- Authentification JWT
- Protection des routes côté client et serveur
- Validation des données avec Zod

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev         # Démarrer serveur développement
npm run build       # Build production
npm run start       # Lancer serveur production

# Qualité de code
npm run lint        # Linter le code
npm run format      # Formatter avec Prettier
npm run type-check  # Vérifier types TypeScript

# Tests
npm run test        # Tests unitaires (Jest)
npm run test:watch  # Tests en mode watch
npm run test:e2e    # Tests E2E (Playwright)
npm run test:coverage # Coverage report
```

## 🚀 Déploiement

### Déploiement Vercel (Recommandé)

1. **Installation Vercel CLI**
```bash
npm install -g vercel
```

2. **Déployer le projet**
```bash
vercel
```

3. **Configurer les variables d'environnement**

Dans Vercel Dashboard > Project Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

4. **Domaine personnalisé** (optionnel)

Vercel Dashboard > Domains > Add Domain

5. **Build Settings**

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Monitoring

- **Vercel Analytics**: Auto-activé sur projets Vercel
- **Supabase Logs**: Dashboard > Logs pour monitoring base de données
- **Error Tracking**: Optionnel avec Sentry

### Performance

- Build optimisé avec Next.js 14
- Cache statique agressif
- Images optimisées
- Code splitting automatique

## 📚 Documentation

### Guides Principaux

- [Stratégie de développement](STRATEGY.md)
- [Prompts Windsurf.ai](PROMPTS.md)
- [Script SQL Supabase](SUPABASE_SETUP.sql)
- [Guide d'optimisation](OPTIMIZATION_GUIDE.md)

### Documentation par PROMPT

- [PROMPT 6 - Profils & Avatars](PROMPT6_COMPLETE.md)
- [PROMPT 7 - Planning Individuel](PROMPT7_COMPLETE.md)
- [PROMPT 8 - Gestion Missions](PROMPT8_COMPLETE.md)
- [PROMPT 9 - Formations & Certifications](PROMPT9_COMPLETE.md)
- [PROMPT 10 - Sécurité Aérienne](PROMPT10_COMPLETE.md)
- [PROMPT 11 - Realtime & Optimizations](PROMPT11_COMPLETE.md)

### Guides de Tests

- Jest config: `jest.config.js`
- Playwright config: `playwright.config.ts`
- Tests unitaires: `src/**/__tests__/`
- Tests E2E: `tests/e2e/`

## 🤝 Contribution

Pour contribuer:

1. Suivre les prompts dans `PROMPTS.md`
2. Respecter la structure et conventions de code
3. Tester avant de commit

## 📄 Licence

MIT - Usage interne équipe pompiers
