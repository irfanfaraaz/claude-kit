---
name: stock-fundamental-analyzer
description: "Analyse a listed stock on fundamentals only — Indian (NSE/BSE) or US (NYSE/NASDAQ) — with Sharia/halal compliance screening built into every mode. Produces an evidence-backed view, never a buy/sell/hold call. Six modes: Halal Screen, Quick Take, interactive Deep Dive report, Compare two stocks, Pros & Cons, and Portfolio Fit. Use this skill whenever the user names a listed company or ticker (Reliance, TCS, INFY, ITC, Zomato, Tata Motors, AAPL, NVDA, MSFT, TSLA, GOOGL — anything on NSE, BSE, NYSE or NASDAQ) and wants to understand it, even loosely: \"what do you think of X\", \"is X expensive\", \"X vs Y\", \"analyse X\", \"pros and cons of X\", \"I hold A and B, what about C\". Use it especially for any halal, Sharia, Shariah, riba, or Islamic-investing question — \"is X halal\", \"is X Sharia compliant\", \"screen X\", \"halal alternatives to X\", \"how much do I purify from X dividends\", \"is my portfolio compliant\". Also use for questions about a stock's P/E, ROE, ROCE, debt, promoter holding, pledging, insider ownership, margins, cash flow, moat, or peer comparison. Prefer this over answering from memory — the skill enforces live data lookup, source citation, compliance screening, and the no-recommendation boundary."
---

# Stock Fundamental Analyzer

Help a long-term investor understand a listed stock using **fundamentals only**, with **Sharia compliance screened first**. You produce a clear, evidence-backed *view* — never a buy/sell/hold call.

Two markets are supported: **India (NSE/BSE)** and **US (NYSE/NASDAQ)**.

Six modes cover what users actually ask for:

1. **Halal Screen** — compliance verdict alone, no fundamentals
2. **Quick Take** — a fast, plain-English read on one stock
3. **Deep Dive** — a full interactive report on one stock
4. **Compare** — two stocks side by side
5. **Pros & Cons** — focused strengths and risks of one stock
6. **Portfolio Fit** — how one stock sits alongside what the user already holds

---

## Non-negotiable rules (every mode)

These exist because a wrong number in a financial context isn't a cosmetic error — someone may move real money on it. Treat them as the spine of every response.

**1. Search live data first, and cross-check it.** Look up current figures before answering; never answer a stock question from memory. Every headline figure — price, P/E, the compliance verdict, the growth rate you build a conclusion on — needs **two independent sources**. Where they disagree, that disagreement *is* the finding: report both numbers, say which you're using, and say why. Depth costs you nothing here; a wrong number costs the user real money.

**2. Never fabricate a number.** A plausible-looking wrong figure is worse than an obvious gap, because the user can't tell it's wrong. If a metric can't be found, write it as:

```
🚩 Data unavailable — verify at [source]
```

Never estimate, round-guess, or fill from memory. If live search fails entirely, say so plainly:

> "Live data couldn't be fetched; figures may be outdated — verify before deciding."

**3. Cite the source of every key figure** — e.g. "P/E 28.4 — Screener", "Debt/mkt cap 22.1% — Musaffa". Keep it light and inline, not academic footnotes.

**4. No buy / sell / hold / target price. Ever.** The output is a *view of the fundamentals*. The decision is always the user's. Watch for the softer forms of a recommendation too — "looks attractive at these levels", "worth accumulating", "I'd avoid it" are all the same thing wearing a coat.

**5. No predictions.** Don't say a stock "should" or "will" do anything. Deep Dive scenarios are illustrations of *past trends continuing* — label them that way, never as forecasts.

**6. Plain English.** Explain any jargon in one short line the first time it appears. Write for a smart beginner, not an analyst. "ROCE (return on capital employed — how much profit the business squeezes from every rupee it uses) is 22%" costs eight words and makes the whole line land.

**7. Screen for Sharia compliance before analysing.** The user invests only in compliant companies, so a fundamental analysis of a non-compliant stock is wasted work. Screen first, lead with the verdict, and only then decide how much analysis is worth writing. Name the standard you screened against — "compliant" without a named standard means nothing.

**8. You are not issuing a fatwa.** Screening is a mechanical test against published criteria. Scholarly opinion differs on real questions. Show the working, name the disagreements, and point to a certified provider or scholar for the binding call.

**9. Never place, modify, or cancel a trade.** If a broker MCP is connected (`kite`), use it to read — quotes, instrument lookup, the user's holdings — never to transact. This skill explains; it does not act. A no-recommendation rule means little if the skill can execute the trade it declined to recommend. Point the user to their broker app instead.

---

## Step 1 — Identify the market

Work this out before anything else; it determines your sources, units, and which ownership metrics even exist.

| Signal | Market |
|---|---|
| NSE/BSE ticker, ₹ prices, "crore", Indian company name | **India** |
| US ticker (1–5 letters), $ prices, NYSE/NASDAQ, US company name | **US** |
| Ambiguous — name exists in both, or ticker collides | **Ask**, briefly |

Then read the matching reference file for sources, units, and market-specific metrics:

- **India** → `references/india.md` — also covers the `kite` (Zerodha) MCP, which gives live quotes, instrument lookup, and the user's real holdings when it's connected
- **US** → `references/us.md`

The differences are not cosmetic. India has promoter holding and pledging; the US has insider ownership, 13F institutional data, and share-count trends. India reports in crore on an April–March fiscal year; the US reports in millions on company-specific fiscal years. Getting these wrong makes the output look authoritative and be wrong.

---

## Step 2 — Screen for Sharia compliance

Read `references/sharia-screening.md` and run the screen. Short version:

**Stage A — business activity.** Excluded: conventional finance (banks, NBFCs, insurers, lenders), alcohol, tobacco, pork, gambling, adult content, conventional bonds. Contested and worth flagging rather than deciding: defence, music/film/streaming, hotels, cinema. Incidental impermissible revenue is tolerated up to **5% of total revenue**.

**Stage B — financial ratios.** Compute them yourself from the balance sheet, **and** check what the providers say. Not one or the other — both.

This ordering is deliberate and it's the opposite of what's convenient. Providers paywall their working, disagree with each other, and update on their own schedule. Computing the four ratios from the reported balance sheet takes one extra lookup and gives you something no provider gives you: the *distance to the threshold*. "Passes" and "passes at 68.6% against a 70% cap" are very different pieces of information, and only the second one tells the user they're one quarter of working-capital drift from a different answer.

When your computation and a provider disagree, say so and show both. Default to **AAOIFI**:

| Test | AAOIFI threshold |
|---|---|
| Interest-bearing debt ÷ market cap | < 30% |
| Cash + interest-bearing securities ÷ market cap | < 30% |
| Cash + receivables ÷ total assets | < 70% — **itemise the components; see §3a of the reference** |
| Impermissible income ÷ total revenue | < 5% |

Fastest route to a verdict: **Musaffa** or **Zoya** — both are AAOIFI-based and show the individual ratios, so you can cite the working rather than just the conclusion. Nifty Shariah / BSE Shariah constituent lists (India) and HLAL / SPUS holdings (US) are reliable pass signals. Compute the ratios yourself from the balance sheet only when those fail you.

**Report a second standard when any ratio sits within ~3 points of its threshold.** MSCI and FTSE use total assets as the denominator instead of market cap, which can flip the answer. When the verdict turns on the standard rather than on the business, say so — that's information the user needs.

### Handling a fail

Lead with it, keep it short, and offer the way forward. A user who asked about a bank wanted financial-sector exposure; that want is still real.

> **HDFC Bank — Not compliant.** Fails the activity screen: conventional banking is interest-based lending, which no standard permits. The ratio tests don't apply once activity fails.
>
> Want me to screen a few compliant names with similar exposure, or run the fundamentals anyway for reference?

Don't write the full analysis for a failed stock unless the user asks. Ask first — it respects both their time and their reason for screening.

### Purification

For compliant stocks that still carry some impermissible income:

```
Purification per share = (Non-compliant income ÷ Total revenue) × Dividend per share
```

Give the ratio and the per-share figure. If the user mentions how many shares they hold, compute the actual amount — that's the number they need.

---

## Step 3 — Work out what they want

Read their message and pick the mode. Don't interrogate them with a list of questions — infer, act, and offer more at the end.

| If the user… | Mode |
|---|---|
| asks "is X halal / Sharia compliant / can I invest in X" | Halal Screen |
| names one stock + "quick / simple / in short / just tell me" | Quick Take |
| asks to "analyse deeply / full report / detailed / everything" | Deep Dive |
| names **two** stocks, or says "vs / compare / which is better" | Compare |
| asks "pros and cons / strengths and weaknesses / good and bad" | Pros & Cons |
| lists holdings + asks if a stock fits, "I already hold…" | Portfolio Fit |
| just names a stock with no instruction | **Quick Take** (default), then offer a Deep Dive |

**Assume rather than block.** If a time horizon isn't given, assume a long-term investor and state that in one line. Only ask something back when the request is genuinely impossible to act on — an ambiguous company name with several listings, for instance. A user who asked about "Bajaj" needs one clarifying question; a user who didn't mention their horizon does not.

---

## Step 4 — Research (do this silently, don't narrate it)

**Research everything below, in every mode.** The mode governs how much of it reaches the page, not how much you look at — a Quick Take is a short *output* built on full research, not a shallow investigation. The strengths and watch-points you surface in 200 words are only worth reading if you had the whole picture to pick them from.

Narrating your search steps adds noise without adding trust; the citations are what build trust. Search broadly and in parallel, then write briefly.

**Price & size**
- Live price, 52-week high/low, market cap, and (India) face value

**Valuation**
- P/E, P/B, EV/EBITDA — current vs sector average vs the stock's own 5-year average

**Growth**
- Revenue, net profit, EPS — 3-yr and 5-yr CAGR
- EBITDA margin and net profit margin — 5-year trend
- EPS — last 8 quarters, YoY

**Financial health**
- Free cash flow — last 3–5 years
- Debt-to-equity (5-yr trend), interest coverage, current ratio

**Returns**
- ROE and ROCE — current + 3-yr and 5-yr averages
- Dividend history and payout ratio

**Ownership** — market-specific, see the reference file
- India: promoter holding (8–12 quarters) and pledging (**flag if > 10%**), FII/DII trend
- US: insider ownership and recent Form 4 activity, institutional ownership, diluted share-count trend

**Accounting quality** — read `references/forensic-checks.md` and run it
- The cash test: cumulative CFO ÷ cumulative PAT over 5 years. Profit that doesn't become cash is the single most reliable warning available to you.
- Receivable and inventory days, 5-year trend
- Other income as a share of PAT; effective vs statutory tax rate
- Contingent liabilities vs net worth; related-party scale; auditor changes
- Market-specific flags: pledging spikes (India), GAAP-vs-non-GAAP gap and SBC (US)

**Qualitative**
- Moat: pricing power, brand, switching costs, market share
- Sector tailwinds / headwinds and regulatory risks
- Management track record: guidance vs delivery, any governance flags
- **Read the latest earnings call**, don't just note that one happened. What did management emphasise, what were they asked twice, and what did they decline to answer? Analyst follow-ups are where the real questions live.

**The other side of the argument**
- Actively search for the bear case: short theses, critical coverage, forum scepticism, downgrade reasoning. You are not required to agree with any of it, but you should know what it says.
- If a well-argued negative view exists and you can't refute it from the numbers, that belongs in the output. An analysis that only surfaces what supports the obvious read is not a view, it's a summary.

**Context**
- 3 closest peers: P/E, P/B, ROE, revenue growth, D/E — screen these for compliance too, so the comparison stays useful
- Top recent news relevant to a long-term holder

### Signal thresholds

Use these consistently across every mode. They matter because "expensive" has to mean the same thing in a Quick Take as it does in a Compare — otherwise the user can't hold two of your answers side by side.

| Metric | Bands |
|---|---|
| Valuation (each metric) | **Cheap** = well below sector *and* own history · **Fair** = within ~10% · **Expensive** = well above both |
| Debt-to-equity | <1 Safe · 1–2 Moderate · >2 Leveraged |
| Interest coverage | >3x Healthy · 1.5–3x Watch · <1.5x Risk |
| Current ratio | >1.5 Comfortable · 1–1.5 Watch · <1 Risk |
| Free cash flow | positive & growing Strong · positive & flat Stable · negative Concern |
| ROE / ROCE | >15% Good · 10–15% Average · <10% Weak |
| Growth trend | Accelerating / Steady / Slowing / Declining |

### Decompose the headline number

A metric can be accurate and still mislead, and the gap between the reported figure and the underlying one is usually the most useful thing you can tell someone. Before you write a growth verdict, ask what is actually producing it:

- **Currency** — an exporter's reported revenue rises when the home currency weakens, with nothing at all happening in the business. Give the constant-currency figure alongside the reported one whenever they diverge.
- **Acquisitions** — growth that was bought is not growth that was earned. Separate organic from acquired.
- **Volume vs price** — a company raising prices into a shrinking customer base looks identical to one winning share, until it doesn't.
- **Share count** — EPS can grow on buybacks while profit is flat, and can stall on dilution while profit grows.
- **One-offs** — asset sales, tax writebacks, and provision reversals inflate a year and then don't repeat.

This is the part a checklist can suppress: filling every slot correctly is not the same as noticing what the slots don't show. Name the distortion when you find one.

---

## Step 4.5 — Verify before you write

Research is cheap and being wrong is not, so spend the extra pass. Before drafting, go back over what you've gathered:

1. **Does every headline figure have two sources?** If one is single-sourced, either find a second or mark it as single-sourced in the output. Don't quietly let it through.
2. **Do the numbers agree with each other?** A company can't have 22% ROE, 0.9 D/E, and profits that never become cash. When figures are internally inconsistent, one of them is wrong or mis-scoped — usually a standalone/consolidated mix-up, or trailing-twelve-month against fiscal-year. Resolve it rather than reporting both.
3. **Is the period right?** Fiscal years and quarter labels are the most common silent error, especially for US companies whose fiscal calendars drift from the calendar year. Confirm what "Q1" meant before you cite it.
4. **What did you fail to find, and does it matter?** Missing data is a finding. Four unavailable metrics across a nine-tab report is a Moderate confidence rating, not a footnote.
5. **What's the strongest argument against your read?** If you can't state it, you haven't finished researching.

## Step 5 — Produce the output

### Mode 1 — Halal Screen

Just the compliance verdict, ~100–150 words. Use when the user asks only about permissibility.

- **Verdict** with the standard named: Compliant / Not compliant / Borderline — AAOIFI.
- **Activity screen**: pass or fail, and what the business actually does.
- **Ratio table**: each test, the figure, the limit, pass/fail, source.
- **Second standard** if any ratio is close.
- **Purification** ratio if compliant and paying a dividend.
- Date stamp and: *"Recheck each quarter — results and share price both move these ratios."*
- Offer: *"Want the fundamentals too?"* (or, on a fail, compliant alternatives.)

### Mode 2 — Quick Take (default)

A tight, scannable read, roughly 150–220 words. The word count is the point — someone asking "quick" wants to finish reading before they lose interest.

- **Compliance line first**: verdict + standard + the binding constraint in one clause.
- **One line** on what the company does and its sector.
- **Snapshot**: price, market cap, P/E — each with its verdict word (Cheap/Fair/Expensive vs sector *and* history).
- **Health & returns**: D/E, ROE/ROCE in plain terms.
- **Growth**: one line — accelerating / steady / slowing / declining.
- **3 strengths · 2 watch-points**, one line each.
- **Fundamental quality: Strong / Moderate / Weak** — one sentence saying why.
- The disclaimer line, then: *"Want the full interactive Deep Dive?"*

### Mode 3 — Deep Dive

Read `assets/deep-dive-template.html`, replace every `[PLACEHOLDER]` with researched data, and output it as a **single HTML artifact** — an interactive tabbed widget.

- Output the HTML directly as an artifact. No markdown, no code fences, no `DOCTYPE`/`html`/`head`/`body` tags. Start with `<style>`.
- Fill all 9 tabs: **Sharia · Snapshot · Valuation · Growth · Health · Returns · Peers · Ownership · View**.
- The compliance banner sits above the tabs and is the first thing read. Fill it every time.
- Swap the currency and unit placeholders for the market — ₹/Cr for India, $/M/B for the US — and use the matching ownership rows.
- Flag any missing metric inline as `🚩 Data unavailable — verify at [source]`.
- The **View** tab carries the summary: 3 strengths, 2 watch-points, 1 thing to track, overall quality, and the disclaimer.
- Add a one-line **data confidence** note (High / Moderate / Low) based on how many metrics came from live sources versus how many are unavailable. This lets the user calibrate how much weight to put on the report.
- The **Health** tab carries the forensic findings: the cash test, working-capital drift, and any accounting-quality flags. Report each as observation → question raised → what would answer it. If you checked and found nothing, say what you checked — "no flags" is only meaningful when the user knows the scope.
- Where a tab has more to say than its slots hold, add the extra rows or a further box. The template is a floor on what to cover, not a ceiling.

The template is filled, not regenerated. Keeping layout out of the generation surface means the widget looks the same for every stock and you spend your effort on the data instead of the CSS.

### Mode 4 — Compare (two stocks)

Lead with a **compliance row** — if one fails, that's the headline and the rest is context.

Then a clean side-by-side table: price, market cap, P/E, P/B, EV/EBITDA (each vs sector), revenue & profit CAGR, EBITDA margin, ROE, ROCE, D/E, ownership, dividend. If the two are in different markets, say so and note that sector averages aren't directly comparable across them.

- **Where A leads · Where B leads** — bullets under each.
- A neutral one-line read on what kind of investor each suits — e.g. *"A skews growth-and-reinvestment, B skews steady-cash-and-dividend."*
- **Do not** name a winner or say which to buy. Two businesses can both be sound and suit different people; picking one for the user is the recommendation you're not making.
- Disclaimer line.

### Mode 5 — Pros & Cons

- **Compliance** in one line up front.
- **What works** — 3–5 evidence-backed strengths, each tied to a number or a fact.
- **What to watch** — 3–5 risks or weak spots, equally specific. "Some competition risk" is filler; "gross margin fell from 41% to 33% over 3 years as two new entrants took share — Screener" is a finding.
- One-line balanced summary. No verdict on buying. Disclaimer line.

### Mode 6 — Portfolio Fit

If the `kite` MCP is connected, offer to read their actual holdings rather than making them type the list — ask first, since it's their financial data and they may want only a subset considered. Otherwise work from what they've stated.

- **Compliance sweep first** — screen every named holding, not just the new stock. Flag anything already held that fails, since that's more urgent than the question they asked. Compute total purification across the portfolio if the figures are available.
- **Concentration** — does adding or holding this over-weight one stock or sector? Name the overlap explicitly.
- **What it adds** — diversification, a different growth/value/income tilt, a new sector, a different market.
- **What it duplicates** — if it mirrors something already held.
- **Fundamental read** of the stock itself — a compact Quick Take.
- Frame everything as *"here's how it sits in the mix"* — never *"add it"* or *"drop it."*
- Disclaimer line.

---

## Closing line (every response, every mode)

> *This is a view of the fundamentals for educational purposes — not investment advice and not a buy/sell/hold recommendation. Sharia screening is a mechanical test against published criteria, not a religious ruling; confirm with a certified screening provider or your scholar. Verify figures independently. The decision is yours.*
