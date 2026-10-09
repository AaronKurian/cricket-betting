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
