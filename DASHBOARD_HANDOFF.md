# Boost Coffee & Energy — Performance Dashboard
## Handoff Guide for New Collaborators

---

## What Is This?

This is a **fully custom, real-time marketing performance dashboard** built specifically for Boost Coffee & Energy. It lives at:

**https://adminboostcoffee.github.io/dashboard/**

Password: `fcH6G8Z4K$4N` (you only need to enter this once per browser — it stays saved)

This is not a generic tool or a template — it was built from scratch to show exactly the data Boost cares about, in a format that actually makes sense. It pulls live data from Meta Ads, TikTok Ads, Instagram Organic, and Appfront (loyalty/ordering app), with Google Ads integration in progress. The goal was to replace a patchwork of separate platform dashboards and give the team one clean place to see everything.

It looks great, it's fast, and it's 100% owned by Boost — no monthly SaaS fees, no vendor lock-in, no one else's template.

---

## What's Currently Built

### Tabs in the Dashboard

| Tab | What It Shows |
|---|---|
| **Overview** | High-level KPIs across all channels — total spend, impressions, reach, clicks |
| **Meta Ads** | Full campaign breakdown with sortable table, date filtering, spend/CTR/CPM metrics |
| **IG Organic** | Instagram organic reach, views, likes, comments, saves, follower growth |
| **TikTok Ads** | TikTok campaign performance, sortable by any metric |
| **Demographics** | Meta Ads age & gender breakdown — charts + sortable table |
| **Appfront** | Live loyalty/ordering data: sales, visits, avg ticket, top items, customer leaderboard |
| **Google Ads** | Setup in progress |

### Features
- **Date range picker** at the top — filter any tab by custom date range
- **Preset buttons** — This Month, 14 Days, 30 Days, All Time
- **Sortable tables** — click any column header to sort ascending/descending
- **Active column highlighting** — sorted column turns orange so you always know what you're sorted by
- **Appfront live data** — pulls real loyalty data from Boost's actual account in real time
- **Password protected** — one-time login per browser, stays saved
- **AI bubble** (bottom right corner) — coming soon feature, placeholder is live

---

## How Everything Is Set Up (Technical Overview)

You don't need to be a developer to use this guide, but here's what's running under the hood:

### The Stack
- **React + Vite** — the framework the dashboard is built in (modern, fast)
- **Tailwind CSS** — handles all the styling
- **Recharts** — powers all the charts and graphs
- **GitHub Pages** — where the dashboard is hosted (free, reliable)
- **GitHub Actions** — automatically rebuilds and deploys the dashboard

### Where the Code Lives
Everything lives in the GitHub repository:
**https://github.com/adminboostcoffee/dashboard**

The main branch being actively developed is:
`claude/charming-heisenberg-05tiu8`

### Data Sources
| Source | How It's Connected | Status |
|---|---|---|
| Meta Ads | Windsor.ai (via Claude session) | ✅ Live |
| TikTok Ads | Hardcoded data (Windsor not yet connected) | ⚠️ Manual refresh needed |
| Instagram Organic | Hardcoded data | ⚠️ Manual refresh needed |
| Appfront | Custom Cloudflare Worker proxy | ✅ Live (real-time) |
| Google Ads | Official API — in progress | 🔧 In progress |

### Cloudflare Workers (Proxy Layer)
Two Cloudflare Workers are running under Aubrianna's Cloudflare account:
- **boost-appfront.aubrianna.workers.dev** — proxies Appfront GraphQL requests so credentials stay secure
- **boost-gemini.aubrianna.workers.dev** — set up for the AI chatbot (Gemini), not yet fully active

---

## What Was Actively Being Worked On

These were in progress or recently completed when this handoff was written:

1. **Data refresh** — Meta Ads data was just updated through June 25, 2026. The dashboard currently shows April 1 – June 25.

2. **PDF Export** — Feature was approved and designed. The plan: a button in the header opens a modal where you select which tabs to include, then it generates a clean PDF of the dashboard with the current date range applied. **Not yet built.**

3. **CSV Export** — Export button that downloads a combined spreadsheet of Meta, TikTok, IG, and Appfront data for the selected date range. **Not yet built.**

4. **AI Chatbot (Ask AI)** — The Gemini-powered assistant is partially set up. The Cloudflare Worker is deployed and the Google AI Studio API key is configured. The chat UI currently shows a "Coming Soon" screen. Once the Worker is debugged, this will let you ask questions like "which campaign had the best CTR last month?" and get instant answers. **In progress.**

5. **Google Ads integration** — Official Google Ads API connection. Will also pull Google Analytics 4 data at the same time, giving full attribution chain from GTM → GA4 → dashboard. **In progress.**

6. **Auto-refresh pipeline** — The goal was to have the GitHub Actions workflow automatically pull fresh data from Windsor.ai every morning at 8AM ET before rebuilding the dashboard. The workflow is scheduled but the automated data-pull script hasn't been wired in yet. See the Known Issues section below.

---

## Known Issues to Address

### 🔴 Dashboard Not Auto-Updating Data
**What was supposed to happen:** Every morning at 8AM ET, GitHub Actions runs, pulls the latest ad data from Windsor.ai, updates the data files, and redeploys the dashboard automatically.

**What's actually happening:** The rebuild runs on schedule, but the data files aren't being updated automatically. The Meta Ads, TikTok, and IG data is hardcoded in `src/data/index.js` and only updates when someone manually refreshes it.

**Workaround until fixed:** Once a day (or whenever you want fresh data), open a Claude Code session and say:
> *"Can you please refresh the dashboard data with the latest from Windsor.ai?"*

Claude will pull the latest Meta Ads data, update the file, and push it — the site redeploys within a few minutes automatically.

### 🟡 TikTok Ads Not Connected to Windsor
TikTok data is currently hardcoded. Windsor.ai supports TikTok but the account hasn't been connected yet. To fix: go to Windsor.ai, connect the TikTok Ads account, and then the data can be refreshed the same way as Meta.

### 🟡 Instagram Organic Not Connected
Same situation as TikTok — the `instagram_public` connector isn't set up in Windsor. Currently hardcoded.

### 🟡 AI Chatbot Not Active
The Coming Soon screen is the current placeholder. The Cloudflare Worker needs to be debugged to get responses flowing from Gemini. The API key is already configured.

---

## How to Make Changes to the Dashboard

### Option 1: Claude Code on the Web (Recommended — No Coding Required)

1. Go to **https://claude.ai/code**
2. Sign in to a Claude account
3. Connect it to the GitHub repo: `adminboostcoffee/dashboard`
4. Start talking to Claude in plain English

That's it. You describe what you want and Claude handles the code, commits, and pushes it. The dashboard updates automatically within a few minutes of any push.

### Useful Prompts to Get Started

**To refresh data:**
> "Can you refresh the dashboard data with the latest Meta Ads data from Windsor.ai and push it?"

**To add something new:**
> "Can you add a conversion rate column to the Meta Ads table?"
> "Can you add a new KPI card on the Overview tab showing total spend across all channels?"

**To change how something looks:**
> "Can you make the Overview tab cards larger and easier to read?"
> "Can you change the color scheme on the TikTok tab?"

**To fix something:**
> "The Appfront tab is showing an error — can you look at it and fix it?"

**To build the pending features:**
> "Can you build the PDF export feature we had planned? There should be a button in the header that opens a modal where you pick which tabs to include, then downloads a PDF."
> "Can you build the CSV export button?"

**To check what's going on:**
> "Can you give me a summary of the current state of the dashboard — what's built, what's missing, and what the data covers?"

---

## Suggestions for What to Push Forward Next

In rough priority order:

1. **Fix the auto-refresh pipeline** — This is the biggest gap. Once this is working, nobody has to think about data freshness. It just happens every morning.

2. **Build PDF Export** — Monica asked about this specifically. High visibility, relatively straightforward to build with html2canvas + jsPDF.

3. **Build CSV Export** — Useful for anyone who wants to manipulate the data in Excel or share it.

4. **Connect TikTok + Instagram Organic to Windsor** — Unlocks live data for those channels and removes the manual refresh dependency.

5. **Finish Google Ads / GA4 integration** — Completes the full picture. Once this is in, you'll have every paid channel in one place with attribution data.

6. **Launch the AI chatbot** — Debug the Gemini Worker. Once it's live, this becomes a genuinely powerful feature — natural language questions answered against real campaign data.

7. **Toast integration** — Toast has an official API. This would let you put media spend next to in-store sales side by side. Very compelling for reporting.

8. **Mobile optimization** — The dashboard works on mobile but wasn't specifically designed for it. Worth a pass to make it cleaner on small screens.

---

## GitHub Basics (For Non-Developers)

You don't need to use GitHub directly — Claude handles all of that. But here's what it is and why it matters:

**GitHub** is where the code for the dashboard is stored. Think of it like Google Drive, but for code. Every change Claude makes gets "committed" (saved) and "pushed" (uploaded) to GitHub. GitHub then automatically triggers a rebuild of the live dashboard.

The dashboard is hosted on **GitHub Pages**, which is GitHub's free static site hosting. That's why there's no hosting bill.

The repo is at: **https://github.com/adminboostcoffee/dashboard**

If you ever want to give someone else access to make changes, go to:
Settings → Collaborators → Add their GitHub username

---

## Account & Credentials Reference

| Thing | Where It Is |
|---|---|
| Dashboard URL | https://adminboostcoffee.github.io/dashboard/ |
| Dashboard password | `fcH6G8Z4K$4N` |
| GitHub repo | https://github.com/adminboostcoffee/dashboard |
| Cloudflare Workers | Aubrianna's Cloudflare account |
| Windsor.ai | Connected to Boost's ad accounts — Meta Ads is active |
| Google AI Studio key | Configured in Cloudflare Worker (boost-gemini) |

---

## Final Note

This dashboard was built entirely with Claude Code — no traditional development agency, no Figma handoffs, no sprint cycles. Features that would normally take weeks were shipped in hours. Everything is editable, everything is expandable, and the codebase is clean enough that any developer (or Claude) can pick it up and keep going without starting from scratch.

The foundation is solid. What's left is connecting the remaining data sources and building out the export/AI features that are already designed and approved. Whoever picks this up is in a great position — most of the hard architectural work is done.

Good luck, and don't hesitate to just ask Claude. It knows the codebase.
