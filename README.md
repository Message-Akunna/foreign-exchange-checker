# Frontend Mentor - Foreign Exchange Checker

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-blueviolet?style=for-the-badge)](https://foreign-exchange-checker-one.vercel.app/history?send=USD&receive=GBP&rate=0.7567&amount=10008)
[![Challenge Link](https://img.shields.io/badge/Frontend_Mentor-Challenge_Details-orange?style=for-the-badge)](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter)


A premium, highly responsive Foreign Exchange (FX) Checker web application. The application delivers real-time conversion queries, dynamic interactive timelines, multi-currency compare dashboards, and persistent storage of user preferences and history.

---

## 📸 Screenshots

| Historical Exchange Rate Charts | Pinned Favorite Currency Pairs |
| :---: | :---: |
| ![Historical Chart](app/assets/images/screenshots/history-page.png) <br> *Dynamic historical charting panel with custom timeframes* | ![Pinned Favorites](app/assets/images/screenshots/favorite-page.png) <br> *Live-updated favorites dashboard and star toggles* |

| Conversion Logs History | Responsive Mobile Layout |
| :---: | :---: |
| ![Conversion Logs](app/assets/images/screenshots/log-page.png) <br> *Stored history log with deletion and restore options* | ![Mobile View](app/assets/images/screenshots/mobile-view.png) <br> *Adaptive mobile layouts with custom scroll behaviors* |

---

## 📝 Overview & Core Features

This project was built to satisfy complex real-world state persistence and performance requirements:

* **Real-time FX Converter**: Instant currency conversions with live ticker data, fully integrated with URL search parameters to support instant sharing and bookmarking.
* **Interactive Charting**: Historical rate fluctuation tracking over customizable periods (1W to 5Y) plotted cleanly with Recharts.
* **Comparison Dashboard**: Analyze a base currency against all other quotes simultaneously in a virtualized, fast-rendering grid.
* **Persistent Favorites & Logs**: Pinned pairs and transaction histories are written directly to an Appwrite database, synced with React Query cache contexts.
* **Intent-Based Auth Gate**: Protected actions (like saving favorites or logging conversions) redirect unauthenticated users to a secure login portal and execute the original action automatically after success.

---

## 🛠️ Built With

* **Frontend Framework**: [React Router v7](https://reactrouter.com/) (configured in Server-Side Rendering mode).
* **UI Components**: [shadcn/ui](https://ui.shadcn.com/) atomic base primitives built on Radix UI.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native CSS variable configuration and custom OKLCH color palettes.
* **State Management**:
  * [TanStack React Query v5](https://tanstack.com/query/latest) for database caching and server state syncing.
  * [Redux Toolkit](https://redux-toolkit.js.org/) for synchronous client-side UI states.
* **Database & Auth**: [Appwrite Client SDK](https://appwrite.io/) using `TablesDB` collections.
* **Data Visualizations**: [Recharts](https://recharts.org/) for interactive area charts.
* **Performance Enhancements**: List virtualization for large lists and optimized asset loading.
* **Code Quality**: [Biome](https://biomejs.dev/) for ultra-fast linting and formatting.

---

## 📓 Learning Journal & Retrospective

### What I'm Most Proud Of
I am extremely proud of the architectural division of concerns in this project. The presentation layers, server data synchronization (React Query), global UI states (Redux), and external API handlers (Appwrite & Frankfurter) are completely separated. 

This clean structure isolates mutations, makes the codebase easy to read, and ensures it can scale seamlessly when new features or databases are introduced.

### Challenges Encountered & How I Overcame Them
* **Flag Asset & List Performance**: Initially, loading large lists of currencies with inline SVG flags caused significant rendering lags and stuttering during scrolling.
  * *Solution*: Migrated from heavy SVG flag components to lightweight PNG assets. Additionally, implemented list virtualization so that only the visible currency elements are rendered in the DOM, reducing the nodes rendered and making list navigation buttery smooth.
* **SSR Hydration Quirks**: Timezones, date formatting (`new Date()`), and direct search parameters (`window.location.search`) caused hydration mismatches because the HTML rendered on the server did not match the client's localized view.
  * *Solution*: Implemented a `mounted` check pattern inside query wrappers and page layouts, ensuring that client-specific rendering is safely deferred until the component has hydrated.

### What I Would Do Differently Next Time
* **Domain Model Definitions**: If I were restarting, I would define concrete domain models and shared type configurations before writing any API logic. As the app grew, abstracting currency structures earlier would have avoided minor refactoring down the line.
* **Automated Testing**: I would introduce more automated testing—particularly integration and End-to-End (E2E) tests—to verify query caching and auth redirects in early development stages.

### Areas for Future Help & Expansion
* **Real-time FX Feeds**: The current setup uses daily exchange rates from the Frankfurter API. In a production update, I'd like help integrating sub-second live feeds to build live market trackers.
* **High-Frequency Update Architecture**: Guidance on designing cost-effective architectures to handle rapid updates without causing rendering overhead or high query fees.

---

## ⚙️ Prerequisites & Setup

### 1. Requirements
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher

### 2. Environment Variables
Create a `.env` file in the root directory and specify the following variables:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

### 3. Installation
Install the project dependencies using `npm`:
```bash
npm install
```

---

## 💻 Available Scripts

* **`npm run dev`**: Starts the Vite local development server.
* **`npm run build`**: Compiles both client and server build assets for production.
* **`npm run start`**: Launches the local production server from the build output.
* **`npm run typecheck`**: Runs TypeScript compiler checking and React Router typegen validation.

---

## 📂 Project Documentation

For a detailed breakdown of the file structure, database collection design, and code patterns, refer to the [Project Documentation](file:///Users/mac/Documents/challenge/foreign-exchange-checker/docs/project-overview.md).
