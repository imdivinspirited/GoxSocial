#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Grid Layout Updates Applied!${NC}"
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
echo -e "  - ${BLUE}Grid Layout for Posts:${NC} Posts now display in a responsive grid on larger screens"
echo -e "  - ${BLUE}Better Content Layout:${NC} Post content is stretched to fill the available space"
echo -e "  - ${BLUE}Improved Visual Design:${NC} Added hover effects and better spacing"
echo -e "  - ${BLUE}Optimized for Multiple Devices:${NC} Maintains single column on mobile, grid on desktop"
echo -e ""
echo -e "${YELLOW}Try resizing your browser window to see the responsive behavior.${NC}" 