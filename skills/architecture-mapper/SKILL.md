---
name: architecture-mapper
description: Generate a beautiful interactive HTML architecture overview of any codebase using jcodemunch structural analysis — no external LLM API needed. Use this whenever the user wants to understand, visualize, document, or onboard onto an unfamiliar repo. Triggers include "map this repo", "show me the architecture", "what does this codebase do", "generate architecture diagram", "make me an overview", "visualize this project", "give me a system overview", "document this codebase", "architecture html", "interactive diagram", or whenever the user points at a local repo path and asks Claude to explain or document its structure. Also use proactively when starting work on a new/unfamiliar repo so you have a structural foundation before making changes. This is a free alternative to CodeBoarding-style tools — no API keys, no LLM cost beyond the current session.
---

# Architecture Mapper

Generate a polished interactive HTML architecture page for any local codebase. Uses **jcodemunch** for structural analysis (free, fast, no LLM cost) and your reasoning to synthesize subsystems.

## Why this skill exists

CodeBoarding and similar tools cost LLM API credits per run, require setup of language server binaries, and produce a static one-shot output. We can produce equivalent (or better) architecture overviews using `jcodemunch` MCP tools that ship with Claude Code — for free, in seconds, with interactive HTML output the user can navigate in their browser.

The user has already chosen this workflow over CodeBoarding. Don't second-guess that. Just produce the deliverable.

## When to use this

Use proactively whenever:
- The user gives a local repo path and asks anything like "what does this do", "explain this", "map this", "document this", "show me the architecture"
- The user wants to onboard a new developer or write architecture docs
- The user is starting work on an unfamiliar repo and would benefit from a structural foundation
- The user explicitly mentions CodeBoarding, interactive diagrams, or architecture visualization

Do NOT use this skill for:
- Single-file or single-symbol questions ("what does this function do") — use `mcp__jcodemunch__get_symbol_source` directly
- Live code search ("where is X defined") — use `search_symbols` directly
- Tasks where the user only wants raw analysis data, not a visual page

## Workflow

### Step 1 — Confirm the target repo

If the user gave you a path, use it. If not, ask: "Which repo should I map? (absolute path)". If they're vague ("this repo"), use the current working directory.

### Step 2 — Index the repo

```
mcp__jcodemunch__index_folder(path="<repo>", use_ai_summaries=false, incremental=true)
```

`use_ai_summaries=false` is important — it keeps the indexing free and fast. The structural data alone is enough.

Capture the returned `repo` identifier (looks like `local/<name>-<hash>`) — you'll need it for every subsequent jcodemunch call.

### Step 3 — Gather structural data in parallel

Send these jcodemunch calls in a single message to run concurrently:

- `get_repo_outline(repo)` — file counts, language breakdown, top-level stats
- `get_file_tree(repo, path_prefix=<each major directory>, include_summaries=true, max_files=100)` — one call per top-level directory (e.g., `apps/web`, `apps/datacenter`, `src/`, `packages/`). Look at the outline first to know what directories exist.
- `get_dependency_cycles(repo)` — flag if there are circular imports
- `get_hotspots(repo, top_n=10)` — high-complexity-high-churn files worth highlighting

Don't request all 500+ files at once — use `path_prefix` to scope each call to a single subsystem. You typically need 3-8 directory fetches to cover a repo.

### Step 4 — Identify subsystems (this is the architecturally important step)

This part adapts CodeBoarding's actual production prompts for cluster grouping. Read this carefully — shortcuts here produce generic, useless output.

**You are a software architecture expert analyzing this repo with comprehensive diagram generation optimization.**

Before grouping, work these out for yourself. Do not write them in the reply:
- Project type (monorepo? single SPA? backend service? CLI tool? library?)
- Domain (e-commerce? developer tools? data pipeline? jewelry design platform?)
- Technology stack (Next.js + MongoDB? FastAPI + Postgres? Rust + Redis?)
- Component patterns that recur (e.g. `*.actions.ts` server actions, `*Panel.jsx` editor panels, `models/*` Mongoose schemas, `pages/*` routes)

This context guides every grouping decision that follows.

**Group related files into meaningful components.** Use directory structure + file summaries + naming patterns + functional similarity as evidence. Aim for **5-12 components per app** — over-fragment and the diagram is noise; under-fragment and "frontend" hides everything important.

For each component, capture:

- **name**: Short, descriptive name. Good: "Authentication", "Data Pipeline", "Request Handling", "3D Editor", "PDF Generation". Bad: "Module A", "Helpers", "Frontend".
- **path**: Primary directory (e.g., `components/ArtistTool/`, `lib/ai/`)
- **description** — comprehensive, include:
  - What this component does
  - Its main flow / purpose in the overall system
  - **WHY these specific files are grouped together** — explicit rationale, not just "they're in the same folder". E.g., "All `*.actions.ts` files implementing server-side mutations exposed to the React layer via Next.js server actions."
  - **How it interacts with other components** — which components it calls, receives data from, or depends on. Concrete: "Calls `Server Actions` to persist changes; subscribes to `Redis PubSub` for live updates from other clients."
  - **Most important files/symbols** — list 5-10 with exact names as they appear in the code
- **color + icon**: For visual variety. Use the palette + emoji guide below.

Validation criteria before moving on:
- Every component name reads clearly to someone who has never seen this repo
- Every file reference is real (you saw it in `get_file_tree` output)
- Every relationship arrow has a verb (calls, reads from, publishes to, validates)
- No component is so big it could itself be broken into 3+ sub-components
- No component is so small it's really just a single file in disguise

### Step 5 — Render the HTML

Use the template at `assets/template.html` as the base. Replace the placeholder sections with the actual analysis. The template uses:
- Dark theme with subtle gradients
- Top navigation to switch between sections
- Cards organized in a responsive grid
- Mermaid-free pure HTML/CSS (no external dependencies)
- Inter + JetBrains Mono fonts via Google Fonts

Write the output to `<repo>/architecture.html`. This is the user's deliverable — open it in their browser when done with `open <repo>/architecture.html`.

### Step 6 — Hand off

Tell the user the file location and key insights you found (1-3 sentences max — the HTML page does the explaining). If you found dependency cycles, hotspots, or anything alarming, mention it.

### Step 4.5 — Final architecture synthesis (CodeBoarding's final-analysis prompt, adapted)

Before rendering, do this synthesis pass. Think of it as the "step back and look at the whole picture" step.

<instructions>
1. Analyze the structural data you gathered — identify patterns and structures suitable for flow graph / hierarchy representation.
2. If important info is missing (e.g., you don't understand what a module does), use jcodemunch's `get_symbol_source` or `get_file_outline` to read the actual implementation — don't guess.
3. Focus on architectural patterns appropriate for the **project type you identified** (e.g., Next.js monorepo patterns are different from CLI tool patterns).
4. Each component should have distinct visual boundaries — components that overlap heavily are a sign you need to merge or re-split.
5. Make analysis suitable for **both** documentation AND visual rendering. Someone reading the descriptions alone should understand the system; someone looking at the diagram alone should see the structure.
</instructions>

The goal: a new developer should be able to read the page once and answer "what are the major parts of this system, what does each one do, and how do they talk to each other?"

## Section design

Keep these sections in the HTML, adapting to what the repo actually has:

1. **Overview** — Top-level node graph: apps + shared packages + external services. Counts and icons. This is the landing page.
2. **One section per major app/subsystem** — Cards with subsystem details (icon, name, path, description, key file pills). Show pages/routes if it's a frontend app.
3. **Data Flow** — How data moves: UI → server actions → DB → workers → external services. Use vertical flow nodes with arrows.
4. **AI/RAG section** — Only if the repo has an AI subsystem. List tools, RAG pipeline steps.
5. **Tech Stack** — Tagged pills grouped by Frontend / Backend / Data / Infra / AI. Pulled from package.json detection or directory naming.
6. **Stats** — Total files, symbols, language breakdown, hotspots, cycles found.

If a section doesn't apply (e.g., no AI in the repo), skip it. Don't pad sections with filler.

## Visual style guide

Use this color palette consistently:

- `--accent: #6c5ce7` (purple — primary, main app)
- `--green: #00b894` (data/management apps)
- `--blue: #0984e3` (UI components, frontend)
- `--orange: #e17055` (workers, backend services)
- `--pink: #fd79a8` (external services, third-party)
- `--cyan: #00cec9` (shared packages, types)
- `--yellow: #ffeaa7` (utilities, helpers)

Assign one main color per subsystem. Use emoji icons that match the function: 💎 jewelry, 📊 data, ⚡ workers, 🔐 auth, 🤖 AI, 🎨 editor, 📄 PDF, 💬 comments, 🗄️ database, ☁️ cloud, 📦 package.

## When the user wants a graph (not cards)

If the user explicitly asks for a **draggable node graph with arrows** (CodeBoarding-style DAG), the card template won't satisfy them. Tell them:

> "A proper draggable graph requires a JS library like vis.js, cytoscape.js, or D3 force-directed. That's a bigger build (~30-60 min) — I can do it but the card-based version is faster and usually more readable. Which do you prefer?"

Only build the graph version if they explicitly want it. The default deliverable is the card-based template.

## Quality bar (what good output looks like vs. bad)

**Bad component description** (what an unprompted LLM produces):
> "ArtistTool: A directory containing 40+ files related to the 3D editor."

**Good component description** (what this skill should produce):
> "**ArtistTool (3D Editor):** The main 3D editing environment users interact with to design jewelry. Wraps a React Three Fiber `<Canvas>` with split viewports, post-processing effects, and custom diamond shaders. Receives model uploads via `UploadedModel`, manages selection state through `SelectionOutline`, exposes 40+ panel controls (`MaterialPanel`, `LightPanel`, `EnvironmentPanel`, etc.). Calls `Server Actions` to persist editor state and reads from `Editor State` types in `lib/states/`. Why grouped: every file here is an R3F component or hook coupled to the live editor canvas — they share state, all render inside the same `<Canvas>`, and none make sense outside that context."

The second one tells you what it does, why these files belong together, who it talks to, and what's inside. That's the bar.

## What NOT to do

- Don't write a generic dashboard for a generic codebase. Every subsystem name and description should be specific to what this repo actually does.
- Don't ask the user a bunch of clarifying questions before starting. The structural data is enough — get going.
- Don't generate Mermaid diagrams in chat — write the HTML file. The user already has the deliverable in their browser; chat output is overhead.
- Don't dump raw tool output into chat. The HTML is the artifact. Chat should just have the path + 1-3 sentences of standout insights.
- Don't use `ai_summaries=true` when indexing — it triggers paid LLM calls and isn't needed.

## Template

The HTML template lives at `assets/template.html` (in this skill directory). Read it once at the start of work, then fill in the sections with actual repo data. The template has clearly-marked `<!-- REPLACE: ... -->` blocks showing where to insert content.
