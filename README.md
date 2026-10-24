# Cricket Betting App

## Frontend

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Update `vite.config.js`:

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Update `src/index.css`:

```css
@import "tailwindcss";
```

## Backend

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv nodemon
```

Update `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

Run the backend:

```bash
npm run dev
```

## Environment

Copy the example environment files when setting up a new checkout:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Frontend uses `VITE_API_URL` for the backend base URL. Authentication endpoints are available under `/auth`, for example `http://localhost:5000/auth/login`. Backend uses `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SIGNUP_BONUS`, and `ADMIN_EMAIL`. CORS accepts all origins for this local setup.

The committed example files contain placeholders only. Keep local `.env` files uncommitted. Signup transactions require MongoDB Atlas or another MongoDB deployment that supports transactions.
