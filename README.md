
# Distributed KanBan System

This is a Kanban board system built with MERN stack. 
The backend is split into two microservices, "auth-service" and "board-service".

auth-service is responsible for the user authentication as well as authorization. 
board-service handles the board maintenance.

The two services communicate with each other with REST APIs.

### Example workflow of the system
The steps are numbered from 1-
![workflow drawio(1)](https://github.com/user-attachments/assets/8dfba7ac-2cbc-441c-8f97-b76238ae92e2)



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

Install front-end dependencies

	cd client
	npm install

Install back-end dependencies

	cd ../auth-service
	npm install
 	cd ../board-service
  	npm install

### 3. **Set Up Environment Variables**

Create  .env file in the client directory with the following content:

	VITE_GOOGLE_CLIENT_ID = your_google_client_id
 	VITE_BOARD_SERVICE_URL = http://localhost:5000
	VITE_AUTH_SERVICE_URL = http://localhost:4000

Create .env file in the auth-service directory with the following content: 

 	PORT = 4000
	MONGODB_URI = your_mongodb_connection_string
	JWT_SECRET = your_jwt_secret
	GOOGLE_CLIENT_ID = your_google_client_id
	GOOGLE_CLIENT_SECRET = your_google_client_secret
	GOOGLE_CALLBACK_URL = http://localhost:3000/user/auth/google/callback

Create .env file in the board-service directory with the following content: 

 	PORT = 5000
	MONGODB_URI = mongodb://localhost:27017/kanban

4. **Run the project**

Navigate to the root folder and “npm run start”. This will start the client, auth-service and board-service concurrently

## User manual

https://docs.google.com/document/d/1o-tMQymdOserdS7oSwS2K58ISiGjOKIakgNh8V27CYA/edit?usp=sharing
