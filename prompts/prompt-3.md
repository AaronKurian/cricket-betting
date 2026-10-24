# Prompt 3: Recreate the Current Cricket-Betting Wallet and Dashboard Setup

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Implement the current simple Phase 3 wallet and player dashboard setup without recreating or replacing the existing project.

Preserve the existing authentication, route protection, landing page, 404 page, Tailwind v4 setup, and current placeholder pages.

## Style rules

Use the simplest readable implementation:

- Keep route logic direct.
- Reuse existing models, API utilities, layouts, and components.
- Avoid unnecessary helper files, abstractions, wrappers, validation frameworks, and packages.
- Keep wallet and transaction schemas simple.
- Use JavaScript, not TypeScript.
- Do not create a profile page.
- Do not create a separate wallet page or wallet route.
- Do not implement predictions, settlements, or external cricket APIs yet.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router.
- Backend: Node.js, Express, JavaScript, Nodemon.
- Database: MongoDB Atlas with Mongoose.

Use the existing backend route convention without adding an `/api` prefix.

## Backend

### Wallet model

Create or complete the Wallet model with:

- `user`
- `balance`
- timestamps

Prevent duplicate wallets for the same user.

### WalletTransaction model

Create or complete the WalletTransaction model with:

- `user`
- `type`
- `amount`
- `reference` where applicable
- `description`
- timestamps

Keep the model simple and preserve the existing signup-bonus transaction behavior.

### Endpoints

Implement these authenticated endpoints:

- `GET /wallet`
- `GET /wallet/transactions`
- `GET /dashboard`

`GET /wallet` must return only the authenticated user's wallet and current virtual-credit balance.

`GET /wallet/transactions` must return only the authenticated user's transactions. Add simple pagination if useful.

`GET /dashboard` must return:

- The authenticated player's name and email.
- The current wallet balance.
- Basic prediction statistics using zero values until predictions exist.
- Upcoming matches when available.
- Recent predictions as an empty list until predictions exist.
- Recent wallet transactions.

Handle empty match and prediction data cleanly.

Do not add complete admin dashboard functionality yet. Do not add any client-controlled wallet balance update endpoint. Wallet changes must only happen through trusted backend logic.

## Frontend

Replace the player dashboard placeholder with a functional dashboard.

The dashboard must:

- Display the user's name.
- Display the current virtual-credit balance.
- Display basic prediction statistics.
- Display upcoming match titles when available.
- Make upcoming match titles link to `/matches/:id`.
- Display useful empty states for predictions and transactions.
- Display loading and API error states.
- Use the existing centralized `api.js` utility for all API requests.
- Keep `api.js` in the existing `api` folder.
- Reuse the existing player sidebar.
- Keep the admin sidebar separate.

Add common reusable components inside the existing `components` folder only when useful. Keep the dashboard simple and responsive.

## Design

Preserve the existing dark retro arcade theme with readable cards, neon accents, consistent spacing, and no unnecessary animations.

## Acceptance criteria

- Wallet data is available only to its owner.
- Wallet transactions are returned correctly.
- The signup bonus balance is displayed on the dashboard.
- Dashboard data loads from the backend.
- Upcoming match titles display and link to their match details when matches exist.
- Empty sections render cleanly.
- No arbitrary client-side wallet updates are possible.
- Existing authentication and route protection continue to work.

Test the backend endpoints and frontend integration. Explain the files changed and verification steps.

Stop after Phase 3.
