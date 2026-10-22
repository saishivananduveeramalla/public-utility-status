# Essentials of Web Programming (EWP) Lab - External Viva Questions & Answers

This document prepares you for questions commonly asked by external examiners during the lab examination for the **Public Utility Status** project.

---

## 1. Core Web Concepts: XML & DTD

### Q1. What is the fundamental difference between HTML and XML?
- **HTML (Hypertext Markup Language):** Designed to **display data** and focuses on how content looks visually. Tags are predefined (e.g., `<h1>`, `<div>`, `<p>`).
- **XML (Extensible Markup Language):** Designed to **store and transport data** in a structured, hierarchical format. Tags are custom-defined by the developer (e.g., `<utility>`, `<category>`, `<area>`). XML is self-descriptive and case-sensitive.

### Q2. What is a DTD (Document Type Definition), and why is it used?
A **DTD** defines the legal building blocks and grammar of an XML document. It specifies:
- Which elements can appear in the XML.
- The order and hierarchy of elements.
- Whether elements are optional (`?`), occur once or more (`+`), or zero or more (`*`).
- In this project, `utilities.dtd` defines that `<utilities>` must contain one or more `<utility>` elements, and each utility must contain `<id>`, `<name>`, `<category>`, `<area>`, `<status>`, `<description>`, `<lastUpdated>`, `<expectedRestoration>`, and `<helpline>` as `#PCDATA` (Parsed Character Data).

### Q3. What is the difference between "Well-Formed XML" and "Valid XML"?
- **Well-Formed XML:** Adheres strictly to XML syntax rules (e.g., single root element, all tags properly closed, case-matching tags, quoted attribute values).
- **Valid XML:** In addition to being well-formed, it strictly conforms to an associated schema definition such as a **DTD** (`utilities.dtd`) or XML Schema (XSD).

---

## 2. Asynchronous APIs: Fetch API & DOMParser

### Q4. How does the Fetch API differ from traditional XMLHttpRequest (AJAX)?
- **Promise-Based:** `fetch()` uses modern ES6 Promises with `async/await`, avoiding callback hell (`onreadystatechange`).
- **Cleaner Syntax:** Simplifies parsing JSON (`response.json()`) and text/XML (`response.text()`).
- **Streaming & Request Objects:** Native support for the `Request`, `Response`, and `Headers` interfaces.
- In our project, `UtilityService` uses:
  ```typescript
  const response = await fetch('/data/utilities.json');
  const data: Utility[] = await response.json();
  ```

### Q5. How did you load and parse XML in JavaScript/Angular?
We used the native browser **`DOMParser`** API inside `UtilityService`:
```typescript
const response = await fetch('/data/utilities.xml');
const rawXml = await response.text();

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(rawXml, 'text/xml');
const utilityNodes = xmlDoc.getElementsByTagName('utility');
```
We then traversed the DOM tree using `getElementsByTagName()` to extract text values into strongly typed TypeScript objects.

### Q6. How did you demonstrate the Fetch API POST method without an external backend?
In `ComplaintRegistrationComponent` and `ComplaintService`, we created a dedicated demonstration method `simulateFetchPost()` that:
1. Gathers form inputs.
2. Serializes data into a JSON string using `JSON.stringify()`.
3. Sets HTTP headers: `headers: { 'Content-Type': 'application/json' }`.
4. Simulates an asynchronous REST endpoint returning an `HTTP 201 Created` status code, inspecting the request body and echoing a server response payload.

---

## 3. Data Formats: JSON vs. XML

### Q7. Why is JSON preferred over XML in modern web applications?
- **Lightweight & Faster:** JSON has less syntax overhead compared to opening and closing XML tags.
- **Native JavaScript Mapping:** JSON parses directly into native JavaScript objects (`JSON.parse()`), whereas XML requires traversing a DOM tree.
- **Data Types:** JSON naturally supports arrays, booleans, numbers, and strings, whereas all XML text is initially character data (`#PCDATA`).

---

## 4. TypeScript & Angular Concepts

### Q8. What is TypeScript, and why is it used with Angular?
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Benefits:
- **Compile-Time Type Safety:** Prevents runtime errors like `undefined is not a function`.
- **Interfaces & Strict Models:** We defined [`Utility`](file:///C:/Users/Dell/.gemini/antigravity/scratch/public-utility-status/src/app/models/utility.model.ts), [`Complaint`](file:///C:/Users/Dell/.gemini/antigravity/scratch/public-utility-status/src/app/models/complaint.model.ts), and [`Announcement`](file:///C:/Users/Dell/.gemini/antigravity/scratch/public-utility-status/src/app/models/announcement.model.ts) so every property is checked at build time.
- **Modern ECMAScript Features:** Arrow functions, optional chaining (`?.`), and async/await.

### Q9. What are Angular Standalone Components?
In modern Angular (v17+), components are **standalone by default** without needing `@NgModule`. Dependencies (like `RouterOutlet`, `ReactiveFormsModule`, and child components) are imported directly into the `@Component({ imports: [...] })` decorator, making the application lighter and faster to bundle.

### Q10. What are Angular Signals, and how did you use them?
Signals provide fine-grained reactivity without relying on heavy change detection cycles:
- **`signal<T>(initialValue)`:** A reactive value that notifies consumers when updated.
- **`computed<T>(() => ...)`:** A derived signal that automatically recomputes when its dependencies change.
- In our project, `UtilityService.stats` is a computed signal:
  ```typescript
  readonly stats = computed<DashboardStats>(() => {
    const list = this.utilitiesSignal();
    return {
      total: list.length,
      operational: list.filter(u => u.status === 'Operational').length,
      maintenance: list.filter(u => u.status === 'Maintenance').length,
      disrupted: list.filter(u => u.status === 'Service Disruption').length
    };
  });
  ```
  Whenever utility data updates, the dashboard summary cards update automatically!

### Q11. Explain Data Binding in Angular.
Our project demonstrates all four core data binding types:
1. **Interpolation `{{ expression }}`:** Displays values on screen (e.g., `{{ stats().total }}`).
2. **Property Binding `[property]="value"`:** Binds component state to DOM properties (e.g., `[class]="getStatusClass(item.status)"`, `[disabled]="complaintForm.invalid"`).
3. **Event Binding `(event)="handler()"`:** Responds to user actions (e.g., `(click)="openDetails(item)"`, `(ngSubmit)="onSubmit()"`).
4. **Two-Way Binding `[(ngModel)]="property"`:** Synchronizes form inputs and state in real-time (used in the Search/Filter toolbar).

### Q12. How does Form Validation work in the Complaint Registration page?
We used **Angular Reactive Forms** (`FormBuilder` and `FormGroup`) with custom validators:
- **Mobile Number:** Validated using regular expressions to enforce exactly 10 digits:
  ```typescript
  mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  ```
- **Email:** Validated using RFC 5322 compliant email validator:
  ```typescript
  email: ['', [Validators.required, Validators.email]]
  ```
- **Description:** Enforces a minimum length of 15 characters to ensure meaningful grievance reporting.
- The submit button remains disabled until all validation constraints are satisfied.

### Q13. How are complaints persisted in this application?
We use the browser's native **`localStorage`** API. When a citizen submits a complaint:
1. A unique ID (`CMP-HYD-2026-XXXX`) is assigned.
2. The record is serialized with `JSON.stringify()` and stored in `localStorage.setItem('ewp_public_utility_complaints', ...)`.
3. When the user reloads the page or navigates to **Track Status**, the records are retrieved via `localStorage.getItem()`, ensuring data persistence across sessions.

---

## 5. Summary Presentation Checklist for the Examiner

When demonstrating to your examiner, present the project in this sequence:
1. **Dashboard:** Show dynamic statistics and explain how Angular computed signals calculate them from JSON.
2. **Directory:** Perform a live search, change filters, and switch to Table View.
3. **Complaint Form:** Intentionally trigger validation errors (e.g. 5-digit phone number), then submit a valid form to get a ticket ID.
4. **POST Demo:** Click the green "Submit via Fetch API POST" button to show the serialized JSON payload and HTTP 201 response.
5. **Track Status:** Paste the generated ticket ID to view the 3-step progress timeline.
6. **XML & DTD Showcase:** Go to the About page and click **"Execute DOMParser"** to prove that `utilities.xml` is parsed natively in the browser.
