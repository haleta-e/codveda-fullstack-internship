# Menged REST API — Technical Documentation

**Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)  
**Level:** Codveda Internship Level 1 — Basic  
**Task:** Task 2 — Build a Simple REST API  
**Technology Stack:** Node.js, Express.js, PostgreSQL (`pg`), `cors`, `dotenv`  
**Base URL:** `http://localhost:5000`

---

## 1. Overview

Menged is an opportunity discovery platform designed specifically for Ethiopian university students, recent graduates, and aspiring professionals. The Level 1 REST API exposes full CRUD operations on the core platform resource: **`Opportunity`**.

This backend serves as the foundation for the upcoming Level 1 Task 3 frontend application.

---

## 2. Standard Response Format

All responses from the Menged REST API return structured, predictable JSON objects.

### 2.1 Success Response (`200 OK`, `201 Created`)

```json
{
  "success": true,
  "message": "Opportunity created successfully.",
  "data": {
    "id": 1,
    "title": "Demonstration: Junior Software Engineering Internship",
    "organization": "TechEthio Innovations (Demonstration Entity)",
    "type": "Internships",
    "field": "Software Engineering",
    "description": "Simulated 3-month hands-on backend and API development internship...",
    "eligibility": "Undergraduate students in Computer Science or Software Engineering...",
    "deadline": "2026-12-31T00:00:00.000Z",
    "application_url": "https://example.com/demo/internship-apply",
    "location": "Addis Ababa, Ethiopia",
    "created_at": "2026-11-14T14:19:18.000Z",
    "updated_at": "2026-11-14T14:19:18.000Z"
  }
}
```

### 2.2 List Response (`200 OK`)

```json
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

### 2.3 Delete Response (`204 No Content`)

An empty body with HTTP status `204 No Content`.

### 2.4 Error Response (`400 Bad Request`, `404 Not Found`, `500 Server Error`)

```json
{
  "success": false,
  "message": "Validation failed for opportunity creation.",
  "errors": [
    "Title is required and must be a non-empty string.",
    "Type is required and must be one of: Internships, Scholarships, Remote jobs, Training programs, Fellowships."
  ]
}
```

---

## 3. Allowed Opportunity Categories

Every opportunity's `type` field is validated at the application level and enforced via a SQL `CHECK` constraint at the database level:

1. `Internships`
2. `Scholarships`
3. `Remote jobs`
4. `Training programs`
5. `Fellowships`

---

## 4. API Endpoints

### 4.1 Health Check

Verifies server status and uptime.

- **Route:** `GET /api/health`
- **Status:** `200 OK`
- **Response Example:**
  ```json
  {
    "success": true,
    "status": "UP",
    "service": "Menged Opportunity Discovery REST API",
    "version": "1.0.0",
    "timestamp": "2026-11-14T14:38:15.000Z"
  }
  ```

---

### 4.2 Get All Opportunities

Retrieves all opportunities ordered chronologically (`created_at DESC`). Supports optional filtering and keyword search.

- **Route:** `GET /api/opportunities`
- **Query Parameters (Optional):**
  - `type` *(string)*: Exact match on opportunity category (e.g., `?type=Internships`).
  - `field` *(string)*: Case-insensitive partial match on field/discipline (e.g., `?field=Software`).
  - `search` *(string)*: Case-insensitive search across `title`, `organization`, and `description`.
- **Status:** `200 OK`
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "id": 1,
        "title": "Demonstration: Junior Software Engineering Internship",
        "organization": "TechEthio Innovations (Demonstration Entity)",
        "type": "Internships",
        "field": "Software Engineering",
        "description": "Simulated 3-month hands-on backend internship...",
        "eligibility": "Undergraduate students in Ethiopian universities.",
        "deadline": "2026-12-31T00:00:00.000Z",
        "application_url": "https://example.com/demo/internship-apply",
        "location": "Addis Ababa, Ethiopia",
        "created_at": "2026-11-14T14:19:18.000Z",
        "updated_at": "2026-11-14T14:19:18.000Z"
      }
    ]
  }
  ```

---

### 4.3 Get Single Opportunity by ID

Retrieves a single opportunity by its database primary key.

- **Route:** `GET /api/opportunities/:id`
- **Route Parameters:**
  - `id` *(integer, required)*: Must be a positive integer.
- **Responses:**
  - `200 OK`: Opportunity found.
  - `400 Bad Request`: Non-numeric or invalid ID format (`/api/opportunities/abc`).
  - `404 Not Found`: Opportunity with requested ID does not exist.

---

### 4.4 Create Opportunity

Creates a new opportunity record in the database.

- **Route:** `POST /api/opportunities`
- **Headers:** `Content-Type: application/json`
- **Request Body Fields:**

| Field | Type | Required | Constraints |
|---|---|:---:|---|
| `title` | String | Yes | 1 to 200 characters |
| `organization` | String | Yes | 1 to 200 characters |
| `type` | String | Yes | One of 5 allowed categories |
| `field` | String | No | Max 100 characters |
| `description` | String | Yes | Non-empty text |
| `eligibility` | String | No | Text |
| `deadline` | String | No | Format `YYYY-MM-DD` |
| `application_url` | String | No | Valid `http://` or `https://` URL |
| `location` | String | No | Max 150 characters |

- **Request Example:**
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
- **Responses:**
  - `201 Created`: Successfully created record with generated `id`, `created_at`, `updated_at`.
  - `400 Bad Request`: Validation failure (missing required fields, invalid date/URL, invalid type).

---

### 4.5 Update Opportunity

Updates all fields of an existing opportunity record.

- **Route:** `PUT /api/opportunities/:id`
- **Route Parameters:** `id` *(positive integer)*
- **Headers:** `Content-Type: application/json`
- **Request Body:** Same schema as `POST /api/opportunities`.
- **Responses:**
  - `200 OK`: Opportunity updated successfully (`updated_at` refreshed).
  - `400 Bad Request`: Invalid ID or invalid input data.
  - `404 Not Found`: Opportunity ID does not exist.

---

### 4.6 Delete Opportunity

Permanently removes an opportunity from the database.

- **Route:** `DELETE /api/opportunities/:id`
- **Route Parameters:** `id` *(positive integer)*
- **Responses:**
  - `204 No Content`: Opportunity successfully deleted.
  - `400 Bad Request`: Invalid ID format.
  - `404 Not Found`: Opportunity ID does not exist.

---

## 5. HTTP Status Codes Used

| Code | Meaning | Usage in Menged API |
|---|---|---|
| `200` | OK | Successful `GET` (all or single) and `PUT` (update). |
| `201` | Created | Successful `POST` (create new opportunity). |
| `204` | No Content | Successful `DELETE` operation. |
| `400` | Bad Request | Validation errors, missing fields, malformed ID format, malformed JSON. |
| `404` | Not Found | Target opportunity ID not in database; unknown route accessed. |
| `500` | Internal Server Error | Database failure or unexpected error (credentials masked). |

---

## 6. Security & Best Practices

1. **SQL Injection Defense:** All queries use parameterized queries (`$1, $2, ...`) via `node-postgres`.
2. **Credential Privacy:** Database passwords and raw connection strings are stored exclusively in `.env` (git-ignored) and never exposed in responses or logs.
3. **CORS:** Pre-configured via `cors()` middleware to allow cross-origin requests from the upcoming Task 3 frontend.
