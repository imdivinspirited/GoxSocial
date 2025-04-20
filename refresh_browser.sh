#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}CSS updates applied!${NC}"
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
echo -e "  - Limited post width on larger screens"
echo -e "  - Better image sizing and aspect ratios"
echo -e "  - Improved content layout for readability"
echo -e "  - Centered content for better viewing experience" 