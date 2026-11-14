-- =============================================================================
-- MENGED DATABASE SEED DATA
-- Database: menged_db
-- Description: Demonstration opportunity records for testing and development
-- NOTE: All records below are simulated demonstration opportunities created
-- solely for internship development and testing purposes. They do not represent
-- active, verified, or guaranteed openings.
-- =============================================================================

INSERT INTO opportunities (
    title,
    organization,
    type,
    field,
    description,
    eligibility,
    deadline,
    application_url,
    location,
    created_at,
    updated_at
) VALUES
(
    'Demonstration: Junior Software Engineering Internship',
    'TechEthio Innovations (Demonstration Entity)',
    'Internships',
    'Software Engineering',
    'Simulated 3-month hands-on backend and API development internship for graduating computer science students.',
    'Undergraduate students in Computer Science, Software Engineering, or related fields in Ethiopian universities.',
    '2026-12-31',
    'https://example.com/demo/internship-apply',
    'Addis Ababa, Ethiopia',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Demonstration: Graduate STEM Excellence Scholarship',
    'Ethiopian Education Support Initiative (Demonstration Entity)',
    'Scholarships',
    'Computer Science & Data Science',
    'Simulated partial tuition scholarship for high-achieving Ethiopian university graduates pursuing advanced ICT degrees.',
    'Graduated within the last 2 years with a GPA of 3.5 or higher from an accredited Ethiopian higher education institution.',
    '2026-11-30',
    'https://example.com/demo/scholarship-apply',
    'Addis Ababa, Ethiopia (Hybrid)',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Demonstration: Junior Frontend Developer (Remote)',
    'Global Pan-African Tech Labs (Demonstration Entity)',
    'Remote jobs',
    'Web Development',
    'Simulated junior remote role focusing on building accessible and responsive user interfaces with JavaScript.',
    'Proficiency in HTML5, CSS3, JavaScript (ES6+), and understanding of REST APIs. Open to Ethiopian residents.',
    '2026-12-15',
    'https://example.com/demo/remote-job-apply',
    'Remote (Ethiopia)',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Demonstration: Cloud Computing & DevOps Training Bootcamp',
    'Horn of Africa Tech Academy (Demonstration Entity)',
    'Training programs',
    'Cloud Computing',
    'Simulated 8-week intensive bootcamp covering Docker, Linux fundamentals, PostgreSQL, and cloud deployments.',
    'Recent graduates or final-year university students with foundational programming knowledge.',
    '2027-01-15',
    'https://example.com/demo/bootcamp-register',
    'Hawassa, Ethiopia (Online/Hybrid)',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Demonstration: African Tech Leadership & AI Fellowship',
    'Future African Innovators Network (Demonstration Entity)',
    'Fellowships',
    'Artificial Intelligence & Leadership',
    'Simulated 6-month fellowship offering mentorship, project funding, and leadership development in emerging technologies.',
    'Graduates and young technology professionals passionate about solving local challenges using modern technologies.',
    '2027-02-28',
    'https://example.com/demo/fellowship-apply',
    'Addis Ababa, Ethiopia',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
