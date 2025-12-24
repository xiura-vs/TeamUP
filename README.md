🚀 MERN Stack Boilerplate (Monorepo)
A production-ready, reusable Full Stack Web Application Boilerplate built with the MERN stack (MongoDB, Express, React, Node.js).

This template is designed to jumpstart future projects by providing pre-built Authentication, Routing, and Database connections out of the box.

✨ Features
🔐 Authentication & Security
JWT Authentication: Secure stateless authentication using JSON Web Tokens.

Bcrypt Hashing: Passwords are never stored in plain text.

Protected Routes: Middleware to protect sensitive backend endpoints.

Frontend Guards: React Higher-Order Components to restrict access to pages based on login status.

👤 User Management
Sign Up & Login: Complete flow with validation.

Forgot Password: Secure token-based password reset flow (with simulation mode).

User Profile: Protected /me endpoint to fetch user data.

🛠 Tech Stack
Frontend: React (Vite), Axios, React Router DOM v6

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Styling: Clean, responsive CSS with a modular structure.

📂 Project Structure
This project follows a Monorepo structure:

Plaintext

mern-boilerplate/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── api.js    # Axios Interceptor config
│   │   ├── pages/    # Login, Signup, Dashboard views
│   │   └── ...
├── server/           # Node.js Backend
│   ├── models/       # Mongoose Schemas (User)
│   ├── routes/       # API Endpoints (Auth)
│   ├── middleware/   # JWT Verification
│   └── ...
└── README.md
🚀 Getting Started
Follow these steps to set up the project locally.

1. Prerequisites
Node.js (v14+)

MongoDB (installed locally or use a MongoDB Atlas URI)

2. Installation
Clone the repository and install dependencies for both Client and Server.

Bash

# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/mern-boilerplate.git my-app

# 2. Install Server Dependencies
cd my-app/server
npm install

# 3. Install Client Dependencies
cd ../client
npm install
3. Environment Setup
You need to create a .env file in the server/ directory.

File: server/.env

Code snippet

PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_boilerplate
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
Note: If you are using MongoDB Atlas, replace the MONGO_URI with your connection string.

4. Running the App
Open two separate terminals.

Terminal 1 (Backend):

Bash

cd server
npm run dev
# Server will start on port 5000 and connect to MongoDB
Terminal 2 (Frontend):

Bash

cd client
npm run dev
# Vite will start the frontend on http://localhost:5173
📧 Password Reset (Simulation Mode)
To avoid needing an email service provider (like SendGrid) during development, the Forgot Password feature runs in Simulation Mode.

Go to the "Forgot Password" page and enter an email.

Check the Terminal 1 (Backend) console logs.

You will see a generated link like: [SIMULATION] Password Reset Link: http://localhost:5173/reset-password?token=xyz...

Copy and paste that link into your browser to reset the password.

📝 License
This project is open source and available under the MIT License.