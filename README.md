# Healix

Healix is a full-stack telemedicine web application that connects patients and doctors through appointment booking, video consultations, and digital prescriptions.

The project includes a React frontend, an Express backend, MongoDB data storage, JWT authentication, and Jitsi-powered video meetings.

## Features

- Patient and doctor registration
- Secure login with JWT authentication
- Role-based dashboards for patients and doctors
- Doctor directory with search and specialization filters
- Appointment booking with date and time selection
- Doctor approval flow for appointment requests
- Video consultations using Jitsi Meet
- Appointment status tracking: pending, approved, live, completed, cancelled
- Digital prescription creation by doctors
- Patient prescription history
- Prescription download as image or PDF
- Responsive frontend for desktop and mobile screens

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Jitsi React SDK
- html2canvas
- jsPDF

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
Healix-main/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── vercel.json
└── README.md
```

## Getting Started

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB database

## Backend Setup

Go to the backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

For local development, the frontend automatically uses:

```text
http://localhost:5000/api
```

If you want to point the frontend to a deployed backend, create a `.env` file inside `Frontend`:

```env
VITE_API_URL=https://your-backend-url.com
```

Start the frontend:

```bash
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## Main User Flow

1. Register a doctor account.
2. Register a patient account.
3. Log in as the patient.
4. Browse doctors.
5. Book an appointment.
6. Log in as the doctor.
7. Approve the appointment.
8. Start or join the video consultation.
9. End the consultation.
10. Create a prescription.
11. Log in as the patient and view prescriptions.

## API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/doctors
GET  /api/auth/profile
```

### Appointments

```text
POST /api/appointments
GET  /api/appointments/doctor
GET  /api/appointments/patient
PUT  /api/appointments/approve/:id
PUT  /api/appointments/start/:id
PUT  /api/appointments/end/:id
```

### Prescriptions

```text
POST /api/prescriptions
GET  /api/prescriptions/patient
```

### Consultations

```text
POST /api/consultations
GET  /api/consultations/:id
```

## Build

To build the frontend for production:

```bash
cd Frontend
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Deployment Notes

The root `vercel.json` is configured to build the frontend from the `Frontend` folder and rewrite API requests to the deployed backend.

For deployment, remember to configure environment variables in your hosting platforms:

Backend:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend:

```env
VITE_API_URL=https://your-backend-url.com
```

## Security Notes

- Do not commit `.env` files.
- Keep `JWT_SECRET` private.
- Keep MongoDB credentials private.
- Use strong passwords for database users.
- Add production CORS origins carefully.

## Author

Created by SriRama Bonthu.
