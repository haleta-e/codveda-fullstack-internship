# Task 2 Submission Evidence & Screenshot Guide

This folder contains visual evidence for the **Codveda Level 1: Task 2 REST API** evaluation.

Capture each screenshot when testing your live API and save them using the naming convention below:

---

## Screenshot Checklist

| Filename | Description | Expected Output / State |
|---|---|---|
| `01-server-startup.png` | Terminal running `npm start` | Shows database connected, port 5000 listening, and health endpoint URLs. |
| `02-database-schema-pgadmin.png` | pgAdmin 4 or `psql` showing schema | The `opportunities` table structure, columns, constraints, and indexes. |
| `03-database-seed-data.png` | pgAdmin 4 query tool | Result of `SELECT id, title, type, organization FROM opportunities;` showing 5 demonstration records. |
| `04-postman-health-check.png` | Postman / Thunder Client | `GET http://localhost:5000/api/health` returning `200 OK` with JSON status `"UP"`. |
| `05-postman-get-all-opportunities.png` | Postman / Thunder Client | `GET http://localhost:5000/api/opportunities` returning `200 OK` with array of opportunities. |
| `06-postman-get-by-id.png` | Postman / Thunder Client | `GET http://localhost:5000/api/opportunities/1` returning `200 OK` with record 1. |
| `07-postman-create-opportunity.png` | Postman / Thunder Client | `POST http://localhost:5000/api/opportunities` with valid JSON payload returning `201 Created`. |
| `08-postman-update-opportunity.png` | Postman / Thunder Client | `PUT http://localhost:5000/api/opportunities/1` with updated fields returning `200 OK`. |
| `09-postman-delete-opportunity.png` | Postman / Thunder Client | `DELETE http://localhost:5000/api/opportunities/1` returning `204 No Content`. |
| `10-postman-validation-error-400.png` | Postman / Thunder Client | `POST http://localhost:5000/api/opportunities` with missing required fields returning `400 Bad Request`. |
| `11-postman-not-found-404.png` | Postman / Thunder Client | `GET http://localhost:5000/api/opportunities/99999` returning `404 Not Found`. |

---

## Tips for Capturing High-Quality Evidence

1. **Clear Windows:** Ensure the HTTP method (`GET`, `POST`, `PUT`, `DELETE`), Request URL, Status Code (`200 OK`, `201 Created`, etc.), and Response Body are clearly readable.
2. **Standard Resolution:** Save screenshots as clean PNG files directly into this directory (`Level-1-Basic/Task-2-REST-API/screenshots/`).
