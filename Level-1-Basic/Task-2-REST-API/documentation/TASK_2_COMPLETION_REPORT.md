# Codveda Internship — Level 1: Basic
## Task 2: Build a Simple REST API — Completion Report

---

### Project Information
- **Intern Name:** Etsegenet Amsalu (Haleta)
- **Internship Track:** Full-Stack Development Internship
- **Level:** Level 1 — Basic
- **Task:** Task 2 — Build a Simple REST API
- **Project Name:** Menged (Opportunity Discovery Platform for Ethiopian Students and Graduates)
- **Primary Resource:** `Opportunity`
- **Location:** `Level-1-Basic/Task-2-REST-API/`
- **Status:** **Completed & Verified**
- **System Documentation:** [System Architecture](../../../docs/SYSTEM_ARCHITECTURE.md) | [Database Design](../../../docs/DATABASE_DESIGN.md)

---

### 1. Executive Summary

Task 2 of Level 1 has been completed in full compliance with the official Codveda requirements and enterprise backend standards. The objective was to design, implement, test, and document a robust RESTful API using Node.js, Express.js, and a persistent PostgreSQL database. 

The API manages the core **Opportunity** resource for **Menged**, an opportunity discovery platform empowering Ethiopian university students and graduates to discover internships, scholarships, remote tech jobs, training programs, and fellowships.

All endpoints adhere to REST conventions, enforce input validation, use parameterized SQL queries, handle errors centrally with standard HTTP status codes, and are accompanied by an automated Postman/Thunder Client test suite and complete technical documentation.

---

### 2. Technology Stack

| Component | Technology | Version / Specification |
|---|---|---|
| **Runtime Environment** | Node.js | v24.x (CommonJS module system) |
| **Backend Framework** | Express.js | v4.21.x |
| **Database Engine** | PostgreSQL | v17.x |
| **Database Driver** | `pg` (node-postgres) | v8.13.x (Connection Pool) |
| **Environment Config** | `dotenv` | v16.4.x |
| **Cross-Origin Security**| `cors` | v2.8.x |
| **API Testing** | Postman / Thunder Client | Automated JSON Collection (15 Scenarios) |
| **Version Control** | Git & GitHub | Modular incremental commits |

---

### 3. Deliverables & Directory Structure

All files have been organized into the prescribed backend architecture:

```
Task-2-REST-API/
├── src/
│   ├── config/
│   │   └── db.js                       # PostgreSQL connection pool with error handling
│   ├── controllers/
│   │   └── opportunityController.js    # Business logic, query builders & validation
│   ├── middleware/
│   │   ├── errorHandler.js             # Centralized error handler & status mapper
│   │   └── notFound.js                 # 404 handler for undefined endpoints
│   ├── routes/
│   │   └── opportunityRoutes.js        # Express router mapping /api/opportunities
│   ├── app.js                          # Express application configuration & middlewares
│   └── server.js                       # HTTP server entrypoint & DB connectivity check
├── database/
│   ├── schema.sql                      # DDL schema: table creation, constraints, indexes
│   └── seed.sql                        # 5 clearly identified demonstration opportunities
├── tests/
│   └── Menged_API.postman_collection.json # 15 pre-configured automated API tests
├── documentation/
│   ├── API_DOCUMENTATION.md            # Complete API endpoint specifications
│   ├── DATABASE_SCHEMA.md              # Database data dictionary & setup instructions
│   └── TASK_2_COMPLETION_REPORT.md     # This comprehensive task finishing report
├── screenshots/
│   └── README.md                       # Submission evidence and screenshot guide
├── .env.example                        # Template for environment variables
├── .env                                # Local configuration file (git-ignored)
├── .gitignore                          # Standard Node.js & secrets git ignore
├── package.json                        # Pinned dependencies & npm start/dev scripts
└── README.md                           # Master project documentation
```

---

### 4. Database Implementation

A dedicated database named `menged_db` and an `opportunities` table were designed with strict constraints and performance indexes.

#### 4.1 Schema Specifications
- **`id`** (`SERIAL PRIMARY KEY`): Unique auto-incrementing identifier.
- **`title`** (`VARCHAR(200) NOT NULL`): Title of the opportunity.
- **`organization`** (`VARCHAR(200) NOT NULL`): Host entity or company.
- **`type`** (`VARCHAR(50) NOT NULL`): Enforced by a SQL `CHECK` constraint:
  `CHECK (type IN ('Internships', 'Scholarships', 'Remote jobs', 'Training programs', 'Fellowships'))`
- **`field`** (`VARCHAR(100)`): Discipline (e.g., Software Engineering, AI, Cloud).
- **`description`** (`TEXT NOT NULL`): Detailed opportunity scope.
- **`eligibility`** (`TEXT`): Academic and applicant criteria.
- **`deadline`** (`DATE`): Closing date (`YYYY-MM-DD`).
- **`application_url`** (`TEXT`): Direct link.
- **`location`** (`VARCHAR(150)`): Physical city/region or Remote status.
- **`created_at`** (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`): Insertion timestamp.
- **`updated_at`** (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`): Last modification timestamp.

#### 4.2 Indexes Created
- `idx_opportunities_type`: Accelerates category filtering.
- `idx_opportunities_field`: Accelerates academic discipline queries.
- `idx_opportunities_deadline`: Accelerates upcoming deadline sorting.

#### 4.3 Demonstration Seed Data
Included 5 simulated demonstration records in `database/seed.sql` representing all 5 categories:
1. *Demonstration: Junior Software Engineering Internship* (TechEthio Innovations)
2. *Demonstration: Graduate STEM Excellence Scholarship* (Ethiopian Education Support Initiative)
3. *Demonstration: Junior Frontend Developer (Remote)* (Global Pan-African Tech Labs)
4. *Demonstration: Cloud Computing & DevOps Training Bootcamp* (Horn of Africa Tech Academy)
5. *Demonstration: African Tech Leadership & AI Fellowship* (Future African Innovators Network)

---

### 5. API Endpoints & Operations Matrix

| Method | Endpoint | Description | Status Codes |
|---|---|---|:---:|
| **GET** | `/api/health` | Service health and uptime status | `200 OK` |
| **GET** | `/api/opportunities` | Retrieve all opportunities (with optional `?type=`, `?field=`, `?search=`) | `200 OK` |
| **GET** | `/api/opportunities/:id` | Retrieve single opportunity by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/opportunities` | Create a new opportunity record | `201 Created`, `400 Bad Request` |
| **PUT** | `/api/opportunities/:id` | Update all fields of an existing opportunity | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE**| `/api/opportunities/:id` | Delete an opportunity from database | `204 No Content`, `400 Bad Request`, `404 Not Found` |

---

### 6. Security, Validation & Centralized Error Handling

1. **SQL Injection Prevention:** Every database query in `opportunityController.js` utilizes parameterized statements (`$1, $2, ...`), completely eliminating SQL injection risks.
2. **Defensive Validation:** 
   - Checks presence and length of mandatory fields (`title`, `organization`, `description`, `type`).
   - Ensures `type` strictly matches one of the 5 allowed opportunity categories.
   - Enforces positive numeric IDs for route parameters (`:id`).
   - Validates date formats (`YYYY-MM-DD`) and HTTP/HTTPS URLs.
3. **Centralized Error Handling (`src/middleware/errorHandler.js`):**
   - Maps database errors (e.g., PostgreSQL `22P02` syntax error, `23514` check constraint violation) to clean, client-facing JSON responses with `400 Bad Request`.
   - Never leaks sensitive database credentials, connection strings, or system passwords.
4. **404 Route Interception (`src/middleware/notFound.js`):** Intercepts requests to unregistered routes and returns consistent JSON errors.

---

### 7. Testing & Verification

An automated Postman / Thunder Client collection (`tests/Menged_API.postman_collection.json`) was developed containing 15 test cases:

1. `GET /api/health` — Verifies 200 OK and service uptime.
2. `GET /api/opportunities` — Verifies 200 OK and retrieval of all records.
3. `GET /api/opportunities?type=Internships` — Verifies category filter.
4. `GET /api/opportunities?search=Software` — Verifies keyword search across fields.
5. `GET /api/opportunities/1` — Verifies single record retrieval.
6. `GET /api/opportunities/abc` — Verifies 400 Bad Request on invalid ID.
7. `GET /api/opportunities/99999` — Verifies 404 Not Found on nonexistent ID.
8. `POST /api/opportunities` — Verifies 201 Created with valid JSON payload.
9. `POST /api/opportunities` (Missing Title) — Verifies 400 Bad Request validation.
10. `POST /api/opportunities` (Invalid Category) — Verifies 400 Bad Request.
11. `PUT /api/opportunities/1` — Verifies 200 OK and refreshed timestamp.
12. `PUT /api/opportunities/99999` — Verifies 404 Not Found on update.
13. `DELETE /api/opportunities/1` — Verifies 204 No Content on deletion.
14. `DELETE /api/opportunities/99999` — Verifies 404 Not Found on delete.
15. `GET /api/undefined-endpoint` — Verifies centralized 404 route handling.

---

### 8. Official Acceptance Criteria Verification

| Requirement Item | Status | Verification Detail |
|---|:---:|---|
| **Node.js & Express Setup** | **Passed** | Fully modular app and server entrypoint with CORS & JSON parsing. |
| **Basic CRUD Operations** | **Passed** | Create, Read (all/single), Update, and Delete fully functioning. |
| **Express Server Running** | **Passed** | Health check route (`/api/health`) and port listener configured. |
| **API Routes Created** | **Passed** | Clean router mounted at `/api/opportunities`. |
| **Postman / Thunder Client Testing** | **Passed** | 15 automated test cases in exportable JSON format. |
| **Error Handling & HTTP Responses**| **Passed** | Uses 200, 201, 204, 400, 404, 500 with consistent JSON format. |
| **PostgreSQL Integration** | **Passed** | DDL schema, indexes, connection pool, and demonstration seed data. |
| **Documentation & Evidence** | **Passed** | Comprehensive README, API docs, DB schema, and screenshot guide. |

---

### 9. Readiness for Task 3 (Frontend Integration)

With Task 2 finished:
- The REST API provides a dependable, contract-adherent JSON backend (`{ success: true, data: [...] }`).
- CORS is enabled to allow local browser clients (`http://localhost:*` or `file://`) to fetch data seamlessly.
- The project is fully positioned for developing the vanilla JavaScript frontend interface in **Level 1: Task 3**.
