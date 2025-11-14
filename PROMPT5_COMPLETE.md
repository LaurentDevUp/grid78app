# ✅ PROMPT 5 - Dashboard avec Calendrier Complété

## 📦 Fichiers Créés

### 1. Hooks Custom

#### `src/lib/hooks/useTeamAvailability.ts`
✅ Hook pour récupérer les disponibilités de l'équipe

**Fonctionnalités** :
- Fetch disponibilités d'un mois entier
- Agrégation par jour
- Calcul du pourcentage de disponibilité
- Liste des utilisateurs disponibles par jour
- React Query avec cache (1 min stale time)
- Refetch automatique toutes les 5 minutes
- Realtime Supabase subscription sur table `availabilities`

**Helper function** :
```typescript
calculateAvailabilityPercentage(available, total) => number
```

**Retour** :
```typescript
{
  availabilityByDay: Record<string, DayAvailability>,
  totalTeamCount: number,
  isLoading: boolean,
  error: Error | null
}
```

**DayAvailability** :
```typescript
{
  date: string,              // YYYY-MM-DD
  availableCount: number,     // Nombre disponibles
  totalCount: number,         // Total équipe
  percentage: number,         // Pourcentage 0-100
  availableUsers: User[]      // Liste users disponibles
}
```

---

#### `src/lib/hooks/useTeamStats.ts`
✅ Hook pour statistiques de l'équipe

**Statistiques récupérées** :
- Total membres
- Disponibles aujourd'hui
- Missions ce mois
- Missions actives
- Heures de vol totales ce mois

**Features** :
- React Query avec cache (2 min)
- Refetch toutes les 5 minutes
- Realtime subscription sur table `missions`

**Retour** :
```typescript
{
  stats: {
    totalMembers: number,
    availableToday: number,
    missionsThisMonth: number,
    activeMissions: number,
    totalFlightHours: number
  },
  isLoading: boolean,
  error: Error | null
}
```

---

#### `src/lib/hooks/useUpcomingMissions.ts`
✅ Hook pour prochaines missions

**Fonctionnalités** :
- Fetch missions futures (≥ aujourd'hui)
- Filtre status: 'planned' ou 'in_progress'
- Tri par date croissante
- Limite configurable (défaut: 3)
- Join avec profil du chef
- Realtime subscription

**Retour** :
```typescript
{
  missions: MissionWithChief[],
  isLoading: boolean,
  error: Error | null
}
```

---

### 2. Composants UI

#### `src/components/ui/modal.tsx`
✅ Composant Modal réutilisable

**Sous-composants** :
- `Modal` - Container principal avec backdrop
- `ModalHeader` - En-tête avec bouton close
- `ModalTitle` - Titre du modal
- `ModalBody` - Corps scrollable
- `ModalFooter` - Footer avec actions

**Features** :
- Backdrop avec blur
- Click outside pour fermer
- Body scroll lock quand ouvert
- Animation fade-in
- z-index 50
- Responsive (max 90vh)

**Usage** :
```tsx
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalHeader onClose={() => setIsOpen(false)}>
    <ModalTitle>Titre</ModalTitle>
  </ModalHeader>
  <ModalBody>
    {/* Contenu */}
  </ModalBody>
  <ModalFooter>
    <button>Annuler</button>
    <button>Valider</button>
  </ModalFooter>
</Modal>
```

---

### 3. Composants Shared

#### `src/components/shared/TeamCalendar.tsx`
✅ Calendrier d'équipe avec disponibilités

**Fonctionnalités** :
- Vue mensuelle complète
- Grille 7 jours x 5-6 semaines
- Navigation mois précédent/suivant
- Affichage nombre disponibles par jour
- Color coding automatique :
  - **Vert** : ≥50% disponibles
  - **Orange** : 25-49% disponibles
  - **Rouge** : <25% disponibles
- Click sur jour → modal avec liste pilotes
- Highlight aujourd'hui (ring cyan)
- Jours hors mois grisés
- Légende des couleurs

**Header** :
- Titre "Disponibilités de l'équipe"
- Mois et année (français)
- Boutons navigation (< >)

**Calendar Grid** :
- En-têtes jours de la semaine (Lun-Dim)
- Cases carrées (aspect-square)
- Border 2px avec couleurs
- Hover effect avec shadow
- Responsive (gap adaptatif)

**Modal Liste Pilotes** :
- Titre avec date formatée
- Nombre disponibles / total
- Badge pourcentage (vert/orange/rouge)
- Liste pilotes avec :
  - Avatar
  - Nom complet
  - Email
  - Badge rôle (Pilot/Chef)

**date-fns utilisé** :
- `format()` - Formatage dates
- `startOfMonth()`, `endOfMonth()` - Bornes mois
- `eachDayOfInterval()` - Génération jours
- `startOfWeek()`, `endOfWeek()` - Calendrier complet
- `isSameMonth()` - Filtrage jours
- `isToday()` - Highlight aujourd'hui
- `addMonths()`, `subMonths()` - Navigation

---

### 4. Dashboard Mis à Jour

#### `src/app/dashboard/page.tsx`
✅ Dashboard complet avec statistiques et calendrier

**Layout** :
```
[Header]
[4 Stats Cards]
[Grid 2:1]
  ├─ [Calendrier]     (2/3 largeur)
  └─ [Sidebar]        (1/3 largeur)
       ├─ Prochaines missions
       └─ Résumé rapide
```

**Stats Cards (4)** :
1. **Total membres**
   - Icône: Users (cyan)
   - Valeur: Total profils

2. **Disponibles aujourd'hui**
   - Icône: TrendingUp (vert)
   - Valeur: Nombre dispos

3. **Missions ce mois**
   - Icône: Plane (orange)
   - Valeur: Total missions

4. **Heures de vol**
   - Icône: Clock (purple)
   - Valeur: Total heures avec "h"

**Calendrier** :
- Composant `TeamCalendar`
- Prend 2/3 de la largeur (lg:col-span-2)
- Responsive: pleine largeur mobile

**Prochaines Missions** :
- 3 missions max
- Cards avec :
  - Titre mission
  - Badge status (En cours/Planifiée)
  - Description (line-clamp-2)
  - Date et heure formatées
  - Localisation (si présente)
  - Hover effect (border cyan)

**Résumé Rapide** :
- Card gradient cyan→orange
- Missions actives (grand chiffre)
- Ratio disponibles/total
- Texte blanc

**Loading States** :
- Spinner pour stats
- Spinner pour missions
- Spinner dans calendrier

**Empty States** :
- "Aucune mission prévue" avec icône

---

## 🔄 Realtime Updates

### Supabase Subscriptions Implémentées

#### useTeamAvailability
```typescript
channel: 'availabilities-changes'
table: 'availabilities'
events: * (INSERT, UPDATE, DELETE)
→ Invalidate query on change
```

#### useTeamStats
```typescript
channel: 'missions-changes'
table: 'missions'
events: * (INSERT, UPDATE, DELETE)
→ Invalidate query on change
```

#### useUpcomingMissions
```typescript
channel: 'upcoming-missions-changes'
table: 'missions'
events: * (INSERT, UPDATE, DELETE)
→ Invalidate query on change
```

**Flow Realtime** :
```
User A ajoute disponibilité
  ↓
Supabase PostgreSQL INSERT
  ↓
Realtime broadcast à tous les clients
  ↓
User B reçoit event
  ↓
React Query invalide cache
  ↓
Refetch automatique
  ↓
UI mise à jour immédiatement
```

---

## 🎨 Color Coding Calendrier

### Logique de Couleurs

```typescript
if (percentage >= 50)   → Vert   (bg-green-100 border-green-500)
if (percentage >= 25)   → Orange (bg-orange-100 border-orange-500)
if (percentage < 25)    → Rouge  (bg-red-100 border-red-500)
```

### Exemples

**10 membres, 7 disponibles** :
- Pourcentage: 70%
- Couleur: **Vert** ✅

**10 membres, 3 disponibles** :
- Pourcentage: 30%
- Couleur: **Orange** ⚠️

**10 membres, 1 disponible** :
- Pourcentage: 10%
- Couleur: **Rouge** ❌

---

## 🧪 Tester le Dashboard

### Test 1 : Statistiques

1. **Se connecter** au dashboard
2. **Vérifier** les 4 cards stats :
   - Total membres > 0
   - Disponibles aujourd'hui (peut être 0)
   - Missions ce mois
   - Heures de vol
3. **Attendre 5 min** : Vérifier refetch automatique

### Test 2 : Calendrier

1. **Observer** le mois en cours
2. **Cliquer** sur bouton < : Mois précédent
3. **Cliquer** sur bouton > : Mois suivant
4. **Chercher** un jour avec disponibilités (coloré)
5. **Cliquer** sur le jour
6. **Vérifier** modal avec liste pilotes

### Test 3 : Ajout Disponibilité

Pour tester vraiment le calendrier, il faut ajouter des disponibilités. Via Supabase Dashboard :

1. Aller sur : Table Editor → availabilities
2. Insert row :
   ```
   user_id: [votre_user_id]
   start_date: 2025-11-12
   end_date: 2025-11-15
   status: available
   ```
3. Sauvegarder
4. **Retour dashboard** : Le calendrier se met à jour automatiquement !
5. **Jours 12-15** novembre doivent être colorés

### Test 4 : Realtime

**Terminal 1** - User A :
1. Connexion dashboard
2. Observer calendrier

**Terminal 2** - Supabase Dashboard :
1. Ajouter nouvelle disponibilité
2. Sauvegarder

**Retour Terminal 1** :
- Calendrier se met à jour seul (2-3 sec)
- Aucun refresh page nécessaire

### Test 5 : Prochaines Missions

Pour voir des missions :

1. Supabase Dashboard → Table missions
2. Insert row :
   ```
   title: Mission test
   description: Test affichage dashboard
   mission_date: 2025-11-20 14:00:00
   status: planned
   location: Paris
   ```
3. Retour dashboard → Mission apparaît dans sidebar

---

## 📊 Requêtes Supabase

### useTeamAvailability

```sql
SELECT *,
  profiles:user_id (
    id, full_name, email, avatar_url, role
  )
FROM availabilities
WHERE start_date >= '2025-11-01'
  AND end_date <= '2025-11-30'
  AND status = 'available'
```

### useTeamStats

```sql
-- Total members
SELECT COUNT(*) FROM profiles

-- Available today
SELECT COUNT(*) FROM availabilities
WHERE status = 'available'
  AND start_date <= '2025-11-12'
  AND end_date >= '2025-11-12'

-- Missions this month
SELECT COUNT(*) FROM missions
WHERE mission_date >= '2025-11-01'
  AND mission_date <= '2025-11-30'

-- Flight hours
SELECT SUM(duration_minutes) FROM flights
WHERE flight_date >= '2025-11-01'
  AND flight_date <= '2025-11-30'
```

### useUpcomingMissions

```sql
SELECT *,
  chief:chief_id (
    id, full_name, email, avatar_url, role
  )
FROM missions
WHERE mission_date >= '2025-11-12'
  AND status IN ('planned', 'in_progress')
ORDER BY mission_date ASC
LIMIT 3
```

---

## 📋 Structure Complète

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx ✅ (mis à jour)
├── components/
│   ├── shared/
│   │   └── TeamCalendar.tsx ✅
│   └── ui/
│       └── modal.tsx ✅
└── lib/
    └── hooks/
        ├── useTeamAvailability.ts ✅
        ├── useTeamStats.ts ✅
        └── useUpcomingMissions.ts ✅
```

---

## 🎯 Fonctionnalités Implémentées

### Calendrier

✅ Vue mensuelle complète
✅ Navigation mois précédent/suivant
✅ Color coding (vert/orange/rouge)
✅ Affichage nombre disponibles/total
✅ Click jour → modal pilotes
✅ Highlight aujourd'hui
✅ Jours hors mois grisés
✅ Légende des couleurs
✅ Loading state

### Statistiques

✅ 4 métriques clés avec icônes
✅ Valeurs en temps réel
✅ Refetch automatique (5 min)
✅ Loading states
✅ Design cohérent GRID78

### Missions

✅ 3 prochaines missions
✅ Status badge (En cours/Planifiée)
✅ Date et heure formatées
✅ Localisation
✅ Empty state
✅ Loading state
✅ Hover effects

### Realtime

✅ Subscription availabilities
✅ Subscription missions
✅ Invalidation cache automatique
✅ UI mise à jour sans refresh

---

## 🚀 Prochaines Étapes

### PROMPT 6 : Gestion Profils

Passez au **PROMPT 6** pour créer :
- Page profil complète
- Mode édition
- Upload avatar vers Supabase Storage
- Sections: Info, Contact, Qualifications, Formations
- Optimistic updates

### Améliorations Futures

- Filtres calendrier (par rôle, par status)
- Export calendrier PDF
- Notifications push missions
- Graphiques stats avancées
- Vue semaine en plus de vue mois

---

## 💡 Tips d'Utilisation

### Ajouter plus de stats

Dans `useTeamStats.ts` :

```typescript
// Ajouter une nouvelle stat
const { count: newStat } = await supabase
  .from('table')
  .select('*', { count: 'exact', head: true })
  .eq('condition', value)

return {
  ...stats,
  newStat: newStat || 0
}
```

Puis dans Dashboard :

```tsx
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600 mb-1">Ma Stat</p>
      <p className="text-3xl font-bold text-grid-cyan-700">
        {stats?.newStat || 0}
      </p>
    </div>
    <div className="h-12 w-12 rounded-full bg-grid-cyan-100">
      <Icon className="h-6 w-6 text-grid-cyan-600" />
    </div>
  </div>
</div>
```

### Personnaliser color coding

Dans `TeamCalendar.tsx` :

```typescript
const getColorClass = (percentage: number) => {
  if (percentage >= 75) return 'bg-green-100 border-green-500'  // Très bon
  if (percentage >= 50) return 'bg-blue-100 border-blue-500'    // Bon
  if (percentage >= 25) return 'bg-orange-100 border-orange-500' // Moyen
  return 'bg-red-100 border-red-500'                             // Faible
}
```

### Ajouter intervalle refetch

Dans les hooks :

```typescript
useQuery({
  queryKey: ['...'],
  queryFn: async () => { ... },
  refetchInterval: 10 * 1000, // 10 secondes au lieu de 5 min
})
```

---

## ✨ Résumé

**🎉 DASHBOARD AVEC CALENDRIER 100% FONCTIONNEL !**

Votre dashboard GRID78 dispose maintenant de :
- ✅ Calendrier d'équipe interactif
- ✅ 4 statistiques temps réel
- ✅ Prochaines missions
- ✅ Color coding intelligent
- ✅ Modal liste pilotes
- ✅ Navigation mois
- ✅ Realtime Supabase (3 channels)
- ✅ Loading states partout
- ✅ Design GRID78 cohérent
- ✅ Responsive mobile/desktop

**Prochaine étape** : PROMPT 6 - Gestion Profils ! 👤

---

**PROMPT 5 Complété** ✅  
**Temps estimé** : ~60 min  
**Prochaine étape** : PROMPT 6 - Page Profil avec Upload Avatar
