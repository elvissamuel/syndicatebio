-- Create tables for Cancer Action Campaign Social Hub

-- Submissions table for photo uploads and engagement
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  filtered_image_url TEXT,
  engagement_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, flagged
  moderation_flags TEXT[], -- array of flagged keywords/issues
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Engagement/Interactions table
CREATE TABLE IF NOT EXISTS engagements (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  engagement_type VARCHAR(50) NOT NULL, -- 'like', 'share', 'comment'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(submission_id, user_id, engagement_type)
);

-- User profiles and scores
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  total_submissions INTEGER DEFAULT 0,
  total_engagements INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Moderation log
CREATE TABLE IF NOT EXISTS moderation_logs (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'flagged', 'approved', 'rejected'
  reason TEXT,
  flagged_keywords TEXT[],
  moderation_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_engagement ON submissions(engagement_count DESC);
CREATE INDEX IF NOT EXISTS idx_engagements_submission ON engagements(submission_id);
CREATE INDEX IF NOT EXISTS idx_engagements_user ON engagements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_score ON user_profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_submission ON moderation_logs(submission_id);
