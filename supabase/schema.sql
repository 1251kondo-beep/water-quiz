-- ======================================================================
-- Supabase Database Schema for Water Quiz App (水道財政クイズ)
-- Execute this SQL script in Supabase SQL Editor (https://supabase.com)
-- ======================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------
-- 1. User Progress Table (ユーザーの各レッスンクリア状況)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_session_id TEXT NOT NULL, -- UUID or localStorage session ID
  lesson_id TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage INT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  stars INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_session_id, lesson_id)
);

-- Index for fast lookup per session
CREATE INDEX IF NOT EXISTS idx_user_progress_session ON public.user_progress(user_session_id);

-- ----------------------------------------------------------------------
-- 2. User Mistakes History Table (要復習問題の記録)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_user_mistakes_session ON public.user_mistakes(user_session_id);

-- ----------------------------------------------------------------------
-- 3. User Bookmarks Table (お気に入り問題の記録)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_session ON public.user_bookmarks(user_session_id);

-- ----------------------------------------------------------------------
-- 4. Enable Row Level Security (RLS) and Allow Anon/Public Access
-- ----------------------------------------------------------------------
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Allow anon public read/write access for user session syncing
CREATE POLICY "Allow anon select on user_progress" ON public.user_progress FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/update on user_progress" ON public.user_progress FOR ALL USING (true);

CREATE POLICY "Allow anon select on user_mistakes" ON public.user_mistakes FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/delete on user_mistakes" ON public.user_mistakes FOR ALL USING (true);

CREATE POLICY "Allow anon select on user_bookmarks" ON public.user_bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/delete on user_bookmarks" ON public.user_bookmarks FOR ALL USING (true);
