-- =============================================================================
-- MENGED DATABASE SCHEMA
-- Database: menged_db
-- Description: Opportunity discovery platform schema for Ethiopian students & graduates
-- =============================================================================

-- Drop table if it already exists (useful for clean setup / reset)
DROP TABLE IF EXISTS opportunities;

-- Create opportunities table
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Internships', 'Scholarships', 'Remote jobs', 'Training programs', 'Fellowships')),
    field VARCHAR(100),
    description TEXT NOT NULL,
    eligibility TEXT,
    deadline DATE,
    application_url TEXT,
    location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering by type and field
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_field ON opportunities(field);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
