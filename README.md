# Public Utility Status - Municipal Citizen Services Portal

> **Course:** Essentials of Web Programming (EWP) Lab  
> **Degree Program:** B.Tech Computer Science & Engineering / Information Technology  
> **Academic Session:** 2026  
> **Target Region (Demonstration):** Greater Hyderabad Municipal Area (GHMC)

---

## 1. Abstract

The **Public Utility Status** web application is an integrated, responsive citizen services and grievance tracking portal designed to provide residents with real-time operational status, maintenance advisories, and problem-reporting mechanisms for essential civic utilities. Built using **Angular**, **TypeScript**, **HTML5**, **CSS3**, **JavaScript (ES6+)**, **XML**, **DTD**, **Fetch API**, and **JSON**, this single-page application eliminates the need for fragmented helplines by uniting municipal utility monitoring under a clean, accessible interface.

---

## 2. Problem Statement

In expanding metropolitan cities like Hyderabad, public utilities—including electricity distribution, drinking water supply, metro rail and bus transit, optical fiber broadband, solid waste collection, and road maintenance—are managed by disparate departments (TSSPDCL, HMWSSB, HMRL, TSRTC, GHMC, T-Fiber). Citizens encounter significant friction:

1. **Information Asymmetry:** Citizens do not know whether a service breakdown is an isolated issue or scheduled maintenance.
2. **Delayed Grievance Reporting:** Phone helplines frequently experience high wait times and congestion during major outages.
3. **Lack of Transparency:** Citizens rarely receive tangible ticket identifiers to track the resolution timeline of reported faults.

The **Public Utility Status** application directly addresses these challenges through a centralized digital portal.

---

## 3. Project Objectives

- **Centralized Dashboard:** Present dynamically computed metrics on utility availability across Hyderabad.
- **Multi-Utility Directory:** Enable searching and multi-parameter filtering across all 6 major utility categories.
- **Robust Grievance Registration:** Provide client-side validated reporting forms that enforce strict validation (e.g., 10-digit mobile numbers, proper email formats, and minimum description lengths).
- **Persistent Local Ticket Tracking:** Issue unique tracking IDs (`CMP-HYD-2026-XXXX`) and visualize resolution progress using a 3-step timeline.
- **Asynchronous Data Exchange:** Demonstrate asynchronous loading of both JSON and XML data using modern browser APIs (`fetch()` and `DOMParser`).
- **Syllabus Demonstration:** Fulfill all technical criteria of the Essentials of Web Programming (EWP) syllabus without external backend dependencies or paid third-party APIs.

---

## 4. Mandatory Technologies Used

| Technology | Purpose in This Project |
| :--- | :--- |
| **HTML5** | Semantic structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`), accessible forms, and input controls. |
| **CSS3** | Responsive Flexbox and Grid layouts, light civic theme (Blue, Green, White), custom status badges, hover transitions, and media queries. |
| **JavaScript (ES6+)** | Asynchronous operations (`async/await`), browser `localStorage` CRUD operations, and XML parsing via `DOMParser`. |
| **XML** | Structured hierarchical storage of municipal utility data in `utilities.xml`. |
| **DTD** | Schema validation rules in `utilities.dtd` specifying element grammar and ordering. |
| **Fetch API** | Asynchronous network retrieval of `utilities.json` and `utilities.xml`, plus mock `POST` method simulation. |
| **JSON** | Lightweight data interchange format for utility statuses (`utilities.json`) and bulletins (`announcements.json`). |
| **TypeScript** | Type-safe classes, interfaces (`Utility`, `Complaint`, `Announcement`, `DashboardStats`), and compile-time verification. |
| **Angular** | Standalone Component architecture, modern Signals (`signal`, `computed`), Reactive Forms, and client-side SPA routing. |

---

## 5. Website Architecture & Pages

```
                   ┌───────────────────────────────────┐
                   │    Site Header & Navigation Bar   │
                   └─────────────────┬─────────────────┘
                                     │
     ┌──────────────┬────────────────┼────────────────┬──────────────┬──────────────┐
     ▼              ▼                ▼                ▼              ▼              ▼
┌─────────┐   ┌───────────┐   ┌─────────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│ Page 1  │   │  Page 2   │   │   Page 3    │   │  Page 4   │   │  Page 5   │   │  Page 6   │
│Dashboard│   │  Utility  │   │  Complaint  │   │ Complaint │   │Announce-  │   │  About &  │
│Overview │   │Directory  │   │Registration │   │  Status   │   │   ments   │   │ XML Demo  │
└─────────┘   └───────────┘   └─────────────┘   └───────────┘   └───────────┘   └───────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │    Site Footer & Helpline Desk    │
                   └───────────────────────────────────┘
```

### Page 1: Home / Dashboard
- **Civic Hero Banner:** Summary of municipal utility services in Greater Hyderabad.
- **Dynamic Status Summary Cards:**
  - Total Utilities (6)
  - Operational Utilities (Green)
  - Utilities Under Maintenance (Yellow)
  - Utilities with Service Disruptions (Red)
  *(Calculated dynamically via Angular `computed()` signals).*
- **Utility Category Cards:** Previews of all 6 sectors with service areas, last updated timestamps, and quick modal inspection.
- **Recent Announcements:** Highlights top municipal advisories.
- **Quick Action Links:** Direct shortcuts to report issues and track existing grievances.

### Page 2: Utility Status Directory
- **Comprehensive Directory:** Details on ID, category, service area, status, description, and expected restoration.
- **Real-Time Search:** Live filtering by utility name, locality, or keyword.
- **Filter Dropdowns:** Filter by category and status.
- **Dual View Modes:** Toggle between Grid Card View and Structured Table View.
- **Data Source Switcher:** Switch between `utilities.json` (Fetch API) and `utilities.xml` (Fetch + DOMParser live test).
- **Details Modal:** Comprehensive view including monthly uptime and dedicated emergency helplines.

### Page 3: Complaint Registration
- **Reactive Form Validation:**
  - Citizen Full Name (minimum 3 characters).
  - Mobile Number (must be exactly 10 digits: `^[0-9]{10}$`).
  - Email Address (RFC 5322 compliant email format).
  - Utility Category & Hyderabad Locality (required selects).
  - Fault Classification (dynamically populated based on chosen category).
  - Problem Description (minimum 15 characters).
- **Unique Ticket ID:** Generates formatted IDs (e.g., `CMP-HYD-2026-XXXX`).
- **Persistent Storage:** Saves grievances to browser `localStorage`.
- **Fetch API POST Demonstration:** An interactive testing panel that executes a simulated asynchronous `POST` request with JSON serialization and HTTP 201 response inspection.

### Page 4: Complaint Status Tracking
- **Search by Ticket ID:** Direct lookup with case-insensitive support.
- **3-Step Progress Timeline:**
  - Step 1: Grievance Lodged (Submitted)
  - Step 2: Maintenance Squad Dispatched (In Progress)
  - Step 3: Rectified & Field Verified (Resolved)
- **Preloaded Demonstrations:** Sample records for each status, enabling one-click evaluation without retyping.

### Page 5: Public Announcements
- **Municipal Advisories:** Scheduled power feeder maintenance, water shutdowns, metro timing revisions, and road resurfacing.
- **Category Filter Pills:** Quickly isolate advisories for specific utilities.
- **Metadata:** Displays priority badges (High, Medium, Normal), affected zones, and target completion windows.

### Page 6: About Project & Technical Lab Demo
- **Technical Documentation:** Detailed breakdown of how syllabus requirements are met.
- **Interactive XML & DTD Console:**
  - Tab 1: Formatted source of `utilities.xml`.
  - Tab 2: Validated declarations from `utilities.dtd`.
  - Tab 3: In-browser DOMParser execution tool with live parsed node output.
- **Limitations & Future Scope:** Transparent disclosure of educational scope and production roadmap.

---

## 6. Project Directory Structure

```
public-utility-status/
│
├── public/
│   ├── favicon.ico
│   └── data/
│       ├── utilities.xml           <-- XML data with DTD reference
│       ├── utilities.dtd           <-- DTD schema validation file
│       ├── utilities.json          <-- JSON utility records (Fetch API)
│       └── announcements.json      <-- JSON public announcements
│
├── src/
│   ├── index.html                  <-- Root HTML5 document
│   ├── main.ts                     <-- Angular bootstrap entry point
│   ├── styles.css                  <-- Global CSS3 styles, variables & themes
│   │
│   └── app/
│       ├── app.ts                  <-- Main App shell component
│       ├── app.html                <-- Root layout with Navbar, Outlet, Footer
│       ├── app.css                 <-- Sticky footer styling
│       ├── app.routes.ts           <-- Angular client-side route declarations
│       ├── app.config.ts           <-- Application configuration
│       │
│       ├── models/
│       │   ├── utility.model.ts    <-- Utility & DashboardStats interfaces
│       │   ├── complaint.model.ts  <-- Complaint & request interfaces
│       │   └── announcement.model.ts <-- Announcement interface
│       │
│       ├── services/
│       │   ├── utility.service.ts  <-- Fetch API, XML DOMParser & stats logic
│       │   ├── complaint.service.ts<-- LocalStorage CRUD & simulated POST API
│       │   └── announcement.service.ts <-- Announcements Fetch API service
│       │
│       └── components/
│           ├── navbar/             <-- Responsive navigation & civic alerts
│           ├── footer/             <-- Project credits & emergency contacts
│           ├── home/               <-- Dashboard with dynamic summary metrics
│           ├── utility-status/     <-- Directory, search, filter, XML toggle
│           ├── complaint-registration/ <-- Reactive form & Fetch POST demo
│           ├── complaint-status/   <-- Ticket lookup & 3-step progress tracker
│           ├── announcements/      <-- Public advisories & priority filters
│           └── about/              <-- Technical docs & live XML/DTD console
│
├── angular.json                    <-- Angular workspace build configuration
├── package.json                    <-- Node.js dependencies & scripts
├── tsconfig.json                   <-- TypeScript compiler configuration
└── README.md                       <-- Project documentation (this file)
```

---

## 7. XML and DTD Structure

### `public/data/utilities.dtd`
```dtd
<!ELEMENT utilities (utility+)>
<!ELEMENT utility (id, name, category, area, status, description, lastUpdated, expectedRestoration, helpline)>
<!ELEMENT id (#PCDATA)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT category (#PCDATA)>
<!ELEMENT area (#PCDATA)>
<!ELEMENT status (#PCDATA)>
<!ELEMENT description (#PCDATA)>
<!ELEMENT lastUpdated (#PCDATA)>
<!ELEMENT expectedRestoration (#PCDATA)>
<!ELEMENT helpline (#PCDATA)>
```

### `public/data/utilities.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE utilities SYSTEM "utilities.dtd">
<utilities>
    <utility>
        <id>U101</id>
        <name>Electricity Distribution</name>
        <category>Electricity</category>
        <area>Hyderabad Central &amp; West (Banjara Hills, Jubilee Hills, Gachibowli)</area>
        <status>Operational</status>
        <description>TSSPDCL 33/11kV substations are functioning normally.</description>
        <lastUpdated>2026-10-22 09:30 AM</lastUpdated>
        <expectedRestoration>All systems normal</expectedRestoration>
        <helpline>1912</helpline>
    </utility>
    <!-- Additional utility nodes (Water, Transit, Internet, Waste, Roads) -->
</utilities>
```

---

## 8. Installation & Setup Instructions

### Prerequisites
Ensure that **Node.js** (v18.0.0 or later) is installed on your computer.
Check by opening a terminal (Command Prompt, PowerShell, or macOS/Linux Terminal):
```bash
node -v
npm -v
```

### Step 1: Open the Project Folder
Open Visual Studio Code (VS Code), select **File > Open Folder...**, and select:
```
C:\Users\Dell\.gemini\antigravity\scratch\public-utility-status
```

### Step 2: Install Project Dependencies
Open the integrated terminal in VS Code (`Ctrl + ~` or **Terminal > New Terminal**) and execute:
```bash
npm install
```
*(All required Angular and TypeScript packages are listed in `package.json` and will be downloaded to `node_modules`).*

### Step 3: Run the Angular Development Server
Start the local server using npm:
```bash
npm start
```
*Alternatively, you can run:*
```bash
npx ng serve
```

### Step 4: Open in Web Browser
Once compiled, open your preferred browser (Google Chrome, Microsoft Edge, or Mozilla Firefox) and navigate to:
```
http://localhost:4200/
```

---

## 9. Comprehensive Testing Procedure for the External Examiner

### Test Case 1: Dashboard Overview & Dynamic Stats
1. Navigate to `http://localhost:4200/`.
2. Inspect the 4 statistics cards at the top. Notice that **Total: 6**, **Operational: 3**, **Maintenance: 2**, and **Disruptions: 1** are calculated dynamically from `utilities.json`.
3. Click **"View Details"** on any utility card (e.g., Water Supply) to open the interactive inspection modal.

### Test Case 2: Utility Status Directory & Search/Filter
1. Click **"Utility Status"** in the navigation bar (`/utilities`).
2. Type `"Gachibowli"` in the search box; observe the real-time filter isolating relevant utilities.
3. Select **Category: Water Supply** from the dropdown; observe the list filter to HMWSSB.
4. Toggle between the **Cards View** and **Table View** using the view switcher icons.
5. In the top bar, click **"Parse utilities.xml (DOMParser)"**. Notice the green success alert confirming that the XML file was fetched and parsed into the DOM.

### Test Case 3: Complaint Registration & Validation
1. Click **"Report Problem"** (`/register-complaint`).
2. Attempt to click **"Submit Grievance"** without filling out the form; note that the button is disabled.
3. Enter invalid details (e.g., a 6-digit phone number or an invalid email address); observe the real-time inline validation error messages.
4. Fill in valid inputs:
   - **Name:** `A. Ramesh`
   - **Mobile:** `9848011223` (10 digits)
   - **Email:** `ramesh@example.com`
   - **Category:** `Electricity`
   - **Area:** `Banjara Hills`
   - **Problem Type:** `Unscheduled Power Outage`
   - **Description:** `Feeder transformer tripped following wind storm; low voltage in lane 4.`
5. Click **"Submit Grievance"**.
6. Observe the confirmation card displaying your unique complaint reference ID (e.g., `CMP-HYD-2026-4819`) with a **Copy ID** button.

### Test Case 4: Fetch API POST Method Simulation
1. Fill in the complaint form again.
2. Click the green button **"Submit via Fetch API POST (Syllabus Demo)"**.
3. Inspect the dark inspection panel displaying:
   - HTTP Status: `201 Created`
   - Request Body: Serialized JSON payload generated via `JSON.stringify()`.
   - Simulated Server Response: JSON payload including a generated reference number and timestamp.

### Test Case 5: Track Grievance Status
1. Click **"Track Status"** (`/complaint-status`).
2. Enter the ID generated in Test Case 3 or one of the preloaded IDs:
   - `CMP-HYD-2026-1011` (Resolved)
   - `CMP-HYD-2026-1012` (In Progress)
   - `CMP-HYD-2026-1013` (Submitted)
3. Click **"Track Status"**.
4. Observe the **3-Step Progress Timeline** visually illuminating the current stage of redressal.
5. In the table below, click **"Track This"** on any record to view its complete progress report.

### Test Case 6: Public Announcements
1. Click **"Announcements"** (`/announcements`).
2. Click the category filter pills (e.g., **Electricity**, **Water Supply**, **Road Maintenance**).
3. Confirm that notices reflect corresponding priorities (High, Medium, Normal) and target completion windows.

### Test Case 7: XML & DTD Laboratory Console
1. Click **"About & Lab Demo"** (`/about`).
2. Scroll to **Section 3: XML & DTD Laboratory Showcase**.
3. Click **"utilities.xml (Data)"** to inspect the raw XML markup.
4. Click **"utilities.dtd (DTD Grammar)"** to view the schema definitions.
5. Click **"Live DOMParser Console"** and select **"Execute DOMParser on utilities.xml"** to see live parsed DOM nodes rendered in a table.

---

## 10. Troubleshooting Common Issues

| Issue / Error | Cause | Resolution |
| :--- | :--- | :--- |
| **`ng: command not found`** | Angular CLI is not installed globally. | Use `npm start` or `npx ng serve` instead of global `ng serve`. |
| **Port 4200 is in use** | Another development server is running. | Run `npx ng serve --port 4300` to serve on an alternate port. |
| **Data fails to load (`HTTP 404`)** | Dev server started from incorrect root. | Ensure you are inside the `public-utility-status` directory containing `angular.json` and `public/`. |
| **LocalStorage complaints reset** | Incognito mode or cache cleared. | Click **"Reload Defaults"** on the Track Status page to repopulate demonstration records. |

---

## 11. Project Limitations

1. **Simulated Municipal Telemetry:** Utility uptimes and outage statuses represent demonstration data for the Greater Hyderabad area rather than live IoT SCADA feeds.
2. **Client-Side Persistence:** Registered grievances are stored locally in the user's browser `localStorage` rather than being written to a persistent cloud database (e.g., PostgreSQL or MongoDB).
3. **Simulated POST Endpoint:** The Fetch API POST demonstration uses an asynchronous client-side REST simulation to satisfy syllabus criteria without introducing backend dependencies (Node.js/Express/PHP).

---

## 12. Future Scope

- **Official Government API Integration:** Direct linkage with Telangana State Open Data APIs, TSSPDCL smart meter feeds, and HMWSSB reservoir sensors.
- **Geographic Information System (GIS) Outage Maps:** Interactive Mapbox or Leaflet heatmaps visualizing affected power feeders and traffic disruptions.
- **Automated SMS & WhatsApp Webhooks:** Instant push notifications dispatched to citizens upon ticket stage transitions.
- **Field Squad Companion App:** Mobile portal for municipal field technicians to upload photographic evidence upon resolving grievances.

---

## 13. Student Project Metadata

- **Student Name:** Essentials of Web Programming Lab Student
- **Degree:** Bachelor of Technology (B.Tech)
- **Specialization:** Computer Science & Engineering
- **Subject Code:** Essentials of Web Programming (EWP) Lab
- **Submission Year:** 2026
