# UrbanPulse Dashboard

React + Vite + Tailwind CSS clone of the UrbanPulse civic-reporting dashboard.

## Stack
- React 19 (Vite)
- Tailwind CSS 3
- lucide-react (icons)

## Getting started
```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build
```bash
npm run build
```

## Structure
```
src/
  components/
    Sidebar.jsx        # left nav + "Your Impact" card
    Header.jsx          # welcome banner, location, notifications, profile
    ReportNewIssue.jsx  # 4-step "report an issue" card
    IssueHeatmap.jsx    # illustrative map with severity pins
    StatsRow.jsx         # 4 stat summary cards
    MyReports.jsx        # user's submitted reports list
    NearbyIssues.jsx     # nearby community reports list
  data.js               # mock data for reports / issues / map pins
  App.jsx               # page layout & responsive mobile drawer
```

All data is mocked in `src/data.js` — swap in real API calls where marked.
