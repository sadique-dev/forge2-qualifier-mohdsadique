# 🚀 NMG Forge 2 Qualifier: Agent-Orchestrated Premium Kanban Board

An advanced, project-management application built during the Forge 2 Online Qualifier. This workspace represents a highly optimized, production-ready system co-authored by **Mohd Sadique** and a cooperative, dual-agent AI team (Hermes as the planning orchestrator, OpenClaw as the coding runner) wired dynamically through Slack.

### 🌐 Live Production Deployments
*   **Frontend (Vercel):** [https://frontend-rosy-eight-61.vercel.app](https://frontend-rosy-eight-61.vercel.app)
*   **Backend API (Render Docker):** [https://forge2-qualifier-mohdsadique.onrender.com/api](https://forge2-qualifier-mohdsadique.onrender.com/api)

---

## 🛠️ Architecture & Tech Stack

### 1. The Frontend (Vite + React)
- **Modern SPA Architecture:** Fast, reactive component hierarchy built on top of React 18 and Vite.
- **Premium Design System:** Handcrafted CSS layout built with dynamic variables, Outfit typography (Google Fonts), glassmorphic elements, elegant transition micro-animations, and curated light-blue/indigo surface colorways.
- **Vertical Sidebar Dashboard:** Upgraded from horizontal tabs to an industry-standard sidebar layout (reminiscent of Linear and Jira) featuring live project metrics, sticky controls, and quick settings.
- **Trello-Style Inline Board Creation:** Fully responsive board canvas with a horizontal-scrolling list workflow and inline "Add List" panels to eliminate clutter and scrolling fatigue.

### 2. The Backend (Laravel API + SQLite)
- **Restful API Core:** Structured routing (`routes/api.php`) serving lightweight JSON payloads for boards, lists, cards, tags, and members.
- **SQLite Database:** Lightweight, zero-configuration local database storage.
- **Automated Card Activity Logs:** Custom database schema and hooks that auto-log card state updates (card creations, list transfers, assignee changes).
- **Mailable Alert System:** Triggers local mailable events logging assignees to the Laravel log driver.

### 3. Dual-Agent Infrastructure & Slack Socket Mode
This project was constructed in a real-time collaborative sandbox:
- **Hermes Orchestrator:** Handled top-level system planning, context retention, and multi-file code review powered by Google Gemini 2.5 Flash.
- **OpenClaw Runner:** Executed low-level coding tasks, automated local asset compilations, and ran verification test suites.
- **Slack Socket Mode Bridge:** The entire system was wired into a dedicated Slack team (`Forge2 Mohd Sadique`) with active channel feeds:
  - `#sprint-main` — General product planning and ticket assignment.
  - `#agent-coder` — Coder execution trails and syntax validation audits.
  - `#agent-log` — Production log output and socket stream telemetry.
  - *Full integration verification logs are archived in `/slack-export/roundtrip_test.json`.*

### 4. Dockerized High-Concurrency Deployment
- **Alpine PHP 8.2 Base:** Ultra-lightweight and secure containerized backend.
- **Concurrent Request Handling:** Enabled multi-threaded execution inside the container (`PHP_CLI_SERVER_WORKERS=4`) to handle parallel frontend fetches (boards, tags, and assignees loading concurrently on page load) without bottlenecking.
- **Automated Startup Script:** Docker entrypoint (`start.sh`) automatically provisions the SQLite schema, runs database migrations, and conditionally seeds initial demo boards upon startup.

---

## 💎 Premium Enhancements Installed

1. **Sidebar Board Settings:** Users can dynamically manage workspace members (name, email) and customize tag categories (color swatches, names) directly from a settings modal without touching the database.
2. **Unified Comments Feed:** Each Kanban card features a premium card modal combining custom assignees, due dates, system logs (e.g. *"Mohd Sadique moved card to Doing"*), and comment inputs.
3. **Smart Overdue Badges:** Cards automatically display a vibrant orange "Overdue" flag if their due date is past the current local timestamp.
4. **Ephemerality-Safe Database Seeding:** The startup system detects if data is missing (such as after a container spin-down or rebuild on Render's Free tier) and automatically triggers fresh seeders to ensure zero-downtime mock data availability.

---

## 📂 Project Structure

```text
├── backend/                  # Laravel API source, SQLite database config, and seeders
├── frontend/                 # Vite + React source, assets, styling, and api clients
├── slack-export/             # Verified Slack Socket Mode connection logs and verification JSONs
├── local-tools/              # Portable PHP 8.3 binary and Composer for zero-install Windows local setup
├── ARCHITECTURE.md           # High-level architecture specification
├── README.md                 # Project handbook (this file)
└── agent-log.md              # Historical agent execution logs and build history
```

---

## 🚀 Running the App Locally

### Prerequisites
- **Node.js** (v20+ recommended)
- **PHP 8.2+ & Composer** (Or you can use the portable binaries pre-bundled in `/local-tools` on Windows).

### 1. Start the Laravel Backend

#### Option A: Using Global PHP & Composer
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy environment file, generate app key, run database migrations and seed:
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan migrate:fresh --seed
   ```
4. Start the server:
   ```bash
   php artisan serve --port=8000
   ```

#### Option B: Using Windows Portable Binaries (Zero-Install)
1. Open PowerShell in the `backend` folder.
2. Run installation and database setups:
   ```powershell
   ..\local-tools\php\composer.bat install
   copy .env.example .env
   ..\local-tools\php\php.exe artisan key:generate
   ..\local-tools\php\php.exe artisan migrate:fresh --seed
   ```
3. Start the server:
   ```powershell
   ..\local-tools\php\php.exe artisan serve --port=8000
   ```

*The API will be live locally at `http://localhost:8000`.*

### 2. Start the React Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

*The application UI will be live locally at `http://localhost:5173`.*

---

## 🏆 Summary of Qualifications

This project showcases production-level full-stack skills:
- **Client-Side:** Responsive React architecture, CSS variables, state coordination, and API clients.
- **Server-Side:** Laravel API routing, ORM models, Eloquent relationships, mailables, and seeds.
- **DevOps & Containers:** Dockerfile optimization, multi-process Alpine configurations, and automated CI/CD deployments (Vercel CLI + Render Webhooks).
- **AI Systems Engineering:** Establishing, routing, and verification of automated multi-agent code compilation loops via Slack webhooks.
