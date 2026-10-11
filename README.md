# claude-kit

My Claude Code setup: local mods, skills, and the plugins I run.

## Mods

Local plugins built with function hooks (panes, bands, guards). Load one with:

```bash
claude --plugin-dir mods/<name>
```

| Mod | What it does |
|---|---|
| `carousel-ship` | After a carousel render: Caption, Queue Threads and Log ledger buttons; blocks Threads posts with a part over 500 characters |
| `commit-guard` | Never commits docs/superpowers, never pushes unless you said push, asks before committing on main/staging/prod |
| `ctx-keeper` | Cache countdown, context, limits and cost band; past 350k it runs /re-fresh, copies it, compacts and pastes it back |
| `env-bootstrap` | Per-project Node version on PATH and env file auto-loaded for Bash, so Claude stops typing nvm use / source .env |
| `git-band` | Git state above the prompt: branch, upstream, ahead/behind, Claude vs your changes, PR and CI, worktree, stash; toasts where each commit landed |
| `hybrid-agents` | Subagents default to Sonnet; pasting a plan path adds the hybrid rule (inline small tasks, Sonnet subagents for big ones) |
| `rm-to-trash` | Rewrites rm into macOS trash so deletes are recoverable and stop hitting the rm deny rule |
| `tool-preload` | Keeps context-mode, jcodemunch, claude-mem, WebSearch, Task and Supabase tools loaded so Claude stops calling ToolSearch for them |
| `turn-coach` | One fork per turn: a verdict on work turns (solved, gaps, shortcuts) plus up to 3 next prompts, in one compact block above the prompt. Merges next-steps and next-steps-supervisor. |

## Skills

261 skills in `skills/`. Copy any folder into `~/.claude/skills/` to use it. Third-party skills are copied in too; their sources are listed below.

| Skill | Description |
|---|---|
| `accessibility-compliance` | Implement WCAG 2.2 compliant interfaces with mobile accessibility, inclusive design patterns, and assistive technology support. Use when aud |
| `alibabacloud-ack-cli` | > |
| `alibabacloud-cfw-internet-firewall-protect` | > |
| `alibabacloud-cfw-status-overview` | / |
| `alibabacloud-cli-guidance` | > |
| `alibabacloud-ddos-security-monitor` | / |
| `alibabacloud-domain-manage` | / |
| `alibabacloud-ecs-diagnose` | / |
| `alibabacloud-esa-pages-deploy` | Deploy HTML pages, static directories, or custom edge functions to Alibaba Cloud ESA edge nodes. Manage Edge KV for distributed key-value st |
| `alibabacloud-find-skills` | > |
| `alibabacloud-network-health-inspection` | > |
| `alibabacloud-network-reachability-analysis` | > |
| `alibabacloud-nginx-ingress-to-api-gateway` | / |
| `alibabacloud-oss-manage-cron-upload` | / |
| `alibabacloud-resourcecenter-search` | / |
| `alibabacloud-solution-deploy` | > |
| `alibabacloud-tair-ai-assistant` | / |
| `alibabacloud-tair-devtoolset` | / |
| `alibabacloud-terraform-code-generation` | / |
| `alibabacloud-waf-bot-management` | > |
| `alibabacloud-waf-security-monitor` | / |
| `api-design-principles` | Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designin |
| `apply-grant` | Prepare an Agentic Engineering Grant application by gathering project data, git history, and context files, then presenting all fields neede |
| `architecture-mapper` | Generate a beautiful interactive HTML architecture overview of any codebase using jcodemunch structural analysis , no external LLM API neede |
| `architecture-patterns` | Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design. Use when arch |
| `brand-design` | Generate, preview, and apply a brand color palette (plus typography, gradients, and tone/voice) to a frontend project. Use when a user says  |
| `bro` | Re-explain the previous assistant message in a much simpler way, for when the reply made you go 'bro what'. Use /bro to get a plain-languag |
| `build-data-pipeline` | Guide a developer through building a Solana data pipeline or indexer. Use when a user says "build an indexer", "data pipeline", "analytics", |
| `build-defi-protocol` | Guide a developer through building a DeFi protocol on Solana. Use when a user says "build a DEX", "AMM", "lending protocol", "vault", "yield |
| `build-mobile` | Guide a developer through building a Solana mobile app. Use when a user says "build a mobile app", "React Native Solana", "Solana mobile", " |
| `build-with-claude` | Guide a developer through building their Solana MVP step by step using Claude Code. Use when a user says "help me build this", "start the MV |
| `carousel-creator` | Turns any content idea or Virlo trend data into a complete Instagram carousel post with hooks, slide by slide copy, and posting strategy. Ju |
| `cinescroll` | Build premium scroll-driven landing pages where scroll position controls what happens on screen, frame-scrubbed hero sequences, pinned narr |
| `code-review` | Review code for quality, security, and best practices following team standards. Use when reviewing pull requests, examining code changes, or |
| `coding-agent` | Invoke when ready to CODE a feature. Manages the entire feature development lifecycle through 8-step session cycles - reads project state, s |
| `colosseum-copilot` | Search and analyze 5,400+ Solana hackathon projects using Colosseum Copilot. Find similar projects, discover winner patterns, identify gaps, |
| `commons-governance` | Govern shared resources well using Elinor Ostrom's design principles for the commons , applied to AIOS shared substrate: multi-operator vaul |
| `communication-style` | Follow expert-level communication preferences: be casual, terse, concise, anticipate needs, provide actual code/explanations not theory, giv |
| `competitive-landscape` | Map the competitive landscape for a crypto product idea. Use when a user says "who are my competitors", "map the competitive landscape", "wh |
| `comprehension-debt` | Keep the operator's understanding from falling behind what their agents ship , the gap between what the vault and repos contain and what the |
| `context7-documentation` | Use Context7 MCP server to reference up-to-date documentation for libraries and frameworks. Use when working with libraries mentioned by the |
| `cqrs-implementation` | Implement Command Query Responsibility Segregation for scalable architectures. Use when separating read and write models, optimizing query p |
| `create-pitch-deck` | Create a structured pitch deck for a crypto project. Use when a user says "create a pitch deck", "help me pitch", "I need slides", "prepare  |
| `create-prd` | Create a Product Requirements Document from conversation context. Use when planning new products, features, or when documenting requirements |
| `cso` | / |
| `data` |  |
| `data-presentation` | Turn data into compelling narratives + effective dashboards. Use when presenting analytics to stakeholders, designing KPI dashboards, struct |
| `database-migration` | Execute database migrations across ORMs and platforms with zero-downtime strategies, data transformation, and rollback procedures. Use when  |
| `debug-program` | Help a developer debug a failing Solana program or transaction. Use when a user says "debug my program", "program error", "transaction faile |
| `deep-research` | Deep, multi-source research for acting under uncertainty , answers WHAT to aim for, WHY it matters, and HOW to pursue it, when the answer re |
| `defillama-research` | Research DeFi protocols and market opportunities using DefiLlama data. Use when a user says "show me TVL data", "which protocols are growing |
| `deploy-to-mainnet` | Guide a Solana project from devnet to mainnet production deployment. Use when a user says "deploy to mainnet", "go to production", "deployme |
| `ego-browser` | When you need a browser, read this Skill by default. Use it to open and operate websites, fill forms, click buttons, take screenshots, extra |
| `elevenlabs-music` | Generate music, sound effects, and voice clips using the ElevenLabs API, then preview them in a web-based player. Use when asked to generate |
| `error-handling-patterns` | Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build res |
| `event-store-design` | Design and implement event stores for event-sourced systems. Use when building event sourcing infrastructure, choosing event store technolog |
| `feature-verify` | Test features after coding them. Invoke after implementing a feature to run tests and mark pass/fail status in features.json. Three modes -  |
| `find-next-crypto-idea` | Interview users sharply to discover, rank, or validate what they should build in crypto. Use when a user asks what to build in crypto, wants |
| `finding-your-why` | Derive the operator's durable purpose from their observed context , the compass under the goals , and connect the work they ship to the valu |
| `fluxwright-design` | Design system skill for fluxwright. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typogr |
| `frontend-design-guidelines` | Apply high-quality web interface design rules when building, reviewing, or styling frontend code. Use when the user says "build a frontend", |
| `higgsfield-game-generation` | / |
| `higgsfield-generate` | / |
| `higgsfield-marketplace-cards` | / |
| `higgsfield-product-photoshoot` | / |
| `higgsfield-soul-id` | / |
| `higgsfield-video-explainer` | / |
| `higgsfield-websites` | / |
| `impeccable-gate` | Picks and runs the right impeccable commands, in the right order, for a UI task: a small UI fix, a new screen, or a check-and-fix loop that  |
| `infographic-builder` | Turn a structured document (an /ingest reflection, role report, weekly-learnings digest, deck outline, research note) into a beautiful, self |
| `json-canvas` | Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual |
| `karpathy-coding` | Behavioral guidelines to reduce common LLM coding mistakes , think before coding, simplicity first, surgical changes, and goal-driven execut |
| `launch-token` | Guide a developer through launching a token on Solana. Use when a user says "launch a token", "create a token", "pump.fun", "bonding curve", |
| `learn` | / |
| `leverage-points` | Decide WHERE to intervene in a system for maximum effect using Donella Meadows' leverage-points lens , push interventions toward high-levera |
| `marketing-video` | Create marketing videos for Solana projects using Remotion (code-driven) and Renoise (AI-generated). Use when a user says "marketing video", |
| `mcp-builder` | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-design |
| `memory-management` | Use mem0 memory tool to store and retrieve context across sessions. Use when storing project decisions, user preferences, technical patterns |
| `merge-conflict-resolver` | [TODO: Complete and informative explanation of what the skill does and when to use it. Include WHEN to use this skill - specific scenarios,  |
| `microservices-patterns` | Design microservices architectures with service boundaries, event-driven communication, and resilience patterns. Use when building distribut |
| `monorepo-management` | Master monorepo management with Turborepo, Nx, and pnpm workspaces to build efficient, scalable multi-package repositories with optimized bu |
| `navigate-skills` | Meta skill, browse all installed solana-new skills, repos, and MCPs to find the right tool for any task |
| `neuroarxiv` | Grounds a coding agent's architecture decisions in real arXiv prior art before it builds something new. Reads arXiv category-wise via real H |
| `obsidian-bases` | Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating datab |
| `obsidian-cli` | Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. Also supports p |
| `obsidian-markdown` | Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when workin |
| `orchestration-ladder` | Choose the right orchestration primitive for delegated work , a single agent, parallel agents, or a dynamic workflow , using the agent → par |
| `pci-compliance` | Implement PCI DSS compliance requirements for secure handling of payment card data and payment systems. Use when securing payment processing |
| `plan-feature` | Create comprehensive feature plans with deep codebase analysis and research. Use when planning new features, breaking down complex tasks, or |
| `postgresql` | Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features |
| `product-review` | Product quality review, UX flows, onboarding, feature completeness, and user value. Use when a user says "product review", "review my produ |
| `project-initializer` | Set up the two-agent pattern for a new project. Run once at start with /project-initializer "project description". Creates features.json (yo |
| `project-status` | Get a quick project snapshot. Invoke at session start or anytime to see current progress - how many features are done/tested/blocked, recent |
| `projection-patterns` | Build read models and projections from event streams. Use when implementing CQRS read sides, building materialized views, or optimizing quer |
| `prompt-engineering-patterns` | Master advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability in production. Use when optimizi |
| `python-best-practices` | Python best practices across design patterns, error handling, project structure, and testing. Use when writing Python code, structuring new  |
| `re-fresh` | / |
| `react-components` | Converts Stitch designs into modular Vite and React components using system-level networking and AST-based validation. |
| `react-nextjs-patterns` | Modern React + Next.js patterns. Use when building Next.js apps (App Router, Server Components, streaming, parallel routes), implementing Re |
| `reddit-post-draft` | > |
| `refactor` | Refactor code with specific focus (performance, readability, maintainability). Use when improving code quality, optimizing code structure, o |
| `research-gate` | Routes "how should I build this" research to the right depth so the cheap answer runs first and the expensive one only fires when it earns i |
| `reverse-engineer-anything` | Reverse engineer native, managed, Electron/JavaScript, packaged, firmware, and browser targets with REA. Use shipped-artifact or requested r |
| `review-and-iterate` | Review Solana project code for quality, security, and production readiness. Use when a user says "review my code", "is this production ready |
| `right-context` | Decide how much operator context to load at session start, and when to climb higher mid-task. Use when the Session Start Ritual's one questi |
| `roast-my-product` | Harsh, honest product critique, find every weakness before users do. Use when a user says "roast my product", "harsh feedback", "be brutal" |
| `run-sprint` | Runs a sprint of tickets while the user is away: grades each ticket for Sonnet or Opus, builds them with subagents (in parallel when they to |
| `scaffold-project` | Set up a complete Solana project workspace from a validated idea. Use when a user says "scaffold my project", "set up my workspace", "what s |
| `shipping-a-saas` | The build ORDER and the defaults that decide whether a product is debuggable six months in , what to build first (admin and seed data before |
| `short-form-script-writer` | Turns any content idea into scroll stopping hooks and a complete short form script ready to film for Instagram Reels or TikTok. No prompting |
| `skill-loader` | Discover and load symlinked skills from ~/.cursor/skills/ when needed. Use when a required skill wasn't auto-discovered by Cursor, or when c |
| `solana-beginner` | Teach Solana fundamentals to developers new to the ecosystem. Use when a user says "what is Solana", "why Solana", "new to Solana", "explain |
| `static-visual-creator` | Turns any script line or concept into a polished 4K PNG visual ready to drop straight into your video edit. No Photoshop or Canva needed. Ju |
| `stock-fundamental-analyzer` | Analyse a listed stock on fundamentals only, Indian (NSE/BSE) or US (NYSE/NASDAQ), with Sharia/halal compliance screening built into every |
| `storm-research` | Use when someone asks to run Storm Research, use the storm-research skill, run the STORM method on a topic, says \"storm research this\" / \ |
| `submit-to-hackathon` | Prepare and optimize a hackathon submission for a Solana project. Use when a user says "submit to hackathon", "prepare my submission", "hack |
| `supabase-mcp` | Use Supabase MCP server tools for database operations, queries, and data retrieval. Use when reading from Supabase database, querying tables |
| `superpowers` |  |
| `superpowers-gate` | Routes a coding task to the right amount of process: small fixes done directly, features through superpowers brainstorming and writing-plans |
| `sustainable-cadence` | Treat the operator's capacity, pace, and rhythm as first-class design inputs , not afterthoughts to optimize away. Use when planning workloa |
| `tailwind-design-system` | Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Use when creating component |
| `team-archetypes` | Compose a team (of people OR agents) by lifecycle posture, not job title, using the five product archetypes , Prototyper, Builder, Sweeper,  |
| `template` | Replace with description of the skill and when Claude should use it. |
| `thinking-tool` | Use thinking tools (mcp_think or sequential thinking) to organize reasoning after context changes. Use when examining files, running command |
| `toggle-two-agent` | Set up the two-agent pattern for a new project. Run once at the start with /project-initializer to create features.json and init.sh structur |
| `validate` | Run comprehensive validation of the project including linting, tests, and build. Use when validating code quality, checking for regressions, |
| `validate-idea` | Run a structured validation sprint on a crypto startup idea. Use when a user says "validate this idea", "is this worth building", "run a val |
| `vault-migrations` | The craft of restructuring a vault without losing a byte , bulk moves, folder dissolutions, renames, file splits/merges across many notes. U |
| `video-generator` | AI video production workflow using Remotion. Use when creating promotional videos, product demos, social media videos, animated explainers,  |
| `virtual-solana-incubator` | Deep technical Solana bootcamp, SVM architecture, Rust patterns, program development. Use when a user says "Solana incubator", "teach me Ru |
| `voice-gate` | Measure AI-writing tells in a draft against the operator's own voice , density, bursts, and position , and report rather than rewrite. Use b |
| `watch-video` | Actually watch or listen to a video/audio source and hold it in context so you can answer questions about it, summarise it, pull quotes, or  |
| `website-builder` | Build a cinematic, high-fidelity landing page from a brief description, then deploy it live on Netlify. Use when creating websites, building |

## Third-party skills

Copied into `skills/` from their authors' repos. To get the latest version, install from the source with `npx skills add <source>`.

| Skill | Source |
|---|---|
| `3d-web-experience` | [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) |
| `adapt` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `advise-project-approach` | [AaravKashyap12/advise-project-approach](https://github.com/AaravKashyap12/advise-project-approach) |
| `agent-browser` | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| `agent-reach` | [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) |
| `algorithmic-art` | [anthropics/skills](https://github.com/anthropics/skills) |
| `alibabacloud-tech-solution-animation-creation-auto-deploy` | [aliyun/alibabacloud-aiops-skills](https://github.com/aliyun/alibabacloud-aiops-skills) |
| `animate` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `archify` | [tt-a1i/archify](https://github.com/tt-a1i/archify) |
| `architecture-decision-records` | [wshobson/agents](https://github.com/wshobson/agents) |
| `architecture-designer` | [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) |
| `arrange` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `audit` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `aws-diagrams` | [eraserlabs/eraser-io](https://github.com/eraserlabs/eraser-io) |
| `bencium-controlled-ux-designer` | [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) |
| `bolder` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `clarify` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `claude-api` | [anthropics/skills](https://github.com/anthropics/skills) |
| `cloud-architect` | [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) |
| `cmux` | [manaflow-ai/cmux](https://github.com/manaflow-ai/cmux) |
| `cmux-browser` | [manaflow-ai/cmux](https://github.com/manaflow-ai/cmux) |
| `colorize` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `copywriting` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) |
| `critique` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `database-schema-designer` | [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit) |
| `delight` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `design-md` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `devops-engineer` | [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) |
| `distill` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `doc-coauthoring` | [anthropics/skills](https://github.com/anthropics/skills) |
| `dogfood` | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| `drawio` | [bahayonghang/drawio-skills](https://github.com/bahayonghang/drawio-skills) |
| `enhance-prompt` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `eraser-diagrams` | [eraserlabs/eraser-io](https://github.com/eraserlabs/eraser-io) |
| `excalidraw` | [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) |
| `excalidraw-diagram-generator` | [github/awesome-copilot](https://github.com/github/awesome-copilot) |
| `extract` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `find-skills` | [vercel-labs/skills](https://github.com/vercel-labs/skills) |
| `fix` | [facebook/react](https://github.com/facebook/react) |
| `framer-motion-animator` | [patricio0312rev/skills](https://github.com/patricio0312rev/skills) |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) |
| `frontend-slides` | [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) |
| `full-output-enforcement` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `github-actions-templates` | [wshobson/agents](https://github.com/wshobson/agents) |
| `gsap` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `gsap-awwwards-website` | [eng0ai/eng0-template-skills](https://github.com/eng0ai/eng0-template-skills) |
| `gsap-react` | [bbeierle12/skill-mcp-claude](https://github.com/bbeierle12/skill-mcp-claude) |
| `gsap-scrolltrigger` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) |
| `gsap-sequencing` | [bbeierle12/skill-mcp-claude](https://github.com/bbeierle12/skill-mcp-claude) |
| `hallmark` | [nutlope/hallmark](https://github.com/nutlope/hallmark) |
| `harden` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `high-end-visual-design` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `hue` | [dominikmartn/hue](https://github.com/dominikmartn/hue) |
| `humanizer` | [blader/humanizer](https://github.com/blader/humanizer) |
| `hyperframes` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `hyperframes-cli` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `hyperframes-registry` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `implement-spec` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `industrial-brutalist-ui` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `instagram-research` | [bradautomates/head-of-content](https://github.com/bradautomates/head-of-content) |
| `install-anti-slop` | [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) |
| `internal-comms` | [anthropics/skills](https://github.com/anthropics/skills) |
| `m01-ownership` | [zhanghandong/rust-skills](https://github.com/zhanghandong/rust-skills) |
| `m06-error-handling` | [zhanghandong/rust-skills](https://github.com/zhanghandong/rust-skills) |
| `m07-concurrency` | [zhanghandong/rust-skills](https://github.com/zhanghandong/rust-skills) |
| `m10-performance` | [zhanghandong/rust-skills](https://github.com/zhanghandong/rust-skills) |
| `marketing-psychology` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) |
| `mermaid-diagrams` | [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit) |
| `minimalist-ui` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `motion` | [jezweb/claude-skills](https://github.com/jezweb/claude-skills) |
| `next-cache-components` | [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) |
| `normalize` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `onboard` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `optimize` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `overdrive` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `phaser-gamedev` | [chongdashu/phaserjs-tinyswords](https://github.com/chongdashu/phaserjs-tinyswords) |
| `polish` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `pr` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `presentation-builder` | [supercent-io/skills-template](https://github.com/supercent-io/skills-template) |
| `qmd` | [tobi/qmd](https://github.com/tobi/qmd) |
| `quieter` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `ralph-gpu` | [vercel-labs/ralph-gpu](https://github.com/vercel-labs/ralph-gpu) |
| `react:components` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `recipe-create-presentation` | [googleworkspace/cli](https://github.com/googleworkspace/cli) |
| `reddit` | [resciencelab/opc-skills](https://github.com/resciencelab/opc-skills) |
| `reddit-marketing` | [openclaudia/openclaudia-skills](https://github.com/openclaudia/openclaudia-skills) |
| `reddit-posts` | [kostja94/marketing-skills](https://github.com/kostja94/marketing-skills) |
| `redesign-existing-projects` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `remotion` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `remotion-best-practices` | [remotion-dev/skills](https://github.com/remotion-dev/skills) |
| `rust-async-patterns` | [wshobson/agents](https://github.com/wshobson/agents) |
| `rust-best-practices` | [apollographql/skills](https://github.com/apollographql/skills) |
| `rust-engineer` | [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) |
| `script-writer` | [ailabs-393/ai-labs-claude-skills](https://github.com/ailabs-393/ai-labs-claude-skills) |
| `scroll-experience` | [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) |
| `scrollytelling` | [doodledood/claude-code-plugins](https://github.com/doodledood/claude-code-plugins) |
| `security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) |
| `shadcn-ui` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `shape` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `skill-creator` | [anthropics/skills](https://github.com/anthropics/skills) |
| `skill-creator-plus` | [robonuggets/skill-creator-plus](https://github.com/robonuggets/skill-creator-plus) |
| `slack-gif-creator` | [anthropics/skills](https://github.com/anthropics/skills) |
| `social-media-marketing` | [dengineproblem/agents-monorepo](https://github.com/dengineproblem/agents-monorepo) |
| `software-crypto-web3` | [vasilyu1983/ai-agents-public](https://github.com/vasilyu1983/ai-agents-public) |
| `solana-dev` | [solana-foundation/solana-dev-skill](https://github.com/solana-foundation/solana-dev-skill) |
| `solana-kit` | [sendaifun/skills](https://github.com/sendaifun/skills) |
| `stitch-design` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `stitch-design-taste` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `stitch-loop` | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `system-design` | [jwynia/agent-skills](https://github.com/jwynia/agent-skills) |
| `theme-factory` | [anthropics/skills](https://github.com/anthropics/skills) |
| `threads-carousel` | [itchernetski/threads-carousel-claude-skill](https://github.com/itchernetski/threads-carousel-claude-skill) |
| `threejs` | [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) |
| `threejs-postprocessing` | [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) |
| `threejs-shaders` | [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) |
| `to-spec` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `to-tickets` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `tweet-writer` | [sanky369/vibe-building-skills](https://github.com/sanky369/vibe-building-skills) |
| `typeset` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| `unsafe-checker` | [zhanghandong/rust-skills](https://github.com/zhanghandong/rust-skills) |
| `vercel-react-native-skills` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `video-use` | [browser-use/video-use](https://github.com/browser-use/video-use) |
| `web-artifacts-builder` | [anthropics/skills](https://github.com/anthropics/skills) |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills) |
| `webgl` | [martinholovsky/claude-skills-generator](https://github.com/martinholovsky/claude-skills-generator) |
| `webgpu` | [cazala/webgpu-skill](https://github.com/cazala/webgpu-skill) |
| `webgpu-threejs-tsl` | [dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill) |
| `website-to-hyperframes` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `x-writer` | [ognjengt/founder-skills](https://github.com/ognjengt/founder-skills) |

## Plugins

Marketplace plugins I use. Add the marketplace, then install:

```bash
claude plugin marketplace add <marketplace source>
claude plugin install <plugin>@<marketplace>
```

| Plugin | Marketplace | Marketplace source |
|---|---|---|
| `agentpane` | `claude-agentpane` | xuanji86/claude-agentpane |
| `aws-core` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `aws-serverless` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `bencium-aeo` | `bencium-marketplace` | bencium/bencium-marketplace |
| `bencium-controlled-ux-designer` | `bencium-marketplace` | bencium/bencium-marketplace |
| `bencium-impact-designer` | `bencium-marketplace` | bencium/bencium-marketplace |
| `bencium-innovative-ux-designer` | `bencium-marketplace` | bencium/bencium-marketplace |
| `claude-code-setup` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `claude-code-wakatime` | `wakatime` | https://github.com/wakatime/claude-code-wakatime.git |
| `claude-mem` | `thedotmack` | thedotmack/claude-mem |
| `claude-video-vision` | `claude-video-vision` | https://github.com/jordanrendric/claude-video-vision.git |
| `code-modernization` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `codex` | `openai-codex` | openai/codex-plugin-cc |
| `context-mode` | `context-mode` | mksglu/context-mode |
| `context7` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `deploy-on-aws` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `feature-dev` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `frontend-design` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `frontend-slides` | `frontend-slides` | zarazhangrui/frontend-slides |
| `impeccable` | `impeccable` | pbakaus/impeccable |
| `kami` | `kami` | tw93/Kami |
| `last30days` | `last30days-skill` | mvanhorn/last30days-skill |
| `lazy-commit` | `lazy-commit` | irfanfaraaz/lazy-commit |
| `mongodb` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `next-steps-supervisor` | `modsmith` | DannyMac180/skills |
| `next-steps` | `claude-community` | anthropics/claude-plugins-community |
| `notion` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `pixel-council` | `pixel-council` | blinkz-ai/pixel-council |
| `playwright` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `plugin-dev` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `ponytail` | `ponytail` | DietrichGebert/ponytail |
| `rust-analyzer-lsp` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `scroll-world` | `scroll-world` | cth9191/scroll-world |
| `session-wrapped` | `claude-code-mods` | OneWave-AI/claude-code-mods |
| `skill-creator` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `supabase` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `superpowers` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `swift-lsp` | `claude-plugins-official` | anthropics/claude-plugins-official |
| `taste-skill` | `taste-skill-marketplace` | irfanfaraaz/taste-skill-plugin |
| `typography` | `bencium-marketplace` | bencium/bencium-marketplace |
| `ui-ux-pro-max` | `ui-ux-pro-max-skill` | nextlevelbuilder/ui-ux-pro-max-skill |
| `understand-anything` | `understand-anything` | Lum1104/Understand-Anything |
| `watch` | `claude-video` | bradautomates/claude-video |
| `zernio` | `zernio` | zernio-dev/zernio-claude-plugin |

## Credits

Third-party skills in `skills/` keep their authors' text. Credit goes to the original authors.
