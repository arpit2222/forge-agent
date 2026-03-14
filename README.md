# ForgeAgent

ForgeAgent is an autonomous AI developer agent built for the Seedstr AI Agent Hackathon. It runs entirely inside a Next.js app, receives Seedstr jobs, interprets prompts, optionally asks for clarification, generates a full SaaS application, builds and packages it, then submits the artifact automatically.

## Highlights

- Live Agent Pipeline Visualization
- Generated App Preview with file tree and snippets
- Clarification Engine for vague prompts
- Reliable template-based generation with OpenRouter fallback
- No separate backend server required

## Architecture Diagram

```
Seedstr API
   ↓
Job Poller
   ↓
Prompt Interpreter
   ↓
Clarification Engine
   ↓
Planning Engine
   ↓
AI Code Generator
   ↓
Project Builder
   ↓
Zip Packager
   ↓
Submission Engine
```

## Software Architecture Diagram

```
            Seedstr Platform
                   │
                   ▼
             Job Poller
                   │
                   ▼
          Prompt Interpreter
                   │
                   ▼
          Clarification Engine
                   │
                   ▼
             Planning Engine
                   │
                   ▼
          AI Code Generator
                   │
                   ▼
            Project Builder
                   │
                   ▼
             Zip Packager
                   │
                   ▼
             Job Submission
                   │
                   ▼
            Dashboard UI
```

## Tech Stack

- Next.js + TypeScript
- Tailwind CSS + shadcn UI-inspired components
- Framer Motion for live visuals
- OpenRouter API for AI code generation
- archiver for ZIP packaging

## Setup

```
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Environment Variables

Copy `.env.example` to `.env` and fill the values.

```
SEEDSTR_API_KEY=
SEEDSTR_AGENT_ID=
OPENROUTER_API_KEY=
AGENT_NAME=ForgeAgent
POLL_INTERVAL=5000
```

Optional:

- `SEEDSTR_BASE_URL` for custom Seedstr API endpoints.
- `OPENROUTER_MODEL` to change the model (default `deepseek/deepseek-chat`).

## Running the Agent

1. Start the agent loop from the sidebar in the Dashboard.
2. The poller checks Seedstr every few seconds.
3. The pipeline updates live as jobs move through each stage.

## Demo Mode

Run a demo job locally:

```
npm run demo
```

Or trigger it from the Dashboard using **Run Demo Job**.

## Dashboard Usage

- **Dashboard:** agent status, job counts, success rate, and recent activity.
- **Pipeline:** live visualization of all agent stages.
- **Logs:** structured event stream.
- **Generated Projects:** file tree and preview snippets for output artifacts.

## Reliability and Error Handling

- Graceful fallback to a strict template if OpenRouter is unavailable.
- Structured logs for polling errors, generation failures, and submissions.
- Guarded status transitions for each pipeline stage.

## Project Structure

```
/app
/agent
/ai
/builder
/clarification
/seedstr
/lib
/generated
/logs
/pipeline
/projects
```

## Notes

The generation template enforces the required Next.js + Tailwind + Prisma + SQLite stack for consistent results. Seedstr integration methods are implemented with `registerAgent`, `pollJobs`, and `submitJob` in `/seedstr/client.ts`.
# forge-agent
