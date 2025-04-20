#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}GoX Social Update: Increased File Size Limits!${NC}"
echo -e "${YELLOW}Express Yourself with Larger Images${NC}"

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
echo -e "${GREEN}New File Size Limits:${NC}"
echo -e ""
echo -e "  ${BLUE}Profile Avatar Images:${NC}"
echo -e "     • INCREASED from 1MB to 5MB maximum size"
echo -e "     • Upload higher quality profile photos"
echo -e "     • Better represent yourself with detailed images"
echo -e "     • Supports JPG, PNG, and GIF formats"
echo -e ""
echo -e "  ${BLUE}Profile Cover Images:${NC}"
echo -e "     • INCREASED from 2MB to 30MB maximum size"
echo -e "     • Upload panoramic travel landscapes"
echo -e "     • Share high-resolution destination photos"
echo -e "     • Showcase your best travel photography"
echo -e ""
echo -e "  ${BLUE}Benefits:${NC}"
echo -e "     • Higher quality images across your profile"
echo -e "     • Better visual storytelling for your travels"
echo -e "     • More details visible in your shared moments"
echo -e "     • Professional-grade photography support"
echo -e ""
echo -e "${YELLOW}Your travel photography deserves to be seen in full quality!${NC}"
echo -e "${YELLOW}Take advantage of these increased limits to showcase your best images.${NC}"
echo -e ""
echo -e "${GREEN}Where to Update Your Images:${NC}"
echo -e "  • Profile Avatar: Settings → Account → Change Avatar"
echo -e "  • Cover Image: Profile Page → Hover over cover area → Change Cover" 