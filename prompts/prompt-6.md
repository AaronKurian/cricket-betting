# Prompt 6: Automatic Match-Score Settlement

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Preserve the existing authentication, wallet, match management, prediction workflow, route protection, responsive sidebars, Tailwind v4 setup, and visual design.

Implement automatic settlement for the existing match-winner prediction system. The result must be calculated from the final scores entered by the admin. Do not add a separate settlement page or manual winner-selection workflow.

## Important scope

- Do not create or reintroduce markets.
- Do not create market models, market routes, market pages, outcomes, odds, or configurable multipliers.
- Players predict only Team A or Team B.
- The admin enters final scores and marks a live match as completed.
- The backend determines the result from those scores.
- Prediction statuses are `pending`, `won`, `lost`, or `tie`.
- A tie refunds the original stake and does not create a profit.
- Do not implement real money, payments, deposits, withdrawals, or cash-outs.
- Use the existing backend route convention without an `/api` prefix.

## Settlement rules

```text
Team A score > Team B score → Team A wins
Team B score > Team A score → Team B wins
Team A score = Team B score → Tie
```

For a winning prediction:

```text
Total payout = stake × 2
Net profit = stake
```

For a losing prediction, the payout is zero.

For a tied match, the original stake is refunded exactly once. The prediction status becomes `tie`, the actual payout equals the original stake, and the net result is zero.

## Backend

### Models

Update the Match model so `winner` supports:

- `teamA`
- `teamB`
- `tie`

Update the Prediction model so status supports:

- `pending`
- `won`
- `lost`
- `tie`

Update wallet transaction types to support a prediction refund in addition to existing signup, stake, and payout transactions.

### Completion endpoint

Use the existing authenticated admin endpoint:

- `PATCH /matches/:id/status`

The only accepted manual status transition is:

```text
live → completed
```

When this endpoint completes a match:

1. Determine the winner from the stored Team A and Team B scores.
2. Store `teamA`, `teamB`, or `tie` on the Match document.
3. Find all pending predictions for the match.
4. Set each prediction to `won`, `lost`, or `tie`.
5. Credit winning payouts using `stake × 2`.
6. Refund tied predictions using their original stake.
7. Set losing prediction payouts to zero.
8. Create payout or refund wallet transactions with the resulting balance.

Use a MongoDB transaction and an atomic match-state update so repeated or concurrent completion requests cannot settle predictions twice.

Reject:

- Invalid match IDs.
- Non-admin requests.
- Completion of an upcoming match.
- Re-completion of an already completed match.
- Invalid status values.

Do not expose a separate winner endpoint. Do not accept a client-provided winner as authoritative input.

### Automatic status lifecycle

Preserve the existing lifecycle:

- New matches always start as `upcoming`.
- When `scheduledAt` is reached, automatically update the match to `live`.
- Do not allow an admin to manually move a match back to `upcoming`.
- Do not allow an admin to manually move a match directly from `upcoming` to `completed`.
- Only a live match may be marked completed.

## Frontend

### Admin match management

Remove the manual status selector and any manual winner-selection UI.

Show a `Mark completed` action only for live matches. Require confirmation using the existing custom dialog. The action should call `PATCH /matches/:id/status` with `completed`.

Keep score editing available before completion. Completed matches must remain locked according to the existing rules.

### Remove settlement page

Remove the `/admin/settlements` route, page, API helper, and admin-sidebar link. Settlement happens automatically when the admin completes the match.

### Match details and prediction history

Update `/matches/:id` and `/predictions` to display:

- Team A winner.
- Team B winner.
- Tie.
- `pending`, `won`, `lost`, or `tie` prediction status.
- Actual payout or refund amount.

Keep prediction placement restricted to eligible upcoming matches.

## Dashboard statistics

Include tied predictions in settled-prediction statistics consistently. A tie is settled but is neither a win nor a loss. Do not count ties as wins.

## Audit logging

Record the automatic score-based settlement through the existing audit-log helper. Include the match, final scores, calculated result, and number of settled predictions. Do not store secrets.

## Acceptance criteria

- Admins cannot manually choose a winner.
- Completing a live match derives the result from its scores.
- Winning predictions receive `stake × 2` exactly once.
- Losing predictions receive zero.
- Tied predictions receive their original stake back exactly once and become `tie`.
- Repeated or concurrent completion requests cannot duplicate payouts or refunds.
- The settlement page and manual winner endpoint are removed.
- Match details and prediction history show tie results correctly.
- Automatic upcoming-to-live status behavior continues working.
- No market-related code is introduced.

Test winning, losing, tied, unauthorized, incomplete-match, repeated-completion, and concurrent-completion scenarios. Explain the fixed payout and refund rules and verification steps.

Stop after this phase.
