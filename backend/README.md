# Doctor Appointment Backend

## Overview
This is the backend service for the Doctor Appointment Booking System. It provides REST APIs for authentication, doctor management, patient management, appointment booking, and admin operations.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Features
- User Registration & Login
- Doctor Registration & Login
- Patient Management
- Appointment Booking
- Appointment Cancellation
- Admin Dashboard APIs
- Secure Authentication using JWT

## Installation

npm install 
npm start 

## Environment Variables

Create a .env file in the backend directory:

env PORT=5000 MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret 

## API Endpoints

### Authentication
- POST /auth/register
- POST /auth/login

### Doctors
- GET /doctors
- GET /doctors/:id

### Appointments
- POST /appointments
- GET /appointments
- DELETE /appointments/:id
:::  Then save the file and push it: bash
git add backend/README.md
git commit -m "Add backend README"
git push
```

After refreshing GitHub, opening the backend folder will show a nicely formatted backend documentation page.