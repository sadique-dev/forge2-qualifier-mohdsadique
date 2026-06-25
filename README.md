# Forge 2 Qualifier Kanban Board

A tiny Trello-style Kanban board built during the Forge 2 online qualifier using a cooperative two-agent system: Hermes as the brain and OpenClaw as the hands, wired through Slack.

### 🌐 Live Deployment
*   **Frontend (Vercel):** [https://forge2-qualifier-mohdsadique.vercel.app](https://forge2-qualifier-mohdsadique.vercel.app)
*   **Backend API (Render/Railway):** [https://forge2-qualifier-mohdsadique.onrender.com](https://forge2-qualifier-mohdsadique.onrender.com)

---


## Features

- Boards, lists, and cards with create flows for each level.
- Drag-and-drop card movement between lists.
- Card detail editing for title, description, and due date.
- Colored tags that can be attached to and detached from cards.
- Member assignment for cards.
- Overdue visual flags for cards past their due date.
- **Interactive Board Settings (New):** Create and manage custom members (name and email) and colored tags directly from the UI.
- **Automated Card Activity Comments & Logs (Bonus):** Unified comment thread and system activity logging (e.g., moves, assignments) for each card, with local email logging.

## Agent System & Model Routing

- Orchestrator: Hermes Agent powered by Google Gemini 2.5 Flash through the direct Google AI Studio API for planning, memory retention, and workflow orchestration.
- Coder: OpenClaw powered by Google Gemini 2.5 Flash (via OpenAI compatibility) to handle large tool schema loads and bypass Groq free-tier TPM rate limits.
- Communication: Slack socket mode channels for planning, coding tasks, and audit trails.

## Project Structure

```text
/backend       Laravel API with SQLite
/frontend      React and Vite frontend
/skills        Reusable agent skills
/slack-export  Evidence logs of Slack wiring and tests
/local-tools   Self-contained PHP 8.3 & Composer binary workspace environment (portable)
```

## Running the App Locally

### Prerequisites

- Node.js 22.19+ or newer
- PHP 8.2+ and Composer installed globally **OR** you can run the app using the portable local binaries included in `/local-tools` (zero-install setup).

### Start the Laravel Backend

#### Option A: Using Global PHP & Composer
1. Navigate to `backend`.
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Generate the application key, migrate, and seed the database:
   ```bash
   php artisan key:generate
   php artisan migrate:fresh --seed
   ```
5. Start the server:
   ```bash
   php artisan serve --port=8000
   ```

#### Option B: Using Included Portable Local Binaries (Windows)
1. Navigate to `backend`.
2. Install dependencies:
   ```bash
   ..\local-tools\php\composer.bat install
   ```
3. Copy the environment file:
   ```bash
   copy .env.example .env
   ```
4. Generate the application key, migrate, and seed the database:
   ```bash
   ..\local-tools\php\php.exe artisan key:generate
   ..\local-tools\php\php.exe artisan migrate:fresh --seed
   ```
5. Start the server:
   ```bash
   ..\local-tools\php\php.exe artisan serve --port=8000
   ```

The API will be available at `http://localhost:8000`.

### Start the React Frontend

1. Navigate to `frontend`.
2. Install dependencies (on Windows, use cmd if script execution is restricted):
   ```cmd
   cmd /c npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

The UI will be available at `http://localhost:5173`.
