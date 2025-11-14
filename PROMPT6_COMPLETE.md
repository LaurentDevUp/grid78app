# ✅ PROMPT 6 - Gestion Profils Complété

## 📦 Fichiers Créés

### 1. Hook Custom

#### `src/lib/hooks/useProfile.ts`
✅ Hook pour gestion complète du profil utilisateur

**Fonctionnalités** :
- Fetch profil par user ID
- Update profil avec **optimistic updates**
- Upload avatar vers Supabase Storage
- Compression d'image automatique (400x400px, max 1MB)
- React Query avec cache (5 min)
- Gestion erreurs et rollback

**API** :
```typescript
const {
  profile,           // Profile data
  isLoading,         // Loading state
  error,             // Error if any
  updateProfile,     // Update function
  uploadAvatar,      // Upload function
  isUpdating         // Mutation state
} = useProfile(userId)
```

**Upload Avatar Flow** :
```
1. Compression image (browser-image-compression)
   - Max 1 MB
   - 400x400px
   - Format JPEG

2. Delete old avatar (if exists)

3. Upload to Storage
   - Path: avatars/{userId}/avatar.jpg
   - Upsert: true

4. Get public URL

5. Update profile.avatar_url

6. React Query invalidate & refetch
```

**Optimistic Updates** :
```typescript
onMutate: (updates) => {
  // 1. Cancel outgoing queries
  // 2. Snapshot current value
  // 3. Optimistically update UI
  return { previousProfile }
},
onError: (err, variables, context) => {
  // Rollback on error
  queryClient.setQueryData(previousProfile)
},
onSettled: () => {
  // Refetch after mutation
  queryClient.invalidateQueries()
}
```

---

### 2. Composants UI

#### `src/components/ui/toast.tsx`
✅ Système de notifications toast

**Composants** :
- `ToastProvider` - Provider avec context
- `useToast()` - Hook pour afficher toasts
- `ToastContainer` - Container de toasts
- `ToastItem` - Item individuel

**Types de Toasts** :
- ✅ **Success** (vert)
- ❌ **Error** (rouge)
- ℹ️ **Info** (bleu)

**Features** :
- Auto-dismiss après 5 secondes
- Click to dismiss
- Animations slide-in
- Position: top-right
- Stack vertical
- Max-width responsive

**Usage** :
```typescript
import { useToast } from '@/components/ui/toast'

const { addToast } = useToast()

// Success
addToast('success', 'Profil mis à jour !')

// Error
addToast('error', 'Une erreur est survenue')

// Info
addToast('info', 'Information importante')
```

---

### 3. Composants Profile

#### `src/components/profile/AvatarUpload.tsx`
✅ Upload avatar avec drag & drop

**Fonctionnalités** :
- 📸 **Preview current avatar** (ou initiales)
- 🖱️ **File picker** (click to upload)
- 📂 **Drag & drop** zone
- 👁️ **Preview before upload**
- 📊 **Progress bar** upload
- ✅ **Validation** :
  - Type: image/* only
  - Size: max 5 MB
- 🗜️ **Compression automatique** (côté client)
- ❌ **Cancel preview**
- 🚨 **Error messages**

**Props** :
```typescript
interface AvatarUploadProps {
  currentAvatar?: string | null
  onUpload: (file: File) => Promise<string>
  userName?: string | null
}
```

**States** :
- `preview` - Preview image (base64)
- `isDragging` - Drag over state
- `isUploading` - Upload in progress
- `progress` - Upload progress (0-100)
- `error` - Error message

**Validation** :
- Type: vérifie image/*
- Size: max 5 MB
- Error messages en français

**UX** :
- Zone drag highlight (cyan)
- Loading spinner + progress
- Preview avec bouton cancel
- Error banner (rouge)

---

#### `src/components/profile/ProfileForm.tsx`
✅ Formulaire édition profil avec validation

**Modes** :
1. **Vue** (display mode)
   - Affichage readonly
   - Bouton "Modifier le profil"
   - Sections: Info perso, Contact

2. **Édition** (edit mode)
   - Formulaire complet
   - Validation Zod
   - Boutons: Annuler, Enregistrer

**Champs** :

| Champ | Type | Éditable | Validation |
|-------|------|----------|------------|
| full_name | text | ✅ | Min 2 caractères |
| email | email | ❌ | Readonly |
| phone | tel | ✅ | Optional |
| role | badge | ❌ | Readonly |

**Validation Zod** :
```typescript
const profileSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
})
```

**Error Handling** :
- Affichage erreurs inline
- Border rouge sur champs invalides
- Clear error on change

**Props** :
```typescript
interface ProfileFormProps {
  profile: Profile
  onSave: (data: Partial<Profile>) => Promise<void>
  isUpdating?: boolean
}
```

**UX** :
- Loading state (spinner dans bouton)
- Disable during save
- Toast notification success/error
- Auto-close edit mode on success

---

### 4. Page Profile Mise à Jour

#### `src/app/profile/page.tsx`
✅ Page profil complète avec 4 sections

**Structure** :
```
┌─────────────────────────────────┐
│  Header (Titre + Description)   │
├─────────────────────────────────┤
│  📸 Photo de profil              │
│  - AvatarUpload component       │
├─────────────────────────────────┤
│  📝 Informations personnelles    │
│  - ProfileForm component        │
├─────────────────────────────────┤
│  🏆 Qualifications               │
│  - Placeholder (PROMPT 9)       │
├─────────────────────────────────┤
│  📚 Formations complétées        │
│  - Placeholder (PROMPT 9)       │
└─────────────────────────────────┘
```

**Loading State** :
- Spinner centré pendant fetch profil

**Error State** :
- Message rouge si profil non trouvé

**Icons** :
- User (cyan) - Photo profil
- Award (orange) - Qualifications
- BookOpen (purple) - Formations

**Responsive** :
- Max-width: 4xl (1024px)
- Centré avec marges auto
- Cards shadow + border-radius

---

### 5. Provider Global

#### `src/app/providers.tsx`
✅ Mise à jour avec ToastProvider

**Stack** :
```
<QueryClientProvider>
  <ToastProvider>
    {children}
  </ToastProvider>
</QueryClientProvider>
```

Toasts disponibles dans toute l'application !

---

## 🗄️ Supabase Storage Configuration

### Bucket `avatars`

**Configuration manuelle requise** (voir `STORAGE_SETUP.md`) :

1. **Créer bucket** :
   - Name: `avatars`
   - Public: ✅
   - Max size: 5 MB
   - MIME types: image/jpeg, image/png, image/webp

2. **Storage Policies** (4) :
   - ✅ Public Read
   - ✅ Authenticated Upload
   - ✅ Authenticated Update
   - ✅ Authenticated Delete

**Structure** :
```
avatars/
  └── {user_id}/
      └── avatar.jpg
```

**URL Format** :
```
https://[PROJECT_REF].supabase.co/storage/v1/object/public/avatars/{user_id}/avatar.jpg
```

---

## 🧪 Tester la Page Profile

### Test 1 : Affichage Profil

1. **Se connecter** au dashboard
2. **Cliquer** sur "Profil" dans navigation
3. **Vérifier** :
   - Avatar actuel (ou initiales)
   - Informations affichées
   - Email, nom, téléphone
   - Badge rôle
   - Sections placeholders

### Test 2 : Upload Avatar

**Avant** : Configurer le bucket (voir STORAGE_SETUP.md)

1. **Page profil** → Section "Photo de profil"
2. **Drag & drop** une image OU cliquer "Cliquez pour uploader"
3. **Vérifier** :
   - Preview apparaît
   - Message "Nouvelle photo prête"
4. **Observer** :
   - Progress bar (0→100%)
   - Spinner pendant upload
5. **Résultat** :
   - ✅ Avatar mis à jour
   - Toast success affiché
   - Preview disparaît après 1 sec

**Test erreurs** :
- Image > 5 MB → Error "Ne doit pas dépasser 5 MB"
- Fichier non-image → Error "Sélectionner une image"

### Test 3 : Édition Profil

1. **Cliquer** sur "Modifier le profil"
2. **Mode édition** s'active
3. **Modifier** :
   - Nom complet
   - Téléphone
4. **Vérifier** readonly :
   - Email grisé
   - Rôle non éditable

**Test validation** :
- Nom < 2 caractères → Error inline
- Nom vide → Error inline

5. **Cliquer** "Enregistrer"
6. **Vérifier** :
   - Loading spinner dans bouton
   - Toast success
   - Mode édition fermé
   - Valeurs mises à jour

### Test 4 : Optimistic Update

**Test optimistic** :
1. Mode édition
2. Modifier nom
3. Cliquer Enregistrer
4. **Observer** : UI se met à jour IMMÉDIATEMENT
5. Backend confirme après (refetch)

**Test rollback** :
1. Couper réseau (DevTools offline)
2. Modifier profil
3. Enregistrer
4. **Observer** :
   - Update optimiste visible
   - Error après timeout
   - **Rollback automatique** à l'ancienne valeur
   - Toast error affiché

### Test 5 : Cancel Edit

1. Mode édition
2. Modifier valeurs
3. **Cliquer** "Annuler"
4. **Vérifier** :
   - Mode édition fermé
   - Valeurs restaurées
   - Pas de sauvegarde

---

## 📋 Flow Complet Upload Avatar

```
User sélectionne image
  ↓
Validation (type + size)
  ↓
Preview base64 affiché
  ↓
User voit preview
  ↓
[Automatic upload]
  ↓
Compression (400x400, 1MB)
  ↓
Progress bar 0%
  ↓
Delete old avatar (if exists)
  ↓
Upload to Storage (avatars/{userId}/avatar.jpg)
  ↓
Progress bar 90%
  ↓
Get public URL
  ↓
Update profile.avatar_url
  ↓
Progress bar 100%
  ↓
Toast success
  ↓
Preview cleared (1 sec delay)
  ↓
New avatar visible
```

---

## 📋 Flow Complet Update Profil

```
User clique "Modifier"
  ↓
Mode édition activé
  ↓
User modifie champs
  ↓
User clique "Enregistrer"
  ↓
Validation Zod
  ↓
[onMutate] Optimistic update
  ↓
UI mise à jour immédiatement
  ↓
API call Supabase
  ↓
[onSuccess] Toast success
  ↓
[onSettled] Refetch pour confirmer
  ↓
Mode édition fermé
```

**Si erreur** :
```
[onError] Rollback optimistic
  ↓
Restaurer anciennes valeurs
  ↓
Toast error
```

---

## 🎨 Design System

### Colors Used

| Element | Color | Class |
|---------|-------|-------|
| Icons section | Cyan | text-grid-cyan-600 |
| Icons section | Orange | text-grid-orange-600 |
| Icons section | Purple | text-grid-purple-600 |
| Button primary | Cyan | bg-grid-cyan-500 |
| Loading spinner | Cyan | border-grid-cyan-500 |
| Error border | Red | border-red-500 |
| Success toast | Green | bg-green-50 |

### Spacing

- Section spacing: mb-6
- Content padding: p-6
- Max width: max-w-4xl

---

## 📦 Dépendances Installées

```json
{
  "browser-image-compression": "^2.x.x"
}
```

**Usage** : Compression d'images côté client avant upload.

---

## 🚀 Prochaines Étapes

### PROMPT 7 : Planning Individuel

Créer interface de gestion du planning individuel :
- Calendrier de disponibilités
- Sélection de plages dates
- Statuts: disponible, indisponible, absent
- CRUD disponibilités

### Améliorations Futures

- **Crop image** avant upload
- **Multiple formats** avatar (thumbnail, medium, large)
- **History** des modifications profil
- **Export profil** PDF
- **Dark mode** support

---

## 💡 Tips d'Utilisation

### Personnaliser Compression

Dans `useProfile.ts` :

```typescript
const options = {
  maxSizeMB: 0.5,           // 500 KB au lieu de 1 MB
  maxWidthOrHeight: 300,    // 300px au lieu de 400px
  useWebWorker: true,
  fileType: 'image/webp',   // WebP au lieu de JPEG
}
```

### Ajouter Champs au Formulaire

1. **Ajouter dans schema** :
```typescript
const profileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(), // 👈 Nouveau champ
})
```

2. **Ajouter dans formData** :
```typescript
const [formData, setFormData] = useState({
  full_name: profile.full_name || '',
  phone: profile.phone || '',
  bio: profile.bio || '', // 👈 Nouveau
})
```

3. **Ajouter input dans JSX** :
```tsx
<textarea
  value={formData.bio}
  onChange={(e) => handleChange('bio', e.target.value)}
  rows={4}
  className="w-full px-3 py-2 border rounded-md"
/>
```

### Custom Toast Duration

Dans `toast.tsx` :

```typescript
setTimeout(() => {
  setToasts((prev) => prev.filter((toast) => toast.id !== id))
}, 3000) // 3 secondes au lieu de 5
```

---

## ✨ Résumé

**🎉 GESTION PROFILS 100% FONCTIONNELLE !**

Votre page profil GRID78 dispose maintenant de :
- ✅ Upload avatar drag & drop
- ✅ Compression image automatique
- ✅ Progress bar upload
- ✅ Formulaire édition avec validation Zod
- ✅ Champs readonly (email, role)
- ✅ Optimistic updates (instant UI)
- ✅ Rollback automatique sur erreur
- ✅ Toast notifications (success/error)
- ✅ Loading states partout
- ✅ Sections placeholders (qualifications, formations)
- ✅ Design GRID78 cohérent
- ✅ Responsive mobile/desktop

**Prochaine étape** : PROMPT 7 - Planning Individuel ! 📅

---

**PROMPT 6 Complété** ✅  
**Temps estimé** : ~90 min  
**Prochaine étape** : PROMPT 7 - Gestion Planning avec Calendrier Personnel
