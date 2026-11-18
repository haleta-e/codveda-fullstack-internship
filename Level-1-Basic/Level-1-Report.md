# Codveda Internship — Level 1 Milestone Completion Report
## Level 1: Basic (Full-Stack Development)

**Intern Name:** Etsegenet Amsalu (Haleta)  
**Project:** Menged (መንገድ — Opportunity Discovery Platform for Ethiopian Students and Graduates)  
**Repository:** [https://github.com/haleta-e/codveda-fullstack-internship](https://github.com/haleta-e/codveda-fullstack-internship)  
**Milestone Status:** **100% Completed & Verified**  
**Core Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js (v24.18.0), Express.js (v4.21.2), PostgreSQL (v17.11)  
**System Specifications:** [Product Requirements](../docs/PRODUCT_REQUIREMENTS.md) | [System Architecture](../docs/SYSTEM_ARCHITECTURE.md) | [Database Design](../docs/DATABASE_DESIGN.md) | [Data Standard](../docs/OPPORTUNITY_DATA_STANDARD.md) | [Roadmap](../docs/DEVELOPMENT_ROADMAP.md)

---

### Task 1: Setup Development Environment

**Status:** **Completed & Verified**

**Technologies & Tools:**
- Node.js (v24.18.0)
- npm (11.16.0)
- Visual Studio Code & Development Extensions (Prettier, ESLint, GitLens, REST Client, PostgreSQL)
- Git (v2.55.0.windows.3) & GitHub (`haleta-e`)
- PostgreSQL (v17.11) & pgAdmin 4
- Windows PowerShell

**Completed Objectives:**
1. Installed and configured Node.js runtime and npm package manager.
2. Configured Visual Studio Code environment with syntax, formatting, and database extensions.
3. Created and configured GitHub remote repository (`codveda-fullstack-internship`).
4. Practiced essential Git workflow commands (`init`, `status`, `add`, `commit`, `log`, `branch`, `push`).
5. Installed and verified PostgreSQL server connectivity via `psql` and pgAdmin 4.
6. Practiced Windows PowerShell navigation and file management commands.
7. Prepared technical documentation and captured 10 verification screenshots.

**Deliverables:**
- Environment setup documentation (`Task-1-Environment-Setup/documentation/Task-1-Environment-Setup.md`).
- 10 installation and verification screenshots (`Task-1-Environment-Setup/screenshots/`).
- Task 1 README documentation (`Task-1-Environment-Setup/README.md`).

---

### Task 2: Build a Simple REST API

**Status:** **Completed & Verified**

**Project:** Menged (Opportunity Discovery Platform)  
**Primary Resource:** `Opportunity`  
**Base URL:** `http://localhost:5000`  

**Technologies:**
- Node.js (v24.18.0)
- Express.js (v4.21.2)
- PostgreSQL (v17.11)
- `pg` (v8.13.1 — Connection Pool)
- `dotenv` (v16.4.7) & `cors` (v2.8.5)
- Postman & Thunder Client

**Completed Objectives:**
1. Initialized modular Express application architecture with separation of routes, controllers, configuration, and middleware.
2. Designed and executed PostgreSQL schema (`menged_db`) with `opportunities` table, category `CHECK` constraint, and performance B-Tree indexes on `type`, `field`, and `deadline`.
3. Seeded 5 demonstration opportunity records across all primary categories (Internships, Scholarships, Remote jobs, Training programs, Fellowships).
4. Implemented RESTful CRUD endpoints (`GET /api/opportunities`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, and `GET /api/health`).
5. Built flexible query filtering supporting `?type=`, `?field=`, and `?search=` across titles, organizations, and descriptions.
6. Enforced parameterized SQL queries (`$1`, `$2`, etc.) preventing SQL injection vulnerabilities.
7. Implemented centralized error handling mapping PostgreSQL error codes (22P02, 23502, 23514, ECONNREFUSED) to standard HTTP status codes (400, 404, 500, 204, 201, 200).
8. Built and verified automated Postman collection covering 15 distinct test scenarios.
9. Authored comprehensive API documentation, database schema specification, and task completion report.

**Deliverables:**
- Express REST API source code (`src/app.js`, `src/server.js`, `src/config/`, `src/controllers/`, `src/middleware/`, `src/routes/`).
- Database DDL schema and seed scripts (`database/schema.sql`, `database/seed.sql`).
- Technical documentation (`documentation/API_DOCUMENTATION.md`, `documentation/DATABASE_SCHEMA.md`, `documentation/TASK_2_COMPLETION_REPORT.md`).
- Automated Postman / Thunder Client test collection (`tests/Menged_API.postman_collection.json`).
- Task 2 README documentation (`README.md`).

---

### Task 3: Build a Dynamic Frontend with Vanilla JavaScript

**Status:** **Completed & Verified**

**Project:** Menged (Opportunity Discovery Platform)  
**Design Concept:** *Discover opportunities. Build your future.*  

**Technologies:**
- Semantic HTML5
- Pure CSS3 (CSS Custom Properties, CSS Grid, Flexbox, 3D Transforms, Backdrop Blur)
- Vanilla JavaScript (ES6+, async/await, native Fetch API)
- Google Fonts (`Plus Jakarta Sans`, `Inter`, `Noto Sans Ethiopic`)

**Completed Objectives:**
1. Developed responsive Single-Page Application (SPA) following the official Menged deep emerald visual identity.
2. Enclosed golden compass logo in a circular clipping mask with gold border to eliminate whitespace borders, and implemented an interactive logo lightbox modal.
3. Implemented a dual-theme engine (Emerald Canvas & Obsidian Night Mode) with both an outside header toggle and a persistent floating theme switcher (`#floating-theme-toggle`), backed by `localStorage` persistence.
4. Engineered a two-column hero section with staggered 3D floating preview cards and dynamic mouse parallax response.
5. Built 5 interactive opportunity category navigation cards with SVG vector icons and smooth auto-scroll filtering.
6. Implemented live opportunity discovery stream connected to Express REST API with real-time **300ms debounced search**, category pills, discipline dropdowns, location filters, and deadline sorting.
7. Applied dynamic 3D card tilt perspective following cursor movement on desktop viewports.
8. Built read-only Opportunity Details modal displaying verified criteria, role overview, and direct external application links.
9. Implemented community opportunity contribution form (`POST /api/opportunities`) with real-time validation and self-dismissing feedback toast alerts.
10. Engineered defensive offline demonstration fallback (`DEMO_FALLBACK_OPPORTUNITIES`), ensuring seamless functionality even if backend services are offline.
11. Authored complete frontend technical documentation and evaluation guides.

**Deliverables:**
- Single-page application entrypoint (`index.html`).
- Branded, token-driven stylesheets (`css/style.css`).
- Modular client-side application controller (`js/app.js`).
- Golden compass brand asset (`assets/logo.png`).
- Comprehensive technical documentation (`documentation/FRONTEND_DOCUMENTATION.md`).
- Task 3 README documentation (`README.md`).

---

### Overall Level 1 Milestone Summary

The **Level 1 (Basic)** milestone for the Codveda Full-Stack Development Internship has been fully completed across all 3 prescribed tasks. The repository represents a fully functioning, decoupled full-stack opportunity discovery platform built with zero external frontend frameworks, high-performance database indexing, defensive error handling, and accessible UI engineering.
