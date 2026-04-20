# Leave Management System

A production-ready full-stack Leave Management System for role-based leave tracking, employee requests, admin approvals, policy validation, and leave history reporting.

## Live Project Link

https://leave-management-system-1-iooo.onrender.com/

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

- Login-only authentication with predefined seeded users(only for demonstration purpose)
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
MONGO_URI=mongodb://127.0.0.1:27017/leave_management_system  {or your own MongoDB URI}
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

In local development, the backend allows `localhost` and `127.0.0.1` frontend origins so Vite can move from `5173` to `5174` when a port is busy. In production, CORS is restricted to `CLIENT_URL`.

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@penthara.ai` | `Admin@123` |
| Employee (Male) | `rohan@penthara.ai` | `Rohan@123` |
| Employee (Female) | `poulami@penthara.ai` | `Poulami@123` |

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

This repository now includes a root [`render.yaml`](./render.yaml) Blueprint for Render.

### Render Blueprint

The Blueprint creates:

- `leave-management-system-api` as a Node web service
- `leave-management-system-web` as a static site

The Blueprint already includes:

- backend health check path: `/api/health`
- frontend SPA rewrite: `/* -> /index.html`
- production backend host binding on `0.0.0.0`

One still need to provide values for:

- `MONGO_URI`
- `CLIENT_URL`
- `VITE_API_BASE_URL`

`JWT_SECRET` is generated automatically by the Blueprint.

## Screenshots 

- Login Page (Role-based Login)
  <br>
  <br><img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/edab44d5-9cd5-44de-b177-b5b43a49fef8" /><br>

- Admin's Leave Request Section
  <br>
  <br><img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/6ee0b03c-b6df-42e3-af54-35eaa663f371" /><br>

- Admin side Employee Dashboard
  <br>
  <br><img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/77b1d30f-a21a-4c21-9a94-917a4f4ea4f9" /><br>

- Admin Side Leave History
  <br>
  <br><img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/6e984627-3944-4739-9ec6-ab8c9a55540d" /><br>

- Employee's Leave Dashboard
  <br>
  <br><img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/b6cc79f1-7977-45b7-a10f-c1c45e4ff850" /><br>

- Employee's Leave Application Form
  <br>
  <br><img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/647efd36-1ab6-4e31-b9f9-7f8c683062b8" /><br>

- Employee's Leave History
  <br>
  <br><img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/12afaea7-2bfe-4d20-a204-3ca89232903d" /><br>

- Female Employee Leave Dashboard
  <br>
  <br><img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/4cc849d1-6bc6-4d3c-bb2e-3e12d9596eed" /><br>

- Light Mode
  <br>
  <br><img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/12588907-11a2-4625-a4f2-a24b85e61a17" /><br>
  <br><img width="1915" height="959" alt="image" src="https://github.com/user-attachments/assets/84614adb-828b-45bd-8d9e-de1241641618" /><br>

  ## Video Demo
  <div align="center">
  <a href="https://drive.google.com/file/d/1YK9Nak7IplpwXqtv8QUrq7l51DYEh0hk/view?usp=sharing">
    <img src="https://github.com/royrohan1437/Leave_management_system/blob/3bc86f051f1e4b305049ab88b4e49084954a8b44/frontend/src/assets/_thumbnail.png?raw=true" alt="Leave Management System Demo" width="800">
  </a>
  <p><b> Assignment Demo Video</b></p>
</div>


