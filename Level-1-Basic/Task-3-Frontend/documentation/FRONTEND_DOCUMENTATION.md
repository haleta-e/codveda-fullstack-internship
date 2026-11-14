# Menged Dynamic Frontend — Technical Documentation

**Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)  
**Level:** Codveda Internship Level 1 — Basic  
**Task:** Task 3 — Dynamic Frontend with Vanilla JavaScript  
**Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API  
**Integration:** Menged Express REST API (`http://localhost:5000/api`) + PostgreSQL (`menged_db`)

---

## 1. System Overview

The Menged frontend delivers an interactive, responsive web application that connects directly to the Node.js/Express REST API created in Task 2. It is engineered entirely with standard modern web technologies—**no third-party frontend frameworks, libraries, or build bundlers are required**.

### Key Features
- **Live REST API Integration:** Consumes `GET`, `POST`, `PUT`, and `DELETE` endpoints via the browser's native Fetch API with `async/await`.
- **Dynamic Content Rendering:** Renders opportunity records directly from PostgreSQL into responsive card grids and interactive tables.
- **Debounced Real-time Search:** Filters opportunities on-the-fly with a 300ms debounce to prevent API thrashing.
- **Category & Discipline Filtering:** Dropdown selectors for exact category filtering (`Internships`, `Scholarships`, `Remote jobs`, `Training programs`, `Fellowships`) and tech fields.
- **Full CRUD Management Dashboard:** Integrated interface allowing developers and evaluators to create, view, edit, and delete opportunities with live database updates.
- **Opportunity Details Modal:** Accessible modal dialog showing complete opportunity descriptions, eligibility requirements, and direct application links.
- **Defensive Error & Network Handling:** Displays custom alert banners if the backend server is unreachable and graceful feedback for empty search results.
- **XSS Protection:** Client-side HTML sanitization ensures untrusted strings are properly escaped prior to DOM injection.

---

## 2. Directory Architecture

```
Level-1-Basic/Task-3-Frontend/
├── index.html                          # Semantic HTML5 single-page application structure
├── css/
│   └── style.css                       # Modern, responsive CSS3 styling & animations
├── js/
│   └── app.js                          # Vanilla JavaScript application, state & Fetch API
├── documentation/
│   └── FRONTEND_DOCUMENTATION.md       # In-depth frontend technical reference
├── screenshots/
│   └── README.md                       # Evaluation evidence and screenshot capture guide
└── README.md                           # Master Task 3 project guide
```

---

## 3. Frontend Architecture & State Management

### 3.1 Centralized Configuration
The API base URL is declared at the very top of `js/app.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```
This enables seamless configuration changes across development, staging, or production environments.

### 3.2 Reactive State Model
The application maintains a centralized state object:
```javascript
const state = {
  opportunities: [],           // All records retrieved from the database
  filteredOpportunities: [],   // Currently active filtered view
  activeType: 'All',           // Active category filter
  activeField: 'All',          // Active discipline filter
  searchQuery: '',             // Active search query
  isEditing: false,            // Flag indicating Create vs. Edit mode
  editingId: null,             // ID of the record currently being modified
  pendingDeleteId: null,       // ID queued for deletion confirmation
  isBackendOnline: true,       // Backend connectivity status
  searchDebounceTimer: null,   // Debounce timer ID
};
```

---

## 4. API Endpoints Consumed

| User Action | API Endpoint | HTTP Method | Expected Status |
|---|---|:---:|:---:|
| Check Server Health | `/api/health` | `GET` | `200 OK` |
| Load Opportunities | `/api/opportunities?type=&field=&search=` | `GET` | `200 OK` |
| View Opportunity Details | `/api/opportunities/:id` | `GET` | `200 OK` |
| Create New Opportunity | `/api/opportunities` | `POST` | `201 Created` |
| Update Opportunity | `/api/opportunities/:id` | `PUT` | `200 OK` |
| Delete Opportunity | `/api/opportunities/:id` | `DELETE` | `204 No Content` |

---

## 5. UI Components & Interactions

### 5.1 Discovery Grid & Cards
Each opportunity card displays:
- Categorized color-coded badges (`Internships` - emerald, `Scholarships` - blue, `Remote jobs` - violet, `Training programs` - amber, `Fellowships` - cyan).
- Title, organization name, location, and application deadline.
- Discipline chips (e.g. Software Engineering, AI, Cloud).
- Truncated description snippet.
- Action triggers: "View Details" (opens modal) and "Apply Now" (external target link).

### 5.2 CRUD Management Interface
- **Create Mode:** The form defaults to inserting a new opportunity into PostgreSQL via `POST /api/opportunities`.
- **Edit Mode:** Clicking "Edit" in the management table or details modal auto-fills the form with existing data, updates the button label to "Update Opportunity", and changes the submission target to `PUT /api/opportunities/:id`.
- **Delete Confirmation:** Accidental deletions are prevented via an interactive confirmation modal before dispatching `DELETE /api/opportunities/:id`.
- **Toast Notifications:** Success and error toast notifications provide immediate visual feedback.

### 5.3 Accessibility (a11y) & Usability
- Semantic landmark elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<footer>`).
- Screen-reader friendly ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-live="polite"`).
- Keyboard shortcuts: `Escape` key closes open modals.
- Tab-accessible form controls with distinct focus outlines.
