# Menged (መንገድ) Dynamic Frontend — Level 1 Task 3

> **Codveda Full-Stack Development Internship**  
> **Level 1 (Basic) — Task 3: Build a Dynamic Frontend with Vanilla JavaScript**  
> **Platform:** Menged (Opportunity Discovery & Career Management Platform for Ethiopian University Students and Graduates)  
> **Concept:** *Discover opportunities. Build your future.*  
> **Developer:** Haleta

---

## 1. Project Overview

**Menged** (መንገድ — "Path" or "Way" in Amharic) is a dedicated platform designed to help Ethiopian university students, recent graduates, and aspiring technologists discover internships, scholarships, remote tech jobs, training bootcamps, and fellowships.

Task 3 delivers an enterprise-grade, modern, and fully responsive user interface built using **HTML5**, **CSS3**, and **Vanilla JavaScript**. The frontend communicates seamlessly with the **Express REST API** and **PostgreSQL database** constructed in Task 2 using the browser's native **Fetch API**.

---

## 2. Brand Identity & Color System

The design implements the official Menged Design Specification:

| Token | Hex | Role |
|---|---|---|
| **Deep Emerald** | `#064E3B` | Primary brand color & identity |
| **Forest Green** | `#0B6B50` | Primary buttons, active links, and positive emphasis |
| **Light Emerald** | `#D1FAE5` | Background highlights & category badge surfaces |
| **Warm White** | `#FAFAF7` | Main page background |
| **Pure White** | `#FFFFFF` | Cards, navigation bar, and dialog surfaces |
| **Soft Blue** | `#DBEAFE` | Secondary hero gradients and highlights |
| **Deep Navy** | `#172554` | Headings, titles, and high-contrast typography |
| **Soft Orange / Gold** | `#F4A261` / `#D97706` | Brand compass star accent and deadline tags |
| **Muted Grey** | `#64748B` | Body copy and secondary text |

---

## 3. Typography Stack

- **Headings & Brand Title:** `Plus Jakarta Sans` (Google Fonts)
- **Body & Controls:** `Inter` (Google Fonts)
- **Ethiopic Text:** `Noto Sans Ethiopic` (Google Fonts)

---

## 4. Key Sections & Interactive Features

### 4.1 Sticky Navigation Bar
- Embedded **Menged Compass Logo** (`assets/logo.png`) representing navigation, guidance, and discovery.
- Brand name displayed in English and Amharic (**MENGED መንገድ**).
- Navigation links (`Discover`, `Categories`, `How It Works`, `Why Menged`, `About`).
- Action triggers: `Sign In` and `Get Started`.
- Responsive mobile hamburger menu with smooth slide-down animation.

### 4.2 Hero Section (Two-Column with 3D Floating Cards)
- Left side: Prominent headline (*"Discover opportunities. Build your future."*), descriptive narrative, and primary action buttons.
- Right side: **Three interactive 3D floating opportunity cards** (`Featured Scholarship`, `Remote Internship`, `Training Bootcamp`) with slow CSS floating keyframe animations and mouse parallax interaction.

### 4.3 Section 02: Opportunity Categories
- 5 dedicated category cards:
  - 💼 **Internships**
  - 🎓 **Scholarships**
  - 💻 **Remote Jobs**
  - 📚 **Training Programs**
  - 🌐 **Fellowships**
- Clicking any category card automatically filters the discovery section and smoothly scrolls there.

### 4.4 Section 03: Opportunity Discovery (Live REST API & PostgreSQL)
- **Keyword Search:** Real-time search across titles, organizations, and descriptions with a **300ms debounce** to prevent excessive network requests.
- **Category Filter Pills:** All, Internships, Scholarships, Remote Jobs, Training Programs, Fellowships.
- **Secondary Filters:** Academic discipline dropdown, Location dropdown, and Sorting (*Newest First*, *Approaching Deadline*, *Alphabetical*).
- **Dynamic Cards Grid:** Populated via `GET http://localhost:5000/api/opportunities`:
  - Organization initial avatar.
  - Category pill badge.
  - Title, Organization, Field, and Location chips.
  - Truncated description snippet.
  - Approaching deadline counter.
  - Interactive **"View Details"** trigger with 3D card tilt on hover.
- **Defensive States:** Shimmering skeleton cards during data fetching, clean empty state when no records match, and an alert banner if the backend is offline.

### 4.5 Section 04: How Menged Works (3-Step Journey)
- `01. Discover` → `02. Explore` → `03. Take Action`.

### 4.6 Section 05: Why Menged?
- Benefits grid: Centralized discovery, organized information, relevant opportunities, and a growing community.

### 4.7 Section 06: Call to Action (CTA)
- Deep emerald banner inviting students and graduates to begin their opportunity journey.

### 4.8 Section 07: Footer
- Comprehensive brand description, category links, platform navigation, and copyright.

### 4.9 Opportunity Details Modal (Read-Only Public Details)
- Clean, focused dialog displaying the full opportunity overview, verified eligibility criteria, academic discipline, location, and the official external **"Apply Now"** button. Public students discover opportunities without distraction.

### 4.10 Community Opportunity Submission Form
- Clean submission section allowing students, educators, and organizations to submit verified opportunities for review via `POST /api/opportunities`.

### 4.11 Night Mode / Dark Theme System
- Built-in theme switcher (`#theme-toggle`) in the navigation bar allowing users to effortlessly switch between Vibrant Emerald and Obsidian Night modes, with preference automatically saved to `localStorage`.

### 4.12 Interactive Logo Lightbox Modal
- Clicking the circular golden compass brand logo opens an interactive modal viewing the high-resolution identity asset in detail.

---

## 5. How to Run and View the Application

### Step 1: Start the Backend (Port 5000)
In your terminal:
```powershell
cd Level-1-Basic\Task-2-REST-API
npm run dev
```

### Step 2: Open the Frontend
In PowerShell:
```powershell
Start-Process "Level-1-Basic\Task-3-Frontend\index.html"
```
Or right-click `index.html` in VS Code and select **Open with Live Server**.
