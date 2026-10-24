# Prompt 1: Recreate the Current Cricket-Betting Phase 1 UI

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Recreate the current Phase 1 frontend exactly as described below.

This task is frontend-only. Do not modify the backend, database, authentication, API routes, or server configuration.

## Existing stack

- React
- Vite
- JavaScript
- Tailwind CSS v4 using the existing `@tailwindcss/vite` setup
- React Router

Preserve the existing Vite and Tailwind configuration. Do not create Tailwind v3 configuration files. Use JavaScript, not TypeScript.

## Dependency

From `frontend`, install `react-router-dom` using the existing package setup. Do not add unnecessary dependencies.

## Routes

Configure React Router in `frontend/src/App.jsx` using `BrowserRouter`, `Routes`, and `Route`.

Create these exact routes:

- `/` → landing page
- `/login` → `LoginPage`
- `/signup` → `SignupPage`
- `/dashboard` → `DashboardPage`
- `/matches` → `MatchesPage`
- `/matches/:id` → `MatchDetailsPage`
- `/predictions` → `MyPredictionsPage`
- `/leaderboard` → `LeaderboardPage`
- `/admin` → `AdminDashboardPage`
- `/admin/matches` → `MatchManagementPage`
- `/admin/users` → `UserManagementPage`
- `/admin/settlements` → `SettlementPage`
- `/admin/audit-logs` → `AuditLogsPage`
- `*` → `NotFoundPage`

Keep all routes directly defined in `App.jsx`. Do not map over a placeholder array. Do not create a shared placeholder component or layout wrapper.

## Separate placeholder pages

Create these individual files inside `frontend/src/pages/`:

- `LoginPage.jsx`
- `SignupPage.jsx`
- `DashboardPage.jsx`
- `MatchesPage.jsx`
- `MatchDetailsPage.jsx`
- `MyPredictionsPage.jsx`
- `LeaderboardPage.jsx`
- `AdminDashboardPage.jsx`
- `MatchManagementPage.jsx`
- `UserManagementPage.jsx`
- `SettlementPage.jsx`
- `AuditLogsPage.jsx`

Each file must contain its own simple `rafce`-style React component and default export. Each placeholder must render only its own component name, such as `LoginPage`, `MatchesPage`, or `AdminDashboardPage`. Do not reuse one component for multiple routes. The player dashboard and admin dashboard must be separate components.

## Landing page

Create `frontend/src/pages/LandingPage.jsx` as a minimal, responsive, single-viewport landing page.

It must:

- Use `Link` for navigation.
- Show a small `Virtual credits only` status pill with a cyan status dot.
- Show the phrase `Welcome to the crease`.
- Show the title `Cricket-Betting`.
- Explain that users predict cricket match outcomes using virtual credits.
- Include a `Sign Up` button linking to `/signup`.
- Include a `Login` button linking to `/login`.
- Use a dark retro arcade aesthetic.
- Use neon cyan, fuchsia, and purple accents.
- Use subtle gradients, glows, and a restrained grid-style background.
- Keep the content centered and responsive.
- Do not add a navbar, sidebar, footer, dashboard content, or unnecessary scrolling.

## 404 page

Create `frontend/src/pages/NotFoundPage.jsx` as a polished 404 page matching the landing page’s dark arcade aesthetic.

It must:

- Display `Error 404`.
- Display a large gradient `404` heading.
- Display the message `This ball went out of bounds.`
- Explain that the requested page does not exist or moved to another over.
- Include a `Return to home` button using `Link` to `/`.
- Use subtle purple glow and cyan/fuchsia gradient accents.
- Be centered and responsive.

## Styling and structure

Keep `frontend/src/main.jsx` responsible for mounting the app and importing global styles.

Use the existing Tailwind CSS v4 import in `frontend/src/index.css`. Replace starter styles with the dark arcade theme, including a dark background, light text, responsive defaults, and subtle grid/gradient background styling.

Do not import or use the starter Vite/React demo assets or starter `App.css`. Do not create a layout component. Do not add authentication, API calls, database logic, profile pages, `/profile`, or Phase 2 functionality.

Do not add unused imports, including `import React from 'react'` when it is not required.

## Verification

From `frontend`, run:

- `npm run lint`
- `npm run build`

Confirm that the landing page, every separate placeholder route, `/matches/:id`, and the wildcard 404 route compile without errors. At the end, report the files changed and the checks performed. Do not begin Phase 2.
