# Menged Dynamic Frontend — Technical Documentation
## Level 1 Task 3: Dynamic Frontend with Vanilla JavaScript

**Platform:** Menged (መንገድ — Opportunity Discovery & Career Management Platform)  
**Concept:** *Discover opportunities. Build your future.*  
**Level:** Codveda Internship Level 1 — Basic (Task 3)  
**Developer:** Etsegenet Amsalu (Haleta)  
**Stack:** Semantic HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES6+), Fetch API  
**Backend Integration:** Connected to Express REST API at `http://localhost:5000/api`  
**Related Documents:** [Product Requirements](../../../docs/PRODUCT_REQUIREMENTS.md) | [System Architecture](../../../docs/SYSTEM_ARCHITECTURE.md) | [Opportunity Data Standard](../../../docs/OPPORTUNITY_DATA_STANDARD.md)

---

## 1. Executive Summary

Task 3 delivers a modern, accessible, and high-performance Single-Page Application (SPA) designed specifically for Ethiopian university students, recent graduates, and early-career technologists. The frontend communicates seamlessly with the Node.js/Express REST API and PostgreSQL database constructed in Task 2.

In strict compliance with **Codveda Level 1 Basic** guidelines:
* Built **100% in native Vanilla JavaScript (ES6+)**, semantic **HTML5**, and pure **CSS3**.
* Zero external CSS frameworks (no Tailwind, Bootstrap, or Material UI).
* Zero external JavaScript frameworks (no React, Vue, Angular, jQuery, or Three.js).
* Zero bloat: all 3D tilt interactions, hero parallax animations, debounced search routines, and modals are implemented using native Web APIs.

---

## 2. Brand Identity and Logo System

```
       +-----------------------+
       |   Official Emblem     |
       |  (Golden Compass)     |
       +-----------+-----------+
                   |
     +-------------+-------------+
     |                           |
     v                           v
Circular Clipping Badge     Interactive Lightbox Modal
(Navbar Header)             (Detailed Emblem Inspection)
- 48px circle               - Accessible dialog
- 50% border-radius         - Dark obsidian backdrop
- Gold accent border        - Dismiss via Esc or click
- Zero white borders
```

### 2.1 The Golden Compass Emblem
The brand logo (`assets/logo.png`) represents direction, guidance, and discovery. To eliminate square background gaps and white edge clipping on light/emerald navigation surfaces:
* The logo is wrapped in a dedicated circular mask (`.brand-logo-badge`):
  ```css
  .brand-logo-badge {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: #041F17;
    border: 2px solid var(--color-accent-gold);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ```

### 2.2 Interactive Logo Lightbox Modal
Clicking the circular logo triggers an animated modal (`#logo-modal`) that displays the high-resolution golden compass asset and the bilingual caption *"MENGED (መንገድ) — The Golden Compass: Guiding Ethiopian Talent Toward Global Opportunities"*. The modal can be closed via the close button, clicking the backdrop, or pressing the `Escape` key.

---

## 3. Design System & Token Architecture

The design architecture utilizes strict CSS Custom Properties tokens organized into semantic groups:

```css
:root {
  /* Brand Identity & Primary Hues */
  --color-deep-emerald: #064E3B;      /* Primary Brand Anchor */
  --color-forest-green: #0B6B50;      /* Interactive Highlights */
  --color-vibrant-emerald: #10B981;   /* Vibrant Accents & Focus */
  --color-light-emerald: #D1FAE5;     /* Badge Surfaces & Glows */
  
  /* Background Canvas & Surfaces */
  --bg-page: #071F17;                 /* Deep Emerald Canvas */
  --bg-card: rgba(6, 78, 59, 0.55);   /* Semi-transparent Card Surface */
  --bg-navbar: rgba(4, 31, 23, 0.88); /* Blurring Header Surface */
  --card-border: rgba(16, 185, 129, 0.22); /* Glowing Emerald Border */
  
  /* High-Contrast Typography */
  --text-main: #FFFFFF;               /* Primary Headings & Bold Text */
  --text-muted: #D1FAE5;              /* Secondary Copy & Metadata */
  --color-deep-navy: #FFFFFF;         /* Inverted for High Contrast */
  
  /* Brand Accents */
  --color-accent-gold: #D4AF37;       /* Golden Compass & Star Ring */
  --color-soft-orange: #F59E0B;       /* Deadline Warnings */
  --color-accent-blue: #3B82F6;       /* Remote Tag Accent */
  
  /* Radii & Motion */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 3.1 Typography Stack
* **Brand & Headings:** `Plus Jakarta Sans` (Google Fonts, 700 & 800 weights) — High-impact geometric sans-serif.
* **Body Copy & Form Controls:** `Inter` (Google Fonts, 400, 500, 600 weights) — Exceptional readability at micro-sizes.
* **Bilingual Amharic Titles:** `Noto Sans Ethiopic` (Google Fonts, 700 weight) — Native typographic harmony for Ethiopic script (**መንገድ**).

---

## 4. Night Mode & Lighting System (Outside & Floating Controls)

The theme engine supports two distinct modes: **Emerald Canvas** and **Obsidian Night Mode**.

```
+---------------------------------------------------------------------------------+
|                               THEME CONTROLS                                    |
+---------------------------------------+-----------------------------------------+
| Control A: Outside Header Toggle      | Control B: Persistent Floating Switcher |
| Located in Navbar (.nav-outside-ctrls)| Pinned to Viewport Bottom-Right         |
| Beside Mobile Menu (Never Hidden)     | Fixed: bottom 1.75rem, right 1.75rem    |
+---------------------------------------+-----------------------------------------+
```

### 4.1 Outside Header Toggle (`#theme-toggle`)
Previously, nested navbar toggles became inaccessible on mobile viewports when the menu collapsed. The theme toggle is now located **outside** the `.nav-links` container inside `.nav-outside-controls`:
* Permanently visible on desktop, tablet, and mobile displays without requiring the user to open the navigation drawer.

### 4.2 Persistent Floating Theme Switcher (`#floating-theme-toggle`)
* Pinned to the bottom-right corner of the browser viewport (`position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 999;`).
* Features a frosted glassmorphic background, gold accent border, animated sun/moon glyphs, and a dynamic label (*"Night Mode"* vs. *"Light Mode"*).
* Allows instant theme switching anywhere as the user scrolls through opportunity streams.

### 4.3 State Synchronization & Persistence
Both controls trigger a synchronized controller function in `app.js`:
```javascript
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('menged-theme', theme);
  // Updates icons, accessibility titles, and floating text in sync
}
```

---

## 5. Homepage Architecture & Component Breakdown

### 5.1 Sticky Header & Navigation Bar (`<header id="navbar">`)
* **Brand Presentation:** Circular golden compass logo badge paired with bold bilingual title (**MENGED መንገድ**).
* **Navigation Links:** Smooth anchors targeting `#discover`, `#categories`, `#how-it-works`, `#why-menged`, and `#submit-section`.
* **API Health Status Pill (`#api-status-pill`):** Real-time indicator displaying `Live PostgreSQL` (green pulse) when connected or `Demonstration Mode` (amber pulse) when offline.
* **Mobile Drawer:** Accessible hamburger button toggling `.nav-links.open` with ARIA attributes (`aria-expanded`).

### 5.2 Section 01: Hero Section with 3D Floating Cards (`#home`)
* **Narrative:** Prominent headline (*"Discover opportunities. Build your future."*) accompanied by primary action buttons and a 3-point metrics bar (*5+ Key Sectors*, *100% Verified Listings*, *Direct Application Links*).
* **3D Floating Preview Cards (`#hero-3d-scene`):** Three interactive cards (*Featured Scholarship*, *Remote Internship*, *DevOps Bootcamp*) that float via staggered CSS keyframe animations.
* **Desktop Mouse Parallax:** Moving the cursor over the hero container calculates normalized coordinates `(x, y)` to apply smooth `translate3d(Xpx, Ypx, 0)` offsets based on each card's `data-speed` coefficient.

### 5.3 Section 02: Opportunity Category Navigator (`#categories`)
* Displays 5 interactive category cards with custom vector SVG icons:
  1. 💼 **Internships**
  2. 🎓 **Scholarships**
  3. 💻 **Remote Jobs**
  4. 📚 **Training Programs**
  5. 🌐 **Fellowships**
* Clicking any category card sets `state.activeCategory`, highlights the corresponding filter pill, executes `fetchOpportunities()`, and smoothly scrolls the user down to Section 03.

### 5.4 Section 03: Live Opportunity Discovery Hub (`#discover`)
* **Real-Time Search Bar:** Keyword search targeting titles, organizations, and descriptions with a **300ms debounce timer** that delays API calls until typing ceases. Includes a clear button (`✕`) when text is present.
* **Category Pill Bar:** Filter chips (`All`, `Internships`, `Scholarships`, `Remote jobs`, `Training programs`, `Fellowships`).
* **Secondary Refinement Controls:**
  * *Discipline Dropdown:* Filters by tech domain (`Software Engineering`, `AI`, `Cloud`, etc.).
  * *Location Dropdown:* Filters by location (`Addis Ababa`, `Remote`, `Hawassa`, etc.).
  * *Sort Selector:* Orders by `Newest First` (default), `Approaching Deadline`, or `Alphabetical (A-Z)`.
* **Dynamic Cards Grid (`#opportunities-grid`):** Generates structured `<article>` cards populated with:
  * Organization single-letter avatar badge.
  * Category badge with distinct palette classes (`pill-internship`, `pill-scholarship`, etc.).
  * Title, organization, and field/location tag chips.
  * Truncated description summary.
  * Formatted application deadline counter.
  * Interactive *"View Details &rarr;"* action button.
* **Card 3D Mouse Tilt:** On desktop screens ($\ge 768\text{px}$), hovering over any card computes the cursor position relative to the card's center to apply `perspective(1000px) rotateX() rotateY() translateY(-6px)`.

### 5.5 Section 04: How Menged Works (`#how-it-works`)
* 3-step structured journey:
  * `01. Discover` — Explore aggregated openings across universities and technology firms.
  * `02. Explore` — Evaluate standardized criteria, deadlines, and requirements.
  * `03. Take Action` — Direct access to official verified application links.

### 5.6 Section 05: Why Menged? (`#why-menged`)
* Two-column narrative highlighting 4 core platform benefits:
  1. *Centralized Discovery*
  2. *Organized Information*
  3. *Relevant Opportunities*
  4. *A Growing Community*

### 5.7 Section 06: Community Opportunity Submission (`#submit-section`)
* **Public Contribution Workflow:** Public students and company representatives can contribute verified openings without administrative complexity.
* **Input Fields:** Opportunity Title, Organization/Company, Category Selector (5 valid options), Academic Discipline, Location, Application Deadline (`type="date"`), Application URL (`type="url"`), Detailed Description, and Eligibility Criteria.
* **Client-Side Validation:** Validates required fields, highlights invalid controls with `.is-invalid`, and renders inline error text.
* **API Integration:** Dispatches an HTTP `POST` payload to `http://localhost:5000/api/opportunities`. On success, displays a green toast alert, resets the form, refetches the database records, and scrolls up to the stream.

### 5.8 Section 07: Call to Action (CTA) & Footer
* Prominent footer providing platform navigation links, account indicators, legal notices, and API health status links.

---

## 6. Modals Architecture

### 6.1 Opportunity Details Modal (`#details-modal`)
* Opens when a user clicks *"View Details"* on any opportunity card.
* **Read-Only Public Focus:** Does not display administrative `Edit` or `Delete` controls.
* Displays: Title, Organization, Location, Discipline, Formatted Deadline, Category Badge, About Description, Eligibility Criteria, and an external **"Apply on Official Website &rarr;"** button opening in a new secure tab (`target="_blank" rel="noopener noreferrer"`).
* **Keyboard Accessibility:** Closes on `Escape` key, clicking the close button (`&times;`), or clicking the backdrop overlay. Body scroll is locked (`overflow: hidden`) while open.

### 6.2 Logo Lightbox Modal (`#logo-modal`)
* Dedicated lightbox for viewing the brand emblem in high resolution.

---

## 7. State Management & API Integration Architecture

### 7.1 State Machine (`state` object in `app.js`)
```javascript
const state = {
  opportunities: [],           // Source records
  filteredOpportunities: [],   // Filtered subset
  activeCategory: 'All',       // Active category
  activeField: 'All',          // Active discipline
  activeLocation: 'All',       // Active location (client-side)
  activeSort: 'newest',        // Active sort
  searchQuery: '',             // Search string
  isBackendOnline: false,      // Backend health flag
  searchDebounceTimer: null,   // Debounce timer ID
};
```

### 7.2 Defensive Offline Fallback (`DEMO_FALLBACK_OPPORTUNITIES`)
To ensure evaluators and users always experience an interactive platform even if the local Express server or PostgreSQL service is offline:
1. `fetchOpportunities()` attempts an HTTP `GET` request with an `AbortController` timeout (2500ms).
2. If the request fails or times out, the function catches the exception and switches to `DEMO_FALLBACK_OPPORTUNITIES` (5 pre-configured demonstration opportunities across all 5 categories).
3. Local filtering and sorting algorithms replicate the backend behavior seamlessly.
4. The navbar status indicator updates to `Demonstration Mode`.

---

## 8. Frontend Security & Quality Engineering

1. **Cross-Site Scripting (XSS) Sanitization:** All text injected into HTML string templates passes through `escapeHtml()`:
   ```javascript
   function escapeHtml(str) {
     if (!str && str !== 0) return '';
     return String(str)
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039;');
   }
   ```
2. **Debounced Search:** User typing in `#search-input` resets a 300ms window, eliminating redundant server requests and CPU churn.
3. **Target Blank Hardening:** All external links enforce `rel="noopener noreferrer"` to prevent reverse tabjacking.
4. **Accessible Semantics:** Proper heading progression (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`), ARIA labels on icon buttons, and focus styling on interactive elements.

---

## 9. Current Frontend Limitations (Level 1)

1. **Client-Side Location & Sorting:** Location filtering and sort reordering happen in the browser runtime rather than via SQL `ORDER BY` or SQL `WHERE location = ...`.
2. **No Authentication UI:** The *"Sign In"* and *"Create Free Account"* buttons trigger informational toast alerts notifying users that personal workspaces arrive in Level 2.
3. **No File Drag-and-Drop:** PDF resume attachments are not supported in Level 1; only external application links can be entered.
