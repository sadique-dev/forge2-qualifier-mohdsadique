# System Architecture — Forge 2 Two-Agent System

This document outlines the multi-agent orchestration architecture used to build the Kanban application.

## System Topology

```mermaid
graph TD
    User([Human Owner]) -->|Mentions in #sprint-main| Hermes[Hermes Agent: The Brain]
    Hermes -->|Orchestrates/Plans| Plan[Kanban Project Plan]
    Hermes -->|Delegates to #agent-coder| OpenClaw[OpenClaw Agent: The Hands]
    OpenClaw -->|Edits Files / Runs Shell| Workspace[Local Workspace: React + Laravel]
    OpenClaw -->|Reports complete| Slack[Slack Channels]
    Slack -->|Feedback Loop| User
```

## Agent Roles and Functions

### 1. Hermes (The Brain)
- **Role:** High-level planner and orchestrator.
- **Responsibilities:**
  - Decomposes user goals into steps.
  - Maintains persistent memory across sessions.
  - Deploys skills (like custom status reports).
  - Integrates with cron for automated monitoring/notifications.
- **Model:** `Google Gemini 2.5-flash` for high-concurrency planning and cheap token usage.

### 2. OpenClaw (The Hands)
- **Role:** Active coder and shell execution environment.
- **Responsibilities:**
  - Inspects workspace code, edits files, and creates routes/controllers.
  - Runs local compiler tests, migrations, and npm scripts.
  - Interfaces directly with the codebase via tool usage.
- **Model:** `Google Gemini 2.5-flash` (via OpenAI compatibility) for reliable tool utilization and schema conformance during file editing.

---

## Slack Channel Routing Scheme

Everything is wired to a private Slack workspace (`Forge2 Mohd Sadique`):

1. **`#sprint-main`** (C0BCNJ6464F)
   - **Purpose:** Humans talk to Hermes. Main plans, high-level decisions, and manual interventions occur here.
2. **`#agent-coder`** (C0BCXMZ2NF5)
   - **Purpose:** Hermes assigns detailed programming subtasks to OpenClaw. OpenClaw posts its diffs and terminal test outcomes here.
3. **`#agent-log`** (C0BD0LK2F6H)
   - **Purpose:** Unified gateway feed logging all raw agent activity and background event occurrences.

---

## Model Selection and Routing Rationale

| Layer | Provider | Model | Rationale |
| :--- | :--- | :--- | :--- |
| **Planning & Cron** | Google | `gemini-2.5-flash` | Direct Google AI Studio API for planning, memory, and automated workflows. |
| **Coding & Terminal** | Google (OpenAI compat) | `gemini-2.5-flash` | Selected as default model to handle large tool schema loads and bypass Groq's 12k TPM free-tier rate limits. |
