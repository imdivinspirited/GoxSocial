#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Post Options Menu Added!${NC}"
echo -e "${YELLOW}Refresh your browser to see the changes.${NC}"

# Try to detect the OS and refresh the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Just prompt the user to refresh manually
    echo -e "${YELLOW}Please refresh your browser manually to see the changes.${NC}"
elif command -v osascript &> /dev/null; then
    # macOS - Use AppleScript to refresh Safari or Chrome
    echo -e "${YELLOW}Attempting to refresh your browser...${NC}"
    osascript -e 'tell application "Safari" to tell its first document to set its URL to (get its URL)'
    osascript -e 'tell application "Google Chrome" to tell its first window to reload'
else
    echo -e "${YELLOW}Please refresh your browser manually to see the changes.${NC}"
fi

echo -e "${GREEN}New Post Options Menu Features:${NC}"
echo -e "  - ${BLUE}Click the three dots (⋯) on any post to open the options menu${NC}"
echo -e "  - ${BLUE}For your own posts:${NC} Delete post option is available"
echo -e "  - ${BLUE}For other users' posts:${NC} Block user and Report post options"
echo -e "  - ${BLUE}For all posts:${NC} Copy link option to share posts"
echo -e ""
echo -e "${YELLOW}The dropdown menu provides a clean way to access additional post actions.${NC}" 