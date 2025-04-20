#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Increased Post Spacing Applied!${NC}"
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

echo -e "${GREEN}Spacing Changes include:${NC}"
echo -e "  - ${BLUE}Increased Grid Gap:${NC} More space between posts in the grid (3rem on desktop, 2.5rem on tablets)"
echo -e "  - ${BLUE}Improved Post Card Padding:${NC} Added 1.5rem padding inside each post card"
echo -e "  - ${BLUE}Better Content Spacing:${NC} More spacing between different sections within posts"
echo -e "  - ${BLUE}Consistent Post Card Styling:${NC} Standardized margins and padding across all post cards"
echo -e ""
echo -e "${YELLOW}The increased spacing provides better visual separation between posts and improves readability.${NC}" 