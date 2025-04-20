#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

WEBSITE_URL="http://localhost:5001"

echo -e "${GREEN}Opening GoX Social Website...${NC}"
echo -e "${YELLOW}URL: ${WEBSITE_URL}${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening in default browser...${NC}"
    xdg-open $WEBSITE_URL
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening in default browser...${NC}"
    open $WEBSITE_URL
else
    echo -e "${YELLOW}Could not automatically open the browser.${NC}"
    echo -e "${YELLOW}Please manually navigate to: ${WEBSITE_URL}${NC}"
fi

echo -e ""
echo -e "${GREEN}Website Features:${NC}"
echo -e "  - ${BLUE}Three-Column Grid Layout:${NC} Posts organized in 3 columns on desktop"
echo -e "  - ${BLUE}Post Options Menu:${NC} Click the three dots (⋯) on any post to access options"
echo -e "  - ${BLUE}Increased Spacing:${NC} Better visual separation between posts"
echo -e ""
echo -e "${YELLOW}Enjoy exploring the GoX Social platform!${NC}" 