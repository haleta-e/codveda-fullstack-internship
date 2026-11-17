# Menged Dynamic Frontend — Technical Documentation

**Platform:** Menged (መንገድ — Opportunity Discovery & Career Management Platform)  
**Concept:** *Discover opportunities. Build your future.*  
**Level:** Codveda Internship Level 1 — Basic (Task 3)  
**Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API, PostgreSQL, Express REST API  
**Integration:** Connected to `http://localhost:5000/api`

---

## 1. Design Architecture & Token System

The design is constructed using a modern, strict CSS variable token architecture:

```css
:root {
  --color-deep-emerald: #064E3B;    /* Brand Primary */
  --color-forest-green: #0B6B50;    /* Interactive Primary */
  --color-light-emerald: #D1FAE5;   /* Surface & Accents */
  --color-warm-white: #FAFAF7;      /* Page Background */
  --color-pure-white: #FFFFFF;      /* Card Surfaces */
  --color-soft-blue: #DBEAFE;       /* Hero Gradient */
  --color-deep-navy: #172554;       /* Text & Headings */
  --color-soft-orange: #F4A261;     /* Highlights */
  --color-accent-gold: #D97706;     /* Brand Compass */
  --color-muted-grey: #64748B;      /* Body Copy */
  --color-border-grey: #E5E7EB;     /* Borders */
}
```

---

## 2. Component Structure

### 2.1 Navigation Bar
- Embedded Compass Logo (`assets/logo.png`) paired with dual typography (`Plus Jakarta Sans` + `Noto Sans Ethiopic`).
- Sticky positioning with dynamic background blur and scroll elevation (`navbar.scrolled`).
- Responsive hamburger menu with ARIA accessibility tags.

### 2.2 3D Floating Hero Cards
- Three opportunity cards (`Global Scholarship`, `Remote Internship`, `Training Program`) positioned with `transform-style: preserve-3d` and individual keyframe animations.
- Subtle mouse parallax interaction (`translate3d()`) responds to mouse cursor position on desktop viewports.

### 2.3 Opportunity Categories
- Five distinct category cards with custom SVG icons.
- Clicking any card dynamically filters the live discovery grid and smoothly scrolls the user to `#discover`.

### 2.4 Live Discovery Grid
- Driven exclusively by the Express REST API (`GET /api/opportunities`).
- Multi-factor filtering:
  - Real-time debounced keyword search (300ms delay).
  - Category filter pills.
  - Discipline dropdown.
  - Location dropdown.
  - Sorting (Newest, Approaching Deadline, Alphabetical).
- 3D card tilt on mouse move (`perspective(1000px) rotateX() rotateY()`).
- Responsive 3-column desktop, 2-column tablet, and 1-column mobile layouts.

### 2.5 Opportunity Details Modal
- Clean modal window displaying full descriptions, eligibility, education level, deadlines, and the external `Apply Now` button.
- Keyboard accessibility: closes on `Escape` key, click outside, or close button.

### 2.6 Developer / Evaluator CRUD Portal
- A foldable management panel located at `#admin-crud-portal`.
- Enables live `POST`, `GET`, `PUT`, and `DELETE` operations for internship evaluation without compromising the public-facing product aesthetic.

---

## 3. Security & Best Practices

1. **XSS Protection:** All dynamic fields from the database pass through an `escapeHtml()` sanitizer before DOM insertion.
2. **Defensive Error Handling:** Offline backend banner with retry button.
3. **Graceful Loading:** Shimmering skeleton cards display while API network requests are in flight.
4. **Reduced Motion Accessibility:** Supports `@media (prefers-reduced-motion: reduce)`.
