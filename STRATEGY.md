# Stratégie de Développement - Application Gestion Équipe Drone Pompiers

## Vue d'ensemble

Application web responsive pour gérer une équipe de 50 pompiers télépilotes de drones avec:
- Authentification sécurisée
- Dashboard avec calendrier d'équipe
- Gestion des profils
- Planning individuel → Calendrier commun
- Gestion des missions et vols
- Suivi des formations
- Consignes de sécurité aérienne

**Stack**: Next.js 14 + TypeScript + Supabase + TailwindCSS + shadcn/ui

## Phase 1: Configuration Initiale (Jour 1)

### 1.1 Setup Projet Next.js
```bash
npx create-next-app@latest drone-team-app --typescript --tailwind --app --use-npm
cd drone-team-app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tanstack/react-query date-fns lucide-react
npm install -D @types/node
```

### 1.2 Configuration Supabase
- Créer projet sur supabase.com
- Noter: `SUPABASE_URL` et `SUPABASE_ANON_KEY`
- Créer fichier `.env.local`

### 1.3 Structure des dossiers
```
/src
  /app
    /auth
    /dashboard
    /profile
    /planning
    /missions
    /formations
    /security
  /components
    /ui (shadcn)
    /layout
    /shared
  /lib
    /supabase
    /hooks
    /utils
  /types
```

## Phase 2: Configuration Supabase Backend (Jour 1-2)

### 2.1 Schéma de Base de Données

#### Tables à créer dans Supabase SQL Editor:

```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'pilot' CHECK (role IN ('pilot', 'chief')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disponibilités
CREATE TABLE availabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  mission_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  chief_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vols
CREATE TABLE flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  pilot_id UUID REFERENCES profiles(id),
  flight_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  drone_model TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formations
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Association user-formations
CREATE TABLE user_trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  completed_at DATE NOT NULL,
  expires_at DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, training_id)
);

-- Consignes de sécurité
CREATE TABLE safety_guidelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_availabilities_user_id ON availabilities(user_id);
CREATE INDEX idx_availabilities_dates ON availabilities(start_date, end_date);
CREATE INDEX idx_flights_mission_id ON flights(mission_id);
CREATE INDEX idx_flights_pilot_id ON flights(pilot_id);
CREATE INDEX idx_missions_date ON missions(mission_date);
CREATE INDEX idx_user_trainings_user_id ON user_trainings(user_id);
```

### 2.2 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_guidelines ENABLE ROW LEVEL SECURITY;

-- Profiles: Lecture pour tous, modification par propriétaire ou chief
CREATE POLICY "Profiles visible par tous authentifiés" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users peuvent modifier leur profil" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Chiefs peuvent modifier tous les profils" ON profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);

-- Availabilities: Lecture tous, écriture propriétaire
CREATE POLICY "Dispos visibles par tous" ON availabilities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users créent leurs dispos" ON availabilities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users modifient leurs dispos" ON availabilities FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users suppriment leurs dispos" ON availabilities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Missions: Lecture tous, écriture chiefs
CREATE POLICY "Missions visibles par tous" ON missions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chiefs créent missions" ON missions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);
CREATE POLICY "Chiefs modifient missions" ON missions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);

-- Flights: Lecture tous, pilots créent leurs vols
CREATE POLICY "Vols visibles par tous" ON flights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Pilots créent leurs vols" ON flights FOR INSERT TO authenticated WITH CHECK (auth.uid() = pilot_id);
CREATE POLICY "Pilots modifient leurs vols" ON flights FOR UPDATE TO authenticated USING (auth.uid() = pilot_id);

-- Trainings & user_trainings: Lecture tous, écriture chiefs
CREATE POLICY "Formations visibles par tous" ON trainings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chiefs gèrent formations" ON trainings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);
CREATE POLICY "Certifications visibles par tous" ON user_trainings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chiefs gèrent certifications" ON user_trainings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);

-- Safety guidelines: Lecture tous, écriture chiefs
CREATE POLICY "Consignes visibles par tous" ON safety_guidelines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chiefs gèrent consignes" ON safety_guidelines FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief')
);
```

### 2.3 Storage Buckets

```sql
-- Créer les buckets via Dashboard Supabase ou SQL
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- RLS pour storage
CREATE POLICY "Users accèdent leur avatar" ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Tous lisent documents" ON storage.objects FOR SELECT TO authenticated 
  USING (bucket_id = 'documents');

CREATE POLICY "Chiefs uploadent documents" ON storage.objects FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'documents' AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'chief'));
```

### 2.4 Functions & Triggers

```sql
-- Trigger auto-création profil après signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function pour obtenir disponibilités équipe
CREATE OR REPLACE FUNCTION get_team_availability(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  available_count BIGINT,
  available_pilots JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d::DATE as date,
    COUNT(DISTINCT a.user_id) as available_count,
    JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'name', p.full_name)) as available_pilots
  FROM generate_series(start_date, end_date, '1 day'::interval) d
  LEFT JOIN availabilities a ON d::DATE BETWEEN a.start_date AND a.end_date
  LEFT JOIN profiles p ON a.user_id = p.id
  GROUP BY d::DATE
  ORDER BY d::DATE;
END;
$$ LANGUAGE plpgsql;
```

## Phase 3: Configuration Frontend (Jour 2)

### 3.1 Configuration Supabase Client

Créer `/src/lib/supabase/client.ts` et `/src/lib/supabase/server.ts`

### 3.2 Types TypeScript

Générer types avec Supabase CLI:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### 3.3 Hooks personnalisés

Créer hooks pour:
- `useAuth`
- `useProfile`
- `useAvailabilities`
- `useMissions`
- `useFlights`
- `useTrainings`

## Phase 4: Développement par Module (Jour 3-7)

### Jour 3: Authentification & Layout
- Page login/signup
- Layout principal avec navigation
- Protection des routes
- Gestion des sessions

### Jour 4: Dashboard & Profils
- Page d'accueil avec calendrier équipe
- Composant calendrier réutilisable
- Page profil avec édition
- Upload avatar

### Jour 5: Planning & Disponibilités
- Page planning individuel
- Interface de sélection de dates
- Intégration temps réel Supabase
- Sync avec calendrier équipe

### Jour 6: Missions & Vols
- Liste des missions
- Création/édition mission (chiefs)
- Journal de vol par mission
- Formulaire ajout vol (pilots)

### Jour 7: Formations & Sécurité
- Catalogue formations
- Suivi certifications
- Upload documents
- Page consignes sécurité avec édition

## Phase 5: Tests & Déploiement (Jour 8-10)

### Tests
- Tests unitaires composants
- Tests intégration Supabase
- Tests E2E avec Playwright
- Tests responsive mobile

### Déploiement
- Vercel pour frontend
- Configuration variables d'environnement
- Setup domaine personnalisé
- Monitoring et analytics

## Principes de Développement

### Code Quality
- TypeScript strict
- ESLint + Prettier
- Components réutilisables
- Hooks personnalisés pour logique métier

### Performance
- React Query pour cache et optimistic updates
- Lazy loading des composants
- Optimisation images Next.js
- Suspense boundaries

### Sécurité
- Validation zod côté client
- RLS strict côté Supabase
- Sanitization inputs
- HTTPS uniquement

### UX/UI
- Design system cohérent (shadcn/ui)
- Feedback utilisateur immédiat
- Loading states
- Error boundaries
- Responsive mobile-first

## Points d'Attention

1. **Temps réel**: Utiliser Supabase Realtime uniquement où nécessaire (calendrier, missions actives)
2. **Pagination**: Implémenter pour missions/vols historiques
3. **Cache**: Stratégie React Query appropriée par resource
4. **Offline**: PWA avec service worker pour fonctionnement offline basique
5. **Notifications**: Prévoir système notification pour missions urgentes (Phase 2)

## Ressources Nécessaires

- Compte Supabase (Free tier suffit pour 50 users)
- Compte Vercel pour déploiement
- Domaine personnalisé (optionnel)
- Service email (Supabase Auth email ou SendGrid)

## Scalabilité Future

- Architecture modulaire permet ajout features
- RLS supporte multi-tenancy (plusieurs équipes)
- Supabase scale jusqu'à milliers d'users
- Migration vers plans supérieurs si nécessaire
