# Mama's Kitchen: restaurant ordering demo

React (Vite) + Node/Express + PostgreSQL. Customers order food; staff get a dashboard for revenue, payments, orders (daily and monthly) and menu management.

## Run locally
1. Create a Postgres database, then `copy .env.example .env` (Windows) or `cp .env.example .env` and set `DATABASE_URL`.
2. `npm install && npm --prefix client install`
3. Terminal 1: `npm run dev:server`  (creates tables and seeds 120 days of sample orders on first start)
4. Terminal 2: `npm run dev:client`  → http://localhost:5173
5. Staff dashboard: http://localhost:5173/admin (password = `ADMIN_PASSWORD`, default `admin123`)

Re-seed anytime: `npm run seed`.

## Deploy to Render (one service, simplest)
Push to GitHub → Render → New → Blueprint → select the repo (uses `render.yaml`: free Postgres + web service).
Set `ADMIN_PASSWORD` when asked. The Express server serves the built React app, so no other setup is needed.

## Deploy the frontend on Vercel (optional)
Keep the API on Render. In Vercel, import the repo, set Root Directory to `client`, and add env var `VITE_API_URL` = your Render URL.

## Demo notes
- Card and transfer payments are simulated (marked paid instantly). Plug Paystack or Flutterwave into `POST /api/orders` in `server/index.js`.
- Menu photos use a link field, because Render's free disk is not persistent. Use Cloudinary or S3 for real uploads.
- Currency (₦) is in `client/src/api.js`; menu data is in `server/seed.js`.

## Frontend structure (client/src)
- `pages/` Home (customer shop), `pages/admin/` AdminLogin, AdminLayout, Overview, Orders, MenuManager
- `components/` Navbar, DishCard, CartDrawer, StatCard, Badge, ProtectedRoute
- `hooks/useCart.js` cart logic · `lib/api.js` API helper + money format · `lib/foodImages.js` food photos
- Styling: Tailwind. Brand colours are in `client/tailwind.config.js`; shared button/input/card styles are in `client/src/index.css`.
- Food photos: set per dish in the dashboard (Photo link), or edit `lib/foodImages.js`, or put files in `client/public/food/`.
