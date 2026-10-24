# Prompt 4: Recreate the Current Cricket-Betting Match Management Setup

You are working in the existing `cricket-betting` repository. Inspect the repository before changing anything. Implement the current simple Phase 4 match management and viewing setup without recreating or replacing the existing project.

Preserve the existing authentication, wallet functionality, player dashboard, route protection, sidebar layouts, Tailwind v4 setup, and visual design.

## Style rules

Use the simplest readable implementation:

- Reuse the existing models, API utility, route guards, layouts, and components.
- Keep backend route logic direct and beginner-friendly.
- Avoid unnecessary helper files, abstractions, validation frameworks, and packages.
- Use JavaScript, not TypeScript.
- Do not create a profile page.
- Do not implement match-winner prediction placement yet.
- Do not integrate an external cricket scores API.
- Do not add a venue field to the Match model, API, forms, or UI.

## Existing stack

- Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router.
- Backend: Node.js, Express, JavaScript, Nodemon.
- Database: MongoDB Atlas with Mongoose.

Use the existing backend route convention without adding an `/api` prefix.

## Backend

### Match model

Create a Match model with:

- `title`
- `teamA`
- `teamB`
- `scheduledAt`
- `scores.teamA`
- `scores.teamB`
- `status`: `upcoming`, `live`, or `completed`
- timestamps

Use one consistent score structure throughout the backend and frontend. Give new matches an `upcoming` status and zero scores by default.

### Match endpoints

Implement these authenticated endpoints:

- `POST /matches` — admin creates a match.
- `GET /matches` — players and admins list matches.
- `GET /matches/:id` — players and admins view match details.
- `PATCH /matches/:id` — admin edits match information.
- `PATCH /matches/:id/score` — admin updates scores.
- `PATCH /matches/:id/status` — admin marks a live match as completed.

Only admins may create or modify matches. Players and admins may view matches. Enforce these rules in the backend, not only in the frontend.

### Validation and status rules

- Validate title, team names, scheduled date, and score values.
- Team names must be different.
- Reject invalid match IDs and malformed payloads with clear errors.
- Scores must be non-negative whole numbers.
- Always create matches as `upcoming`; do not allow admins to manually choose the initial status.
- Automatically move an upcoming match to `live` when its scheduled date and time is reached.
- Allow only the `live` to `completed` transition through the admin workflow.
- Never move a match back to `upcoming` or `live` after it has progressed.
- Prevent inappropriate edits to completed matches.
- Do not silently accept invalid data.

## Frontend

### Match listing

Implement `/matches` for authenticated players and admins.

- Fetch matches through the centralized `api.js` utility.
- Display match title, teams, scores, schedule, and status.
- Include loading, error, and empty states.
- Link each match to `/matches/:id`.

### Match details

Implement `/matches/:id`.

- Fetch and display the selected match.
- Display title, teams, schedule, scores, and status.
- Keep match details focused on match information. Match-winner predictions will be added later.
- Handle loading, invalid ID, missing match, and API error states.

### Admin match management

Implement `/admin/matches` for admins.

- Create matches.
- Edit title, team names, and scheduled date.
- Update the score for each actual team name.
- Mark a live match as completed after confirmation.
- Do not show a manual status selector for upcoming or live matches.
- Display backend validation and API errors.
- Require confirmation through the custom dialog when marking a live match completed.

## Common dialog and notifications

Create or reuse a common `Dialog` component inside the existing `components` folder.

- The dialog must accept arbitrary children and action content.
- Include a visible X close button.
- Close when Escape is pressed.
- Use it instead of browser `prompt()` and `confirm()` dialogs.
- Editing a match must open one dialog containing all editable fields.

Use the existing toast approach for success and error messages. Toasts should dismiss automatically after two seconds and include a manual close button.

## Sidebar behavior

- Keep player and admin sidebars separate.
- Keep the Matches item selected on `/matches` and `/matches/:id`.
- Keep admin match navigation selected appropriately on shared match pages.
- Preserve the responsive hamburger and close-button behavior.

## Acceptance criteria

- Admins can create, edit, and update matches.
- Players cannot create or modify matches through direct API requests.
- Players and admins can view match lists and details.
- Match details load correctly from the backend.
- Invalid data and invalid IDs are rejected.
- Completed matches cannot be edited inappropriately.
- Dashboard upcoming match titles come from the Match collection and link to match details.
- Custom dialogs replace browser dialogs.
- Empty, loading, success, and error states work correctly.
- Existing authentication, wallet, dashboard, and route behavior continues to work.

Test the backend endpoints and frontend workflow. Explain the files changed and verification steps.

Stop after Phase 4.
