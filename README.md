# Leave Management System

A production-ready full-stack Leave Management System for role-based leave tracking, employee requests, admin approvals, policy validation, and leave history reporting.

## Tech Stack

**Frontend**
- React.js with Vite
- TailwindCSS
- shadcn/ui-style components
- Zustand for auth, leave, and notification state
- Axios, React Router, Sonner toasts

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Role-based middleware

## Features

- Login-only authentication with predefined seeded users
- Admin and Employee protected routes
- JWT-based API authorization
- Leave application workflow with Pending, Approved, and Rejected statuses
- Paid leave policy: 25 days per year
- Unpaid leave policy: 12 weeks per year
- Female-only maternity and menstrual leave validation
- Overlap prevention for pending and approved leave requests
- Future/today-only leave application dates
- Admin approval and rejection workflow
- Employee leave history and dashboard
- Admin pending request cards, employee leave dashboard, processed history, and filters
- Notification dots for new admin requests and employee status updates
- UI-only file upload with toast: `This feature is under development`
- Dark/light mode toggle
- Responsive sidebar and cross-device layouts

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    server.js

frontend/
  src/
    assets/
    components/
    hooks/
    pages/
    services/
    store/
    utils/
    App.js
    main.jsx
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/leave_management_system
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SEED_USERS=true
DNS_SERVERS=8.8.8.8,1.1.1.1
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For deployment, set `CLIENT_URL` on the backend to the deployed frontend URL. Multiple origins can be comma-separated.

`DNS_SERVERS` is optional, but useful on local machines where Node cannot resolve MongoDB Atlas `mongodb+srv` records through the default resolver.

In local development, the backend allows `localhost` and `127.0.0.1` frontend origins so Vite can move from `5173` to `5174` when a port is busy. In production, CORS is restricted to `CLIENT_URL`.

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@penthara.ai` | `Admin@123` |
| Employee | `rohan@penthara.ai` | `Rohan@123` |
| Employee | `poulami@penthara.ai` | `Poulami@123` |

`poulami@penthara.ai` is seeded as a female employee and can access maternity and menstrual leave options.

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Start MongoDB locally, then run the backend:

```bash
cd backend
npm run dev
```

The backend automatically seeds the predefined users unless `SEED_USERS=false`.

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Useful Scripts

From the repository root:

```bash
npm run backend:dev
npm run backend:seed
npm run frontend:dev
npm run frontend:build
```

## API Overview

Base URL:

```text
/api
```

Main routes:

- `POST /auth/login`
- `GET /auth/me`
- `POST /leaves`
- `GET /leaves/mine`
- `GET /leaves/summary`
- `DELETE /leaves/:id`
- `GET /admin/leaves`
- `PATCH /admin/leaves/:id/approve`
- `PATCH /admin/leaves/:id/reject`
- `GET /admin/employees/summary`
- `GET /admin/employees/:employeeId/leaves`
- `GET /notifications`
- `PATCH /notifications/employee/read`

## Deployment Notes

**Backend on Render/Railway**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`

**Frontend on Render**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Required environment variable: `VITE_API_BASE_URL`

## Commit Suggestions

Backend:

```bash
git add .
git commit -m "feat(api): add leave management backend"
git push
```

Frontend:

```bash
git add .
git commit -m "feat(client): add leave management frontend"
git push
```

Documentation and setup:

```bash
git add .
git commit -m "docs: add setup and deployment guide"
git push
```
