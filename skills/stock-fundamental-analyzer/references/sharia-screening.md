# Sharia screening — methodology reference

Read this whenever you run a compliance screen. The mechanics matter: a stock can pass one recognised standard and fail another, and saying "compliant" without naming the standard is close to meaningless.

## Contents

1. What screening is and isn't
2. Stage A — business activity screen
3. Stage B — financial ratio screen
4. The four standards, side by side
5. Which standard to use and how to report
6. Purification (dividend cleansing)
7. Where to look things up
8. Why status changes — and how often to recheck
9. Category notes: India
10. Category notes: US

---

## 1. What screening is and isn't

Screening is a **mechanical test against published criteria**. It is not a fatwa, and you are not a scholar. Two things follow:

- Report *what the numbers say against a named standard*, not *whether something is halal*.
- Scholarly opinion genuinely differs — particularly on entertainment, defence, and whether purification applies to capital gains. Where a judgement is contested, say so rather than picking a side.

Point the user to a certified screening provider (Musaffa, Zoya, Islamicly) or their own scholar for the binding call. Your job is to show the working.

---

## 2. Stage A — business activity screen

If a company fails here, the ratios don't matter. Nothing later in the analysis can rescue it. Run this first.

**Excluded core activities:**

| Category | What it covers |
|---|---|
| Conventional finance | Banks, NBFCs, insurers, brokerages, lenders, credit-card issuers — the business *is* riba |
| Alcohol | Production, distribution, retail |
| Tobacco | Cigarettes, chewing tobacco, vaping |
| Pork & non-halal meat | Processing, distribution |
| Gambling | Casinos, lotteries, betting, gaming-for-money |
| Adult entertainment | Any form |
| Conventional bonds & derivatives | As a primary business |

**Contested — flag rather than decide:**

| Category | The disagreement |
|---|---|
| Weapons & defence | AAOIFI and most index screens permit; some scholars exclude entirely |
| Music, film, streaming | AAOIFI excludes entertainment; DJIM/MSCI generally permit non-adult media |
| Hotels & airlines | Usually permitted if alcohol/impermissible revenue stays under the 5% tolerance |
| Cinema chains | Excluded under stricter standards, permitted under some index screens |

**The 5% tolerance.** Every major standard allows incidental impermissible income up to **5% of total revenue**. A supermarket that sells some alcohol, an airline serving drinks, a company earning bank interest on idle cash — all pass if that stream stays under 5%. Above it, the company fails on activity regardless of ratios.

Interest income on cash deposits is the single most common way an otherwise-clean company picks up impermissible revenue. Check it explicitly; it's usually buried in "Other income" in the P&L.

---

## 3. Stage B — financial ratio screen

Three tests, all measuring the same worry from different angles: *how much of this business is really a bet on interest and paper rather than on real activity?*

1. **Leverage** — interest-bearing debt relative to size. Holding a company financed largely by interest-bearing debt makes you a party to riba.
2. **Liquidity / cash** — cash and interest-bearing securities relative to size. Buying a company that is mostly cash is closer to exchanging money for money than to owning a business.
3. **Receivables** — money owed rather than assets held. Same reasoning: trading debt at anything other than par is impermissible.

The **denominator is where standards diverge**, and it changes answers materially:

- **Market capitalisation** (AAOIFI, DJIM) — compliance moves with the share price. A 40% drawdown can push debt/market-cap through the threshold with nothing at all changing inside the business. This surprises people; explain it when it's the reason for a fail.
- **Total assets** (MSCI, FTSE) — stable, driven only by the balance sheet, updates quarterly.

---

## 3a. Define the components before you compute — this decides verdicts

The word "receivables" is where two careful analysts get different answers for the same company on the same day. Two runs of this skill on TCS produced 44.5% and 68.6% for the *same* test, and the verdict flipped from comfortable pass to on-the-line, purely on what got counted. Pin the components down before you divide anything.

**Cash and near-cash — include all of:**
- Cash and cash equivalents
- Bank balances, including restricted cash
- Short-term investments, mutual funds, and marketable securities
- Interest-bearing deposits of any tenor

**Receivables — the contested part.** Include, in this order of confidence:

| Item | Include? |
|---|---|
| Trade receivables (billed) | Always |
| **Unbilled revenue / contract assets** | **Yes** — work delivered, money owed, not yet invoiced. Economically identical to a receivable, and excluding it is the single biggest source of divergence for IT and services companies |
| Long-term receivables | Yes |
| Loans and advances to third parties | Yes |
| Advance tax and statutory deposits | Grey — disclose whether you counted them |
| Prepaid expenses | No — a service owed to you, not money |
| Inventory | No — a real asset, which is the point of the test |

Unbilled revenue is the one that matters. Indian IT exporters routinely carry ₹25,000–30,000 Cr of it against ₹50,000–55,000 Cr of billed receivables. Leaving it out understates the ratio by roughly twenty percentage points and turns a marginal company into a clean pass.

AAOIFI's tangibility test asks whether the business is predominantly *real assets* or predominantly *money and paper*. Money owed for completed work is paper regardless of whether an invoice has been raised, so the conservative reading includes it. Take that reading.

**Always report both a narrow and a broad figure, and itemise what went into each.** Not as hedging — as the actual finding. A company at 44% narrow and 67% broad is telling you something a single number can't: that two-thirds of its balance sheet is claims on other people, and that its compliance depends on a definitional judgement rather than on a comfortable margin. Say that.

**Also name the balance sheet you used.** Screener, StockAnalysis, and the company's own filing classify these lines differently, and a quarterly balance sheet gives a different answer from the fiscal year-end. State the source and the date; a ratio without them can't be checked or reproduced.

## 4. The four standards, side by side

| Test | AAOIFI | DJIM (S&P) | MSCI Islamic | FTSE Shariah |
|---|---|---|---|---|
| **Denominator** | Market cap | Trailing 24-mo avg market cap | Total assets | Total assets |
| Interest-bearing debt | < 30% | < 33% | < 33.33% | < 33% |
| Cash + interest-bearing securities | < 30% | < 33% | < 33.33% | < 33% |
| Accounts receivable | (see note) | < 33% | < 33.33% | (see note) |
| Cash + receivables combined | < 70% of total assets | — | — | < 50% of total assets |
| Impermissible income | < 5% of revenue | < 5% of revenue | < 5% of revenue | < 5% of revenue |

Notes on the two that differ in shape:

- **AAOIFI** applies a *tangibility* rule instead of a standalone receivables cap: cash plus receivables must not exceed **70% of total assets**. The idea is that the company must be predominantly real assets, not predominantly paper.
- **FTSE** uses a tighter combined cap of **50% of total assets**, making it the strictest of the four on liquidity.

---

## 5. Which standard to use and how to report

**Default to AAOIFI.** It's the most widely accepted globally, and it's what the screening apps most Indian and Gulf retail investors use (Musaffa, Islamicly) are built on.

**Report a second standard whenever the result is close.** "Close" means any ratio within about 3 percentage points of its threshold. A stock at 31% debt/market-cap fails AAOIFI and passes MSCI — the user deserves to know that the verdict hinged on a choice of standard, not on the business.

Report it like this:

```
Compliance: Fails — AAOIFI
  ✗ Debt / market cap        34.2%  (limit 30%)   — Screener, Musaffa
  ✓ Cash + securities        11.8%  (limit 30%)
  ✓ Cash + receivables       48.1%  (limit 70% of assets)
  ✓ Impermissible income      0.9%  (limit 5%)
  Activity: passes — [sector], no excluded lines

  Under MSCI (total-assets basis) debt is 24.1% and this would pass.
  The verdict here turns on the standard, not on the business.
```

When a stock **fails**, always offer the same-sector alternative. That's the most useful thing you can do — the user asked about a company because they wanted exposure to something, and the exposure is usually still available. "HDFC Bank fails on activity (conventional banking). If you want financial-sector exposure that screens clean, the usual routes are takaful-style insurers, or asset-light financial-infrastructure names — want me to screen a few?"

---

## 6. Purification (dividend cleansing)

Even a compliant company usually earns *some* impermissible income — typically bank interest on cash. That portion of any dividend received must be given away, without expectation of reward, and not counted as charity for tax-benefit purposes in the way zakat or a chosen donation would be.

**The common formula:**

```
Purification per share = (Non-compliant income ÷ Total revenue) × Dividend per share
Total to purify        = Purification per share × shares held
```

Worked example — impermissible income ₹42 Cr on revenue ₹5,100 Cr, dividend ₹18/share, 200 shares held:

```
0.82%  ×  ₹18       =  ₹0.148 per share
₹0.148 ×  200       =  ₹29.50 to purify
```

Give the ratio and the per-share figure whenever you can find the non-compliant income line. If the user tells you their holding size, compute the rupee/dollar amount too — that's the number they actually need.

**Where scholars differ:** whether purification also applies to capital gains, and whether the denominator should be total revenue or total income. Give the revenue-based dividend figure as the baseline, note that some scholars extend it to gains, and leave the choice to the user.

---

## 7. Where to look things up

**Screening verdicts (fastest route — check these first):**

| Source | Coverage | Notes |
|---|---|---|
| Musaffa (musaffa.com) | India + US + global | AAOIFI-based, shows the individual ratios — most useful because you can see the working |
| Zoya (zoya.finance) | US-heavy, some India | AAOIFI-based, clean ratio breakdown |
| Islamicly | India-heavy | App-first, verdict without much detail |
| Nifty50 / Nifty500 Shariah | India | NSE's own index — constituent list is a reliable pass signal |
| S&P BSE 500 Shariah | India | Same idea on BSE |
| Dow Jones Islamic Market indices | Global + US | Constituent lists |
| HLAL (Wahed FTSE USA Shariah ETF) holdings | US | Published daily; a name in the holdings has passed FTSE screening |
| SPUS (SP Funds S&P 500 Sharia) holdings | US | Same, AAOIFI-adjacent |

**Raw inputs when you have to compute the ratios yourself:**

- India — Screener.in balance sheet (debt, cash, receivables), P&L "Other income" for interest, market cap from the header
- US — StockAnalysis.com or Macrotrends for the balance sheet, SEC EDGAR 10-K for the revenue breakdown that shows impermissible lines

An ETF holdings list is a *pass* signal but not a *fail* signal — absence may just mean the fund didn't select it.

---

## 8. Why status changes — and how often to recheck

Compliance is not a property of a company, it's a property of a company *at a moment*. Three things move it:

- **Quarterly results** shift debt, cash, and receivables
- **Share price** moves the AAOIFI and DJIM denominators directly — this is the one people forget
- **Business changes** — an acquisition can add an impermissible revenue line overnight

Always stamp the verdict with a date and tell the user to recheck each quarter. A screen from six months ago is not evidence about today.

---

## 9. Category notes: India

**Structurally excluded on activity** — the entire listed banking sector (private and PSU), NBFCs and consumer lenders, life and general insurers, tobacco-linked FMCG, listed breweries and distillers, gaming and casino operators, and hotel groups where bar revenue runs above the tolerance.

**Usually clean on activity** — IT services, pharma, most non-tobacco FMCG, auto and auto components, cement, metals, chemicals, and industrials. These still have to clear the ratio tests, and capital-intensive sectors (cement, metals, infrastructure, telecom) frequently fail on leverage.

**Where the ratios usually bite** — infrastructure, telecom, real estate, and airlines carry debt loads that fail the 30% test routinely even though the activity screen is clean.

---

## 10. Category notes: US

**Structurally excluded on activity** — money-centre and regional banks, insurers and reinsurers, consumer-credit issuers, casinos and gaming, alcohol and tobacco, and any conglomerate whose insurance or lending arm is a primary earnings driver.

**Usually clean on activity** — software, semiconductors, healthcare and pharma, industrials, energy, and most consumer staples. Streaming, gaming, and social media are contested rather than clean — flag them and name the disagreement.

**Where the ratios usually bite** — buyback-heavy large caps that fund repurchases with debt, REITs (leverage by design), telecoms, and airlines. Also watch companies sitting on very large cash and short-term securities balances; the cash test catches some names people assume are safe.

**A US-specific gotcha:** conventional interest income shows up in "Interest and other income, net" in the 10-K, often netted against interest expense. Netted figures hide the impermissible line — dig for the gross number in the notes when the tolerance test is close.
