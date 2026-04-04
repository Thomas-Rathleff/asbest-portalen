-- Kør i Supabase SQL Editor

CREATE TABLE IF NOT EXISTS virksomheder (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asbe_nr TEXT UNIQUE NOT NULL,
  navn TEXT,
  adresse TEXT,
  postnr TEXT,
  by TEXT,
  cvr TEXT,
  region TEXT,
  hjemmeside TEXT,
  telefon TEXT,
  beskrivelse TEXT,
  premium BOOLEAN DEFAULT false,
  aktiv BOOLEAN DEFAULT true,
  sidst_opdateret TIMESTAMPTZ DEFAULT NOW(),
  oprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tillad offentlig læsning
ALTER TABLE virksomheder ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Offentlig læsning" ON virksomheder FOR SELECT USING (true);
CREATE POLICY "Service kan skrive" ON virksomheder FOR ALL USING (true);

-- Indeks for hurtig søgning
CREATE INDEX IF NOT EXISTS idx_virksomheder_postnr ON virksomheder(postnr);
CREATE INDEX IF NOT EXISTS idx_virksomheder_asbe_nr ON virksomheder(asbe_nr);
