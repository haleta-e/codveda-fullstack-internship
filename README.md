# Menged (መንገድ) — Opportunity Discovery Platform
### Discover Opportunities. Build Your Future.

**Menged** (መንገድ — "Path" or "Way" in Amharic) is a full-stack opportunity discovery and career management platform designed to help Ethiopian university students, recent graduates, and aspiring professionals discover verified opportunities that support their academic and career development.

Higher-education opportunities — including summer internships, international scholarships, remote tech jobs, training bootcamps, and leadership fellowships — are frequently scattered across unstructured Telegram channels, informal social media posts, and disparate portals. Menged bridges this information gap by standardizing, indexing, and presenting opportunities through an accessible, high-performance web experience backed by a relational PostgreSQL database.

This project was built as part of the **Codveda Full-Stack Development Internship** (Level 1 Basic Milestone).

---

## 📚 Complete Project Documentation Hub

All technical specifications, architectural designs, data standards, and task-level completion records are organized into the following official documents:

| Documentation Document | File Location | Purpose & Core Contents |
|---|---|---|
| **Product Requirements (SRS)** | [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | Full Software Requirements Specification, user journeys, functional requirements (FR-001 to FR-025), non-functional requirements (NFR-001 to NFR-011), personas, scope, and technical constraints. |
| **System Architecture** | [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md) | Comprehensive architecture document containing 4 Mermaid diagrams: High-level System Architecture, Frontend-to-Backend Sequence, Data Flow, and Request Lifecycle. |
| **Database Design** | [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) | PostgreSQL 17 relational database specification for `menged_db`, table schemas, constraints, B-Tree indexes, seed data records, and Level 2 relational ER diagrams. |
| **Opportunity Data Standard** | [`docs/OPPORTUNITY_DATA_STANDARD.md`](docs/OPPORTUNITY_DATA_STANDARD.md) | Canonical data dictionary (MODS v1.0), category definitions, client/server validation boundaries, date formats, and verified JSON request/response payloads. |
| **Development Roadmap** | [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md) | Project progress overview, Level 1 completed features, Level 2 intermediate objectives (Auth, Workspaces, Tracking), and Level 3 advanced vision (Scrapers, Matching). |
| **Level 1 Milestone Report** | [`Level-1-Basic/Level-1-Report.md`](Level-1-Basic/Level-1-Report.md) | Official internship milestone completion report verifying all objectives across Task 1, Task 2, and Task 3. |
| **Task 1: Environment Setup** | [`Level-1-Basic/Task-1-Environment-Setup/`](Level-1-Basic/Task-1-Environment-Setup/README.md) | Environment configuration guide, tool versions (Node.js v24, PostgreSQL 17, Git), and 10 verification screenshots. |
| **Task 2: REST API Guide** | [`Level-1-Basic/Task-2-REST-API/`](Level-1-Basic/Task-2-REST-API/README.md) | Express REST API documentation, CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`), Postman test suite (15 tests), and error handling. |
| **Task 3: Dynamic Frontend** | [`Level-1-Basic/Task-3-Frontend/`](Level-1-Basic/Task-3-Frontend/README.md) | Vanilla JavaScript SPA guide, CSS design tokens, Night Mode system, 3D card tilt, modals, and submission workflows. |

---

## 🎯 Core Features Implemented (Level 1 Basic)

### 1. Presentation & User Experience (Task 3)
* **100% Vanilla Tech Stack:** Built with pure **Semantic HTML5**, **Modern CSS3**, and native **Vanilla JavaScript (ES6+)**. Zero external frontend libraries or bulky frameworks.
* **Brand Identity & Circular Logo:** Golden compass brand logo (`assets/logo.png`) housed in a 50% circular clipping badge with gold border (`#D4AF37`) to eliminate whitespace gaps, plus an interactive logo lightbox modal (`#logo-modal`).
* **Outside & Floating Night Mode:** Dual-theme engine (Vibrant Emerald Canvas and Obsidian Night Mode) controlled via both an **outside header switch** (always visible in navbar) and a **persistent floating switch** pinned to the bottom-right of the screen (`position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 999;`). Automatically saves preference in `localStorage`.
* **Two-Column Hero with 3D Parallax:** Staggered 3D floating preview cards with keyframe animations and real-time mouse parallax interaction.
* **5 Category Navigation Cards:** Quick-access cards with custom vector SVGs (*Internships, Scholarships, Remote jobs, Training programs, Fellowships*) that auto-filter and smooth-scroll to results.
* **Live Discovery Grid:** Driven by the Express REST API with real-time **300ms debounced search**, category pills, discipline filters, location filters, and deadline sorting.
* **Interactive 3D Card Hover Tilt:** Cards calculate cursor entry angles to tilt dynamically with 3D perspective transforms.
* **Read-Only Opportunity Details Modal:** Clean modal presenting full role descriptions, eligibility criteria, and direct outbound application links without administrative clutter.
* **Community Opportunity Contribution:** Form enabling students and organizations to submit opportunities via live HTTP `POST /api/opportunities` with client validation and feedback toasts.
* **Defensive Offline Fallback:** Graceful fallback to local demonstration data (`DEMO_FALLBACK_OPPORTUNITIES`) if backend services are offline.

### 2. Backend REST API Architecture (Task 2)
* **RESTful CRUD Endpoints:** Full CRUD functionality implemented on the core resource:
  * `GET /api/health` — Health check returning server uptime and status.
  * `GET /api/opportunities` — Query filtering by `?type=`, `?field=`, and `?search=`.
  * `GET /api/opportunities/:id` — Single record retrieval with positive integer validation.
  * `POST /api/opportunities` — Record insertion with comprehensive field validation.
  * `PUT /api/opportunities/:id` — Full record modification with existence verification.
  * `DELETE /api/opportunities/:id` — Permanent record deletion returning HTTP `204 No Content`.
* **SQL Injection Prevention:** 100% parameterized SQL queries (`$1`, `$2`, etc.) via `pg.Pool`.
* **Centralized Error Handling:** Translates internal PostgreSQL error codes (22P02, 23502, 23514, ECONNREFUSED) into sanitized client-friendly JSON error payloads.
* **Automated Testing:** 15 automated test scenarios exported as a Postman/Thunder Client collection (`tests/Menged_API.postman_collection.json`).

### 3. Database Architecture (PostgreSQL 17)
* Relational database `menged_db` with single primary table `opportunities`.
* Domain integrity enforced via SQL `CHECK (type IN ('Internships', 'Scholarships', 'Remote jobs', 'Training programs', 'Fellowships'))`.
* B-Tree performance indexes on `type`, `field`, and `deadline` for rapid query execution.

---

## 🛠️ Technology Stack Specifications

```
PRESENTATION LAYER
├── Semantic HTML5 (W3C Standard Landmarks)
├── Pure CSS3 (CSS Custom Properties, Glassmorphism, 3D Transforms, CSS Grid, Flexbox)
├── Vanilla JavaScript (ES6+, Fetch API, async/await, DOM Controllers)
└── Google Fonts (Plus Jakarta Sans, Inter, Noto Sans Ethiopic)

APPLICATION LAYER (REST API)
├── Node.js (v24.18.0 JavaScript Runtime)
├── Express.js (v4.21.2 Web Routing Framework)
├── pg / node-postgres (v8.13.1 Connection Pooling)
├── dotenv (v16.4.7 Environment Management)
└── cors (v2.8.5 Cross-Origin Resource Sharing)

DATA LAYER
└── PostgreSQL (v17.11 Relational Database Server on Port 5432)

DEVELOPMENT & TESTING TOOLING
├── Visual Studio Code (v1.96+)
├── Git (v2.55.0) & GitHub
├── pgAdmin 4
└── Postman / Thunder Client (Automated API Test Suite)
```

---

## 📂 Repository Directory Structure

```text
Codveda-Internship/
│
├── docs/                                          # Project-Wide System Documentation
│   ├── PRODUCT_REQUIREMENTS.md                    # Software Requirements Specification (SRS)
│   ├── SYSTEM_ARCHITECTURE.md                     # Architecture, Lifecycle & Mermaid Diagrams
│   ├── DATABASE_DESIGN.md                         # PostgreSQL Schema, Constraints & Indexes
│   ├── OPPORTUNITY_DATA_STANDARD.md               # Data Dictionary & Canonical Formats
│   └── DEVELOPMENT_ROADMAP.md                     # Completed vs Planned Roadmap
│
├── Level-1-Basic/                                 # Level 1 Milestone Deliverables
│   ├── Level-1-Report.md                          # Comprehensive Level 1 Completion Report
│   │
│   ├── Task-1-Environment-Setup/                  # Task 1: Environment & Tooling
│   │   ├── documentation/
│   │   │   └── Task-1-Environment-Setup.md        # Environment Setup Documentation
│   │   ├── screenshots/                           # 10 Verification Screenshots
│   │   └── README.md                              # Task 1 Summary Guide
│   │
│   ├── Task-2-REST-API/                           # Task 2: Express & PostgreSQL REST API
│   │   ├── src/
│   │   │   ├── config/db.js                       # pg.Pool Connection Configuration
│   │   │   ├── controllers/opportunityController.js # CRUD Logic & Validation
│   │   │   ├── middleware/errorHandler.js         # Centralized Error Middleware
│   │   │   ├── middleware/notFound.js             # 404 Route Handler
│   │   │   ├── routes/opportunityRoutes.js        # /api/opportunities Routing
│   │   │   ├── app.js                             # Express App & Global Middlewares
│   │   │   └── server.js                          # HTTP Server Entry Point
│   │   ├── database/
│   │   │   ├── schema.sql                         # PostgreSQL Table Schema DDL
│   │   │   └── seed.sql                           # 5 Simulated Demonstration Records
│   │   ├── documentation/
│   │   │   ├── API_DOCUMENTATION.md               # Endpoints, Payloads & Status Codes
│   │   │   ├── DATABASE_SCHEMA.md                 # Database Column Dictionary
│   │   │   └── TASK_2_COMPLETION_REPORT.md        # Task 2 Verification Report
│   │   ├── tests/
│   │   │   └── Menged_API.postman_collection.json # 15 Automated Test Scenarios
│   │   ├── .env.example                           # Environment Variables Template
│   │   ├── package.json                           # Backend Dependencies & Scripts
│   │   └── README.md                              # Task 2 Setup Guide
│   │
│   └── Task-3-Frontend/                           # Task 3: Dynamic Vanilla JS Frontend
│       ├── assets/
│       │   └── logo.png                           # Golden Compass Identity Asset
│       ├── css/
│       │   └── style.css                          # Branded Styles, Night Mode & 3D Tilt
│       ├── js/
│       │   └── app.js                             # Client Controller, State, Fetch & UI
│       ├── documentation/
│       │   └── FRONTEND_DOCUMENTATION.md          # Comprehensive Frontend Architecture
│       ├── screenshots/                           # UI Screenshot Capture Guide
│       ├── index.html                             # Single-Page Application Layout
│       └── README.md                              # Task 3 Execution Guide
│
├── Level-2-Intermediate/                          # Reserved for Level 2 Milestone Work
├── Level-3-Advanced/                              # Reserved for Level 3 Milestone Work
└── README.md                                      # Main Project Entrypoint (This File)
```

---

## 🚀 Step-by-Step Local Setup & Execution

### Prerequisites
Ensure the following tools are installed on your machine:
* **Node.js:** v20+ (Tested on `v24.18.0`)
* **PostgreSQL:** v16+ (Tested on `v17.11`) running on port `5432`
* **Git:** (Tested on `v2.55.0`)
* **Web Browser:** Google Chrome, Microsoft Edge, or Mozilla Firefox

---

### Step 1: Clone the Repository
```powershell
git clone https://github.com/haleta-e/codveda-fullstack-internship.git
cd codveda-fullstack-internship
```

---

### Step 2: Initialize the PostgreSQL Database
Open Windows PowerShell and run:
```powershell
# 1. Create the database
psql -U postgres -c "CREATE DATABASE menged_db;"

# 2. Run the table schema DDL (creates opportunities table & indexes)
psql -U postgres -d menged_db -f Level-1-Basic/Task-2-REST-API/database/schema.sql

# 3. Seed initial demonstration opportunity records
psql -U postgres -d menged_db -f Level-1-Basic/Task-2-REST-API/database/seed.sql
```

---

### Step 3: Configure and Launch the Backend REST API
```powershell
# Navigate to the backend directory
cd Level-1-Basic/Task-2-REST-API

# Install dependencies (express, pg, cors, dotenv)
npm install

# Create your local .env configuration file
Copy-Item .env.example .env
```

Open `.env` in VS Code or your text editor and ensure the database credentials match your local PostgreSQL configuration:
```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_NAME=menged_db
DB_PASSWORD=your_actual_password_here
DB_PORT=5432
```

Start the Express development server:
```powershell
npm run dev
```

The terminal will confirm:
```text
==================================================
  MENGED REST API SERVER (Codveda Level 1 - Task 2)
  Server running in development mode on port 5000
  API Base URL: http://localhost:5000/api
  Health Check: http://localhost:5000/api/health
  Database Connected: menged_db on localhost:5432
==================================================
```

Verify in your browser: open `http://localhost:5000/api/health` — it will return:
```json
{
  "success": true,
  "status": "UP",
  "service": "Menged Opportunity Discovery REST API",
  "version": "1.0.0",
  "timestamp": "..."
}
```

---

### Step 4: Launch the Frontend Application
Open a second terminal window and navigate to the frontend folder:
```powershell
cd Level-1-Basic/Task-3-Frontend

# Launch directly in your default browser
Start-Process "index.html"
```
*Or* right-click `index.html` in Visual Studio Code and select **Open with Live Server**.

The navbar will show **Live PostgreSQL** (green pulse), confirming active full-stack communication!

---

## 🧪 Testing the API Suite (Postman / Thunder Client)

The backend includes an automated test suite containing 15 test scenarios:
1. Open Postman or Thunder Client.
2. Click **Import** and select:
   `Level-1-Basic/Task-2-REST-API/tests/Menged_API.postman_collection.json`
3. Ensure the backend server is running on `http://localhost:5000`.
4. Run the collection. All 15 tests will execute and pass, verifying health checks, list queries, type filtering, keyword search, single record lookups, validation errors, updates, and deletions.

---

## 🗺️ Future Milestones (Level 2 & Level 3)

| Development Milestone | Planned Technical Capabilities |
|---|---|
| **Level 2: Intermediate** | • User authentication (bcrypt password hashing, HTTP-only JWT tokens).<br>• Student & graduate academic profiles.<br>• Personal workspace with opportunity bookmarks.<br>• Kanban application pipeline (*Saved → Applied → Interviewing → Offered*).<br>• Candidate document library (PDF resume, transcript, and cover letter storage).<br>• Submission moderation workflow for administrators. |
| **Level 3: Advanced** | • Distributed background web scrapers collecting vacancies from 20+ Ethiopian websites.<br>• Data Normalization Engine with automated entity extraction and deduplication.<br>• Multi-channel deadline reminder bot (Telegram & Email).<br>• Profile-to-opportunity compatibility matching algorithms. |

---

## 👩‍💻 Project Information & Attribution

* **Project Name:** Menged (መንገድ)
* **Lead Developer:** Etsegenet Amsalu (Haleta)
* **GitHub Profile:** [@haleta-e](https://github.com/haleta-e)
* **GitHub Repository:** [https://github.com/haleta-e/codveda-fullstack-internship](https://github.com/haleta-e/codveda-fullstack-internship)
* **Internship Program:** Codveda Full-Stack Development Internship
* **Current Milestone:** Level 1 (Basic) — **100% Completed**
