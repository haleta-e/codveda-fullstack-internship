# Menged (መንገድ)
### Discover Opportunities. Prepare for Your Future.

Menged is a full-stack opportunity discovery platform designed to help Ethiopian university students, recent graduates, and aspiring professionals discover opportunities that support their academic and career development.

Opportunities such as internships, scholarships, remote jobs, training programs, and fellowships are often scattered across different websites, social media platforms, and online communities. Menged aims to make discovering these opportunities easier by bringing them together in one accessible platform.

This repository contains the development of Menged as part of the **Codveda Full-Stack Development Internship**.

---

## 🎯 Project Objectives

- Provide a centralized platform for discovering opportunities.
- Help students and graduates find opportunities relevant to their interests and fields.
- Make opportunity information easy to search, filter, and explore.
- Provide direct access to original application sources.
- Build a foundation for future career preparation and application management features.

## 💡 Core Concept

Menged is designed around the journey:

**Discover → Evaluate → Prepare → Apply → Track → Grow**

The initial version focuses on opportunity discovery and exploration. Future development will gradually introduce more personalized career-development features.

---

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- REST API
- dotenv
- CORS

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Google Fonts

### Development and Testing
- Visual Studio Code
- Git and GitHub
- PostgreSQL
- pgAdmin
- Postman / Thunder Client

---

## 📂 Repository Structure

```text
Codveda-Internship/
│
├── README.md
│
├── Level-1-Basic/
│   ├── Level-1-Report.md
│   │
│   ├── Task-1-Environment-Setup/
│   │
│   ├── Task-2-REST-API/
│   │   ├── src/
│   │   ├── database/
│   │   ├── tests/
│   │   ├── documentation/
│   │   ├── screenshots/
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── Task-3-Frontend/
│       ├── index.html
│       ├── css/
│       ├── js/
│       ├── documentation/
│       ├── screenshots/
│       └── README.md
│
├── Level-2-Intermediate/
│
└── Level-3-Advanced/
```

---

## 🚀 Current Implementation

### Level 1: Basic

**Status: Tasks 1, 2, and 3 reported as completed.**

#### Task 1: Development Environment Setup

Established the development environment required for full-stack application development.

Completed setup includes:

- Node.js and npm
- Visual Studio Code
- Git and GitHub
- PostgreSQL and pgAdmin
- Essential development extensions
- Basic terminal commands
- Setup documentation and screenshots

#### Task 2: Backend REST API

Developed the backend API using Node.js, Express.js, and PostgreSQL.

The backend manages opportunity records and provides CRUD operations.

Implemented capabilities:

- PostgreSQL database and opportunity table
- Database connection pooling
- RESTful API endpoints
- Create, read, update, and delete operations
- Search and filtering
- Input validation
- Centralized error handling
- HTTP status codes
- Postman API test collection
- Technical documentation

**API Base URL:** `http://localhost:5000`

#### Task 3: Frontend Development

Developed a responsive frontend using HTML5, CSS3, and Vanilla JavaScript.

The frontend communicates with the backend through the browser's Fetch API.

Implemented capabilities:

- Responsive landing page
- Dynamic opportunity cards
- Keyword search
- Category and discipline filters
- Opportunity details modal
- External application links
- Opportunity management interface
- Create, edit, and delete operations
- Loading, empty, and error states
- Form validation
- Toast notifications
- Responsive navigation

---

## 🔗 How the Application Works

Menged follows a client-server architecture.

```text
             USER
               |
               v
       HTML / CSS / JavaScript
               |
               v
          Fetch API
               |
               v
        Express REST API
               |
               v
       PostgreSQL Database
               |
               v
        Opportunity Records
```

1. The user interacts with the frontend.
2. JavaScript sends HTTP requests using Fetch API.
3. Express receives and processes API requests.
4. The backend communicates with PostgreSQL.
5. The API returns JSON responses.
6. JavaScript updates the interface using the returned data.

---

## ▶️ Running the Application Locally

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- Visual Studio Code
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/haleta-e/codveda-fullstack-internship.git
```

Navigate into the project:

```bash
cd codveda-fullstack-internship
```

### 2. Configure the Database

Create a PostgreSQL database named:

```text
menged_db
```

Run the SQL files in the backend project:

```text
Level-1-Basic/Task-2-REST-API/database/schema.sql
Level-1-Basic/Task-2-REST-API/database/seed.sql
```

The schema creates the required database table and the seed file inserts demonstration opportunities.

### 3. Configure the Backend

Navigate to:

```bash
cd Level-1-Basic/Task-2-REST-API
```

Install dependencies:

```bash
npm install
```

Create your local `.env` file using `.env.example` as a reference.

Configure the PostgreSQL connection values and other required environment variables.

Start the backend:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Check the health endpoint:

```text
http://localhost:5000/api/health
```

### 4. Start the Frontend

Open the following folder in Visual Studio Code:

```text
Level-1-Basic/Task-3-Frontend
```

Run `index.html` using the VS Code Live Server extension or another local static web server.

Make sure the backend is running before using the frontend features that require API access.

---

## 📚 Documentation

Detailed documentation is maintained separately for each task.

| Documentation | Location |
|---|---|
| Level 1 Completion Report | `Level-1-Basic/Level-1-Report.md` |
| Backend README | `Level-1-Basic/Task-2-REST-API/README.md` |
| API Documentation | `Level-1-Basic/Task-2-REST-API/documentation/API_DOCUMENTATION.md` |
| Database Documentation | `Level-1-Basic/Task-2-REST-API/documentation/DATABASE_SCHEMA.md` |
| Task 2 Completion Report | `Level-1-Basic/Task-2-REST-API/documentation/TASK_2_COMPLETION_REPORT.md` |
| Frontend README | `Level-1-Basic/Task-3-Frontend/README.md` |
| Frontend Documentation | `Level-1-Basic/Task-3-Frontend/documentation/FRONTEND_DOCUMENTATION.md` |

---

## 🗺️ Future Development Roadmap

Menged is intended to grow beyond a basic opportunity discovery application.

Potential future development areas include:

### Personalized User Accounts
- User registration and authentication
- Student and graduate profiles
- Academic information and interests
- Skills and career goals

### Application Management
- Save interesting opportunities
- Track application progress
- Manage deadlines
- Add personal notes
- View application history

### Personal Document Library
- Upload and organize CV versions
- Store certificates and academic documents
- Manage motivation letters and personal statements
- Reuse documents when preparing applications

### Community Opportunity Contributions
- Allow users to submit opportunities
- Review submissions before publication
- Reduce duplicate and misleading listings

### Further Improvements
- Personalized recommendations
- Notifications and deadline reminders
- Improved administration and moderation
- Enhanced security and access control

These are future development goals, not claims about features already implemented.

---

## 🔐 Security Note

The current Level 1 implementation is a local development project.

Although the backend includes validation, parameterized SQL queries, and centralized error handling, the application does not yet implement a complete production authentication and authorization system.

The opportunity management interface is therefore a development demonstration, not a secured public administration system.

Authentication, authorization, production deployment, and additional security controls can be addressed in future development.

---

## 👩‍💻 Project Information

**Project:** Menged (መንገድ)  
**Developer:** Etsegenet Amsalu  
**Internship:** Codveda Full-Stack Development Internship  
**Domain:** Full-Stack Development  
**GitHub Repository:** https://github.com/haleta-e/codveda-fullstack-internship

---

## 📌 Project Status

| Development Stage | Status |
|---|---|
| Level 1: Basic | Tasks 1, 2, and 3 reported complete |
| Level 2: Intermediate | Planned |
| Level 3: Advanced | Planned |

This README will be updated as new features, improvements, documentation, and development milestones are completed.