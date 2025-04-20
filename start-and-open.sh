#!/bin/bash

# Start the server in the background
NODE_ENV=production node dist/index.js &
SERVER_PID=$!

# Wait a bit for the server to start
sleep 3

# Open the website in browser
bash ./open_website.sh

# Wait for user to press Ctrl+C
echo "Server is running. Press Ctrl+C to stop."
wait $SERVER_PID 