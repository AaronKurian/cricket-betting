# Prompt 5: Implement Match-Winner Predictions

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Preserve the existing authentication, wallet, dashboard, match management, route protection, responsive sidebars, Tailwind v4 setup, and visual design.

Implement player predictions for match winners only.

## Important scope

- Do not create or reintroduce markets.
- Do not create a Market model, market routes, market pages, outcomes, multipliers, or odds.
- Players predict only Team A or Team B.
- Do not implement settlement yet.
- Do not implement real money, payments, deposits, withdrawals, or cash-outs.
- Use the existing backend route convention without an `/api` prefix.

## Style rules

Use the simplest readable implementation:

- Reuse the existing models, API utility, route guards, layouts, dialog, toast, and components.
- Keep backend route logic direct and beginner-friendly.
- Avoid unnecessary helper files, abstractions, validation frameworks, and packages.
- Use JavaScript, not TypeScript.
- Do not create a profile page.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router.
- Backend: Node.js, Express, JavaScript, Nodemon.
- Database: MongoDB Atlas with Mongoose.

## Backend

### Prediction model

Create a `Prediction` model containing:

- `user` — the player who made the prediction.
- `match` — the selected match.
- `selectedTeam` — `teamA` or `teamB`.
- `stake` — positive whole-number virtual credits.
- `status` — `pending`, `won`, or `lost`.
- `actualPayout` — default to zero until settlement is implemented.
- timestamps.

Prevent a player from creating more than one prediction for the same match. Add useful indexes for player history and match lookups.

### Prediction endpoints

Implement:

- `POST /predictions` — place a prediction.
- `GET /predictions` — return only the authenticated player's predictions.
- `GET /predictions/:id` — return one prediction only when it belongs to the authenticated player.

Only authenticated players may use these endpoints. Admins must not access another player's private prediction history through these player endpoints.

### Placing a prediction

When a player submits a prediction:

- Validate the match ID.
- Validate that the selected team is `teamA` or `teamB`.
- Validate that the stake is a positive whole number.
- Confirm that the match exists.
- Allow predictions only while the match status is `upcoming`.
- Reject predictions for `live` or `completed` matches.
- Confirm that the player's wallet has enough credits.
- Deduct the stake from the wallet on the backend.
- Create a `prediction_stake` wallet transaction with the new balance.
- Create the prediction with `pending` status.
- Never trust a client-provided balance or payout.

Use a MongoDB transaction so the wallet deduction, wallet transaction, and prediction are created consistently. Use an atomic balance update so concurrent requests cannot overspend the wallet. Support a request ID where appropriate to avoid charging twice when the same request is retried.

If any validation fails, do not change the wallet.

### Dashboard integration

Update the dashboard response to include:

- Total predictions.
- Won predictions count.
- Win rate based on settled wins.
- Recent predictions.

Pending predictions must not be treated as wins.

Update wallet transaction handling so multiple prediction-stake transactions are supported. Preserve the existing signup-bonus transaction.

## Frontend

### Match details

Update `/matches/:id` for players:

- Load the match, wallet balance, and the player's predictions.
- Allow selecting Team A or Team B only for upcoming matches.
- Allow entering a virtual-credit stake.
- Show the remaining balance while the player types.
- Show the remaining balance in red when the stake is greater than the balance.
- Disable the prediction button for empty, invalid, or over-budget stakes.
- Require confirmation through the existing custom `Dialog` component.
- Submit through the centralized `api.js` utility.
- Refresh the wallet balance after a successful prediction.

Use a polished responsive dark arcade UI with:

- A clear match-winner section.
- Distinct Team A and Team B selection cards.
- A visible selected-team state.
- A balance indicator.
- A properly aligned stake input and action button.
- No unnecessary icons or visual clutter.

If the player already has a prediction for the match, hide the prediction form and show a polished locked-prediction card containing:

- Confirmation that the prediction was placed.
- Selected team.
- Stake amount.
- Current balance.
- Prediction status.
- A short message explaining that the result will update after the match is completed.

Admins may view match details but must not see player prediction controls.

### My predictions

Implement `/predictions` as a functional player page:

- Fetch predictions from `GET /predictions`.
- Show match title and teams.
- Show the selected team.
- Show stake, status, and actual payout when available.
- Handle loading, empty, and error states.
- Use the existing player sidebar and arcade design.

### Responsive layout

Ensure the responsive sidebar works correctly on mobile:

- The sidebar must become an overlay drawer.
- Closed mobile sidebars must not occupy page layout width.
- The hamburger button opens the drawer.
- The close button closes it.
- Page content must use the full mobile viewport width.
- Desktop sidebar behavior must remain unchanged.

## Settlement boundary

Do not implement:

- Admin score entry and automatic result settlement.
- Winner payouts.
- Loser deductions beyond the original stake.
- Updating predictions from `pending` to `won` or `lost`.

Those features belong to a later phase.

## Acceptance criteria

- Players can predict Team A or Team B for an upcoming match.
- A player can make only one prediction per match.
- The stake is deducted exactly once.
- Wallet and prediction records remain consistent.
- Insufficient balances are rejected without changing the wallet.
- Live and completed matches reject new predictions.
- Existing predictions are displayed instead of the prediction form.
- Player prediction history is private.
- Dashboard prediction statistics use real prediction data.
- Mobile layout does not leave a blank sidebar-width gap.
- No market-related code or terminology is introduced.
- Existing authentication, wallet, dashboard, and match functionality continues to work.

Test the backend endpoints and frontend prediction workflow. Explain the files changed and verification steps.

Stop after Phase 6.
