# 📦 Supabase Storage - Configuration Bucket Avatars

## Étapes de Configuration

### 1. Créer le Bucket

1. Aller sur **Supabase Dashboard**
2. Sélectionner votre projet **grid78-drone-team**
3. Menu de gauche : **Storage**
4. Cliquer sur **New bucket**
5. Configuration :
   - **Name** : `avatars`
   - **Public** : ✅ Coché (pour accès direct aux avatars)
   - **File size limit** : 5 MB
   - **Allowed MIME types** : `image/jpeg, image/png, image/webp, image/gif`
6. Cliquer sur **Create bucket**

### 2. Configurer les Storage Policies

Pour permettre aux utilisateurs d'uploader et de voir leurs avatars :

#### Policy 1 : Public Read (Lecture publique)

```sql
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

#### Policy 2 : Authenticated Upload (Upload authentifié)

```sql
CREATE POLICY "Users can upload their avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3 : Authenticated Update (Mise à jour authentifiée)

```sql
CREATE POLICY "Users can update their avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4 : Authenticated Delete (Suppression authentifiée)

```sql
CREATE POLICY "Users can delete their avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Structure des Fichiers

Les avatars seront organisés ainsi :
```
avatars/
  └── [user_id]/
      └── avatar.jpg
```

Exemple :
```
avatars/123e4567-e89b-12d3-a456-426614174000/avatar.jpg
```

### 4. URL Publique

Format URL :
```
https://[PROJECT_REF].supabase.co/storage/v1/object/public/avatars/[user_id]/avatar.jpg
```

### 5. Tailles Recommandées

- **Max upload** : 5 MB
- **Dimension recommandée** : 400x400 px
- **Format** : JPG, PNG, WebP
- **Compression** : Quality 80%

## Vérification

Pour vérifier que tout fonctionne :

1. Aller dans **Storage** → **avatars**
2. Vous devriez voir le bucket vide
3. Policies visibles dans **Policies** tab

## Notes

- Les avatars sont **publics** (accessible sans authentification)
- Upload/Update/Delete nécessitent **authentification**
- Chaque utilisateur ne peut modifier que **son propre avatar**
- Le dossier est créé automatiquement au premier upload
