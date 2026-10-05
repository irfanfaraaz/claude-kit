# US (NYSE / NASDAQ) — market reference

## Sources, in priority order

1. **StockAnalysis.com** — the closest US equivalent to Screener. Clean ratios, 10-year financials, peer tables, all free and fetchable.
2. **Finviz** — best single source for sector and industry averages, plus insider transactions.
3. **Macrotrends** — long-run history when you need 10+ years of margins or cash flow.
4. **Yahoo Finance** — quick quotes, analyst estimates, ownership summary.
5. **SEC EDGAR** — authoritative. 10-K for the annual picture, 10-Q for quarterly, DEF 14A for compensation and governance, Form 4 for insider trades. Slow to read but it's the source everything else derives from.
6. **Earnings-call transcripts** — Motley Fool and company IR pages carry them free.

## Units and conventions

- Currency **$**, standard grouping: $1,255,000.
- Market cap in **millions / billions**: "$2.94T", "$48.2B", "$740M". Never crore.
- Fiscal years vary by company and often don't match the calendar. Apple's FY ends in September; Nvidia's in January. **Always state the fiscal year end** the first time you cite an annual figure, or the CAGR you quote won't line up with anything the user checks.
- Quarters are the company's own fiscal quarters. When comparing two US companies, check whether their quarters are actually aligned before putting them in the same row.

## Ownership — what exists here instead

The US has no promoter or pledging concept. The equivalents:

- **Insider ownership** — officers and directors as a percentage of shares outstanding. High insider ownership is generally read as alignment. Source: the proxy statement (DEF 14A) or Yahoo/Finviz summary.
- **Insider transactions** — Form 4 filings, aggregated on Finviz and OpenInsider. Cluster buying by multiple insiders is a stronger signal than any single sale, since sales happen for tax and diversification reasons that say nothing about the business.
- **Institutional ownership** — from 13F filings, reported quarterly with a 45-day lag. Note the lag when you cite it; the data is always at least six weeks stale.
- **Share count trend** — this is the US-specific one that matters most. Buybacks shrink the count and flatter EPS; heavy stock-based compensation inflates it and quietly dilutes holders. Track diluted shares outstanding over 5 years and say which direction it's moving. A company growing net profit 8% while shrinking share count 4% is a different business from one growing profit 12% with flat shares, even though EPS growth looks identical.

## Sector averages

Finviz's screener gives industry medians for P/E, P/B, ROE, and debt directly. StockAnalysis.com shows a peer comparison table on each ticker page. Prefer *industry* over *sector* averages — "Technology" spans semiconductor fabs and SaaS companies whose economics have nothing in common.

## Governance flags worth checking

- Auditor changes or material weakness disclosures in the 10-K
- Restatements (8-K Item 4.02)
- Dual-class share structures that leave founders in control with a small economic stake
- Executive compensation growing faster than results (DEF 14A)
- Ongoing SEC enforcement or securities class actions
- Heavy and rising stock-based compensation relative to revenue

## Finding the two numbers the aggregators hide

Screening needs **total assets** and **gross interest income**, and both are routinely missing from the summary pages. Go straight to these rather than searching around:

- **Total assets** — StockAnalysis.com `/stocks/<TICKER>/financials/balance-sheet/`. It's there as a row; you don't need the 10-Q for it.
- **Gross interest income** — this one usually *does* require the filing, because 10-K and 10-Q income statements often report "Interest and other income, net". Netted against interest expense, it understates the impermissible line. Search the filing's notes for the gross figure when the 5% tolerance test is anywhere near close; take the netted number only when the result isn't marginal, and say which you used.

**Watch the fiscal calendar when you pull a quarterly filing.** US fiscal years drift from the calendar badly — Nvidia's FY2027 Q1 ended in April 2026. Confirm the quarter label against StockAnalysis's fiscal calendar before citing it, or you'll attribute figures to the wrong period with complete confidence.

## US-specific metric notes

- **Free cash flow** — check whether the company deducts stock-based compensation. Many tech firms report FCF that treats SBC as non-cash, which overstates what shareholders actually keep.
- **Adjusted / non-GAAP earnings** — nearly universal and nearly always flattering. Quote GAAP as the baseline and mention the adjusted figure only when you also say what was excluded.
- **Net debt** — US companies often carry large debt alongside large cash. Debt-to-equity on gross debt alone can look alarming for a company sitting on more cash than it owes. Give both when they diverge.
