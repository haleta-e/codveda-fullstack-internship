# Menged Database Schema Specification

**Database Name:** `menged_db`  
**Relational Engine:** PostgreSQL (tested on PostgreSQL 17)  
**Schema File:** [`database/schema.sql`](../database/schema.sql)  
**Seed File:** [`database/seed.sql`](../database/seed.sql)

---

## 1. Entity-Relationship Overview

For Level 1 Task 2, the data model centers on the core entity of the Menged platform: **`opportunities`**.

```
+-----------------------------------------------------------+
|                      opportunities                        |
+-----------------------------------------------------------+
| id               SERIAL PRIMARY KEY                       |
| title            VARCHAR(200) NOT NULL                    |
| organization     VARCHAR(200) NOT NULL                    |
| type             VARCHAR(50) NOT NULL (CHECK constraint)  |
| field            VARCHAR(100)                             |
| description      TEXT NOT NULL                            |
| eligibility      TEXT                                     |
| deadline         DATE                                     |
| application_url  TEXT                                     |
| location         VARCHAR(150)                             |
| created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP      |
| updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP      |
+-----------------------------------------------------------+
```

---

## 2. Table Column Definitions

| Column Name | Data Type | Nullable | Default | Description & Constraints |
|---|---|:---:|---|---|
| `id` | `SERIAL` | No | Auto-increment | Unique identifier / Primary Key. |
| `title` | `VARCHAR(200)` | No | None | Title of the opportunity (e.g., job role, scholarship name). |
| `organization` | `VARCHAR(200)` | No | None | Organization, company, or institution offering the opportunity. |
| `type` | `VARCHAR(50)` | No | None | Opportunity category. Must be one of: `Internships`, `Scholarships`, `Remote jobs`, `Training programs`, `Fellowships`. |
| `field` | `VARCHAR(100)` | Yes | NULL | Tech discipline (e.g., Software Engineering, Data Science). |
| `description` | `TEXT` | No | None | Detailed overview of responsibilities, syllabus, or benefits. |
| `eligibility` | `TEXT` | Yes | NULL | Requirements for applicants (GPA, degree status, location). |
| `deadline` | `DATE` | Yes | NULL | Application closing date (`YYYY-MM-DD`). |
| `application_url`| `TEXT` | Yes | NULL | Direct link to application form or instructions. |
| `location` | `VARCHAR(150)` | Yes | NULL | City, country, or remote status (e.g., "Addis Ababa, Ethiopia"). |
| `created_at` | `TIMESTAMP` | Yes | `CURRENT_TIMESTAMP` | System timestamp when record was inserted. |
| `updated_at` | `TIMESTAMP` | Yes | `CURRENT_TIMESTAMP` | System timestamp when record was last updated. |

---

## 3. Database Constraints & Indexes

### 3.1 Check Constraint on Type
```sql
CHECK (type IN ('Internships', 'Scholarships', 'Remote jobs', 'Training programs', 'Fellowships'))
```
Prevents invalid categories from ever being stored in the database.

### 3.2 Performance Indexes
```sql
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_field ON opportunities(field);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
```
Indexes speed up high-frequency discovery queries such as filtering by category (`type`), searching by academic discipline (`field`), or sorting by upcoming `deadline`.

---

## 4. Demonstration Seed Data

The database includes 5 demonstration opportunities in [`database/seed.sql`](../database/seed.sql):

1. **Junior Software Engineering Internship** (`Internships`, Addis Ababa)
2. **Graduate STEM Excellence Scholarship** (`Scholarships`, Hybrid)
3. **Junior Frontend Developer (Remote)** (`Remote jobs`, Remote)
4. **Cloud Computing & DevOps Training Bootcamp** (`Training programs`, Hawassa)
5. **African Tech Leadership & AI Fellowship** (`Fellowships`, Addis Ababa)

> **Notice:** All demonstration opportunities are simulated for educational and portfolio demonstration during the Codveda internship. None represent verified open applications.

---

## 5. How to Setup the Database

### Option A: Using PostgreSQL CLI (`psql`)

```powershell
# 1. Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE menged_db;"

# 2. Execute schema DDL
psql -U postgres -d menged_db -f database/schema.sql

# 3. Seed demonstration records
psql -U postgres -d menged_db -f database/seed.sql

# 4. Verify insertion
psql -U postgres -d menged_db -c "SELECT id, title, type, organization FROM opportunities;"
```

### Option B: Using pgAdmin 4

1. Open **pgAdmin 4**.
2. Right-click **Databases** -> **Create** -> **Database...** -> Name it `menged_db`.
3. Select `menged_db`, open the **Query Tool** (Tools -> Query Tool).
4. Open and run [`database/schema.sql`](../database/schema.sql) (Press `F5`).
5. Open and run [`database/seed.sql`](../database/seed.sql) (Press `F5`).
6. View the populated table by running `SELECT * FROM opportunities;`.
