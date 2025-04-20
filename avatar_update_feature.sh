#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}New Feature Added to GoX Social!${NC}"
echo -e "${YELLOW}Profile Picture Update in Settings${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening Settings page in default browser...${NC}"
    xdg-open http://localhost:5001/settings
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening Settings page in default browser...${NC}"
    open http://localhost:5001/settings
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001/settings${NC}"
fi

echo -e ""
echo -e "${GREEN}Profile Picture Update Feature:${NC}"
echo -e ""
echo -e "  ${BLUE}How to Change Your Avatar:${NC}"
echo -e "     1. Navigate to the Settings page"
echo -e "     2. Click 'Change Avatar' button in the Account tab"
echo -e "     3. Select an image file from your computer (JPG, PNG, GIF)"
echo -e "     4. Your new profile picture will be immediately applied"
echo -e ""
echo -e "  ${BLUE}Feature Details:${NC}"
echo -e "     - Maximum file size: 1MB"
echo -e "     - Supported formats: JPG, PNG, GIF"
echo -e "     - Your avatar appears in posts, comments, and your profile"
echo -e "     - No cropping needed - select exactly the image you want"
echo -e ""
echo -e "${YELLOW}Personalize your GoX Social experience with a custom avatar that represents you!${NC}"
echo -e ""
echo -e "${GREEN}Quick Access:${NC}"
echo -e "  Settings page: http://localhost:5001/settings"
echo -e "  Profile page: http://localhost:5001/profile" 