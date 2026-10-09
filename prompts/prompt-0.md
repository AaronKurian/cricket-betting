# Prompt 0: Create the Cricket Betting App Foundation

Create a production-oriented JavaScript monorepo named `cricket-betting` in the current directory. The result must be runnable immediately after installation and must contain exactly two application folders at the root:

- `frontend`
- `backend`

Use npm and do not introduce unnecessary dependencies or abstractions.

## Frontend

Inside `frontend`, initialise a Vite React application using the current Vite command:

```bash
npm create vite@latest frontend -- --template react
```

Install the dependencies and configure Tailwind CSS using the current Tailwind v4 Vite integration:

```bash
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
```

Update `frontend/vite.config.js` to import `react`, `defineConfig`, and `tailwindcss`, then register both the React and Tailwind Vite plugins:

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Ensure `frontend/src/index.css` imports Tailwind:

```css
@import "tailwindcss";
```

Keep the generated Vite React application functional. The frontend must have these npm scripts:

- `npm run dev` starts Vite
- `npm run build` creates a production build
- `npm run lint` runs ESLint
- `npm run preview` previews the production build

## Backend

Inside `backend`, initialise a separate npm application and install Express, CORS, dotenv, and nodemon:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

Configure `backend/package.json` with ESM and these scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Create `backend/server.js` with the following behavior:

- Load environment variables with `dotenv`.
- Create an Express app.
- Enable CORS.
- Enable JSON request parsing.
- Listen on `process.env.PORT` and fall back to port `5000` when it is not set.
- Log the actual port when the server starts.

Create `backend/.env.example` containing:

```env
PORT=5000
```

Create a local `backend/.env` with the same development value only if it does not expose or overwrite a user-provided secret. Ensure `.env` files containing secrets are ignored by Git, while `.env.example` remains tracked.

## Repository files and safety

Create or update the root `.gitignore` so it ignores at least:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

Do not commit generated `node_modules`, build output, or real credentials. Do not replace existing user code unless it is required to make this setup work. If files already exist, inspect them first and preserve compatible content.

Add or update the root `README.md` with the exact commands needed to install and run both applications from separate terminals:

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

Document that the frontend runs on the Vite URL and the backend runs on `http://localhost:5000`.

## Required verification

Before finishing, run these checks from the repository root:

```bash
cd frontend && npm install && npm run lint && npm run build
cd ../backend && npm install
node --check server.js
```

Start the backend with `npm run dev` and verify that it starts on the configured port. Confirm that the frontend starts with `npm run dev` and that no missing dependency, Tailwind configuration, environment-variable, or module-format error remains.

At the end, report the folders and files created or changed, the commands verified, any assumptions, and any deferred concerns. Provide one concise git commit message covering all changes.
