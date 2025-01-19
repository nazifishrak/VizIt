#!/bin/bash

# Navigate to the server directory
echo "Navigating to the server directory..."
cd server || { echo "Server directory not found. Exiting."; exit 1; }

# Activate the virtual environment
echo "Activating the virtual environment..."
source env/bin/activate || { echo "Failed to activate virtual environment. Exiting."; exit 1; }

# Start the backend server using uvicorn
echo "Starting the backend server with uvicorn..."
uvicorn app.main:app --reload &

# Save the PID of the uvicorn process to terminate later if needed
UVICORN_PID=$!

# Navigate to the client directory
echo "Navigating to the client directory..."
cd ../client || { echo "Client directory not found. Exiting."; kill $UVICORN_PID; exit 1; }

# Start the frontend application using npm
echo "Starting the frontend with npm..."
npm start || { echo "Failed to start npm. Exiting."; kill $UVICORN_PID; exit 1; }

# Wait for the user to exit
echo "Press Ctrl+C to stop the project."
wait
