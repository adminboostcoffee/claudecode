# Boost Coffee & Energy — Performance Dashboard
### Executive Handoff Guide

---

## First Things First — The Dashboard

Go here: **https://adminboostcoffee.github.io/dashboard/**
Password: **fcH6G8Z4K$4N** *(enter once, stays saved in your browser forever)*

This is a fully custom marketing performance dashboard built from scratch for Boost. It replaced the need to log into Meta, TikTok, Instagram, and Appfront separately every time you want to see numbers. Everything lives in one place, filtered by date, with clean charts and sortable tables. It's fast, it's password protected, and Boost owns it completely — no subscriptions, no agency, no vendor telling you what you can and can't see.

---

## All the Logins You Need

| What | Website | Email | Password |
|---|---|---|---|
| **The Dashboard** | https://adminboostcoffee.github.io/dashboard/ | — | `fcH6G8Z4K$4N` |
| **GitHub** *(where the code lives)* | https://github.com | admin@boostcoffee.com | `fcH6G8Z4K$4N` |
| **Windsor.ai** *(ad data connector)* | https://windsor.ai | admin@boostcoffee.com | `fcH6G8Z4K$4N` |
| **Cloudflare** *(backend services)* | https://cloudflare.com | aubrianna@boostcoffee.com | `fcH6G8Z4K$4N` |
| **Claude Code** *(how you make changes)* | https://claude.ai/code | *(your own Claude account)* | — |

> **Cloudflare:** You've been added as an Administrator — you can log in with your own email once you accept the invite. This is where the two background services run that power Appfront data and the AI chatbot.

> **Windsor.ai FREE TRIAL:** ⚠️ Approximately **15 days remaining** on the free trial. Upgrade before it expires or data connections will stop working.

---

## What the Dashboard Does Right Now

### The Tabs

| Tab | What You See |
|---|---|
| **Overview** | The big picture — total spend, impressions, reach, and clicks across every channel combined |
| **Meta Ads** | Every Meta campaign broken down by spend, impressions, reach, clicks, CTR, CPM — sortable by any column |
| **IG Organic** | Instagram organic performance — reach, views, likes, comments, saves, follower growth |
| **TikTok Ads** | TikTok campaign performance — same sortable breakdown as Meta |
| **Demographics** | Who your Meta ads are reaching — age and gender breakdown with charts and a full data table |
| **Appfront** | Live loyalty and ordering data — sales, visits, average ticket, top menu items, customer leaderboard |
| **Google Ads** | Coming soon — integration in progress |

### How to Use It
- **Pick a date range** at the top — choose This Month, Last 14 Days, Last 30 Days, All Time, or enter custom dates
- **Click any column header** in a table to sort by that metric — the active column highlights orange
- **Toggle ascending/descending** with the sort direction button
- The **Appfront tab** pulls live data directly from Boost's loyalty account every time you open it — no refresh needed
- The **AI bubble** in the bottom right corner is a coming-soon feature — placeholder is live, functionality being built

---

## How to Make Changes (No Coding Required)

Everything is managed through **Claude Code** — you talk to Claude in plain English and it handles all the technical work, updates the code, and pushes it live. The dashboard redeploys automatically within a few minutes of any change.

### Getting Started
1. Go to **https://claude.ai/code**
2. Sign in with your Claude account
3. Make sure the repo **adminboostcoffee/dashboard** is connected (you'll see it in the repo picker)
4. Start typing — describe what you want in plain English

### Prompts to Bookmark

**To get a full rundown on the current state of the dashboard:**
> *"Please read the file DASHBOARD_HANDOFF.md from this repository and share the full contents with me."*

**To refresh the data (do this every few days until auto-refresh is fixed):**
> *"Can you refresh the dashboard data with the latest from Windsor.ai and push it live?"*

**To verify TikTok and Instagram are pulling from Windsor:**
> *"Can you try pulling TikTok Ads and Instagram Organic data from Windsor.ai and let me know if it works or if there are any errors?"*

**To add something new:**
> *"Can you add a cost-per-click column to the TikTok Ads table?"*
> *"Can you add a new card on the Overview showing total impressions across all channels?"*

**To build the export features:**
> *"Can you build a PDF export button that lets me pick which tabs to include and downloads a clean PDF of the current date range?"*
> *"Can you build a CSV export button that downloads all the current data as a spreadsheet?"*

**To fix something:**
> *"The Appfront tab is showing a connection error — can you look into it and fix it?"*

**To change how something looks:**
> *"Can you make the Overview KPI cards bigger and easier to read?"*

---

## Where the Data Comes From

| Channel | Connection | Status |
|---|---|---|
| **Meta Ads** | Windsor.ai | ✅ Live — pull fresh data anytime by asking Claude |
| **TikTok Ads** | Windsor.ai (connected, sync pending confirmation) | 🔍 Ask Claude to verify the pull |
| **Instagram Organic** | Windsor.ai (connected, sync pending confirmation) | 🔍 Ask Claude to verify the pull |
| **Google Ads** | Windsor.ai — needs connector added | 🔧 In progress |
| **Appfront** | Custom-built secure proxy | ✅ Fully live, updates in real time automatically |

### A Note on Appfront
Appfront doesn't have a public API — there's no official way for outside tools to connect to it. So we built a custom secure connection using Boost's own account credentials running through Cloudflare. It's completely legitimate — we're just accessing Boost's own data in a smarter way. The only limitation is that Appfront only returns data by month, not by day or week. That's an Appfront constraint, not ours — it's noted right on the dashboard.

---

## What's Being Built Next (Priority Order)

1. **Verify TikTok & Instagram data pulls from Windsor** — connectors are added, just need to confirm data is flowing. Ask Claude to test it.

2. **Add Google Ads to Windsor + finish the Google Ads tab** — a few clicks in Windsor to add the connector, then Claude wires up the tab. Also pulls Google Analytics 4 at the same time for full attribution.

3. **PDF Export** — button in the header, pick which tabs to include, download a clean PDF with the current date range applied. Already designed, just needs to be built.

4. **CSV Export** — download all current filtered data as a spreadsheet. Great for Excel analysis or sharing with the team.

5. **Fix auto-refresh** — the dashboard is supposed to automatically pull fresh data every morning at 8AM ET. The schedule is set up but the data-pull step needs to be wired in. Once done, nobody has to think about it.

6. **AI Chatbot** — the Gemini-powered Ask AI feature is partially built. Once live, you'll be able to ask things like "which campaign had the best CTR this month?" and get instant answers from your actual data.

7. **Toast POS integration** — Toast has an official API. This would put in-store sales next to media spend on the same dashboard — very powerful for showing full-funnel ROI.

---

## Known Issues

### Data Doesn't Refresh Automatically Yet
The dashboard is set up to rebuild every morning at 8AM ET, but it doesn't pull new data as part of that process yet — that step still needs to be built. In the meantime, just ask Claude to refresh it every few days. It takes about a minute.

### TikTok & Instagram Sync Not Yet Confirmed
Both channels were connected in Windsor.ai, but the data pull hasn't been tested end-to-end yet. Ask Claude to verify — it'll tell you exactly what's working or what needs attention.

### AI Chatbot Shows "Coming Soon"
The infrastructure is in place (Cloudflare Worker + API key), it just needs a debugging pass to get responses flowing. Ask Claude to look into it when you're ready.

---

## The Bigger Picture

This dashboard was built entirely using Claude Code — no development agency, no designer, no sprint planning. The kind of work that typically takes weeks and costs thousands was done in hours through plain-English conversations with Claude.

Everything is fully owned by Boost. The code lives in Boost's GitHub account, the hosting is free through GitHub Pages, and any developer or Claude session can pick it up and keep building. There's no vendor to negotiate with, no platform to migrate off of, and no proprietary system that locks you in.

The foundation is completely solid. The remaining work is mostly connecting a few more data sources in Windsor (a few clicks) and building the export features (ask Claude). Whoever takes this over is walking into a well-built, well-documented project that's ready to grow.

---

## Quick Reference Card

| Task | What to Do |
|---|---|
| View the dashboard | https://adminboostcoffee.github.io/dashboard/ → password `fcH6G8Z4K$4N` |
| Make a change | claude.ai/code → connect adminboostcoffee/dashboard → describe it |
| Refresh data | Ask Claude: *"Refresh the dashboard data from Windsor and push it"* |
| Something broke | Ask Claude: *"The [tab name] tab is showing an error — can you fix it?"* |
| Add a new feature | Ask Claude in plain English — it knows the whole codebase |
| Read this doc in Claude | Ask Claude: *"Read DASHBOARD_HANDOFF.md and share it with me"* |
| Upgrade Windsor trial | windsor.ai → admin@boostcoffee.com → upgrade before trial ends (~15 days) |
