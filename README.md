Github Link:
https://github.com/OskarSan/kanban


Link for the project documentation docs:
https://docs.google.com/document/d/1Oq7tz8XcPaLkwwmJpHKAkU7TjbUbdFjEsBREsLTuFFI/edit?usp=sharing



# Kanban Project

This project is a Kanban board application built with React, TypeScript, and Vite for the client, and Express, TypeScript, and MongoDB for the server.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Installation

### 1. **Clone the Repository**

### 2. **Install dependencies**

install project dependencies

	npm install

Install client dependencies

	cd client
	npm install

Install server dependencies

	cd ../server
	npm install

### 3. **Set Up Environment Variables**

Create  .env file in the client directory with the following content:

	VITE_API_URL = http://localhost:3000

Create .env file in the server directory with the following content: 
	
	PORT=3000
	MONGODB_URI = your_mongodb_connection_string
	JWT_SECRET = your_jwt_secret
	GOOGLE_CLIENT_ID = your_google_client_id
	GOOGLE_CLIENT_SECRET = your_google_client_secret
	GOOGLE_CALLBACK_URL = http://localhost:3000/user/auth/google/callback


4. **Run the project**

Navigate to the root folder and “npm run start”. This will start the clien and server concurrently

## User manual

https://docs.google.com/document/d/1o-tMQymdOserdS7oSwS2K58ISiGjOKIakgNh8V27CYA/edit?usp=sharing
