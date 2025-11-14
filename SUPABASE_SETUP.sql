-- ================================================
-- SCHEMA COMPLET SUPABASE - Application Drone Team
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLES
-- ================================================

-- Table Profiles (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'pilot' CHECK (role IN ('pilot', 'chief')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Disponibilités
CREATE TABLE IF NOT EXISTS public.availabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'tentative')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Table Missions
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  mission_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  chief_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Vols
CREATE TABLE IF NOT EXISTS public.flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  pilot_id UUID NOT NULL REFERENCES public.profiles(id),
  flight_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  drone_model TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Formations (catalogue)
CREATE TABLE IF NOT EXISTS public.trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_hours INTEGER,
  category TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Association User-Formations
CREATE TABLE IF NOT EXISTS public.user_trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  completed_at DATE NOT NULL,
  expires_at DATE,
  certificate_url TEXT,
  validated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, training_id, completed_at)
);

-- Table Consignes de Sécurité
CREATE TABLE IF NOT EXISTS public.safety_guidelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  document_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES POUR PERFORMANCE
-- ================================================

-- Availabilities
CREATE INDEX IF NOT EXISTS idx_availabilities_user_id ON public.availabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_availabilities_dates ON public.availabilities(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_availabilities_status ON public.availabilities(status);

-- Missions
CREATE INDEX IF NOT EXISTS idx_missions_date ON public.missions(mission_date DESC);
CREATE INDEX IF NOT EXISTS idx_missions_status ON public.missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_chief_id ON public.missions(chief_id);

-- Flights
CREATE INDEX IF NOT EXISTS idx_flights_mission_id ON public.flights(mission_id);
CREATE INDEX IF NOT EXISTS idx_flights_pilot_id ON public.flights(pilot_id);
CREATE INDEX IF NOT EXISTS idx_flights_date ON public.flights(flight_date DESC);

-- User Trainings
CREATE INDEX IF NOT EXISTS idx_user_trainings_user_id ON public.user_trainings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trainings_training_id ON public.user_trainings(training_id);
CREATE INDEX IF NOT EXISTS idx_user_trainings_expires_at ON public.user_trainings(expires_at);

-- Safety Guidelines
CREATE INDEX IF NOT EXISTS idx_safety_category ON public.safety_guidelines(category);
CREATE INDEX IF NOT EXISTS idx_safety_priority ON public.safety_guidelines(priority);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_guidelines ENABLE ROW LEVEL SECURITY;

-- ================================================
-- POLICIES - PROFILES
-- ================================================

-- Lecture: tous les utilisateurs authentifiés peuvent voir tous les profils
CREATE POLICY "Profiles lisibles par tous authentifiés"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Update: utilisateur peut modifier son propre profil
CREATE POLICY "Users modifient leur propre profil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Chiefs peuvent modifier tous les profils
CREATE POLICY "Chiefs peuvent modifier tous les profils"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- Insert: géré via trigger après signup
CREATE POLICY "Service role peut insérer profils"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ================================================
-- POLICIES - AVAILABILITIES
-- ================================================

-- Lecture: tous voient toutes les disponibilités
CREATE POLICY "Disponibilités lisibles par tous"
  ON public.availabilities FOR SELECT
  TO authenticated
  USING (true);

-- Insert: user peut créer ses propres dispos
CREATE POLICY "Users créent leurs propres disponibilités"
  ON public.availabilities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update: user modifie ses propres dispos
CREATE POLICY "Users modifient leurs propres disponibilités"
  ON public.availabilities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: user supprime ses propres dispos
CREATE POLICY "Users suppriment leurs propres disponibilités"
  ON public.availabilities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ================================================
-- POLICIES - MISSIONS
-- ================================================

-- Lecture: tous voient toutes les missions
CREATE POLICY "Missions lisibles par tous"
  ON public.missions FOR SELECT
  TO authenticated
  USING (true);

-- Insert: seulement chiefs
CREATE POLICY "Chiefs créent missions"
  ON public.missions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- Update: seulement chiefs
CREATE POLICY "Chiefs modifient missions"
  ON public.missions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- Delete: seulement chiefs
CREATE POLICY "Chiefs suppriment missions"
  ON public.missions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- ================================================
-- POLICIES - FLIGHTS
-- ================================================

-- Lecture: tous voient tous les vols
CREATE POLICY "Vols lisibles par tous"
  ON public.flights FOR SELECT
  TO authenticated
  USING (true);

-- Insert: pilot crée vol avec son propre pilot_id
CREATE POLICY "Pilots créent leurs propres vols"
  ON public.flights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pilot_id);

-- Update: pilot modifie ses propres vols OU chief modifie tous
CREATE POLICY "Pilots modifient leurs propres vols"
  ON public.flights FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = pilot_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- Delete: pilot supprime ses propres vols OU chief
CREATE POLICY "Pilots suppriment leurs propres vols"
  ON public.flights FOR DELETE
  TO authenticated
  USING (
    auth.uid() = pilot_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- ================================================
-- POLICIES - TRAININGS
-- ================================================

-- Lecture: tous voient toutes les formations
CREATE POLICY "Formations lisibles par tous"
  ON public.trainings FOR SELECT
  TO authenticated
  USING (true);

-- CRUD: seulement chiefs
CREATE POLICY "Chiefs gèrent formations"
  ON public.trainings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- ================================================
-- POLICIES - USER_TRAININGS
-- ================================================

-- Lecture: tous voient toutes les certifications
CREATE POLICY "Certifications lisibles par tous"
  ON public.user_trainings FOR SELECT
  TO authenticated
  USING (true);

-- Insert/Update/Delete: seulement chiefs
CREATE POLICY "Chiefs gèrent certifications"
  ON public.user_trainings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- ================================================
-- POLICIES - SAFETY_GUIDELINES
-- ================================================

-- Lecture: tous voient toutes les consignes
CREATE POLICY "Consignes lisibles par tous"
  ON public.safety_guidelines FOR SELECT
  TO authenticated
  USING (true);

-- CRUD: seulement chiefs
CREATE POLICY "Chiefs gèrent consignes sécurité"
  ON public.safety_guidelines FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'chief'
    )
  );

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Function: Auto-création profil après signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'pilot')
  );
  RETURN NEW;
END;
$$;

-- Trigger: Exécuter handle_new_user après insert dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Updated_at automatique
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers updated_at pour chaque table
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_availabilities ON public.availabilities;
CREATE TRIGGER set_updated_at_availabilities
  BEFORE UPDATE ON public.availabilities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_missions ON public.missions;
CREATE TRIGGER set_updated_at_missions
  BEFORE UPDATE ON public.missions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_flights ON public.flights;
CREATE TRIGGER set_updated_at_flights
  BEFORE UPDATE ON public.flights
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- VIEWS UTILES
-- ================================================

-- Vue: Disponibilités avec infos user
CREATE OR REPLACE VIEW public.availabilities_with_user AS
SELECT
  a.*,
  p.full_name,
  p.email,
  p.role,
  p.avatar_url
FROM public.availabilities a
JOIN public.profiles p ON a.user_id = p.id;

-- Vue: Missions avec infos chief et compteurs
CREATE OR REPLACE VIEW public.missions_with_details AS
SELECT
  m.*,
  p.full_name as chief_name,
  COUNT(DISTINCT f.id) as flights_count,
  SUM(f.duration_minutes) as total_flight_minutes,
  COUNT(DISTINCT f.pilot_id) as pilots_count
FROM public.missions m
LEFT JOIN public.profiles p ON m.chief_id = p.id
LEFT JOIN public.flights f ON m.id = f.mission_id
GROUP BY m.id, p.full_name;

-- Vue: Vols avec infos pilot et mission
CREATE OR REPLACE VIEW public.flights_with_details AS
SELECT
  f.*,
  p.full_name as pilot_name,
  p.email as pilot_email,
  m.title as mission_title,
  m.mission_date
FROM public.flights f
JOIN public.profiles p ON f.pilot_id = p.id
JOIN public.missions m ON f.mission_id = m.id;

-- Vue: Certifications avec détails user et training
CREATE OR REPLACE VIEW public.user_trainings_with_details AS
SELECT
  ut.*,
  p.full_name as user_name,
  p.email as user_email,
  t.name as training_name,
  t.description as training_description,
  t.duration_hours,
  CASE
    WHEN ut.expires_at IS NULL THEN 'valid'
    WHEN ut.expires_at < CURRENT_DATE THEN 'expired'
    WHEN ut.expires_at < CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
    ELSE 'valid'
  END as status
FROM public.user_trainings ut
JOIN public.profiles p ON ut.user_id = p.id
JOIN public.trainings t ON ut.training_id = t.id;

-- ================================================
-- FUNCTION: Statistiques Dashboard
-- ================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM public.profiles),
    'total_pilots', (SELECT COUNT(*) FROM public.profiles WHERE role = 'pilot'),
    'total_chiefs', (SELECT COUNT(*) FROM public.profiles WHERE role = 'chief'),
    'available_today', (
      SELECT COUNT(DISTINCT user_id)
      FROM public.availabilities
      WHERE CURRENT_DATE BETWEEN start_date AND end_date
    ),
    'missions_this_month', (
      SELECT COUNT(*)
      FROM public.missions
      WHERE DATE_TRUNC('month', mission_date) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    'active_missions', (
      SELECT COUNT(*)
      FROM public.missions
      WHERE status = 'in_progress'
    ),
    'total_flight_hours_this_month', (
      SELECT COALESCE(SUM(duration_minutes), 0) / 60.0
      FROM public.flights
      WHERE DATE_TRUNC('month', flight_date) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    'certifications_expiring_soon', (
      SELECT COUNT(*)
      FROM public.user_trainings
      WHERE expires_at IS NOT NULL
      AND expires_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- ================================================
-- STORAGE BUCKETS & POLICIES
-- ================================================

-- Créer buckets (à exécuter via Dashboard ou API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- Policies Storage: Avatars
-- CREATE POLICY "Users peuvent lire leur propre avatar"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users peuvent uploader leur propre avatar"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users peuvent mettre à jour leur propre avatar"
--   ON storage.objects FOR UPDATE
--   TO authenticated
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ================================================
-- DONNÉES DE TEST (optionnel)
-- ================================================

-- Insérer quelques formations de base
INSERT INTO public.trainings (name, description, duration_hours, category) VALUES
  ('Télépilote Drone DGAC', 'Certification DGAC pour pilotage professionnel de drones', 35, 'Certification'),
  ('Sécurité Incendie Niveau 1', 'Formation de base sécurité incendie et évacuation', 14, 'Sécurité'),
  ('Premiers Secours PSC1', 'Formation premiers secours civiques niveau 1', 7, 'Secours'),
  ('Vol de Nuit', 'Qualification vol de drone en conditions nocturnes', 8, 'Qualification'),
  ('Photogrammétrie', 'Techniques de photogrammétrie par drone', 16, 'Technique')
ON CONFLICT (name) DO NOTHING;

-- Insérer quelques consignes de sécurité
INSERT INTO public.safety_guidelines (title, content, category, priority) VALUES
  (
    'Vérifications Pré-Vol Obligatoires',
    E'## Check-list avant chaque vol\n\n1. Vérifier conditions météo (vent < 40 km/h)\n2. Contrôler niveau batterie drone (>30%)\n3. Calibrer GPS et compas\n4. Vérifier espace aérien (pas de NOTAM)\n5. Informer le chef d''unité',
    'Procédure',
    'critical'
  ),
  (
    'Zones Interdites de Vol',
    E'## Liste des zones à éviter\n\n- Aéroports et aérodromes (rayon 5km)\n- Zones militaires\n- Sites sensibles (centrales, prisons)\n- Rassemblements de personnes sans autorisation\n\nConsulter Géoportail avant chaque mission.',
    'Réglementation',
    'high'
  ),
  (
    'Procédure en Cas de Perte de Signal',
    E'## Actions à mener\n\n1. Ne pas paniquer\n2. Activer RTH (Return To Home)\n3. Informer immédiatement le chef\n4. Noter dernière position connue\n5. Déclencher procédure de recherche si nécessaire',
    'Urgence',
    'high'
  )
ON CONFLICT DO NOTHING;

-- ================================================
-- NOTES D'INSTALLATION
-- ================================================

/*
INSTRUCTIONS:

1. Copier/coller ce script dans l'éditeur SQL de Supabase (Dashboard > SQL Editor)
2. Exécuter le script complet
3. Vérifier que toutes les tables sont créées (Dashboard > Table Editor)
4. Créer les storage buckets via Dashboard > Storage:
   - avatars (private)
   - documents (private)
   - certificates (private)
5. Configurer les policies storage (voir commentaires ci-dessus)
6. Tester avec un user de test

NEXT STEPS:
- Générer les types TypeScript: npx supabase gen types typescript
- Configurer les variables d'environnement Next.js
- Développer le frontend selon les prompts
*/
