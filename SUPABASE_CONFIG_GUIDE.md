# 🔐 Guide de Configuration Supabase

## Étape 1 : Créer un Projet Supabase

1. Aller sur https://supabase.com
2. Cliquer sur "New Project"
3. Choisir un nom : **grid78-drone-team**
4. Choisir un mot de passe sécurisé
5. Choisir une région proche (ex: Europe West pour la France)
6. Attendre ~2 minutes que le projet soit créé

## Étape 2 : Exécuter le Script SQL

1. Dans le Dashboard Supabase, aller dans **SQL Editor**
2. Cliquer sur "New Query"
3. Copier tout le contenu du fichier `SUPABASE_SETUP.sql`
4. Coller dans l'éditeur
5. Cliquer sur **Run** (ou Ctrl+Enter)
6. Vérifier qu'il n'y a pas d'erreurs

✅ Cela créera :
- Toutes les tables (profiles, availabilities, missions, flights, etc.)
- Les index de performance
- Les politiques RLS de sécurité
- Les triggers et fonctions
- Les données de test (formations et consignes)

## Étape 3 : Créer les Storage Buckets

Dans **Storage** (menu gauche) :

1. Cliquer sur **New bucket**
2. Créer 3 buckets avec ces paramètres :

### Bucket: avatars
- Name: `avatars`
- Public: ❌ Non (Private)
- File size limit: 2 MB
- Allowed MIME types: `image/*`

### Bucket: documents
- Name: `documents`
- Public: ❌ Non (Private)
- File size limit: 10 MB
- Allowed MIME types: `application/pdf, image/*`

### Bucket: certificates
- Name: `certificates`
- Public: ❌ Non (Private)
- File size limit: 5 MB
- Allowed MIME types: `application/pdf, image/*`

## Étape 4 : Récupérer les Clés API

1. Aller dans **Settings** > **API** (dans le menu)
2. Copier les valeurs suivantes :

### URL du Projet
```
Project URL: https://xxxxxxxxxxxxx.supabase.co
```

### Clé Anon (Public)
```
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

⚠️ **NE JAMAIS PARTAGER** la clé `service_role` !

## Étape 5 : Configurer les Variables d'Environnement

Créer le fichier `.env.local` à la racine du projet :

```bash
# Dans le terminal
cd c:\Users\adm\Documents\appgridnew78
notepad .env.local
```

Coller le contenu suivant et **remplacer** avec vos vraies valeurs :

```env
# Supabase Configuration GRID78
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# Optional: Service Role Key (KEEP SECRET - Never expose to client!)
# SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

**Remplacer** :
- `xxxxxxxxxxxxx` par votre vrai Project ID
- `eyJhbG...` par votre vraie clé anon

### ⚠️ Important

- Le fichier `.env.local` est déjà dans `.gitignore` (ne sera pas commité)
- Ne jamais partager ces clés publiquement
- La clé `anon` est sécurisée par RLS côté Supabase

## Étape 6 : Redémarrer le Serveur

Une fois `.env.local` créé :

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer
npm run dev
```

Le serveur devrait démarrer sans erreurs et pouvoir se connecter à Supabase.

## Étape 7 : Tester la Connexion

### Test Simple

Créer un fichier de test temporaire :

```tsx
// src/app/test-supabase/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('count')
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Connexion Supabase</h1>
      {error ? (
        <p className="text-red-500">Erreur: {error.message}</p>
      ) : (
        <p className="text-green-500">✅ Connexion réussie!</p>
      )}
    </div>
  )
}
```

Visiter : http://localhost:3000/test-supabase

Si vous voyez "✅ Connexion réussie!", tout fonctionne !

## Étape 8 : Créer un Premier Utilisateur

### Via Supabase Dashboard

1. Aller dans **Authentication** > **Users**
2. Cliquer sur **Add user**
3. Choisir "Create new user"
4. Remplir :
   - Email: `votre-email@example.com`
   - Password: mot de passe sécurisé
   - Auto Confirm User: ✅ Oui
5. Cliquer sur **Create user**

Le profil sera créé automatiquement via le trigger SQL !

### Vérifier le Profil Créé

Dans **Table Editor** > **profiles**, vous devriez voir le nouvel utilisateur avec :
- `email`: celui que vous avez saisi
- `role`: `pilot` (par défaut)
- `full_name`: vide (à remplir plus tard)

## 🎯 Checklist Complète

- [ ] Projet Supabase créé
- [ ] Script `SUPABASE_SETUP.sql` exécuté sans erreur
- [ ] 3 storage buckets créés (avatars, documents, certificates)
- [ ] Clés API récupérées
- [ ] Fichier `.env.local` créé avec les bonnes valeurs
- [ ] Serveur Next.js redémarré
- [ ] Test connexion réussi
- [ ] Premier utilisateur créé

## 📚 Prochaines Étapes

Une fois tout configuré :

1. ✅ Passer au **PROMPT 3** pour créer les pages d'authentification
2. ✅ Commencer à développer les fonctionnalités

## 🆘 Problèmes Courants

### Erreur "Invalid API key"
- Vérifier que les clés dans `.env.local` sont correctes
- Pas d'espaces avant/après les valeurs
- Redémarrer le serveur après modification

### Erreur RLS "Row Level Security"
- Vérifier que les policies ont été créées (via script SQL)
- L'utilisateur doit être authentifié pour accéder aux données

### Tables non trouvées
- Re-exécuter le script `SUPABASE_SETUP.sql`
- Vérifier qu'il n'y a pas d'erreurs dans l'exécution

## 📞 Support

- Documentation Supabase : https://supabase.com/docs
- Discord Supabase : https://discord.supabase.com
- Votre fichier `STRATEGY.md` pour la vue d'ensemble

---

**Configuration Supabase pour GRID 78 Drone Team**
