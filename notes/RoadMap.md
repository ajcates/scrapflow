# RoadMap: General Mobile Web Scraper

## Project Overview
A general-purpose mobile web scraper application. The user defines scraping rules interactively by selecting elements on a webpage loaded within a proxy frame. The backend then executes these rules using Playwright.

### Methodology: Agile & TDD
This project follows a strict **Test Driven Development (TDD)** cycle (Red-Green-Refactor) and Agile principles.
- **Testing Framework**: `node-tap` for unit and integration tests.
- **E2E/Browser Testing**: `playwright-termux` for testing scraping logic and rendering.
- **Process**: Write a failing test -> Implement minimal code to pass -> Refactor.

### Tech Stack
- **Frontend**: Vue.js (TypeScript)
- **Backend**: Express.js (TypeScript)
- **Scraping Engine**: Playwright (via `playwright-termux`)
- **Testing**: `node-tap` (Unit/Integration), `playwright-termux` (Browser Control)
- **Styling**: Material 3 Expressive (using Web Components or similar), Custom CSS (No Tailwind).
- **Architecture**: Monorepo (`client/`, `server/`).
- **Data Storage**: Flat JSON files.

---

## Phase 1: Project Initialization & Test Infrastructure
- [ ] **Monorepo Setup**
    - Initialize `package.json` workspaces (`client`, `server`).
    - Configure TypeScript (`tsconfig.json`) for strict typing.
- [ ] **Test Harness Setup**
    - Install and configure `node-tap` in both workspaces.
    - Set up `playwright-termux` for backend browser testing.
    - **TDD**: Write a simple "Hello World" test for both server and client to verify the harness.

## Phase 2: The Proxy "Driver" System (TDD)
- [ ] **Proxy Driver Interface**
    - **Red**: Write a test defining the expected API for a `ProxyDriver` (fetching, rewriting).
    - **Green**: Define the TypeScript interfaces.
- [ ] **Default Proxy Implementation**
    - **Red**: Write tests for the default proxy:
        - Should fetch a URL.
        - Should rewrite relative paths (CSS, JS, Images) to absolute/proxied paths.
        - Should emulate a Mobile User Agent.
    - **Green**: Implement the HTTP fetching and HTML parsing/rewriting logic.
    - **Refactor**: Ensure code is loosely coupled and highly cohesive.

## Phase 3: Frontend Core (The Builder) - Agile Iterations
- [ ] **App Shell & State**
    - **Red**: Write component tests for the Main Toolbar and Viewport layout.
    - **Green**: Implement Material 3 Expressive layout.
- [ ] **DOM Interaction Logic**
    - **Red**: Write unit tests for the element selection logic (given an HTML structure, selecting X should highlight Y).
    - **Green**: Implement the "Select Items" mode (highlighting `divs`, badging siblings).
- [ ] **"Foreach" Mode**
    - **Red**: Write tests for adding properties to the scraping state.
    - **Green**: Implement the secondary "Foreach" Toolbar (Add Property, Add Link, Add Image).
    - **Refactor**: extract complex logic into composed functions/composables.

## Phase 4: The Scraping Engine (Backend) - TDD with Playwright
- [ ] **Scraper Service Definition**
    - **Red**: Write a test using `playwright-termux` mock/stub to verify the `Scraper` class structure.
    - **Green**: Create the `Scraper` class and `scrape()` method signature.
- [ ] **Execution Logic**
    - **Red**: Create a test site (local HTML) and write a test that asserts the scraper extracts specific data from it using a JSON definition.
    - **Green**: Implement the `playwright-termux` logic:
        - Navigate (Mobile UA).
        - Select and Extract "Foreach" items.
        - Handle Pagination (click next, wait).
    - **Refactor**: Optimize for performance and reliability.
- [ ] **Recursive Scraping**
    - **Red**: Write a test for deep scraping (following links).
    - **Green**: Implement the recursive crawling logic.

## Phase 5: Data Persistence & Polish
- [ ] **Persistence Layer**
    - **Red**: Write tests for saving and retrieving JSON results and definitions.
    - **Green**: Implement flat file storage logic.
- [ ] **Results Viewer**
    - **Red**: Write tests for the filtering logic (contains/does not contain).
    - **Green**: Build the frontend Results Viewer.
- [ ] **Final Polish**
    - Run all `node-tap` tests.
    - Ensure full test coverage.
    - Verify comments and "what/why" documentation.
