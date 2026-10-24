# Prompt 7: Prediction History and Player Leaderboard

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Preserve the existing authentication, wallet, dashboard, match management, score-based prediction settlement, route protection, responsive sidebars, Tailwind v4 setup, and visual design.

Implement improved prediction history and a virtual-credit leaderboard for the existing match-winner system.

## Important scope

- Do not create or reintroduce markets.
- Do not create market models, market routes, market pages, outcomes, odds, or configurable multipliers.
- Players predict only Team A or Team B.
- Do not create a profile page or `/profile` route.
- Use the existing backend route convention without an `/api` prefix.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router.
- Backend: Node.js, Express, JavaScript, Nodemon.
- Database: MongoDB Atlas with Mongoose.

## Backend

### Prediction history

Extend `GET /predictions` for the authenticated player.

Support these status filters:

- `pending`
- `won`
- `lost`

Add pagination:

- Accept `page` and `limit` query parameters.
- Apply a sensible maximum page size.
- Sort consistently by newest prediction first.
- Use a stable tie-breaker such as prediction ID.
- Return pagination metadata including current page, page size, total records, and total pages.

Reject invalid status filters with a clear error. Return only the authenticated player's predictions. Populate only safe match information:

- Match title.
- Team names.
- Scheduled date.
- Match status.
- Declared winner when available.

Do not return private information belonging to other players.

### Leaderboard

Implement:

- `GET /leaderboard`

The endpoint must require authentication and be accessible to both players and admins.

Rank players by current virtual-credit wallet balance.

Leaderboard rules:

- Include players only.
- Exclude admin accounts.
- Include players with no wallet as zero balance where appropriate.
- Sort by balance descending.
- Use player name as the first tie-breaker.
- Use player ID as the final deterministic tie-breaker.
- Return rank, display name, balance, and whether the row belongs to the current user.
- Do not expose emails, password hashes, roles, private predictions, or other sensitive information.
- Return the selected metric and a readable metric label.

### Dashboard statistics

Keep dashboard statistics consistent with settlement data:

- Total predictions includes all predictions.
- Wins count predictions with `won` status.
- Losses count predictions with `lost` status.
- Ties count predictions with `tie` status.
- Win rate is calculated from settled predictions only: wins divided by wins plus losses plus ties.
- Pending predictions must not reduce the win rate.

## Frontend

### My Predictions page

Implement `/predictions` as a functional player page.

Add filter controls for:

- All
- Pending
- Won
- Lost
- Tie

Use the centralized `api.js` utility and backend pagination.

Each prediction card should display:

- Match title.
- Team names.
- Selected team.
- Stake.
- Actual payout.
- Prediction status.
- Declared match winner when available.

Include:

- Loading state.
- Error state.
- Empty state for the selected filter.
- Previous and next pagination controls.
- Clear visual differences between pending, won, lost, and tie statuses.

Keep the page private to the authenticated player and preserve the existing player sidebar.

### Leaderboard page

Implement `/leaderboard` for both players and admins.

Display:

- Ranking number.
- Player name.
- Current virtual-credit balance.
- Current-player highlight when applicable.
- Selected metric explanation.

Include loading, error, and empty states. Use the existing dark retro arcade theme and keep the layout responsive on mobile.

### Navigation

Keep the existing player Leaderboard link.

Add a Leaderboard link to the admin sidebar as well. Both roles must navigate to the same `/leaderboard` page, while the backend still enforces authentication.

Do not add a profile route or unrelated user-management UI.

## Acceptance criteria

- Prediction filters return the correct records.
- Pagination metadata and controls work correctly.
- Prediction history matches backend records.
- Pending predictions do not count as wins or losses.
- Leaderboard ranks players by current virtual-credit balance.
- Admins are excluded from rankings.
- Tie-breaking is deterministic.
- Private information is not exposed.
- Both players and admins can access `/leaderboard`.
- The admin sidebar contains a working Leaderboard link.
- Existing authentication, wallet, match, prediction, settlement, and responsive sidebar behavior continues to work.
- No market-related code or terminology is introduced.

Test the prediction filters, pagination, leaderboard API, player view, admin view, and responsive navigation. Explain the ranking metric, files changed, and verification steps.

Stop after this phase.
