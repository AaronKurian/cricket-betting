# Prompt 8: Admin Dashboard, User Management, and Audit Logs

You are working in the existing `cricket-betting` repository. Inspect the repository and current working tree before changing anything. Preserve all existing authentication, wallet, match, score-based prediction settlement, leaderboard, routing, sidebar, responsive layout, and visual design functionality.

Implement the admin dashboard, admin user management, and audit-log functionality for the existing match-winner prediction system.

## Important scope

- Do not create or reintroduce markets.
- Do not create market models, market routes, market pages, outcomes, odds, or configurable multipliers.
- Players predict only Team A or Team B.
- Match settlement is based on final scores when an admin completes a live match.
- Prediction statuses are `pending`, `won`, `lost`, or `tie`.
- Do not create a profile page or `/profile` route.
- Use the existing backend route convention without an `/api` prefix.
- Do not add real-money payments, deposits, withdrawals, or external cricket-score APIs.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router, and the existing icon/toast utilities.
- Backend: Node.js, Express, JavaScript, Nodemon, and Mongoose.
- Database: MongoDB Atlas.
- Authentication: JWT-based authentication using the existing HTTP-only cookie flow.

## Backend

### Audit log model

Create or complete an `AuditLog` model with:

- `actor`: the admin user who performed the action.
- `action`: a readable action identifier.
- `targetType`: the affected resource type, such as `match` or `user`.
- `targetId`: the affected document ID when applicable.
- `details`: safe non-sensitive metadata.
- timestamps.

Add useful indexes for administrative retrieval.

Never store passwords, JWTs, cookies, or other secrets in audit logs.

Create a small reusable server-side helper for recording audit events. It must support the existing MongoDB session when an action is performed inside a transaction.

### Audit events

Record audit events for:

- Match creation.
- Match information updates.
- Match score updates.
- Match status updates.
- Score-based match completion and settlement.
- User role changes.

Keep audit records safe, concise, and useful for administration.

### Admin dashboard endpoint

Implement or complete:

- `GET /admin/dashboard`

Require an authenticated admin on the backend.

Return:

- Total registered users.
- Total matches.
- Upcoming match count.
- Live match count.
- Total virtual credits according to the existing dashboard definition.
- Total predictions.
- Pending, won, and lost prediction counts.
- The top five players ranked by current virtual-credit wallet balance.
- The next five upcoming matches ordered by scheduled start time.
- The five most recent administrative audit events.

For the top-player list:

- Include players only.
- Exclude admin accounts.
- Return only safe public fields such as player name and balance.
- Sort by balance descending with deterministic tie-breaking.

For upcoming matches, return only the fields needed by the dashboard, including match ID, title, and scheduled date.

Avoid unnecessary or duplicated database queries where practical.

### Admin user endpoints

Implement or complete:

- `GET /admin/users`
- `PATCH /admin/users/:id/role`

Both endpoints must require an authenticated admin.

For listing users:

- Return safe user fields only: ID, name, email, role, and creation date.
- Support pagination.
- Support optional search by name or email.
- Support filtering by `player` or `admin` role.
- Use stable sorting.
- Never return password hashes or authentication data.

For role changes:

- Accept only `player` or `admin`.
- Validate the user ID.
- Never trust a client-provided authorization level outside this endpoint.
- Require confirmation in the frontend.
- Prevent demoting the last remaining admin.
- Perform the last-admin check safely inside the database transaction where supported.
- Record the previous and new role in the audit log.

### Admin audit-log endpoint

Implement or complete:

- `GET /admin/audit-logs`

Require an authenticated admin.

Support:

- Pagination.
- Stable newest-first sorting.
- Optional action filtering.
- Safe actor information such as actor name.

Do not expose secrets or sensitive authentication data.

### Server integration

- Register the admin router using the existing route style.
- Synchronize required indexes when the server connects to MongoDB, following the project’s existing startup pattern.
- Preserve admin bootstrap behavior.
- Preserve existing score-based match completion and prediction transaction behavior.

## Frontend

### Centralized API utility

Extend the existing `frontend/src/api/api.js` utility with functions for:

- Admin dashboard data.
- Admin user listing.
- User role updates.
- Audit-log listing.

Use the existing request and credential-handling behavior.

### Admin dashboard page

Replace the admin dashboard placeholder with a functional page at `/admin`.

Display:

- Responsive statistic cards.
- Top five players with rank, name, and virtual-credit balance.
- Five upcoming matches, showing the match title and linking to the appropriate match page.
- Recent administrative activity.
- Useful empty, loading, and error states.

Use the existing dark arcade theme and responsive layout. On wide screens, statistic cards should fill their row evenly. On small screens, they should wrap into a balanced layout without narrow cards or unused horizontal space.

Do not retain prediction-status and shortcut panels when replacing the dashboard content with the top-player and upcoming-match panels.

### User management page

Implement `/admin/users`.

Include:

- Search input.
- Role filter.
- Paginated user list.
- Name, email, and role display.
- Promote and demote controls.
- Confirmation before changing a role.
- Loading, success, error, and empty states.

The UI must clearly communicate backend errors such as the last-admin protection.

### Audit logs page

Implement `/admin/audit-logs`.

Include:

- Action filter.
- Paginated audit-log display.
- Actor, action, target, timestamp, and safe details.
- Loading, error, and empty states.

Keep the information readable on small screens.

### Navigation and access

Keep the admin sidebar separate from the player sidebar.

The admin sidebar must include:

- Dashboard.
- Matches.
- Users.
- Audit Logs.
- Leaderboard.
- Logout.

Admins must continue to access the shared `/matches` and `/leaderboard` pages where already supported. Keep `/predictions` restricted to players according to the existing route guards.

## Acceptance criteria

- Admin dashboard data loads from `/admin/dashboard`.
- Top five players exclude admins and are ranked correctly.
- Five upcoming matches appear in scheduled order.
- Administrative actions create audit records.
- Audit records are retrievable only by admins.
- Admins can list users and safely change roles.
- The last admin cannot be demoted.
- Players cannot call admin endpoints successfully.
- Sensitive user and authentication data is never exposed.
- The admin dashboard remains responsive and its statistic cards fill available space correctly.
- Existing authentication, wallets, matches, score-based predictions, leaderboard, and sidebars continue working.
- No market-related code or terminology is introduced.

Run frontend lint and build checks, backend syntax checks, and appropriate manual API verification. Explain the files changed and verification results. Do not claim database or browser workflows were tested unless they were actually run.

Stop after this phase.
