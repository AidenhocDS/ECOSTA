# CourtSight Web (ECOSTA)

CourtSight is an interactive stadium seat exploration app built with React, Vite, and Tailwind CSS. It combines an SVG-based stadium map, seat-view previews, and a rule-based AI chat assistant that recommends sections based on user intent.

## Features

- **Interactive SVG Stadium Map:** 55+ dynamically generated sections with hover states, selection glows, and smooth transitions.
- **Smart Zoom & Pan:** Auto-focuses selected sections with easing animations and route overlays.
- **Seat View Explorer:** Real or fallback preview images with row-level details.
- **AI Chat Assistance:** Rule-based intent classification recommends sections based on budget, view preference, and party size.
- **Route Visualization:** Neon animated paths from stadium gates to selected seats.
- **User Authentication:** Built-in login/signup flow with session persistence via localStorage.
- **Responsive Dashboard:** Two-column layout (map + details) adapts to mobile/tablet views.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- react-zoom-pan-pinch
- ESLint 9

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm 9+

## Getting Started

1. Clone your repository:

```bash
git clone <your-repo-url>
cd courtsight-web
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the local URL shown in terminal (usually http://localhost:5173).

## Available Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## Project Structure

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    AIChatbox.jsx
    AuthFlow.jsx
    InteractiveMap.jsx
    ViewPanel.jsx
  data/
    seatViewsData.js
    stadiumData.js
  utils/
    nlpEngine.js
public/
  assets/
    views/
```

## Architecture & Data Flow

```
User Input (Map Click or Chat)
    ↓
Event Handler (handleSectionClick or processChatInput)
    ↓
State Update (selectedSection, activeRoute)
    ↓
Component Re-render
    ↓
UI Sync (Map highlight, ViewPanel image, zoom animation)
```

**Key Components:**
- `AuthFlow`: User login/signup form with localStorage session.
- `InteractiveMap`: SVG stadium rendering with selection and routing overlays.
- `ViewPanel`: Displays socket-level images and "Show Route" action.
- `AIChatbox`: Float-in chat widget with intent parsing.
- `nlpEngine`: Rule-based keyword matching for section recommendations.

## Deployment

### Build for Production

```bash
npm run build
```

Outputs optimized assets to `dist/`.

### Deploy to Vercel (Recommended)

1. Push code to GitHub.
2. Connect repo to [Vercel](https://vercel.com/).
3. Set build command: `npm run build`.
4. Set output dir: `dist`.
5. Deploy.

### Deploy to Other Platforms

- **Netlify:** Similar to Vercel; point to `dist/` folder.
- **GitHub Pages:** Use `gh-pages` or Actions workflow to deploy `dist/` to gh-pages branch.
- **Self-hosted:** Serve `dist/` folder via any static HTTP server.

## Future Improvements

- Backend API integration for real seat prices and availability.
- WebSocket support for real-time event updates.
- Image optimization and CDN caching for seat photos.
- Advanced NLP with ML-based intent classification.
- Multi-stadium support with dynamic data loading.
- Accessibility improvements (ARIA labels, keyboard nav).

## Notes

- This project currently runs **fully client-side** (no backend API required).
- If an image file is missing, UI fallback placeholders are shown automatically (via onError handler).
- All session data is stored in browser localStorage; clearing browser data will log out the user.
- The SVG stadium map uses a mathematical super-ellipse formula for smooth section boundaries.
