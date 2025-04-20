#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}New Features Added to GoX Social!${NC}"
echo -e "${YELLOW}Refresh your browser to see the changes.${NC}"

# Try to detect the OS and refresh the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening in default browser...${NC}"
    xdg-open http://localhost:5001
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening in default browser...${NC}"
    open http://localhost:5001
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001${NC}"
fi

echo -e ""
echo -e "${GREEN}New Features:${NC}"
echo -e ""
echo -e "  ${BLUE}1. Image Adjustment Tool${NC}"
echo -e "     - Click the crop icon on image previews before posting"
echo -e "     - Adjust and position your photos exactly how you want them"
echo -e "     - Zoom in/out to focus on specific parts of the image"
echo -e "     - Rotate images to correct orientation"
echo -e ""
echo -e "  ${BLUE}2. Improved Post Deletion${NC}"
echo -e "     - Post deletion now works properly"
echo -e "     - Click the three dots (⋯) on any of your posts"
echo -e "     - Select 'Delete post' from the menu"
echo -e "     - Posts are now immediately removed from the feed"
echo -e ""
echo -e "${YELLOW}Try creating a post with images and adjust them before posting!${NC}"
echo -e "${YELLOW}You can now also properly delete your own posts using the menu options.${NC}" 