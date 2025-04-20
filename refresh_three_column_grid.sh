#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}3-Column Grid Layout Applied!${NC}"
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

echo -e "${GREEN}Changes include:${NC}"
echo -e "  - ${BLUE}Three-Column Grid:${NC} Posts now display in a clean 3-column layout on large screens"
echo -e "  - ${BLUE}Responsive Design:${NC} 2 columns on medium screens, 3 columns on large screens"
echo -e "  - ${BLUE}Mobile-Friendly:${NC} Single column layout preserved on small screens"
echo -e ""
echo -e "${YELLOW}Try resizing your browser window to see how the layout adapts:${NC}" 
echo -e "  - ${BLUE}Small screens:${NC} 1 post per row"
echo -e "  - ${BLUE}Medium screens (tablet):${NC} 2 posts per row"
echo -e "  - ${BLUE}Large screens (desktop):${NC} 3 posts per row" 