# Menged Dynamic Frontend — Level 1 Task 3

> **Codveda Full-Stack Development Internship**  
> **Level 1 (Basic) — Task 3: Build a Dynamic Frontend with Vanilla JavaScript**  
> **Developer:** Haleta  
> **Project:** Menged (Opportunity Discovery Platform for Ethiopian University Students and Graduates)

---

## 1. Project Overview

**Menged** (መንገድ — "Path" or "Way" in Amharic) is a dedicated platform designed to help Ethiopian university students, recent graduates, and aspiring technologists discover internships, scholarships, remote tech jobs, training programs, and fellowships.

Task 3 completes Level 1 by providing a modern, accessible, and responsive user interface built using **HTML5**, **CSS3**, and **Vanilla JavaScript**. The frontend communicates seamlessly with the **Express REST API** and **PostgreSQL database** constructed in Task 2 using the native browser **Fetch API**.

---

## 2. Technologies Used

- **Markup:** Semantic HTML5
- **Styling:** CSS3 (Custom properties, CSS Grid, Flexbox, Keyframe animations)
- **Scripting:** Vanilla JavaScript (ES6+, `async/await`, Fetch API)
- **Backend API:** Node.js / Express.js (from Task 2, running on port 5000)
- **Database:** PostgreSQL (`menged_db`)
- **Typography:** Plus Jakarta Sans & Noto Sans Ethiopic (Google Fonts)

---

## 3. Directory Structure

```
Task-3-Frontend/
│
├── index.html                          # Semantic HTML5 single-page application structure
│
├── css/
│   └── style.css                       # Responsive CSS3 styles, variables, and animations
│
├── js/
│   └── app.js                          # Vanilla JavaScript logic, state, and API integration
│
├── documentation/
│   └── FRONTEND_DOCUMENTATION.md       # In-depth technical architecture and component specs
│
├── screenshots/
│   └── README.md                       # Evaluation evidence and screenshot checklist
│
└── README.md                           # Master Task 3 documentation
```

---

## 4. Frontend Features

### 4.1 Navigation & Branding
- Modern navbar featuring the Menged brand icon and dual English/Amharic typography.
- Smooth scrolling navigation links (`#home`, `#opportunities`, `#manage`, `#about`).
- Responsive mobile hamburger menu with accessible ARIA toggle.

### 4.2 Hero Section
- Clean value proposition tailored to Ethiopian university students and graduates.
- Call-to-action buttons for rapid exploration or posting new opportunities.
- Live platform statistics and interactive visual card preview.

### 4.3 Opportunity Discovery Grid
- Fetches real opportunity records dynamically from the PostgreSQL database via `GET /api/opportunities`.
- Category badges with distinct color styling (`Internships`, `Scholarships`, `Remote jobs`, `Training programs`, `Fellowships`).
- Informative chips showing location and application deadlines.
- "View Details" trigger and direct "Apply" button links.

### 4.4 Search and Filtering
- **Keyword Search:** Real-time search across titles, organizations, and descriptions with a **300ms debounce** to optimize network traffic.
- **Category Filter:** Filter by specific opportunity type.
- **Field Filter:** Filter by technical discipline (Software Engineering, Computer Science, AI, Cloud, etc.).
- **Reset Filters:** Instant reset button restoring default view.
- **Empty State:** User-friendly feedback when no records match search parameters.

### 4.5 Opportunity Details Modal
- Detailed view presenting full description, eligibility criteria, deadline, and host organization.
- Accessible modal navigation (close on button, click outside, or `Escape` key).
- Direct "Edit" and "Delete" shortcuts.

### 4.6 Full CRUD Opportunity Management
- **Create (POST):** Add a new opportunity with client-side validation.
- **Read (GET):** Live database record table with instant refresh.
- **Update (PUT):** Pre-populates the form for editing and updates the record in PostgreSQL.
- **Delete (DELETE):** Deletes a record permanently with an explicit confirmation dialog.
- **Toast Notifications:** Feedback banners confirming success or displaying validation/network errors.

### 4.7 Defensive Error Handling
- Persistent warning banner if the Express/PostgreSQL backend is offline.
- Skeleton loading cards while fetching data.

---

## 5. How to Run the Application

### Step 1: Start the Task 2 Backend API
Ensure PostgreSQL is running, then start the Express server in your terminal:
```powershell
cd Level-1-Basic\Task-2-REST-API
npm run dev
```

Verify that the backend is live at:
`http://localhost:5000/api/health`

### Step 2: Open the Frontend
Since the frontend uses standard HTML, CSS, and Vanilla JavaScript, you can open it in any modern browser:

- **Option A (VS Code Live Server extension):**
  Right-click `Level-1-Basic/Task-3-Frontend/index.html` -> Click **Open with Live Server**.

- **Option B (Direct Browser File):**
  Double-click `Level-1-Basic/Task-3-Frontend/index.html` or open it in Google Chrome, Microsoft Edge, or Mozilla Firefox:
  ```powershell
  Start-Process "Level-1-Basic\Task-3-Frontend\index.html"
  ```

---

## 6. How to Test Frontend Features

1. **Test Discovery:**
   - Open the page. Verify that the 5 demonstration opportunities stored in PostgreSQL load into the discovery grid.
2. **Test Search & Filtering:**
   - Type `"Software"` in the search box. Notice the debounced search filters results to matching opportunities.
   - Select `"Internships"` from the Category dropdown. Verify only internship cards are displayed.
   - Click `"Reset Filters"`. Verify all opportunities reappear.
3. **Test Opportunity Details:**
   - Click `"View Details"` on any opportunity card. Verify the modal opens with full descriptions, eligibility, and deadline.
   - Press `Escape` to close the modal.
4. **Test Create (POST):**
   - Scroll to the "Manage Opportunities" section.
   - Fill in Title, Organization, Category, and Description. Click **Submit Opportunity**.
   - Verify the success toast appears and the new opportunity immediately appears in the grid.
5. **Test Edit (PUT):**
   - Find your newly created opportunity in the management table. Click **Edit**.
   - Modify the title. Click **Update Opportunity**.
   - Verify the update is reflected in the grid and table.
6. **Test Delete (DELETE):**
   - Click **Delete** on the test opportunity in the table.
   - Confirm deletion in the modal dialog. Verify the record is permanently removed from the database.
7. **Test Responsive Design:**
   - Press `F12` to open Developer Tools and toggle the device toolbar to test mobile and tablet viewports.

---

## 7. Known Limitations

- **Authentication:** In accordance with Codveda Level 1 guidelines, user accounts and authentication are deliberately omitted. Any user can post or manage opportunities for evaluation purposes.
- **Demonstration Data:** All seeded opportunities are simulated demonstration records created for portfolio and internship review purposes.
