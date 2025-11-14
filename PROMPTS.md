# Prompts Windsurf.ai - Application Drone Team

## PROMPT 1: Setup Initial du Projet

```
Créer une application Next.js 14 avec TypeScript, TailwindCSS et App Router pour gérer une équipe de pompiers télépilotes de drones.

Stack: Next.js 14, TypeScript, Supabase, TailwindCSS, shadcn/ui, React Query

Structure du projet:
- /src/app avec routes: auth, dashboard, profile, planning, missions, formations, security
- /src/components: ui (shadcn), layout, shared
- /src/lib: supabase, hooks, utils
- /src/types pour les types TypeScript

Installer les dépendances:
- @supabase/supabase-js @supabase/auth-helpers-nextjs
- @tanstack/react-query date-fns lucide-react zod
- shadcn/ui components

Créer:
1. Structure complète des dossiers
2. Configuration TypeScript stricte
3. Configuration TailwindCSS avec thème personnalisé (couleurs pompiers: rouge, gris foncé)
4. Fichier .env.local.example avec variables Supabase
5. Configuration ESLint et Prettier
```

## PROMPT 2: Configuration Supabase Client

```
Configurer Supabase pour Next.js 14 App Router avec authentification et types TypeScript.

Créer /src/lib/supabase/client.ts:
- Client Supabase browser avec createBrowserClient
- Export fonction getSupabase()

Créer /src/lib/supabase/server.ts:
- Server client avec cookies
- Fonctions: createClient(), getSession(), getUser()

Créer /src/lib/supabase/middleware.ts:
- Middleware Next.js pour refresh session
- Protection routes authentifiées

Créer /src/types/database.types.ts:
- Types pour: profiles, availabilities, missions, flights, trainings, user_trainings, safety_guidelines
- Types Database complet avec relations
```

## PROMPT 3: Authentification

```
Implémenter système d'authentification complet avec Supabase Auth.

Créer /src/app/auth/login/page.tsx:
- Formulaire login email/password avec validation Zod
- Gestion erreurs et loading states
- Redirection vers dashboard après login
- Lien vers signup

Créer /src/app/auth/signup/page.tsx:
- Formulaire inscription: email, password, full_name, role
- Validation côté client
- Création automatique profil via trigger Supabase

Créer /src/lib/hooks/useAuth.ts:
- Hook custom avec: user, profile, signIn, signUp, signOut, loading
- React Query pour cache profil
- Listener changements auth Supabase

Créer /src/components/layout/ProtectedRoute.tsx:
- HOC pour protéger routes
- Redirection vers login si non auth
- Loading state pendant vérification
```

## PROMPT 4: Layout et Navigation

```
Créer layout principal responsive avec navigation adaptée mobile/desktop.

Créer /src/components/layout/MainLayout.tsx:
- Sidebar desktop avec menu: Dashboard, Profil, Planning, Missions, Formations, Sécurité
- Mobile: Header avec hamburger menu
- User dropdown: profil, déconnexion
- Badge rôle (Pilot/Chef)
- Footer avec infos application

Créer /src/components/layout/Navigation.tsx:
- Navigation items avec icônes Lucide
- Active state sur route courante
- Permissions selon rôle (certains items seulement pour chiefs)

Utiliser shadcn/ui:
- Sheet pour mobile menu
- DropdownMenu pour user menu
- Separator, Avatar, Badge

Style: moderne, responsive, couleurs pompiers
```

## PROMPT 5: Dashboard avec Calendrier

```
Créer page d'accueil (dashboard) avec calendrier d'équipe et overview.

Créer /src/app/dashboard/page.tsx:
- Grid responsive: calendrier principal + cards stats
- Composant TeamCalendar affichant disponibilités agrégées
- Card "Prochaines missions" (3 prochaines)
- Card "Stats équipe" (membres dispos aujourd'hui, missions ce mois)
- Realtime updates avec Supabase subscriptions

Créer /src/components/shared/TeamCalendar.tsx:
- Vue mensuelle avec jours affichant nombre pilotes disponibles
- Color coding: vert (>50% dispo), orange (25-50%), rouge (<25%)
- Click jour → modal liste des pilotes disponibles
- Navigation mois précédent/suivant
- Utiliser date-fns pour manipulation dates

Créer /src/lib/hooks/useTeamAvailability.ts:
- Fetch disponibilités période donnée
- Agrégation par jour
- React Query avec refetch interval + realtime subscription
- Fonction helper: calculateAvailabilityPercentage()
```

## PROMPT 6: Gestion Profils

```
Implémenter page profil avec affichage et édition informations utilisateur.

Créer /src/app/profile/page.tsx:
- Affichage profil utilisateur connecté
- Mode édition avec formulaire
- Upload avatar vers Supabase Storage
- Sections: Info perso, Contact, Qualifications, Formations complétées
- Save avec optimistic update

Créer /src/components/profile/AvatarUpload.tsx:
- Drag & drop ou file picker
- Preview image avant upload
- Upload vers bucket avatars Supabase
- Compression image côté client
- Progress bar upload

Créer /src/components/profile/ProfileForm.tsx:
- Champs: full_name, phone, email (readonly), role (readonly sauf chief)
- Validation Zod
- Boutons: Save, Cancel
- Toast notifications succès/erreur

Créer /src/lib/hooks/useProfile.ts:
- Fetch profil par ID
- Update profil avec optimistic updates
- Upload avatar fonction
```

## PROMPT 7: Planning Individuel

```
Créer interface de gestion du planning individuel avec sélection de dates.

Créer /src/app/planning/page.tsx:
- Titre "Mon Planning"
- Composant CalendarSelector pour sélectionner dates disponibles
- Liste des disponibilités enregistrées avec dates et actions (supprimer)
- Bouton "Ajouter disponibilité" → modal
- Indication: "Ces dates alimentent le calendrier d'équipe"

Créer /src/components/planning/CalendarSelector.tsx:
- Calendrier mensuel interactif
- Sélection range de dates (start → end)
- Dates déjà sélectionnées highlightées
- Empêcher sélection dates passées
- Validation: pas de chevauchement

Créer /src/components/planning/AvailabilityModal.tsx:
- Modal ajout disponibilité
- DatePicker start/end avec react-day-picker
- Champ notes optionnel
- Submit → INSERT Supabase
- Success → refresh + realtime notification

Créer /src/lib/hooks/useAvailabilities.ts:
- CRUD disponibilités user courant
- Realtime subscription pour updates
- Validation overlaps côté client
```

## PROMPT 8: Gestion Missions

```
Implémenter système complet de gestion des missions avec droits selon rôle.

Créer /src/app/missions/page.tsx:
- Liste missions (cards ou table) filtrables par statut et date
- Bouton "Nouvelle Mission" (visible seulement pour chiefs)
- Click mission → page détail
- Statut badges: Planned, In Progress, Completed, Cancelled

Créer /src/app/missions/[id]/page.tsx:
- Détails mission: titre, description, date, lieu, statut, chief responsable
- Liste vols associés (table)
- Bouton "Ajouter un vol" (pilots)
- Bouton "Éditer mission" (chiefs)
- Realtime updates vols

Créer /src/components/missions/MissionForm.tsx:
- Formulaire création/édition mission (chiefs only)
- Champs: title, description, mission_date, location, status
- DateTimePicker pour mission_date
- Validation Zod
- Auto-assign chief_id à user courant

Créer /src/components/missions/FlightForm.tsx:
- Formulaire ajout vol
- Champs: flight_date (default now), duration_minutes, drone_model, notes
- mission_id et pilot_id auto-remplis
- Submit → INSERT flights

Créer /src/lib/hooks/useMissions.ts et useFlights.ts:
- CRUD avec permissions
- Filters et sorting
- Realtime subscriptions
```

## PROMPT 9: Formations & Certifications

```
Créer système de suivi des formations et certifications.

Créer /src/app/formations/page.tsx:
- Onglets: "Catalogue" et "Mes Certifications"
- Catalogue: liste toutes formations disponibles avec descriptions
- Mes Certifications: liste formations complétées par user avec dates
- Chiefs: bouton "Ajouter formation", "Valider certification pour un membre"

Créer /src/components/formations/TrainingCard.tsx:
- Card formation: nom, description, durée
- Badge statut pour user: Complété (date) / À faire
- Click → modal détails avec doc téléchargeable

Créer /src/components/formations/CertificationModal.tsx:
- Modal pour chiefs: sélectionner user + training + date
- Upload certificat PDF optionnel vers Storage
- Submit → INSERT user_trainings

Créer /src/components/formations/TrainingList.tsx:
- Table formations user avec: nom, date completion, expiration, certificat
- Filter: actives / expirées
- Download certificat

Créer /src/lib/hooks/useTrainings.ts:
- Fetch trainings catalogue
- Fetch user certifications
- Add/remove certifications (chiefs)
- Upload certificate document
```

## PROMPT 10: Sécurité Aérienne

```
Page consignes de sécurité avec contenu éditablepar chiefs.

Créer /src/app/security/page.tsx:
- Sections accordéon par catégorie
- Chaque consigne: titre, contenu, priority badge, documents liés
- Chiefs: boutons éditer/ajouter consignes
- Search bar pour filtrer consignes

Créer /src/components/security/GuidelineCard.tsx:
- Card consigne avec titre, contenu (Markdown), catégorie
- Priority indicator (high/medium/low)
- Boutons: download docs, edit (chiefs)

Créer /src/components/security/GuidelineEditor.tsx:
- Modal édition consigne (chiefs)
- Markdown editor pour contenu
- Upload documents associés
- Champs: title, content, category, priority
- Submit → INSERT/UPDATE safety_guidelines

Créer /src/lib/hooks/useSafety.ts:
- Fetch guidelines avec filters
- CRUD (chiefs only)
- Upload/download documents Storage
```

## PROMPT 11: Realtime & Optimizations

```
Implémenter Supabase Realtime et optimisations performance.

Créer /src/lib/supabase/realtime.ts:
- Fonctions setup subscriptions par table
- useRealtimeSubscription hook générique
- Gestion cleanup et reconnexion

Optimiser:
1. React Query config:
   - Stale time approprié par resource
   - Cache time optimisé
   - Optimistic updates pour mutations

2. Composants:
   - Lazy loading routes avec next/dynamic
   - Suspense boundaries avec fallbacks
   - Error boundaries

3. Performance:
   - Memo components lourds
   - useCallback pour fonctions passées en props
   - Debounce search inputs
   - Pagination missions/flights (limit 20)

4. Realtime subscriptions:
   - availabilities → update dashboard calendar
   - missions → update missions list
   - flights → update mission details
   - Unsubscribe on unmount
```

## PROMPT 12: Tests & Déploiement

```
Setup tests et préparation déploiement Vercel.

1. Tests unitaires (Jest + React Testing Library):
   - Tests composants: forms, cards, modals
   - Tests hooks: useAuth, useProfile
   - Tests utils: date helpers, validators

2. Tests E2E (Playwright):
   - Flow complet: signup → dashboard → créer dispo → voir calendrier
   - Flow mission: chief crée mission → pilot ajoute vol
   - Tests responsive mobile

3. Configuration déploiement:
   - vercel.json config
   - Environment variables Vercel
   - Build optimization settings
   - Setup domaine personnalisé

4. Documentation:
   - README.md complet
   - Guide installation développeurs
   - Guide utilisateur (Markdown)
   - Scripts npm utiles

5. Monitoring:
   - Vercel Analytics
   - Error tracking (Sentry optionnel)
   - Supabase logs review
```

## Notes d'Utilisation

- Exécuter prompts dans l'ordre numérique
- Chaque prompt peut être utilisé indépendamment dans Windsurf
- Adapter les détails selon besoins spécifiques
- Tester après chaque prompt avant de passer au suivant
