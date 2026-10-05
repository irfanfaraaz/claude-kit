# India (NSE / BSE) — market reference

## Kite MCP (Zerodha) — use it for prices and holdings, not fundamentals

If the `kite` MCP server is connected, it is the best source for two specific things and useless for everything else. Knowing the boundary saves you a wasted round trip.

**Use Kite for:**

- **Live quotes, LTP, OHLC** — real-time and authoritative, straight from the exchange feed. Better than scraping Screener for the current price.
- **Historical price data** — clean OHLC series for 52-week ranges and drawdowns.
- **Instrument lookup** — resolves an ambiguous company name to the right NSE/BSE trading symbol. Use this whenever a name could match several listings instead of asking the user.
- **The user's actual holdings and positions** — this is the big one. For **Portfolio Fit**, read their real portfolio rather than making them type it out. Ask before pulling it; it's their financial data and they may prefer to name a subset.

**Do not use Kite for:** P/E, ROE, ROCE, margins, CAGR, promoter holding, pledging, FII/DII, or anything Sharia-related. It's a broker API — it knows prices and your account, not fundamentals. Screener remains the source for all of that.

**Never place, modify, or cancel an order.** Kite exposes order-placement tools. This skill analyses and explains; it does not transact. The no-buy/sell-recommendation rule would be hollow if the skill could act on one. If the user asks you to place a trade, decline and point them to the Kite app — that decision should pass through their own hands.

Kite requires a login round-trip on first use in a session. If it isn't connected or the user isn't logged in, fall back to Screener/Tickertape for price and just ask for holdings.

---

## Sources, in priority order

1. **Screener.in** — the workhorse. Ratios, 10-year financials, shareholding, peer comparison, all on one page.
2. **Tickertape** — good for sector averages and a cleaner peer set.
3. **Moneycontrol** — news, results coverage, management commentary.
4. **NSE India / BSE India** — authoritative for shareholding patterns and announcements, but they frequently block automated fetches. Don't build a plan around reaching them.
5. **Annual reports / earnings-call transcripts** — for moat, governance, and guidance-vs-delivery.

Cross-check the headline valuation numbers across Screener and Tickertape; they sometimes differ on trailing vs forward earnings.

## Units and conventions

- Currency **₹**, and use the Indian grouping in prose: ₹12,55,000 — not ₹1,255,000.
- Market cap and financials in **crore (Cr)**. 1 Cr = 10 million. Say "₹4,82,000 Cr", not "₹4.82 trillion".
- Per-share figures in plain rupees: ₹1,482.30.
- Fiscal year runs **April–March**. FY26 means April 2025 to March 2026 — say "FY26 (Apr 25–Mar 26)" the first time to avoid ambiguity.
- Quarters are **Q1 = Jun, Q2 = Sep, Q3 = Dec, Q4 = Mar**. This trips people up; a US-style "Q1" means something different.

## Ownership — what exists here

- **Promoter holding** — the founding family or parent group's stake. Track it over 8–12 quarters. A steady decline is a signal worth naming even when each individual quarter looks small.
- **Promoter pledging** — promoters borrowing against their own shares. **Flag anything above 10%.** High pledging plus a falling share price is how forced-selling spirals start, and it's the single most India-specific risk indicator on this list.
- **FII / DII holding** — foreign and domestic institutional stakes, quarterly. Direction matters more than level.

## Sector averages

Tickertape and Screener both publish sector medians. Screener's peer table on each company page is the fastest route — it pre-selects comparables and shows P/E, P/B, ROE, and market cap side by side.

## Governance flags worth checking

- Auditor resignations or qualified opinions
- Related-party transactions that are large relative to revenue
- Restated financials
- SEBI actions or pending investigations
- Repeated gaps between management guidance and delivered results

Moneycontrol and the annual report's auditor section are where these surface.
