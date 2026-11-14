# Codveda Internship
## Level 1: Basic

### Task 1: Setup Development Environment

**Status:** Completed

**Technologies:**
- Node.js
- npm
- Visual Studio Code
- Git and GitHub
- PostgreSQL
- pgAdmin 4
- PowerShell

**Completed Objectives:**

1. Installed and configured Node.js and npm.
2. Configured Visual Studio Code and development extensions.
3. Created and configured a GitHub repository.
4. Practiced basic Git commands.
5. Installed and verified PostgreSQL.
6. Practiced basic terminal commands.
7. Prepared technical documentation and screenshots.

**Deliverables:**
- Environment setup documentation.
- Installation and configuration screenshots.
- GitHub repository containing the completed work.

---

### Task 2: Build a Simple REST API

**Status:** Completed

**Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)

**Technologies:**
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors
- Postman / Thunder Client

**Completed Objectives:**

1. Initialized Node.js project and structured modular Express application architecture.
2. Created PostgreSQL database (`menged_db`) schema with `opportunities` table, constraints, and indexes.
3. Seeded initial demonstration opportunities across all core categories (Internships, Scholarships, Remote jobs, Training programs, Fellowships).
4. Implemented full CRUD RESTful endpoints (`POST`, `GET`, `GET :id`, `PUT`, `DELETE`).
5. Implemented centralized error handling and request validation (400, 404, 500, 204, 201, 200).
6. Configured CORS and JSON body-parsing middleware.
7. Prepared complete Postman/Thunder Client testing collection with 15 test scenarios.
8. Authored technical documentation, database schema specification, and evidence screenshot guide.

**Deliverables:**
- Express REST API source code (`src/`).
- PostgreSQL schema and demonstration seed scripts (`database/`).
- Comprehensive API and Database documentation (`documentation/`).
- Postman / Thunder Client automated test collection (`tests/`).
- Task 2 README and submission evidence guide.

---

### Task 3: Build a Dynamic Frontend with Vanilla JavaScript

**Status:** Completed

**Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)

**Technologies:**
- HTML5
- CSS3 (Custom properties, Flexbox, CSS Grid)
- Vanilla JavaScript (ES6+, async/await)
- Fetch API
- Google Fonts (Plus Jakarta Sans, Noto Sans Ethiopic)

**Completed Objectives:**

1. Developed a responsive, modern HTML5 user interface with branded navigation and hero section.
2. Connected frontend dynamically to Express REST API endpoints (`/api/opportunities`) using the native Fetch API.
3. Rendered opportunity cards dynamically from real PostgreSQL records with category badges, deadline chips, and external application links.
4. Implemented real-time debounced search (300ms) and multi-factor category and discipline filtering.
5. Built an accessible opportunity details modal displaying full descriptions, eligibility, and direct apply triggers.
6. Engineered an interactive CRUD management dashboard enabling Create (POST), Edit (PUT), and Delete (DELETE) operations with confirmation dialogs.
7. Implemented loading skeletons, defensive network error banners, and empty search states.
8. Prepared technical documentation, submission screenshot guide, and comprehensive README.

**Deliverables:**
- Frontend single-page application (`index.html`).
- Responsive stylesheets (`css/style.css`).
- Vanilla JavaScript application logic (`js/app.js`).
- Complete frontend technical documentation (`documentation/FRONTEND_DOCUMENTATION.md`).
- Evaluation screenshot capture guide (`screenshots/README.md`).
- Task 3 README documentation.
