/*
  # Add AI Features to Database Schema

  1. New Tables
    - ai_analysis
      - Stores AI-generated insights and recommendations
    - ai_interactions
      - Logs all interactions with AI agents
    - ai_feedback
      - Stores feedback on AI performance for continuous improvement

  2. Changes
    - Add AI-related columns to existing tables
    - Add indexes for AI-related queries

  3. Security
    - Enable RLS on new tables
    - Add policies for AI-related data access
*/

-- AI Analysis table
CREATE TABLE IF NOT EXISTS ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  recommendations jsonb NOT NULL DEFAULT '[]',
  confidence_score float NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- AI Interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  input jsonb NOT NULL,
  output jsonb NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AI Feedback table
CREATE TABLE IF NOT EXISTS ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  interaction_id uuid REFERENCES ai_interactions(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add AI-related columns to existing tables
ALTER TABLE inventory
ADD COLUMN IF NOT EXISTS ai_predictions jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_ai_analysis timestamptz;

ALTER TABLE staff
ADD COLUMN IF NOT EXISTS ai_schedule_suggestions jsonb DEFAULT '[]'::jsonb;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS ai_insights jsonb DEFAULT '{}'::jsonb;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_analysis_restaurant ON ai_analysis(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_type ON ai_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_restaurant ON ai_interactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_restaurant ON ai_feedback(restaurant_id);

-- Enable RLS
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Restaurant staff can view AI analysis"
  ON ai_analysis
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = ai_analysis.restaurant_id
    )
  );

CREATE POLICY "Restaurant staff can view AI interactions"
  ON ai_interactions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = ai_interactions.restaurant_id
    )
  );

CREATE POLICY "Restaurant staff can manage AI feedback"
  ON ai_feedback
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = ai_feedback.restaurant_id
    )
  );