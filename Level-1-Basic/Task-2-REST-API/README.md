# Menged REST API — Level 1 Task 2

> **Codveda Full-Stack Development Internship**  
> **Level 1 (Basic) — Task 2: Build a Simple REST API**  
> **Developer:** Haleta  
> **Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)

---

## 1. Project Introduction

**Menged** (መንገድ — meaning "Path" or "Way" in Amharic) is an opportunity discovery platform tailored to help Ethiopian university students, recent graduates, and aspiring technologists discover internships, scholarships, remote tech jobs, training programs, and fellowships.

Task 2 implements the complete backend REST API for the core platform resource: **`Opportunity`**. It provides full CRUD (Create, Read, Update, Delete) capabilities backed by a persistent PostgreSQL database, structured error handling, input validation, and RESTful HTTP status codes.

This API serves as the reliable data layer for the Level 1 Task 3 frontend application.

---

## 2. Technology Stack

- **Runtime:** Node.js (v24.x / ES6+ JavaScript)
- **Framework:** Express.js (v4.x)
- **Database:** PostgreSQL (v17.x)
- **Database Client:** `pg` (node-postgres connection pool)
- **Environment Management:** `dotenv`
- **Security & Headers:** `cors`
- **API Testing:** Postman & Thunder Client

---

## 3. Directory Structure

```
Task-2-REST-API/
│
├── src/
│   ├── config/
│   │   └── db.js                        # PostgreSQL connection pool & error handling
│   │
│   ├── controllers/
│   │   └── opportunityController.js     # CRUD business logic & input validation
│   │
│   ├── middleware/
│   │   ├── errorHandler.js              # Centralized error handler & status mapper
│   │   └── notFound.js                  # 404 handler for undefined endpoints
│   │
│   ├── routes/
│   │   └── opportunityRoutes.js         # API route definitions
│   │
│   ├── app.js                           # Express application & middleware setup
│   └── server.js                        # Server entry point & DB connection check
│
├── database/
│   ├── schema.sql                       # PostgreSQL DDL table schema & indexes
│   └── seed.sql                         # Demonstration opportunities seed data
│
├── tests/
│   └── Menged_API.postman_collection.json # Exported Postman / Thunder Client tests
│
├── documentation/
│   ├── API_DOCUMENTATION.md             # In-depth API endpoint reference
│   └── DATABASE_SCHEMA.md               # Database entity design & dictionary
│
├── screenshots/
│   └── README.md                        # Submission screenshot evidence checklist
│
├── .env.example                         # Environment variables template
├── .env                                 # Local environment configuration (ignored)
├── .gitignore                           # Git ignore rules
├── package.json                         # Project dependencies and npm scripts
└── README.md                            # Main project documentation
```

---

## 4. Environment Configuration

1. Copy `.env.example` to `.env` if not already present:
   ```powershell
   cp .env.example .env
   ```

2. Configure your PostgreSQL credentials in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development

   # PostgreSQL Configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=menged_db
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   ```

---

## 5. Database Setup

Ensure PostgreSQL is running on your machine.

### Step 5.1: Create the Database
In PowerShell or terminal:
```powershell
psql -U postgres -c "CREATE DATABASE menged_db;"
```

### Step 5.2: Execute Schema & Seed Scripts
```powershell
# Run the table schema creation script
psql -U postgres -d menged_db -f database/schema.sql

# Seed demonstration opportunities
psql -U postgres -d menged_db -f database/seed.sql
```

*(Alternatively, open pgAdmin 4, create `menged_db`, and run `schema.sql` and `seed.sql` inside the Query Tool).*

---

## 6. Installation & Running the Server

### Step 6.1: Install Dependencies
```powershell
cd Level-1-Basic\Task-2-REST-API
npm install
```

### Step 6.2: Start the Server

- **Production / Standard Mode:**
  ```powershell
  npm start
  ```

- **Development Mode (Auto-restart on save):**
  ```powershell
  npm run dev
  ```

Upon startup, the console will output:
```text
----------------------------------------------------
PostgreSQL database connected successfully.
Database: menged_db on localhost:5432
Menged REST API server running on port 5000
Environment: development
Health check: http://localhost:5000/api/health
Opportunities: http://localhost:5000/api/opportunities
----------------------------------------------------
```

---

## 7. API Endpoints Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Status Code |
|---|---|---|:---:|
| `GET` | `/api/health` | Service health check | `200 OK` |
| `GET` | `/api/opportunities` | Get all opportunities (supports `?type=`, `?field=`, `?search=`) | `200 OK` |
| `GET` | `/api/opportunities/:id` | Get single opportunity by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/opportunities` | Create a new opportunity | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/opportunities/:id` | Update an existing opportunity | `200 OK` / `400` / `404` |
| `DELETE` | `/api/opportunities/:id` | Delete an opportunity | `204 No Content` / `404` |

---

## 8. Example Requests & Responses

### 8.1 Health Check (`GET /api/health`)

**Response:**
```json
{
  "success": true,
  "status": "UP",
  "service": "Menged Opportunity Discovery REST API",
  "version": "1.0.0",
  "timestamp": "2026-11-14T14:38:15.000Z"
}
```

### 8.2 Create Opportunity (`POST /api/opportunities`)

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Demonstration: Junior Backend Developer Trainee",
  "organization": "FinTech Addis Innovations (Demonstration Entity)",
  "type": "Training programs",
  "field": "FinTech & Backend",
  "description": "Simulated 6-month specialized backend development training on Node.js and PostgreSQL.",
  "eligibility": "Fresh university graduates in Computer Science or Software Engineering.",
  "deadline": "2027-03-31",
  "application_url": "https://example.com/demo/fintech-training-apply",
  "location": "Addis Ababa, Ethiopia (Hybrid)"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Opportunity created successfully.",
  "data": {
    "id": 6,
    "title": "Demonstration: Junior Backend Developer Trainee",
    "organization": "FinTech Addis Innovations (Demonstration Entity)",
    "type": "Training programs",
    "field": "FinTech & Backend",
    "description": "Simulated 6-month specialized backend development training on Node.js and PostgreSQL.",
    "eligibility": "Fresh university graduates in Computer Science or Software Engineering.",
    "deadline": "2027-03-31T00:00:00.000Z",
    "application_url": "https://example.com/demo/fintech-training-apply",
    "location": "Addis Ababa, Ethiopia (Hybrid)",
    "created_at": "2026-11-14T14:40:00.000Z",
    "updated_at": "2026-11-14T14:40:00.000Z"
  }
}
```

---

## 9. Error Handling & Validation Rules

The API implements centralized, secure error handling:

- **Validation Failure (`400 Bad Request`):**
  - Missing mandatory fields (`title`, `organization`, `description`, `type`).
  - Invalid category type (must be: `Internships`, `Scholarships`, `Remote jobs`, `Training programs`, `Fellowships`).
  - Invalid ID (`/api/opportunities/abc`).
  - Invalid date (`YYYY-MM-DD`) or malformed URL.
- **Resource Not Found (`404 Not Found`):** Querying, updating, or deleting a non-existent ID.
- **Security:** Raw PostgreSQL database credentials, connection strings, and internal stack traces are masked from clients to prevent data leaks.

---

## 10. API Testing (Postman & Thunder Client)

A ready-to-use testing collection is located at:
[`tests/Menged_API.postman_collection.json`](tests/Menged_API.postman_collection.json)

### How to Import & Run:
1. Open **Postman** (or the **Thunder Client** extension in VS Code).
2. Click **Import** -> Select `tests/Menged_API.postman_collection.json`.
3. The collection includes 15 automated test requests covering:
   - Health check
   - CRUD operations (Create, Read All, Read One, Update, Delete)
   - Filter by type & search by keyword
   - Edge cases (400 validation failures, non-numeric IDs, 404 not found).

---

## 11. Git Commit History Guidelines

When committing this work to your repository in VS Code, use the 5 incremental commits outlined in the task guidelines:

1. `git commit -m "Initialize Menged REST API"`
2. `git commit -m "Configure PostgreSQL database"`
3. `git commit -m "Implement opportunity CRUD endpoints"`
4. `git commit -m "Add validation and error handling"`
5. `git commit -m "Add API testing and documentation"`
