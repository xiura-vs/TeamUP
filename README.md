# TeamUP - Team Finder Platform

TeamUP is a full-stack web application designed to help students and developers find compatible teammates for hackathons, college projects, and startup ideas. It solves the problem of finding the right people by connecting users based on their skills and interests.

The project is built using the MERN stack (MongoDB, Express, React, Node.js) and features a complete authentication system, a modern landing page with a hackathon hub, and a dashboard infrastructure.

## Features

**Core Platform**
* **Smart Matching UI:** A visual interface that helps users find teammates with complementary skills (e.g., matching a React developer with a Python/ML engineer).
* **Hackathon Hub:** A dedicated section displaying live and upcoming hackathons with details like dates, tags, and participant counts.
* **Modern Interface:** A fully responsive design featuring glass-morphism effects, smooth animations, and a clean user experience.

**Authentication & Security**
* **Secure Login & Signup:** Full authentication flow using JSON Web Tokens (JWT).
* **Password Management:** Includes a secure forgot/reset password flow via email simulation.
* **Protected Routes:** Backend middleware and frontend route guards ensure only authenticated users can access the dashboard.
* **Data Security:** Passwords are hashed using Bcrypt before storage.

## Tech Stack

* **Frontend:** React (Vite), Axios, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose)
* **Styling:** Custom CSS with modern design variables

## Project Structure

The project is organized as a monorepo containing both the client and server code:

* **client/**: Contains the React frontend application, including pages for Home, Login, Signup, and Dashboard.
* **server/**: Contains the Node.js/Express backend API, database models, and authentication logic.

## Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites
Make sure you have Node.js installed. You will also need a MongoDB connection string (either a local instance or a cloud database like MongoDB Atlas).

### 2. Installation
You need to install dependencies for both the frontend and the backend.

First, clone the repository:
git clone https://github.com/GreXinja/TeamUP
cd dream-team-platform

Then, install the server dependencies:
cd server
npm install

Finally, install the client dependencies:
cd ../client
npm install

### 3. Environment Configuration
Create a file named .env inside the server directory. You can copy the structure below:

PORT=5000
MONGO_URI=mongodb://localhost:27017/teamup_db
JWT_SECRET=enter_a_secure_random_string_here
CLIENT_URL=http://localhost:5173

Note: Replace the MONGO_URI with your actual connection string if you are not using a local database.

### 4. Running the Application
You need to run the backend and frontend in separate terminals.

**Terminal 1 (Backend)**
Navigate to the server folder and run:
npm run dev

**Terminal 2 (Frontend)**
Navigate to the client folder and run:
npm run dev

The frontend will launch at http://localhost:5173.

## Password Reset (Development Mode)
To make development easier, the forgot password feature runs in a simulation mode. You do not need an actual email service provider to test it.

1. Go to the Forgot Password page and submit an email address.
2. Check your backend terminal (Terminal 1).
3. You will see a log entry labeled "[SIMULATION] Password Reset Link".
4. Copy that link and paste it into your browser to reset the password.

## License
This project is open source and available under the MIT License.
