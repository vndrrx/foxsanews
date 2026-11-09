-- ==============================================================
-- FOXSA NEWS - SUPABASE DATABASE SCHEMA
-- Jalankan script ini di Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================

-- 1. TABEL AKUN STAFF & JURNALIS (foxsa_staff_accounts)
CREATE TABLE IF NOT EXISTS public.foxsa_staff_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  author_name TEXT,
  role TEXT NOT NULL DEFAULT 'Junior Reporter',
  status TEXT NOT NULL DEFAULT 'approved', -- 'approved', 'pending', 'rejected', 'retired'
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_former BOOLEAN NOT NULL DEFAULT false,
  avatar TEXT,
  quote TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABEL FORMER STAFF / ALUMNI (foxsa_former_staff)
CREATE TABLE IF NOT EXISTS public.foxsa_former_staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  former_role TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'staff', -- 'leadership', 'management', 'staff'
  badge TEXT,
  period TEXT NOT NULL,
  avatar TEXT,
  bio TEXT DEFAULT '',
  legacy TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL CHAT REDAKSI / ADMIN CHAT (foxsa_admin_chats)
CREATE TABLE IF NOT EXISTS public.foxsa_admin_chats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_username TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT,
  sender_avatar TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS
ALTER TABLE public.foxsa_staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foxsa_former_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foxsa_admin_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for foxsa_staff_accounts" ON public.foxsa_staff_accounts;
CREATE POLICY "Public access for foxsa_staff_accounts" ON public.foxsa_staff_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for foxsa_former_staff" ON public.foxsa_former_staff;
CREATE POLICY "Public access for foxsa_former_staff" ON public.foxsa_former_staff FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for foxsa_admin_chats" ON public.foxsa_admin_chats;
CREATE POLICY "Public access for foxsa_admin_chats" ON public.foxsa_admin_chats FOR ALL USING (true) WITH CHECK (true);

-- 5. REALTIME REPLICATION (Agar chat & update akun langsung live tanpa reload)
ALTER PUBLICATION supabase_realtime ADD TABLE public.foxsa_admin_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.foxsa_staff_accounts;

-- 6. DATA AWAL (SEED DEFAULT STAFF & FORMER STAFF)
INSERT INTO public.foxsa_staff_accounts (username, password, display_name, author_name, role, status, is_admin, avatar, quote, bio)
VALUES
  ('admin', 'foxsa2026', 'Arthur Redfields (CEO & Admin)', 'Arthur Redfields', 'Chief Executive Officer', 'approved', true, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg', 'Setiap berita yang terbit harus akurat, tajam, dan menjunjung profesionalisme jurnalisme di San Andreas.', 'CEO & Pimpinan Utama Redaksi FoxSA News Agency.'),
  ('arthur', 'arthurfoxsa', 'Arthur Redfields', 'Arthur Redfields', 'Chief Executive Officer', 'approved', true, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg', 'Setiap berita yang terbit harus akurat, tajam, dan menjunjung profesionalisme jurnalisme di San Andreas.', 'Chief Executive Officer FoxSA News.'),
  ('reinhardt', 'reinhardt2026', 'Reinhardt Harrison', 'Reinhardt Harrison', 'Commissioner', 'approved', true, 'assets/logo/foxsa-icon.jpg', 'Menjaga marwah, independensi redaksi, dan integritas jurnalistik tertinggi FoxSA News.', 'President Commissioner FoxSA News Agency.'),
  ('park', 'parkfoxsa', 'Park Jisung', 'Park Jisung', 'Executive Producer', 'approved', false, 'assets/logo/foxsa-icon.jpg', 'Mengawal dinamika ruang produksi berita studio dan siaran lapangan.', 'Executive Producer'),
  ('steven', 'stevendeluca', 'Steven Deluca', 'Steven Deluca', 'Junior Reporter', 'approved', false, 'assets/logo/foxsa-icon.jpg', 'Belajar dan meliput langsung denyut nadi kota Los Santos.', 'Junior Reporter')
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.foxsa_former_staff (id, name, former_role, category, badge, period, avatar, bio, legacy)
VALUES
  ('former_messiah', 'Messiah Dillard', 'Founder & Former Chief Executive Officer', 'leadership', 'Pendiri & CEO Ke-1', '2025 - 2026', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg', 'Sosok pendiri utama FoxSA News yang meletakkan batu fondasi jurnalisme independen dan berani di San Andreas.', 'Membangun FoxSA News dari nol hingga menjadi salah satu entitas media terbesar dan paling berpengaruh di Los Santos.'),
  ('former_catherine', 'Catherine Cecilie', 'Former Station Manager & Senior Anchor', 'management', 'Pimpinan Siaran', '2025 - 2026', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg', 'Penyiar dan manajer stasiun yang mengawal siaran radio, podcast, dan hubungan komunitas FoxSA.', 'Memperluas jangkauan siaran radio dan program podcast FoxSA ke seluruh pelosok San Andreas.'),
  ('former_boniface', 'Boniface O''Connor', 'Former Senior Field Reporter', 'staff', 'Jurnalis Investigasi', '2025 - 2026', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg', 'Reporter investigasi yang gigih menembus batas liputan kriminal dan konflik jalanan di Los Santos.', 'Seri investigasi mendalam kasus kejahatan terorganisir yang mengangkat nama FoxSA di mata publik.')
ON CONFLICT (id) DO NOTHING;
