# Daily Fortune Cookie

A sweet little site that reveals **one fortune per day**, unlocked at **10:00 AM** (viewer’s local time). Built with **Vite + React + TailwindCSS + Framer Motion**.

## Features
- 10:00 AM unlock timer with live countdown
- One cookie per day (persists in `localStorage`)
- First day = Day 1 (stores the start date on first open)
- Cookie crack animation + sparkles ✨
- Typewriter reveal for the fortune slip
- Glassmorphism UI, mobile-friendly
- 30 preloaded notes (loops after Day 30)
- Optional dev reset: add `?dev=1` to the URL to show a **Reset progress** button

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploy
- Easiest: push to GitHub → Import on Vercel → Deploy.
