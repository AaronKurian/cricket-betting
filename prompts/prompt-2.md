# Prompt 2: Recreate the Current Cricket-Betting Authentication Setup

You are working in the existing `cricket-betting` repository. Inspect the full repository before changing anything. Implement the current simple Phase 2 authentication setup without recreating or replacing the existing project.

Preserve the Phase 1 landing page, 404 page, routes, Tailwind v4 setup, and basic placeholder pages.

This task is limited to authentication, signup credits, session restoration, and role-based route access. Do not begin matches, predictions, leaderboard data, admin management functionality, or any other later phase.

## Style rules

Use the simplest readable implementation:

- Keep route logic direct.
- Avoid unnecessary helper files, abstractions, wrappers, validation frameworks, and packages.
- Keep model schemas simple.
- Use basic React components for protected placeholder pages.
- Do not add sidebars, top navigation, dashboards, profile pages, or extra UI after login.
- Use JavaScript, not TypeScript.
- Do not add `NODE_ENV` configuration.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router.
- Backend: Node.js, Express, JavaScript, Nodemon.
- Database: MongoDB with Mongoose.
- Password hashing: bcrypt.
- Authentication: JWT stored in an HTTP-only cookie named `authtoken`.

## Backend packages

Keep the existing backend packages and add only the required authentication/database packages:

- `mongoose`
- `bcrypt`
- `jsonwebtoken`
- `react-icons`

Keep Express, CORS, dotenv, and Nodemon. Do not add Helmet, cookie-parser, Zod, rate limiting, testing frameworks, or other unnecessary packages.

## Backend environment

Create `backend/.env.example` with these variables:

- `PORT=5000`
- `MONGODB_URI=` with a placeholder MongoDB URI
- `JWT_SECRET=` with a placeholder secret
- `JWT_EXPIRES_IN=7d`
- `SIGNUP_BONUS=10000`
- `ADMIN_EMAIL=` with a placeholder email

Create a local `backend/.env` only with local development values if it does not already exist. Never add real credentials to tracked files.

Update `backend/.gitignore` so `.env` and other local environment files are ignored while `.env.example` remains allowed.

## Backend server

Update `backend/server.js` to:

- Load dotenv.
- Create the Express app.
- Enable JSON parsing.
- Allow all CORS origins while allowing credentials using the simple CORS configuration compatible with cookies.
- Mount the auth router at `/auth`.
- Do not use an `/api` prefix.
- Require `MONGODB_URI` and `JWT_SECRET` before startup.
- Connect to MongoDB before listening.
- Run admin bootstrap after connecting.
- Listen on port `process.env.PORT` or `5000`.

The public auth URLs must be:

- `POST http://localhost:5000/auth/signup`
- `POST http://localhost:5000/auth/login`
- `POST http://localhost:5000/auth/logout`
- `GET http://localhost:5000/auth/me`

## Models

Create simple Mongoose models in `backend/models/`:

### User

Fields:

- `name`: required string
- `email`: required unique string
- `passwordHash`: required string and excluded from normal queries
- `role`: `player` or `admin`, defaulting to `player`
- timestamps

Do not add trim, minimum length, maximum length, or unnecessary schema validation.

### Wallet

Fields:

- `user`: required unique reference to User
- `balance`: required number with a default of `0`
- timestamps

### WalletTransaction

Fields:

- `user`: required reference to User
- `type`: `signup_bonus`
- `amount`: required number
- `balanceAfter`: required number
- `description`: required string
- timestamps

Keep a unique index for one signup-bonus transaction per user.

## Auth routes

Create `backend/routes/auth.js` with direct route handlers.

### Signup

`POST /auth/signup` should:

- Read `name`, `email`, and `password` from the request body.
- Reject only missing required fields with a simple 400 response.
- Normalize the email to lowercase.
- Hash the password with bcrypt.
- Create the user as a player.
- Read the signup bonus from `SIGNUP_BONUS`, defaulting to `10000`.
- Create the wallet with the signup bonus.
- Create the signup-bonus wallet transaction.
- Use a MongoDB transaction so user, wallet, and transaction are created together.
- Return a safe user object without the password hash.
- Set an HTTP-only cookie named `authtoken` containing a JWT.
- Return a clear duplicate-email error if the unique email index rejects the user.

Do not accept the role or bonus amount from the client.

### Login

`POST /auth/login` should:

- Read email and password.
- Reject missing fields simply.
- Normalize the email to lowercase.
- Find the user and compare the password with bcrypt.
- Return a basic invalid-credentials error when login fails.
- Create a JWT containing the user ID.
- Store it in the HTTP-only `authtoken` cookie.
- Return safe user information without the password hash.

Use simple cookie settings with HTTP-only, `sameSite: 'lax'`, a root path, and a reasonable seven-day lifetime. Do not add environment-dependent cookie branches.

### Logout

`POST /auth/logout` should clear the `authtoken` cookie and return a successful empty response.

### Current user

`GET /auth/me` should use authentication middleware, read and verify the `authtoken` cookie, load the user, and return safe user information.

## Backend middleware

Create a simple `backend/middleware/auth.js` with:

- Cookie extraction for `authtoken`.
- JWT verification using `JWT_SECRET`.
- Current-user lookup.
- A 401 response when the cookie is missing, invalid, or its user no longer exists.
- A basic role middleware that can restrict future admin endpoints.

Do not expose password hashes or JWT values in JSON responses.

## Admin bootstrap

Create `backend/services/adminBootstrap.js`.

After MongoDB connects:

- Read and lowercase `ADMIN_EMAIL`.
- If no `ADMIN_EMAIL` is configured, do nothing.
- If any admin already exists, do nothing.
- Otherwise find the registered player with the configured email.
- Promote that player to admin if found.
- Do not create an admin account or default password.

The bootstrap should be safe to run whenever the server starts. If a user registers with the admin email after startup, restarting the backend should run the bootstrap again and promote that user.

## Frontend API structure

Keep the API utility in `frontend/src/api/api.js`.

It should:

- Use `VITE_API_URL` with `http://localhost:5000` as the fallback.
- Send requests with credentials enabled so the browser sends `authtoken`.
- Provide a shared request function.
- Provide direct functions for `login`, `signup`, `logout`, and `getCurrentUser`.
- Parse JSON errors and throw simple error messages.

Create `frontend/.env.example` with `VITE_API_URL=http://localhost:5000`. Keep local `.env` files ignored by Git.

## Frontend auth state

Keep auth state in `frontend/src/auth/AuthContext.jsx`.

It should:

- Restore the session on app load using `getCurrentUser`.
- Store the current user and loading state.
- Expose simple `login`, `signup`, and `logout` functions.
- Update or clear the current user after those operations.
- Keep the `useAuth` hook in the same auth context file to avoid unnecessary files.

Create `frontend/src/auth/RouteGuards.jsx` with simple guards for:

- Protected authenticated routes.
- Guest-only login/signup routes.
- Player-only routes.
- Admin-only routes.

Redirect unauthenticated users to `/login`. Redirect players away from admin routes. Redirect admins away from player-only routes. After login, send players to `/dashboard` and admins to `/admin`.

## Frontend routes and pages

Preserve these routes:

- `/` → existing landing page
- `/login` → functional login form
- `/signup` → functional signup form
- `/dashboard` → basic `DashboardPage` placeholder
- `/matches` → basic `MatchesPage` placeholder
- `/matches/:id` → basic `MatchDetailsPage` placeholder
- `/predictions` → basic `MyPredictionsPage` placeholder
- `/leaderboard` → basic `LeaderboardPage` placeholder
- `/admin` → basic `AdminDashboardPage` placeholder
- `/admin/matches` → basic `MatchManagementPage` placeholder
- `/admin/users` → basic `UserManagementPage` placeholder
- `/admin/settlements` → basic `SettlementPage` placeholder
- `/admin/audit-logs` → basic `AuditLogsPage` placeholder
- `*` → existing 404 page

After login, render only the existing basic RAFCE-style placeholder components. Do not add a sidebar, navbar, layout wrapper, profile page, or extra dashboard UI.

The login and signup forms should remain simple and functional with required fields, submitting state, API error display, and redirects. Do not add complex validation.

Add a password show/hide button to both forms. Use `react-icons` for the eye and eye-off icons. The button should toggle the password input between password and text types, include an accessible label, and not submit the form.

## Verification

Run:

- `npm run lint` from `frontend`
- `npm run build` from `frontend`
- `node --check` for every backend JavaScript file
- `git diff --check`

If a MongoDB URI is available, manually verify signup, duplicate signup, login, `/auth/me`, logout, admin bootstrap, and role redirects. Explain that signup transactions require MongoDB Atlas or another MongoDB deployment that supports transactions.

Stop after this authentication phase. Report files changed, environment variables, endpoint URLs, and verification results. Do not start the next feature phase.
