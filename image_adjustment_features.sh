#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${GREEN}✨ New Features Added to GoX Social! ✨${NC}"
echo -e "${YELLOW}Image Adjustment Tools & Profile Improvements${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening Profile page in default browser...${NC}"
    xdg-open http://localhost:5001/profile
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening Profile page in default browser...${NC}"
    open http://localhost:5001/profile
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001/profile${NC}"
fi

echo -e ""
echo -e "${GREEN}Profile Improvements:${NC}"
echo -e ""
echo -e "  ${BLUE}1. Better Visibility for Profile Names${NC}"
echo -e "     • Your name and username now appear clearly over cover images"
echo -e "     • Added gradient overlay for improved readability"
echo -e "     • No more hidden profile information!"
echo -e ""
echo -e "  ${MAGENTA}2. Image Adjustment Tools${NC}"
echo -e "     • Crop, zoom, and rotate your profile and cover images"
echo -e "     • Fine-tune how your photos appear on your profile"
echo -e "     • Available for both new uploads and existing images"
echo -e ""
echo -e "  ${BLUE}How to Use:${NC}"
echo -e "     • ${YELLOW}For Profile Pictures:${NC}"
echo -e "       - Hover over your profile picture to see the crop tool icon"
echo -e "       - Click the icon to open the adjustment interface"
echo -e "       - Zoom, rotate, and position your photo as desired"
echo -e "       - Click 'Apply' to save your changes"
echo -e ""
echo -e "     • ${YELLOW}For Cover Images:${NC}"
echo -e "       - Hover over your cover image to reveal the 'Adjust Cover' button"
echo -e "       - Use the adjustment interface to perfect your cover image"
echo -e "       - Apply changes when you're satisfied with the result"
echo -e ""
echo -e "  ${BLUE}Benefits:${NC}"
echo -e "     • Perfect presentation of your travel photos"
echo -e "     • Focus on the most important parts of your images"
echo -e "     • Consistent, professional-looking profile"
echo -e "     • Full control over how your photos appear"
echo -e ""
echo -e "${GREEN}Try the new image adjustment tools today!${NC}"
echo -e "${YELLOW}Customize your profile to show the world your best travel moments.${NC}" 