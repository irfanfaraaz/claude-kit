---
name: research-gate
description: Routes "how should I build this" research to the right depth so the cheap answer runs first and the expensive one only fires when it earns its cost. Use whenever the user asks for project strategy, architecture direction, stack or vendor selection, a repo or architecture critique, a prioritized improvement plan, "what's the best approach", "am I about to rebuild something that exists", or "what's the state of the art". It runs advise-project-approach for the industry-evidence answer — which settles most cases — then applies a three-part test and escalates to neuroarxiv's arXiv literature search only when a load-bearing technical mechanism is left genuinely unresolved. Reach for this before designing any non-trivial system. Skip it only when the user explicitly typed /advise-project-approach or /neuroarxiv, since they already chose their depth.
license: MIT
---

# Research Gate

Two research skills are installed and they look interchangeable from the
outside. They are not.

- **advise-project-approach** answers *how should I build this*, from
  industry evidence: comparable repos, official docs, real pricing.
- **neuroarxiv** answers *has this mechanism already been solved and
  published*, from live arXiv — and costs one isolated agent read per
  paper, typically 12–20 of them.

Almost every real question is the first kind. Someone asking "what stack
for a multi-tenant dashboard" needs comparables and a cost model, not
papers on tenancy isolation. But occasionally the hard part of a project
is a mechanism nobody's product-blogged about, and building it blind
means rediscovering a known failure mode the expensive way.

This skill exists so the second case gets caught without making every
routine stack question pay for a literature search.

## Step 1 — Bypass check

If the user explicitly typed `/advise-project-approach` or `/neuroarxiv`,
or asked for one by name, run that one directly and stop reading this.
They picked their depth; do not second-guess it or add a gate they did
not ask for.

Otherwise continue.

## Step 2 — Run advise-project-approach

Invoke it and let it run its own protocol in full, including its intake
gate. Do not summarize it, pre-empt it, or skip its evidence rules.

If it stops to ask intake questions, **the gate stops too.** There is
nothing to escalate from an unanswered brief — you would be sending
neuroarxiv a guess. Wait for the user's answers, then resume here.

Its output is the answer for most requests. Deliver it.

## Step 3 — The escalation test

Read what advise-project-approach actually produced — specifically its
`Recommended Stack` / `Architecture Direction`, its comparable evidence,
and its load-bearing risk. Then ask three questions. **Escalate only if
all three are yes.**

**A. Is the unresolved thing a mechanism, not a choice?**

Write it as a single verb-phrase with a constraint in it: "invalidate a
cache across N replicas without a coordinator", "rank results when
relevance labels are sparse", "reconcile writes from clients that were
offline for days". If the only honest phrasing is "which of Postgres /
Mongo / Dynamo should I pick", that is a selection question and advise
already answered it. Selection questions never escalate.

**B. Did industry evidence come up short on that specific mechanism?**

Yes if the comparables don't implement it, implement it in ways that
contradict each other, or hide it inside a closed managed service you
cannot read. No if a comparable's source shows you the mechanism working
— reading that source is cheaper, more concrete, and more current than
any abstract.

**C. Is getting it wrong expensive to undo?**

Yes if it anchors the data model, the wire protocol, the consistency
story, or a training/inference loop. No if a later refactor absorbs it.

If all three pass, escalate. If any fails, do not — and say which one
failed in one line, so the user can overrule you with `/neuroarxiv` if
they disagree. That single line is the whole point of showing your work
here; a silent non-escalation is indistinguishable from forgetting.

### Things that never escalate

- **Cost, pricing, quota, and vendor lock-in findings.** arXiv has
  nothing to say about a per-seat price. Advise owns this entirely.
- **Anything advise flagged as unverified pricing or a missing comparable
  it could have found with one more fetch.** Fix the cheap gap first.
- **A mechanism the user already named.** If they said "use HNSW", they
  converged. Re-opening it wastes their time and neuroarxiv's own
  pre-flight would abort anyway.
- **CRUD, glue, integration, and documented SDK paths.** No mechanism, no
  prior art worth the fetch.

## Step 4 — Escalate with a narrowed brief

When you do escalate, hand neuroarxiv the *mechanism sentence from test
A*, not the original project request.

This matters more than it looks. neuroarxiv's Phase 0 maps the problem
onto arXiv categories and search terms; feed it "build a multi-tenant
analytics dashboard" and it will guess at five categories and read
twenty loosely-related abstracts. Feed it "invalidate a derived
aggregate cache when tenant writes arrive out of order" and it lands on
cs.DB and cs.DC with real search terms, needs fewer papers per category,
and returns something a builder can act on.

Also pass forward what advise already established — the constraints, the
chosen stack, and the comparables that came up short — so the paper reads
are scouting against the real design, not a blank slate.

Escalate once. If neuroarxiv reports a thin result set, that is a
finding: the mechanism is either genuinely novel or the framing was
wrong. Say so and stop. Do not widen the search and re-run hoping for
better coverage — that is the cost spiral this gate exists to prevent.

## Step 5 — Report

Lead with the deliverable, not the routing.

For the common case (no escalation), give advise-project-approach's
output as-is, then one closing line naming the escalation test that
failed and offering `/neuroarxiv` as the manual override.

For the escalated case, give advise's recommendation first, then
neuroarxiv's THE PATH as the resolution of the one open mechanism —
framed as *this is the part the comparables couldn't settle, here's what
the literature says*. Where the two disagree, say so plainly rather than
blending them; a paper's result and a shipped product's choice diverging
is real information about the tradeoff, not a contradiction to smooth
over.
