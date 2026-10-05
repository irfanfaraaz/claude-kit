---
name: reddit-post-draft
description: >
  Draft story-arc Reddit posts (title + body) that read human and drive curiosity without hard-selling.
  Use this skill whenever the user wants a Reddit post draft, rewrite, or outline—even if they only say
  "post for r/entrepreneur", "case study style Reddit", "I made $X style post", "lead gen Reddit thread",
  "viral Reddit story", "AMA style opener", "done-for-you SaaS post", "payroll agent post structure",
  or "Reddit posting guide / post bank". Also use when they paste a story and want it shaped for Reddit,
  or when they mention intro→problem→feelings→solution→build→result flow. After drafting, apply
  reddit-posts for subreddit rules and flair; use reddit-marketing when the post is promotional (90/10).
metadata:
  version: 1.1.0
---

# Reddit post draft (story + bank)

You draft **title + body** only. Subreddit compliance is a separate step (reddit-posts).

## Before you draft

1. **If the user gave no concrete facts** (who, what, numbers, timeline)—ask. Do not invent metrics or clients.
2. **Post bank is pattern-only.** Never copy bank posts verbatim into the user's mouth. Never present bank anecdotes as the user's story. Mirror **structure and rhythm** only; all facts must be the user's.
3. **Read references only when needed:**
   - Structure only → `references/framework.md`
   - Match a proven arc (payroll, DFY, BI feature, etc.) → open `references/post-bank.md`, jump via its TOC, then mirror structure not wording.

## Workflow

1. **Collect** — Subreddit (if any), real facts only, desired reader action (comment, DM, no CTA).
2. **Title** — Significant result + curiosity + audience goal or pain (framework).
3. **Body** — Walk the arc in order; one block per section; concrete details; include friction/costs; end on outcome without a pitch.
4. **Optional bank match** — If user names a pattern ("like the dental post"), load that section in `post-bank.md` and align section order only.
5. **Handoff** — State "Verify sub rules before posting." Suggest flair if obvious. If links are risky in OP, use P.S. "happy to share link if you ask."

## Output format

Always emit exactly this shape:

```text
**Title:** ...

**Body:**
...
```

Then one line: flair suggestion if inferable, and the sub rules reminder.

## Principles

- Sell through **result**, not pitch.
- **Specifics over adjectives** (weeks, dollars, tools).
- **Links** — prefer "ask me in comments" when subs discourage OP links.

## Bundled resources

| File | When to load |
|------|----------------|
| `references/framework.md` | Title rules + body arc table |
| `references/post-bank.md` | Pattern match only; TOC at top |

## Test prompts (optional sanity checks)

Use these to verify the skill is followed (subjective—no assertions required):

1. "Draft a Reddit post about helping a friend apply to jobs faster; no dollar amounts yet—ask me what you need."
2. "I want a post structured like the payroll agent story but my project is a scheduling tool for clinics—here are the real numbers: …"
3. "Title + body only for r/SaaS—we added a done-for-you tier and booked two clients in a day; keep it under 300 words."

## Related skills

- **reddit-posts** — rules, flair, formatting, subreddit tone.
- **reddit-marketing** — 90/10, promotion cadence, authentic engagement.
