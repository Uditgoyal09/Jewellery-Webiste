Ganesh Jewellers is now split into two clean apps:

- `frontend/` for the React UI
- `backend/` for the Node.js + Express + MongoDB API

The backend now follows an MVC structure:

- `backend/src/models`
- `backend/src/controllers`
- `backend/src/routes`
- `backend/src/middleware`
- `backend/src/config`

Single-port setup:

- The frontend is built into `frontend/dist`
- The backend serves that build and all `/api` routes on the same port
- Open the app from `http://localhost:5000`

Run it:

1. Create `backend/.env` from `backend/.env.example`
2. Set your real `MONGODB_URI` and `JWT_SECRET`
3. Install backend packages: `npm install --prefix backend`
4. Install frontend packages if needed: `npm install --prefix frontend`
5. Build the frontend once: `npm run frontend:build`
6. Start the app on one port: `npm run backend:dev`

Optional while changing UI:

- Run `npm run frontend:watch` in a second terminal to rebuild frontend files automatically
- Keep using `npm run backend:dev` for the single running app port
