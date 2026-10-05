# CareConnect Frontend

The frontend application for **CareConnect**, a childcare booking platform that connects parents with caregivers and provides tools for managing childcare booking requests.

## Overview

CareConnect provides a user-friendly web interface where:

* Parents can register and log in.
* Parents can browse available caregivers.
* Parents can submit childcare booking requests.
* Parents can view and manage their bookings.
* Caregivers can manage their profiles.
* Caregivers can view and respond to booking requests.
* Role-based navigation provides the appropriate experience for parents and caregivers.

## Tech Stack

* React
* Vite
* React Router
* Axios
* JavaScript
* CSS

## User Roles

### Parent

Parents can:

* Register and log in
* Browse caregivers
* View caregiver profiles
* Book caregivers
* View booking history
* Track booking status
* Manage their account

### Caregiver

Caregivers can:

* Register and log in
* View and manage their profile
* Set their hourly rate
* View incoming booking requests
* Respond to booking requests
* Manage booking status

## Application Pages

### Public Pages

* Home
* About
* Login
* Register

### Parent Pages

* Parent Dashboard
* Find Caregivers
* Book Caregiver
* My Bookings

### Caregiver Pages

* Caregiver Dashboard
* My Bookings
* Profile

## Project Structure

```text id="v1k4pz"
src/
├── assets/
├── components/
│   ├── auth/
│   ├── booking/
│   ├── caregiver/
│   └── common/
├── context/
├── pages/
│   ├── public/
│   ├── parent/
│   └── caregiver/
├── services/
│   ├── api.js
│   └── ...
├── utils/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Getting Started

### 1. Clone the repository

```bash id="0wq8hf"
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd childcare-booking-frontend
```

### 2. Install dependencies

```bash id="7w3x5p"
npm install
```

### 3. Start the development server

```bash id="az9x5b"
npm run dev
```

The frontend will normally be available at:

```text id="z9e6mm"
http://localhost:5173
```

## Backend Connection

The frontend communicates with the CareConnect backend API.

During local development, the backend runs on:

```text id="p9uh2k"
http://localhost:5000
```

The API base URL is:

```text id="8d3d6k"
http://localhost:5000/api
```

The backend repository contains the API, authentication, database, and booking logic required by the frontend.

## Authentication

The application uses JWT-based authentication.

After login, the authentication token is stored locally and automatically included in protected API requests.

Role-based protected routes ensure that parent and caregiver pages are accessible only to the appropriate user role.

## Main Features

* User registration and login
* JWT authentication
* Role-based access control
* Caregiver discovery
* Caregiver profiles
* Childcare booking requests
* Booking management
* Booking status updates
* Loading states
* User-friendly error handling
* Responsive application interface

## Available Scripts

### Development

```bash id="n6y0ua"
npm run dev
```

### Build

```bash id="2v4yit"
npm run build
```

### Lint

```bash id="9d1wqj"
npm run lint
```

### Preview Production Build

```bash id="3x9n8z"
npm run preview
```

## Project Status

CareConnect currently provides the core MVP functionality for connecting parents with caregivers and managing childcare booking requests.

## Future Improvements

Potential future improvements include:

* Online payment integration
* Reviews and ratings
* Advanced caregiver search and filtering
* Notifications
* Improved caregiver availability management
* Production deployment
