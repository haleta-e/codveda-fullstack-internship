# Development Roadmap & Technical Milestones
## Project: Menged (መንገድ) — Opportunity Discovery Platform

**Platform:** Menged (መንገድ)  
**Internship Program:** Codveda Full-Stack Development Internship  
**Current Milestone:** Level 1 (Basic) — **100% Completed**  
**Document Version:** 1.0.0  
**Lead Developer:** Etsegenet Amsalu (Haleta)  

---

## 1. Project Development Overview

**Menged** is evolving through three progressive internship milestones, advancing from a local full-stack opportunity discovery portal into an intelligent, authenticated career navigation ecosystem for Ethiopian higher education talent.

```mermaid
timeline
    title Menged Development Progression
    section Level 1 : Basic (Completed)
      Task 1 : Environment & Tooling Setup
      Task 2 : Express & PostgreSQL REST API
      Task 3 : Dynamic Vanilla JS Frontend
    section Level 2 : Intermediate (Planned)
      Authentication & Security : JWT, bcrypt, Session State
      Personal Workspace : Saved Opportunities, Application Stages
      Document Library : Resumes, Cover Letters, Transcripts
      Moderation Queue : Admin Verification Workflow
    section Level 3 : Advanced (Future)
      Automated Scrapers : University & Tech Board Ingestion
      Normalization Engine : Parsing & Deduplication
      Smart Notifications : Telegram Bot & Deadline Alerts
      Matching Engine : Skill-to-Opportunity Scoring
```

---

## 2. Milestone 1: Level 1 (Basic) — Completed

### 2.1 Task 1: Setup Development Environment
* **Status:** **Completed & Verified**
* **Deliverables:**
  * Node.js (`v24.18.0`) and npm (`11.16.0`) configured for server-side JavaScript execution.
  * Git (`v2.55.0.windows.3`) configured with author identity (`haleta-e` / `etsegenetamsalu56@gmail.com`) and GitHub remote integration.
  * PostgreSQL (`v17.11`) and pgAdmin 4 installed, connected, and verified via SQL query checks.
  * Visual Studio Code development environment with linting, formatting, and database extensions.
  * 10 verification screenshots and complete technical documentation in `Level-1-Basic/Task-1-Environment-Setup/`.

### 2.2 Task 2: Build a Simple REST API
* **Status:** **Completed & Verified**
* **Deliverables:**
  * Express.js backend server operating on `http://localhost:5000` with CORS and JSON body-parsing middleware.
  * Relational database `menged_db` with `opportunities` schema, `CHECK (type IN (...))` constraints, and performance indexes on `type`, `field`, and `deadline`.
  * Seed script (`database/seed.sql`) providing 5 demonstration records across all 5 opportunity classifications.
  * Full CRUD endpoints (`GET /api/opportunities`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, and `GET /api/health`).
  * Parameterized SQL queries preventing SQL injection vulnerabilities.
  * Centralized error middleware with PostgreSQL error code mapping (22P02, 23502, 23514, ECONNREFUSED).
  * Automated Postman/Thunder Client collection containing 15 test scenarios (`tests/Menged_API.postman_collection.json`).

### 2.3 Task 3: Build a Dynamic Frontend with Vanilla JavaScript
* **Status:** **Completed & Verified**
* **Deliverables:**
  * Responsive Single-Page Application (SPA) constructed in semantic HTML5, CSS3, and Vanilla JavaScript (ES6+).
  * Official golden compass brand identity asset (`assets/logo.png`) with circular badge clipping and interactive lightbox modal.
  * Night Mode theme engine with an outside header toggle, persistent floating theme switcher (`#floating-theme-toggle`), and `localStorage` persistence.
  * 3D perspective hero cards with keyframe animations and mouse parallax interaction.
  * 5 category quick-navigation cards with custom SVG vector icons.
  * Live opportunity discovery grid powered by the REST API with a **300ms debounced search bar**, category pills, discipline filters, location filters, and deadline sorting.
  * Dynamic 3D tilt perspective on opportunity cards based on cursor entry angles.
  * Read-only Opportunity Details modal with verified requirements and direct outbound application links.
  * Community opportunity contribution form sending live `POST /api/opportunities` requests with validation error states and toast notifications.
  * Defensive offline resilience (`DEMO_FALLBACK_OPPORTUNITIES`) ensuring uninterrupted interactivity if backend services are offline.

---

## 3. Current System Capabilities vs. Limitations

```
+----------------------------------------------------+----------------------------------------------------+
|                CURRENT CAPABILITIES                |                CURRENT LIMITATIONS                 |
+----------------------------------------------------+----------------------------------------------------+
| - Full CRUD operations on Opportunity entity       | - No user authentication (passwords, JWT tokens)   |
| - High-performance PostgreSQL 17 query indexes     | - No personalized user workspaces or accounts      |
| - 300ms debounced search & multi-tier filtering    | - Community submissions publish without moderation |
| - Outside & floating Night Mode theme switcher     | - Location filtering and sorting done client-side  |
| - 3D card tilt & parallax perspective interaction  | - No file upload backend for candidate resumes     |
| - Graceful offline fallback with demo dataset      | - Single-table database model (no foreign keys)    |
| - 100% Vanilla JS, Semantic HTML5, Pure CSS3       | - Manual data entry only (no automated scrapers)   |
+----------------------------------------------------+----------------------------------------------------+
```

---

## 4. Milestone 2: Level 2 (Intermediate) — Planned Direction

Level 2 will introduce **User State, Authentication, Application Management, and Document Storage**.

### 4.1 Epic A: Authentication and User Profiles
* **Secure Registration & Login:** Implement user authentication using email/password, bcrypt password hashing (12 salt rounds), and HTTP-only signed JWT access tokens with refresh tokens.
* **Student & Graduate Profiles:** Academic profiles storing university affiliation, major, graduation year, cumulative GPA, key programming skills, and target industries.
* **Role-Based Access Control (RBAC):** Distinct permissions separating `student`, `contributor`, and `administrator`.

### 4.2 Epic B: Personal Workspace & Application Tracking
* **Opportunity Bookmarks:** Authenticated students can save/bookmark opportunities to their private workspace.
* **Kanban Application Pipeline:** A tracking board allowing students to manage their application progression through distinct stages:
  $$\text{Saved} \longrightarrow \text{Applied} \longrightarrow \text{Interviewing} \longrightarrow \text{Offered} \longrightarrow \text{Archived}$$
* **Personal Notes:** Private notes attached to tracked applications (e.g., interview dates, salary discussions, recruiter contacts).

### 4.3 Epic C: Candidate Document Library
* **File Upload Service:** Integration of Multer middleware with local disk storage (or cloud object storage) for candidate application assets.
* **Document Management:** Upload and manage multiple versions of PDF resumes, official university transcripts, and personalized cover letters.

### 4.4 Epic D: Moderation Workflow
* **Submission Review Queue:** Community-submitted opportunities enter a `status = 'pending'` state.
* **Admin Review Dashboard:** Platform administrators can review, verify official links, edit typographical errors, and approve or reject submissions prior to public indexing.

---

## 5. Milestone 3: Level 3 (Advanced) — Future Vision

Level 3 will transition Menged into an automated, intelligent ecosystem.

### 5.1 Automated Opportunity Ingestion & Normalization
* **Distributed Web Scrapers:** Headless background collectors monitoring 20+ Ethiopian technology company websites, public university career boards, and international scholarship portals.
* **Opportunity Normalization Engine:** Automated pipeline transforming unstructured vacancy text into the Menged Opportunity Data Standard (MODS) using pattern matching and LLM-assisted entity extraction.
* **Automated Deduplication:** SHA-256 fingerprinting and string similarity scoring to detect and merge duplicate postings.

### 5.2 Intelligent Matching & Deadline Reminders
* **Opportunity-Profile Match Score:** Algorithms comparing student skills, GPA, and graduation year against opportunity criteria to generate a compatibility percentage.
* **Multi-Channel Notifications:** Automated alerts via Email and Telegram bots notifying students 7, 3, and 1 day before closing deadlines.
* **Institutional Dashboards:** Dedicated portal for universities and employers to post verified opportunities directly and track aggregated student engagement metrics.

---

## 6. Comprehensive Milestones Matrix

| Development Milestone | Core Features / Capabilities | Technology / Artifacts | Status |
|---|---|---|:---:|
| **Level 1 — Task 1** | Node.js, npm, Git, GitHub, PostgreSQL 17, pgAdmin 4, PowerShell setup | Documentation, 10 Screenshots | **COMPLETED** |
| **Level 1 — Task 2** | Express REST API, CRUD on `Opportunity`, PostgreSQL schema, error middleware | 15 Postman Tests, SQL DDL/Seed | **COMPLETED** |
| **Level 1 — Task 3** | Responsive SPA, 3D Hero Parallax, Search & Filter Hub, Outside Theme Switcher, Submission Form | HTML5, CSS3, Vanilla JS, Logo Asset | **COMPLETED** |
| **Level 2 — Milestone** | JWT Authentication, Academic User Profiles, Saved Bookmarks, Kanban Application Tracker | bcrypt, jsonwebtoken, Multi-table SQL | **PLANNED** |
| **Level 2 — Storage** | Candidate Document Library (Resumes, Transcripts), Submission Moderation Dashboard | Multer, Admin Controller, Status Enum | **PLANNED** |
| **Level 3 — Ingestion** | Automated Web Scrapers, Opportunity Normalization Pipeline, Duplicate Detection | Cheerio, Puppeteer / Python, Cron | **FUTURE** |
| **Level 3 — Intelligence**| Telegram Deadline Bot, Recommendation Matching Engine, Employer Analytics | Telegram Bot API, Vector Search | **FUTURE** |
