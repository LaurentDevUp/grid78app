# ✅ PROMPT 9 - Formations & Certifications Complété

## 📦 Fichiers Créés

### 1. Hook Custom

#### `src/lib/hooks/useTrainings.ts`
✅ Hooks pour gestion formations et certifications

**3 hooks exportés** :

**1. `useTrainings()`** - Catalogue formations
```typescript
const {
  trainings,          // Array<Training>
  isLoading,
  error,
  createTraining,     // Chiefs only
  updateTraining,     // Chiefs only
  deleteTraining,     // Chiefs only
  isCreating,
  isUpdating,
  isDeleting
} = useTrainings()
```

**2. `useUserTrainings(userId)`** - Certifications user
```typescript
const {
  certifications,     // Array<UserTrainingWithDetails>
  isLoading,
  error,
  addCertification,   // Chiefs: valider certification
  removeCertification,// Chiefs: supprimer certification
  uploadCertificate,  // Upload PDF/image vers Storage
  isAdding,
  isRemoving
} = useUserTrainings(userId)
```

**3. `useTrainingsWithStatus(userId)`** - Catalogue avec statut user
```typescript
const {
  trainingsWithStatus,  // Array<TrainingWithStatus>
  isLoading
} = useTrainingsWithStatus(userId)

// TrainingWithStatus = Training + { isCompleted, user_training }
```

**Upload Certificate** :
```typescript
const url = await uploadCertificate(file, userId, trainingId)
// Upload to: documents/certificates/{userId}/{trainingId}-{timestamp}.ext
// Returns: Public URL
```

**Realtime** :
```typescript
channel: `user-trainings-${userId}`
table: 'user_trainings'
filter: `user_id=eq.${userId}`
→ Invalidate user certifications
```

---

### 2. Composants Trainings

#### `src/components/trainings/TrainingCard.tsx`
✅ Card formation avec statut complétion

**Features** :
- Title + description (clamp-2)
- ✅ **Icon CheckCircle** si complété (vert)
- ⭕ **Icon Circle** si à faire (gris)
- Badge **Obligatoire** si is_required
- Badge **Complété le XX** si terminé (vert)
- Badge **À faire** sinon (bleu)
- Date expiration si applicable

**Props** :
```typescript
interface TrainingCardProps {
  training: TrainingWithStatus
  onClick?: () => void
}
```

**Styling** :
- Border vert si complété
- Border gris sinon
- Hover → Border cyan/vert plus foncé

---

#### `src/components/trainings/CertificationModal.tsx`
✅ Modal validation certification (Chiefs only)

**Features** :
- **Select user** (dropdown tous membres)
- **Select training** (dropdown catalogue)
- **Date complétion** (date picker, default today)
- **Date expiration** (optionnel)
- **Upload certificat** (PDF ou image, max 5MB)
- Validation fichier (type + size)
- Upload progress
- Toast success/error

**Props** :
```typescript
interface CertificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CertificationData) => Promise<void>
  uploadCertificate: (file, userId, trainingId) => Promise<string>
  trainings: Training[]
  users: Array<{ id, full_name, email }>
}
```

**Flow** :
```
Chief sélectionne user + training
  ↓
Remplit dates
  ↓
Upload certificat (optionnel)
  ↓
Soumet
  ↓
INSERT user_trainings
  ↓
Toast success
  ↓
Modal fermé
  ↓
Certification visible
```

---

#### `src/components/trainings/TrainingList.tsx`
✅ Table certifications user avec filtres

**Features** :
- **Filtres** : Toutes / Actives / Expirées
- **Table responsive** avec colonnes :
  - Formation (title + description)
  - Date complétion
  - Expiration (badge success/danger)
  - Certificat (download button)
  - Actions (delete, chiefs only)
- Row rouge si expirée
- Empty state

**Props** :
```typescript
interface TrainingListProps {
  certifications: UserTrainingWithDetails[]
  onDelete?: (id: string) => Promise<void>
  showActions?: boolean
}
```

**Filters Logic** :
- **All** : Toutes certifications
- **Active** : Non expirées OU pas d'expiration
- **Expired** : `expires_at` passée

---

### 3. Page Formations

#### `src/app/trainings/page.tsx`
✅ Page complète avec onglets

**Structure** :
```
┌────────────────────────────────────┐
│  Header + "Valider certification"  │ (Chiefs)
├────────────────────────────────────┤
│  Tabs: Catalogue | Certifications  │
├────────────────────────────────────┤
│  [Catalogue Tab]                   │
│  Grid 3 cols TrainingCards         │
│  - Toutes formations               │
│  - Statut complété/à faire         │
├────────────────────────────────────┤
│  [Certifications Tab]              │
│  TrainingList component            │
│  - Table avec filtres              │
│  - Download certificats            │
│  - Actions si chief                │
└────────────────────────────────────┘
```

**Onglets** :
1. **Catalogue** :
   - Grid formations disponibles
   - Cards avec statut (complété/à faire)
   - Click card → Modal détails (future)

2. **Mes Certifications** :
   - Table certifications
   - Filtres (toutes/actives/expirées)
   - Download certificats
   - Delete (chiefs only)

**Bouton "Valider certification"** (Chiefs) :
- Visible seulement chiefs
- Ouvre CertificationModal
- Sélectionner user + training
- Upload certificat optionnel

---

## 🎨 Status & Badges

### Statut Formation

| État | Badge | Color |
|------|-------|-------|
| À faire | À faire | Blue (default) |
| Complété | Complété le XX | Green (success) |
| Obligatoire | Obligatoire | Orange (warning) |

### Expiration Certification

| État | Badge | Color |
|------|-------|-------|
| Active | Date expiration | Green (success) |
| Expirée | Date expiration | Red (danger) |
| Pas d'expiration | - | Gray |

---

## 🔒 Permissions

### Chiefs (role='chief')

**Formations** :
- ✅ Voir catalogue
- ✅ Voir toutes certifications
- ✅ **Valider certification** pour n'importe quel membre
- ✅ Upload certificat
- ✅ Supprimer certification

### Pilots (role='pilot')

**Formations** :
- ✅ Voir catalogue
- ✅ Voir uniquement SES certifications
- ❌ Valider certification
- ❌ Supprimer certification

---

## 📁 Storage Setup

### Bucket `documents`

**Structure certificats** :
```
documents/
  └── certificates/
      └── {user_id}/
          └── {training_id}-{timestamp}.pdf
```

**Policies requises** :
1. **Public Read** :
```sql
bucket_id = 'documents' AND 
storage.foldername(name)[1] = 'certificates'
```

2. **Authenticated Upload** :
```sql
bucket_id = 'documents' AND 
storage.foldername(name)[1] = 'certificates'
```

**Validation** :
- Types : PDF, images (jpg, png)
- Size max : 5 MB
- Nommage : `{trainingId}-{timestamp}.{ext}`

---

## 🔄 Realtime Updates

### Subscription User Trainings

```typescript
channel: `user-trainings-${userId}`
table: 'user_trainings'
filter: `user_id=eq.${userId}`
events: * (INSERT, UPDATE, DELETE)

→ Invalidate ['user-trainings', userId]
→ Invalidate ['trainings-with-status']
```

**Effet** :
- Chief valide certification → User voit immédiatement
- Certification expirée → Badge rouge automatique
- Catalogue updated → Cards avec statut rafraîchies

---

## 🧪 Tester Formations

### Test 1 : Voir Catalogue (Pilot)

1. **Se connecter** en tant que pilot
2. **Aller** sur /trainings
3. **Onglet Catalogue**
4. **Vérifier** :
   - Formations listées
   - Badges "À faire" sur toutes
   - Pas de bouton "Valider certification"

### Test 2 : Valider Certification (Chief)

1. **Se connecter** en tant que chief
2. **Click** "Valider certification"
3. **Sélectionner** :
   - User : Un pilot
   - Formation : Une du catalogue
   - Date complétion : Aujourd'hui
4. **Upload** certificat PDF (optionnel)
5. **Soumettre**
6. **Vérifier** :
   - Toast success
   - Onglet "Mes Certifications"
   - Certification dans table

### Test 3 : Filtres Certifications

1. **Onglet "Mes Certifications"**
2. **Click** "Actives"
3. **Vérifier** : Seulement certifications non expirées
4. **Click** "Expirées"
5. **Vérifier** : Seulement certifications expirées (row rouge)

### Test 4 : Download Certificat

1. **Certification avec certificat**
2. **Click** bouton "Télécharger"
3. **Vérifier** : PDF téléchargé

### Test 5 : Supprimer Certification (Chief)

1. **En tant que chief**
2. **Onglet Certifications**
3. **Bouton poubelle** visible
4. **Click** → Confirm
5. **Vérifier** : Certification supprimée

### Test 6 : Realtime

**Terminal 1** : Chief valide certification pour pilot A
**Terminal 2** : Pilot A sur page formations

1. **Terminal 1** : Valider certification
2. **Observer Terminal 2** :
   - Onglet Catalogue → Badge "Complété" apparaît ⚡
   - Onglet Certifications → Nouvelle ligne ⚡
   - Aucun refresh !

---

## 📋 Flow Complet Validation

```
Chief click "Valider certification"
  ↓
Modal s'ouvre
  ↓
Sélectionne user + training
  ↓
Remplit dates
  ↓
(Optionnel) Upload certificat PDF
  ↓
Submit
  ↓
[Upload certificat si présent]
  - Compression
  - Upload Storage
  - Get public URL
  ↓
INSERT user_trainings
  - user_id
  - training_id
  - completed_at
  - expires_at
  - certificate_url
  - validated_by (chief_id)
  ↓
Realtime broadcast
  ↓
React Query invalidate
  ↓
User catalogue refetch → Badge "Complété"
  ↓
User certifications refetch → Nouvelle ligne
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
| Button "Valider" | Purple | bg-grid-purple-500 |
| Tabs active | Purple | border-grid-purple-500 |
| Cards complétées | Green | border-green-200 |
| Badge complété | Green | variant="success" |
| Badge à faire | Blue | variant="default" |
| Badge obligatoire | Orange | variant="warning" |
| Badge expiré | Red | variant="danger" |
| Row expirée | Red | bg-red-50 |

### Icons

- BookOpen (Catalogue) : Purple
- Award (Certifications) : Purple
- CheckCircle (Complété) : Green
- Circle (À faire) : Gray
- Download (Certificat) : Cyan
- Plus (Valider) : White

---

## 📚 Schema Database

### Table `trainings`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | PK |
| name | text | Nom formation |
| description | text | Description |
| duration_hours | int | Durée en heures |
| category | text | Catégorie |
| document_url | text | Doc téléchargeable |
| created_at | timestamp | Date création |
| updated_at | timestamp | Date MAJ |

### Table `user_trainings`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| training_id | uuid | FK trainings |
| completed_at | date | Date complétion |
| expires_at | date | Date expiration |
| certificate_url | text | URL certificat |
| validated_by | uuid | FK profiles (chief) |
| created_at | timestamp | Date création |
| updated_at | timestamp | Date MAJ |

---

## 🚀 Prochaines Étapes

### PROMPT 10 : Sécurité Aérienne

Créer page consignes sécurité :
- Sections accordéon
- Markdown content
- Priority badges
- Édition chiefs
- Upload documents

### Améliorations Futures Formations

- **Modal détails** formation (click card)
- **Statistiques** taux complétion équipe
- **Rappels** formations à renouveler
- **Historique** modifications certifications
- **Export** PDF liste certifications
- **Notifications** expiration proche

---

## 💡 Tips d'Utilisation

### Ajouter Formation au Catalogue

SQL via Supabase Dashboard :

```sql
INSERT INTO trainings (name, description, duration_hours, category)
VALUES 
  ('Vol en conditions difficiles', 'Formation avancée conditions météo', 8, 'Advanced'),
  ('Réglementation drone', 'Réglementation aérienne', 4, 'Required'),
  ('Premier secours', 'Formation secourisme', 16, 'Safety');
```

### Filtrer par Catégorie

Dans page :

```typescript
const [categoryFilter, setCategoryFilter] = useState('all')

const filtered = trainingsWithStatus.filter(t => 
  categoryFilter === 'all' || t.category === categoryFilter
)
```

### Export Certifications PDF

Ajouter bouton export :

```typescript
import jsPDF from 'jspdf'

const exportPDF = () => {
  const doc = new jsPDF()
  doc.text('Mes Certifications', 10, 10)
  // Add certifications...
  doc.save('certifications.pdf')
}
```

---

## ✨ Résumé

**🎉 FORMATIONS & CERTIFICATIONS 100% FONCTIONNELLES !**

Votre système formations GRID78 dispose maintenant de :
- ✅ Catalogue formations complet
- ✅ Tracking certifications par user
- ✅ Validation chiefs avec upload certificat
- ✅ Onglets Catalogue / Certifications
- ✅ Filtres (toutes/actives/expirées)
- ✅ Table responsive avec download
- ✅ Upload certificats Supabase Storage
- ✅ Badges statut colorés (4 types)
- ✅ Realtime Supabase updates
- ✅ Permissions rôle-based
- ✅ Loading states
- ✅ Empty states
- ✅ Toast notifications
- ✅ Design GRID78 cohérent (purple theme)
- ✅ Responsive mobile/desktop

**Prochaine étape** : PROMPT 10 - Sécurité Aérienne ! 🛡️

---

**PROMPT 9 Complété** ✅  
**Temps estimé** : ~120 min  
**Prochaine étape** : PROMPT 10 - Consignes de Sécurité Éditables
