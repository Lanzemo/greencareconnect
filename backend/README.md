# CareConnect Backend

The backend API for **CareConnect**, a childcare booking platform that connects parents with caregivers and allows users to manage childcare booking requests.

## Overview

CareConnect provides a platform where:

* Parents can create accounts and find caregivers.
* Parents can submit childcare booking requests.
* Caregivers can view and respond to booking requests.
* Users can manage their profiles.
* Authentication and role-based access control protect user-specific features.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt
* REST API

## User Roles

### Parent

Parents can:

* Register and log in
* View their profile
* Browse caregivers
* Book caregivers
* View their bookings
* Track booking status

### Caregiver

Caregivers can:

* Register and log in
* View and manage their profile
* Set their hourly rate
* View incoming booking requests
* Accept, confirm, or cancel booking requests
* Respond to parents' booking requests

## Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── app.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_BACKEND_REPOSITORY_URL>
cd childcare-booking-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use your own MongoDB connection string and JWT secret.

**Do not commit your `.env` file to GitHub.**

### 4. Start the development server

```bash
node src/app.js
```

If nodemon is installed, you can also run:

```bash
npx nodemon src/app.js
```

The API will be available at:

```text
http://localhost:5000
```

## API

The frontend communicates with the backend through the `/api` routes.

Protected requests use JWT bearer authentication:

```text
Authorization: Bearer <token>
```

## Authentication

CareConnect uses JWT-based authentication.

After successful login, the client stores the authentication token and sends it with protected API requests.

Role-based authorization restricts parent and caregiver functionality to the appropriate user role.

## Booking Flow

The general booking flow is:

```text
Parent
  ↓
Browse Caregivers
  ↓
Select Caregiver
  ↓
Submit Booking Request
  ↓
Caregiver Reviews Request
  ↓
Caregiver Responds
  ↓
Booking Status Updated
```

## Development

During local development:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

The React frontend communicates with the backend API through:

```text
http://localhost:5000/api
```

## Security Notes

* Passwords are hashed before being stored.
* JWT authentication is used for protected routes.
* Environment variables are used for sensitive configuration.
* `.env` is excluded from version control.
* `node_modules` is excluded from version control.

## Project Status

CareConnect currently provides the core MVP functionality for parent and caregiver registration, authentication, caregiver discovery, profile management, and childcare booking management.

## Future Improvements

Potential future improvements include:

* Online payment integration
* Email/SMS notifications
* Advanced caregiver search and filtering
* Reviews and ratings
* Improved booking availability management
* Production deployment and monitoring
