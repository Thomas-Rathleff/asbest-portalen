-- Kør dette i Supabase SQL Editor (Database → SQL Editor → New query)

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  navn TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT,
  adresse TEXT,
  postnr TEXT,
  byggeaar INTEGER,
  tagmateriale TEXT,
  risiko TEXT,
  matchede_virksomheder TEXT,
  status TEXT DEFAULT 'ny',
  oprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tillad kun server-side insert (ikke direkte fra browser)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service kan indsætte leads" ON leads
  FOR INSERT WITH CHECK (true);
