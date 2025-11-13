-- GeoSim Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  ai_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  title TEXT,
  tags TEXT[]
);

-- Enable Row Level Security
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own simulations
CREATE POLICY "Users can read own simulations"
  ON simulations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own simulations
CREATE POLICY "Users can insert own simulations"
  ON simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own simulations
CREATE POLICY "Users can update own simulations"
  ON simulations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own simulations
CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public simulations are viewable by all authenticated users
CREATE POLICY "Public simulations are viewable"
  ON simulations FOR SELECT
  USING (is_public = TRUE AND auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_is_public ON simulations(is_public);
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simulations_tags ON simulations USING GIN(tags);
