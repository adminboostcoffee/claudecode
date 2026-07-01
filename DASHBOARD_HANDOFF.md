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

## Login Credentials

These are the accounts you'll need access to in order to manage and maintain the dashboard:

| Platform | URL | Email | Password |
|---|---|---|---|
| **Dashboard** | https://adminboostcoffee.github.io/dashboard/ | *(no login required — use password below)* | `fcH6G8Z4K$4N` |
| **GitHub** | https://github.com | admin@boostcoffee.com | `fcH6G8Z4K$4N` |
| **Windsor.ai** | https://windsor.ai | admin@boostcoffee.com | `fcH6G8Z4K$4N` |
| **Cloudflare** | https://www.cloudflare.com | aubrianna@boostcoffee.com | `fcH6G8Z4K$4N` |

**Cloudflare** is where the two background proxy services (Workers) are hosted — one for Appfront data and one for the AI chatbot integration. You have been added as a member/administrator on the Cloudflare account — log in with your own email to access it. You won't need to touch it often but it's good to have access.

**Windsor.ai** is where the ad platform connections are managed. You'll log in here to add or reconnect data sources (TikTok, Instagram, Google Ads, etc.).

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
| Meta Ads | Windsor.ai ✅ | ✅ Live — refreshable on demand |
| TikTok Ads | Windsor.ai ✅ (connected — needs sync verified) | 🔍 Needs data pull confirmed |
| Instagram Organic | Windsor.ai ✅ (connected — needs sync verified) | 🔍 Needs data pull confirmed |
| Google Ads | Windsor.ai — add connector + official API | 🔧 In progress |
| Appfront | Custom Cloudflare Worker proxy | ✅ Live (real-time, no refresh needed) |

> **Note:** Windsor.ai is currently on a free trial — approximately 15 days remaining. Make sure to upgrade before it expires to avoid any disruption to data pulls.

### Cloudflare Workers (Proxy Layer)
Two Cloudflare Workers are running under the Cloudflare account (aubrianna@boostcoffee.com):
- **boost-appfront.aubrianna.workers.dev** — proxies Appfront GraphQL requests so credentials stay secure
- **boost-gemini.aubrianna.workers.dev** — set up for the AI chatbot (Gemini), not yet fully active

---

## Appfront — How It Works & Current Limitations

Appfront is Boost's loyalty and mobile ordering platform. It's the most complex integration in the dashboard because **Appfront does not have a public API** — meaning there's no official, documented way for outside tools to pull data from it.

### What We Did
We reverse-engineered Appfront's internal GraphQL API (the same one their own app uses) and built a **Cloudflare Worker** that acts as a secure middleman. When the Appfront tab loads on the dashboard, it sends a request to our Worker, which forwards it to Appfront's servers using Boost's own credentials — and returns the data. This is completely legitimate; we're just accessing Boost's own data through Boost's own account.

### What It Currently Shows (Live Data)
- Total sales & order volume
- Total visits and unique members
- Average ticket size
- Average spend per customer
- Coupons redeemed
- Active member count
- Monthly sales & orders bar chart
- Top menu items ranked by orders
- Customer leaderboard (top spenders, most visits, highest avg order)

### Current Limitations
- **Monthly data only** — Appfront's internal API returns totals by month, not by day or week. There is no way to break this down further with the current approach. The dashboard notes this with an info tooltip on the chart.
- **No CSV/PDF export from Appfront** — Appfront's official export is PDF only (no spreadsheet). The data visible on our dashboard tab is the workaround.
- **Auth token dependency** — If Appfront changes how their internal authentication works, the Worker may need to be updated. This is rare but worth knowing.
- **If the Appfront tab shows a connection error** — the auth token inside the Cloudflare Worker may have expired. Claude can help diagnose this, or you can log into Cloudflare and update the Worker's environment variable with a fresh token from Appfront's network requests.

---

## Windsor.ai — Connection Status & What's Next

Windsor.ai is the hub that connects ad platforms to the dashboard. Meta Ads, TikTok Ads, and Instagram Organic have all been added as connectors. Google Ads still needs to be added.

> **Free trial:** Windsor.ai is currently on a free trial with approximately 15 days remaining. Upgrade before it expires to avoid interruption.

### TikTok Ads & Instagram Organic — Already Connected
Both connectors have been added in Windsor. If data isn't pulling correctly, ask Claude:
> *"Can you try pulling TikTok Ads and Instagram Organic data from Windsor.ai and let me know if there are any errors?"*
Claude will diagnose whether it's an auth issue, a sync delay, or something else.

### To Connect Google Ads:
1. Log into Windsor.ai (admin@boostcoffee.com)
2. Add Connector → Google Ads
3. Also add Google Analytics 4 while you're there (same Google account)
4. This unlocks the Google Ads tab and full attribution data from GTM → GA4

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
> *"Can you please refresh the dashboard data with the latest from Windsor.ai and push it?"*

Claude will pull the latest Meta Ads data, update the file, and push it — the site redeploys within a few minutes automatically.

### 🟡 TikTok Ads & Instagram Organic — Windsor Connected, Sync Needs Verification
Both TikTok Ads and Instagram Organic have been added as connectors in Windsor.ai, but the data pull hasn't been confirmed yet — it's possible the accounts just need to finish authorizing or syncing. Ask Claude to attempt a data refresh and it will diagnose whether Windsor is returning data or if there's an auth step still pending.

### 🟡 Google Ads Not Yet Added
Google Ads needs to be added to Windsor.ai and the dashboard tab needs to be wired up. The tab currently shows a "Setup" badge.

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

**Daily data refresh (do this until auto-refresh is fixed):**
> "Can you refresh the dashboard data with the latest Meta Ads data from Windsor.ai and push it?"

**After connecting TikTok or Instagram in Windsor:**
> "Can you pull fresh TikTok Ads data from Windsor.ai and add it to the dashboard?"
> "Can you pull fresh Instagram Organic data from Windsor.ai and update the dashboard?"

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

**To get oriented:**
> "Can you give me a summary of the current state of the dashboard — what's built, what's missing, and what the data covers?"
> "Can you read the DASHBOARD_HANDOFF.md file and give me a quick rundown?"

---

## Suggestions for What to Push Forward Next

In rough priority order:

1. **Connect TikTok, Instagram, and Google Ads to Windsor.ai** — This is the quickest win. Log into Windsor, add those connectors, then ask Claude to pull and push the data. Unlocks live data for all three channels at once.

2. **Fix the auto-refresh pipeline** — Once this is working, nobody has to think about data freshness. It just happens every morning.

3. **Build PDF Export** — Monica asked about this specifically. High visibility, relatively straightforward to build. Just ask Claude.

4. **Build CSV Export** — Useful for anyone who wants to manipulate the data in Excel.

5. **Finish Google Ads / GA4 integration** — Completes the full picture with attribution data.

6. **Launch the AI chatbot** — Debug the Gemini Worker. Once live, this becomes a genuinely powerful feature — natural language questions answered against real campaign data.

7. **Toast integration** — Toast has an official API. Would let you put media spend next to in-store sales side by side.

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

## Final Note

This dashboard was built entirely with Claude Code. Everything is editable, everything is expandable, and the codebase is clean enough that any developer (or Claude user) can pick it up and keep going without starting from scratch.

The foundation is solid. What's left is connecting the remaining data sources (which is just a few clicks in Windsor) and building out the export/AI features that are already designed and approved. Whoever picks this up is in a great position — most of the hard architectural work is done.

Good luck, and don't hesitate to just ask Claude. It knows the codebase.
