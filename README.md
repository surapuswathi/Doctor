# Doctor Appointment Booking System

## Overview

Doctor Appointment Booking System is a full-stack MERN application that enables patients to book appointments with doctors online. The platform provides separate interfaces for patients, doctors, and administrators, allowing efficient management of healthcare appointments and user accounts.

## Features

### Patient Features
- User Registration & Login
- View Available Doctors
- Book Appointments
- View Appointment History
- Manage Profile

### Doctor Features
- Doctor Registration & Login
- Manage Profile
- Update Availability
- View Scheduled Appointments
- Track Patient Appointments

### Admin Features
- Manage Users
- Manage Doctors
- Monitor Appointments
- Access Dashboard Statistics

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

text Doctor/ ├── backend/ │   ├── config/ │   ├── controllers/ │   ├── middleware/ │   ├── models/ │   ├── routes/ │   ├── server.js │   └── README.md │ ├── frontend/ │   ├── public/ │   ├── src/ │   │   ├── components/ │   │   ├── pages/ │   │   ├── services/ │   │   └── context/ │   ├── App.jsx │   └── README.md │ └── README.md 

## Installation

### Clone Repository

bash git clone https://github.com/surapuswathi/Doctor.git cd Doctor 

### Backend Setup

bash cd backend npm install 

Create a .env file:

env PORT=5000 MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret 

Start Backend Server:

bash npm start 

### Frontend Setup

bash cd frontend npm install npm run dev 

Frontend will run on:

text http://localhost:5173 

Backend will run on:

text http://localhost:5000 

## API Modules

### Authentication
- User Login
- User Registration
- JWT Authentication

### Doctors
- Doctor Management
- Availability Management
- Doctor Profiles

### Patients
- Patient Profiles
- Appointment Tracking

### Appointments
- Appointment Booking
- Appointment Cancellation
- Appointment History

### Admin
- User Management
- Doctor Management
- Dashboard Analytics

## Future Enhancements

- Online Payment Integration
- Email Notifications
- Video Consultation
- Prescription Management
- Appointment Reminders
- Medical Records Management

## Author

Swathi Kiranmai

GitHub Repository:
https://github.com/surapuswathi/Doctor