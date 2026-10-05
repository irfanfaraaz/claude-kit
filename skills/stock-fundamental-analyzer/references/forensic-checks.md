# Forensic checks — accounting quality and red flags

Run these on every Deep Dive, Compare, and Pros & Cons. They're what separates an analysis from a data dump: the ratios tell you what the company reported, and these tell you whether to believe it.

None of them proves fraud. Each one is a *question the numbers raise*, and the honest output names the question and what would answer it. A single flag on its own is usually nothing; three flags pointing the same direction is a finding.

## Contents

1. The cash test — the most important one
2. Working capital drift
3. Earnings quality
4. Balance-sheet checks
5. Governance and disclosure
6. India-specific
7. US-specific
8. How to report what you find

---

## 1. The cash test — the most important one

**Cash flow from operations should track net profit over time.** Profit is an opinion; cash is a fact. A company reporting rising profit while operating cash flow stagnates or falls is the single most reliable warning in fundamental analysis, and it precedes most accounting blow-ups.

Compute over 5 years:

```
Cumulative CFO ÷ Cumulative PAT
```

| Ratio | Read |
|---|---|
| > 1.0 | Healthy — cash exceeds reported profit, typical of asset-light and subscription businesses |
| 0.8 – 1.0 | Normal for most industries |
| 0.5 – 0.8 | Worth explaining — is it growth-driven working capital, or something else? |
| < 0.5 sustained | Serious. Profit is not converting to cash and you should say so plainly |

Growth genuinely consumes working capital, so a fast-growing company can run below 1.0 for legitimate reasons. The distinguishing question is whether the gap *closes* when growth slows. If it never closes, the profit was never there.

---

## 2. Working capital drift

Rising days outstanding means the company is either selling to weaker customers, stuffing the channel, or recognising revenue early.

- **Receivable days** = (Receivables ÷ Revenue) × 365. Track the 5-year trend. Rising faster than revenue growth is the flag.
- **Inventory days** = (Inventory ÷ COGS) × 365. Building inventory ahead of demand, or obsolete stock not written down.
- **Payable days** — stretching suppliers can be strength (bargaining power) or stress (can't pay). Read it against the cash balance.

**Cash conversion cycle** = receivable days + inventory days − payable days. A cycle lengthening year after year while margins hold is a common sign that the margins are being defended with terms rather than with pricing power.

---

## 3. Earnings quality

- **Other income as a share of PAT.** If a meaningful slice of profit comes from treasury income, asset sales, or forex gains rather than operations, the operating business is weaker than the headline. Flag anything above ~15% and say what the operating-only figure would be.
- **One-offs presented as recurring.** Provision reversals, tax writebacks, land sales, insurance receipts. Strip them and restate the growth rate.
- **Effective tax rate versus statutory.** A rate far below statutory year after year needs an explanation — genuine incentives (SEZ, R&D credits) are fine and disclosed; unexplained gaps are not. A rate suddenly *normalising* will crush reported EPS growth even with a flat business.
- **Capitalised costs.** R&D, software, and interest moved to the balance sheet inflate current profit and defer the expense. Check whether capitalisation as a share of the spend is rising.
- **Margin expansion without a mechanism.** If EBITDA margin improved 400bps, there must be a reason you can name — mix, pricing, scale, input costs. "Operating leverage" with no supporting detail is not a reason.

---

## 4. Balance-sheet checks

- **Contingent liabilities versus net worth.** Disclosed in the notes, ignored by every screener. Tax disputes and guarantees that are large relative to equity belong in the risk list.
- **Equity dilution despite reported profits.** A company that keeps raising equity while claiming strong profitability is telling you something the P&L isn't.
- **Goodwill as a share of assets.** Large goodwill from acquisitions is an impairment waiting for a bad year. Check whether it has ever been written down.
- **Related-party transactions** as a share of revenue or expenses. Scale matters more than existence — most groups have some.
- **Subsidiary performance.** Consolidated numbers can hide a loss-making arm being funded by the healthy one. Compare standalone to consolidated when they diverge.
- **Debt maturity profile.** Total debt matters less than *when it's due*. Near-term maturities against available cash is the actual liquidity question.

---

## 5. Governance and disclosure

- Auditor resignation or change, and the stated reason
- Qualified opinion, emphasis of matter, or a key audit matter that reads like a warning
- Restatement of prior financials
- CFO turnover — repeated exits in the finance function is a stronger signal than CEO turnover
- Regulator action (SEBI in India, SEC in the US), ongoing or settled
- Repeated gaps between guidance and delivery
- Disclosure quality itself: a company that stopped reporting a segment it used to break out has usually stopped wanting you to see it

---

## 6. India-specific

- **Promoter pledging** — level and, more importantly, direction. A spike is more informative than a steady level. Above 10% is the flag; above 25% is a risk in its own right.
- **Promoter holding declining** quarter after quarter, even in small increments.
- **Auditor size versus company size** — a large listed company with a small unknown auditor.
- **Related-party sales to promoter-owned entities.**
- **Frequent changes to the fiscal year or reporting segments.**

## 7. US-specific

- **GAAP versus non-GAAP gap**, and whether it is widening. The size of the adjustment is the disclosure.
- **Stock-based compensation as a share of revenue**, and whether "adjusted" FCF treats it as free.
- **Share count rising despite buybacks** — buybacks offsetting dilution rather than returning capital.
- **Segment reporting changes** that make prior periods incomparable.
- **Form 4 cluster selling** by multiple insiders in a short window.
- **Material weakness in internal controls** disclosed in the 10-K.

---

## 8. How to report what you find

Say what you checked, not only what you found. "No flags" is only meaningful if the user knows what was looked for.

Report each flag as: **the observation → the question it raises → what would answer it.**

> Receivable days rose from 58 to 91 over three years while revenue grew 14% CAGR — receivables are growing roughly twice as fast as sales. That's either a deliberate shift to larger customers with longer terms, or revenue being recognised ahead of collection. The FY26 annual report's segment note would distinguish the two. — Screener

Flag the absence of data too. If contingent liabilities or related-party detail couldn't be reached, that's a limit on the analysis and belongs in the data-confidence note, not silently omitted.
