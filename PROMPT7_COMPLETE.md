# ✅ PROMPT 7 - Planning Individuel Complété

## 📦 Fichiers Créés

### 1. Hook Custom

#### `src/lib/hooks/useAvailabilities.ts`
✅ Hook pour gestion CRUD des disponibilités

**Fonctionnalités** :
- Fetch disponibilités par user ID
- Create, Update, Delete disponibilités
- **Validation overlaps** côté client
- React Query avec cache (2 min)
- Realtime Supabase subscription
- Invalidation cache team-availability (dashboard)

**API** :
```typescript
const {
  availabilities,        // Array<Availability>
  isLoading,             // Loading state
  error,                 // Error if any
  hasOverlap,            // (start, end, excludeId?) => boolean
  createAvailability,    // Create function
  updateAvailability,    // Update function
  deleteAvailability,    // Delete function
  isCreating,            // Create pending
  isUpdating,            // Update pending
  isDeleting             // Delete pending
} = useAvailabilities(userId)
```

**hasOverlap Function** :
```typescript
hasOverlap(startDate: Date, endDate: Date, excludeId?: string): boolean

// Vérifie si la plage [startDate, endDate] chevauche
// une disponibilité existante
// Logique: start <= availEnd AND end >= availStart
```

**Realtime** :
```typescript
// Subscribe to user's availabilities changes
channel: `availabilities-${userId}`
filter: `user_id=eq.${userId}`
→ Invalidate queries on any change
```

---

### 2. Composants Planning

#### `src/components/planning/CalendarSelector.tsx`
✅ Calendrier interactif de sélection de plages

**Fonctionnalités** :
- Vue mensuelle (react-day-picker)
- Sélection **range** (date début → date fin)
- Dates déjà sélectionnées highlightées
- **Empêche dates passées** (before today)
- Disabled dates custom
- Style GRID78 (cyan)
- Locale français
- Preview période sélectionnée

**Props** :
```typescript
interface CalendarSelectorProps {
  selectedDates: Date[]            // Dates déjà réservées
  onRangeSelect: (start, end) => void
  disabledDates?: Date[]           // Dates à désactiver
}
```

**Styling** :
- Selected: bg-grid-cyan-500
- Range middle: bg-cyan-50
- Hover: bg-blue-50
- Disabled: opacity 40%

**Usage** :
```tsx
<CalendarSelector
  selectedDates={existingDates}
  onRangeSelect={(start, end) => {
    console.log('Selected:', start, end)
  }}
/>
```

---

#### `src/components/planning/AvailabilityModal.tsx`
✅ Modal d'ajout de disponibilité

**Fonctionnalités** :
- Modal réutilisable (base Modal)
- CalendarSelector intégré
- Champ **notes** optionnel
- Validation :
  - Dates passées interdites
  - End >= Start
  - Pas de chevauchement
- Loading state
- Error display
- Toast notifications

**Props** :
```typescript
interface AvailabilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (start, end, notes?) => Promise<void>
  existingDates?: Date[]
  checkOverlap?: (start, end) => boolean
}
```

**Validation Flow** :
```
User sélectionne range
  ↓
Vérifier date >= today
  ↓
Vérifier end >= start
  ↓
Vérifier overlap (checkOverlap)
  ↓
Si OK → Display selected period
Si KO → Display error message
```

**Submit Flow** :
```
User click "Ajouter"
  ↓
Validation finale
  ↓
Call onSubmit(start, end, notes)
  ↓
Loading spinner
  ↓
Success → Toast + Close modal
Error → Display error + Keep open
```

---

### 3. Page Planning

#### `src/app/planning/page.tsx`
✅ Page complète de gestion planning

**Structure** :
```
┌─────────────────────────────────────┐
│  Header (Titre + Description)       │
├─────────────────────────────────────┤
│  Info Banner (Comment ça marche)    │
├─────────────────────────────────────┤
│  Grid 1:2 (desktop)                 │
│  ┌──────┬──────────────────────┐   │
│  │ Col 1│ Col 2                │   │
│  │ Stat │ Liste disponibilités │   │
│  │ Add  │                      │   │
│  └──────┴──────────────────────┘   │
└─────────────────────────────────────┘
```

**Colonne 1 (Stats & Actions)** :
- Card stat : Nombre disponibilités
- Bouton "Ajouter une disponibilité" (cyan)

**Colonne 2 (Liste)** :
- Header "Mes disponibilités"
- Empty state si aucune
- Liste cards avec :
  - Icon calendrier
  - Dates (du XX au YY)
  - Notes (si présentes)
  - Date création
  - Bouton supprimer (rouge)

**States** :
- Loading : Spinner centré
- Empty : Icon + message + bouton add
- Populated : Liste scrollable

**Actions** :
- Add : Ouvre modal
- Delete : Confirm + Toast

---

## 🔄 Realtime Updates

### Subscription Implémentée

```typescript
channel: `availabilities-${userId}`
table: 'availabilities'
filter: `user_id=eq.${userId}`
events: * (INSERT, UPDATE, DELETE)

→ Invalidate ['availabilities', userId]
→ Invalidate ['team-availability'] (dashboard)
```

**Flow Realtime** :
```
User A ajoute disponibilité
  ↓
Supabase INSERT
  ↓
Broadcast to User A's channel
  ↓
React Query invalide cache
  ↓
Refetch automatique
  ↓
Liste mise à jour
  ↓
Dashboard team calendar updated !
```

---

## ✅ Validation Overlaps

### Logique Client-Side

```typescript
// Range 1: [start, end]
// Range 2: [availStart, availEnd]

// Overlap si:
start <= availEnd AND end >= availStart

// Exemples:
[10, 15] et [12, 18] → OVERLAP ❌
[10, 15] et [16, 20] → OK ✅
[10, 15] et [5, 9]   → OK ✅
```

**Visualisation** :
```
Timeline:  |-----|-----|-----|-----|-----|
           1     5    10    15    20    25

Range 1:         [====]               (10-15)
Range 2:            [=======]         (12-18) → OVERLAP
Range 3:                    [====]    (16-20) → OK
Range 4:   [====]                     (1-9)   → OK
```

**Code** :
```typescript
const hasOverlap = (startDate: Date, endDate: Date): boolean => {
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')

  return availabilities.some((avail) => {
    const availStart = avail.start_date
    const availEnd = avail.end_date
    return start <= availEnd && end >= availStart
  })
}
```

---

## 🧪 Tester la Page Planning

### Test 1 : Affichage Initial

1. **Se connecter** au dashboard
2. **Cliquer** "Planning" dans navigation
3. **Vérifier** :
   - Header "Mon Planning"
   - Banner bleu explicatif
   - Stat "0 Disponibilités"
   - Empty state avec message

### Test 2 : Ajouter Disponibilité

1. **Click** "Ajouter une disponibilité"
2. **Modal** s'ouvre
3. **Calendrier** affiché
4. **Cliquer** sur une date future (ex: 20 nov)
5. **Cliquer** sur une date fin (ex: 25 nov)
6. **Vérifier** :
   - Période affichée en bas
   - Dates highlightées cyan
7. **Optionnel** : Ajouter notes
8. **Click** "Ajouter"
9. **Observer** :
   - Loading spinner
   - Toast success
   - Modal se ferme
   - Disponibilité apparaît dans liste

### Test 3 : Dates Passées Interdites

1. **Ouvrir** modal
2. **Essayer** cliquer date passée
3. **Vérifier** : Date grisée, non cliquable

### Test 4 : Validation Overlap

1. **Ajouter** disponibilité 20-25 nov
2. **Ouvrir** modal à nouveau
3. **Sélectionner** 23-28 nov (chevauche!)
4. **Vérifier** :
   - Message error "Cette période chevauche..."
   - Couleur rouge
   - Bouton "Ajouter" peut rester actif mais erreur au submit

### Test 5 : Supprimer Disponibilité

1. **Click** bouton poubelle (rouge)
2. **Confirm** dialog apparaît
3. **Click** OK
4. **Observer** :
   - Loading spinner dans bouton
   - Toast success
   - Disponibilité supprimée de la liste
   - Stat mise à jour

### Test 6 : Notes Optionnelles

1. **Ajouter** disponibilité
2. **Remplir** champ notes : "Disponible missions longue distance"
3. **Soumettre**
4. **Vérifier** : Notes affichées sous les dates dans la liste

### Test 7 : Realtime (Dashboard)

**Terminal 1** : Dashboard ouvert (calendrier équipe)
**Terminal 2** : Planning ouvert

1. **Terminal 2** : Ajouter disponibilité
2. **Observer Terminal 1** :
   - Dashboard calendrier se met à jour
   - Dates colorées automatiquement
   - Aucun refresh nécessaire !

---

## 📋 Flow Complet Ajout

```
Click "Ajouter une disponibilité"
  ↓
Modal s'ouvre
  ↓
Calendrier affiché (dates existantes highlightées)
  ↓
User sélectionne start date
  ↓
User sélectionne end date
  ↓
Validation:
  - Dates >= today ✅
  - End >= Start ✅
  - Pas d'overlap ✅
  ↓
Preview période affiché (vert)
  ↓
User ajoute notes (optionnel)
  ↓
User click "Ajouter"
  ↓
Loading spinner
  ↓
INSERT Supabase
  ↓
Supabase trigger realtime
  ↓
React Query invalide cache
  ↓
Refetch availabilities
  ↓
Liste mise à jour
  ↓
Dashboard invalidé aussi
  ↓
Toast success
  ↓
Modal fermé
```

---

## 🎨 Design System

### Colors

| Element | Color | Class |
|---------|-------|-------|
| Primary button | Cyan | bg-grid-cyan-500 |
| Calendar selected | Cyan | bg-grid-cyan-500 |
| Calendar range | Cyan light | bg-cffafe |
| Delete button | Red | text-red-600 |
| Info banner | Blue | bg-blue-50 |
| Success preview | Green | bg-green-50 |
| Error message | Red | bg-red-50 |

### Spacing

- Page max-width: max-w-7xl
- Grid gap: gap-8
- Card padding: p-6
- List spacing: space-y-3

---

## 📦 Dépendances Installées

```json
{
  "react-day-picker": "^8.x.x",
  "date-fns": "^2.x.x" (déjà installé)
}
```

**react-day-picker** : Calendrier React moderne avec range selection.

---

## 🚀 Prochaines Étapes

### PROMPT 8 : Gestion Missions

Créer système complet de missions :
- Liste missions (filtrable)
- Détail mission
- Création/édition mission (chiefs)
- Vols associés
- Status badges

### Améliorations Futures Planning

- **Éditer** disponibilité existante
- **Export** planning PDF/ICS
- **Vue calendrier** alternative (au lieu de liste)
- **Récurrence** : répéter disponibilités
- **Notifications** : rappels disponibilités
- **Statistiques** : taux disponibilité mensuel

---

## 💡 Tips d'Utilisation

### Ajouter Validation Personnalisée

Dans `AvailabilityModal.tsx` :

```typescript
// Exemple: Max 30 jours par période
const daysDiff = differenceInDays(end, start)
if (daysDiff > 30) {
  setError('Une période ne peut pas dépasser 30 jours')
  return
}
```

### Personnaliser Style Calendrier

Dans `CalendarSelector.tsx` :

```css
.calendar-selector .rdp-day_selected {
  background-color: #your-color;
  border-radius: 50%; /* Rond au lieu de carré */
}
```

### Ajouter Status Disponibilités

Modifier schema pour ajouter status :

```sql
ALTER TABLE availabilities 
ADD COLUMN status_type TEXT 
CHECK (status_type IN ('confirmed', 'tentative', 'cancelled'));
```

Puis afficher badge dans liste :
```tsx
<Badge variant={
  avail.status_type === 'confirmed' ? 'success' : 
  avail.status_type === 'tentative' ? 'warning' : 
  'danger'
}>
  {avail.status_type}
</Badge>
```

---

## ✨ Résumé

**🎉 PLANNING INDIVIDUEL 100% FONCTIONNEL !**

Votre page planning GRID78 dispose maintenant de :
- ✅ Calendrier interactif react-day-picker
- ✅ Sélection range dates (start → end)
- ✅ Validation overlaps côté client
- ✅ Empêche dates passées
- ✅ CRUD complet disponibilités
- ✅ Notes optionnelles
- ✅ Realtime Supabase subscription
- ✅ Invalidation dashboard automatique
- ✅ Toast notifications
- ✅ Loading states partout
- ✅ Empty states
- ✅ Confirm delete
- ✅ Design GRID78 cohérent
- ✅ Responsive mobile/desktop

**Prochaine étape** : PROMPT 8 - Gestion Missions ! ✈️

---

**PROMPT 7 Complété** ✅  
**Temps estimé** : ~90 min  
**Prochaine étape** : PROMPT 8 - Système Complet de Gestion des Missions
