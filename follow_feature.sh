#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 GoX Social Update: Enhanced Social Experience! 🚀${NC}"
echo -e "${BLUE}Connect with travelers like never before with our latest features${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening GoX Social in default browser...${NC}"
    xdg-open http://localhost:5001
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening GoX Social in default browser...${NC}"
    open http://localhost:5001
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001${NC}"
fi

echo -e ""
echo -e "${GREEN}🌟 New Features:${NC}"
echo -e ""
echo -e "  ${MAGENTA}1. Enhanced User Profiles${NC}"
echo -e "     • User profiles now appear with every post"
echo -e "     • See who's posting with profile photos and usernames"
echo -e "     • Click on profiles to view detailed user information"
echo -e ""
echo -e "  ${BLUE}2. Follow/Unfollow System${NC}"
echo -e "     • Follow your favorite travelers"
echo -e "     • Get updates from people you follow in your feed"
echo -e "     • Easily unfollow with one click when needed"
echo -e "     • See follower and following counts on profiles"
echo -e ""
echo -e "  ${YELLOW}3. Social Engagement${NC}"
echo -e "     • Connect with like-minded travelers"
echo -e "     • Build your travel community"
echo -e "     • Discover new destinations through your network"
echo -e ""
echo -e "${BLUE}How to Use:${NC}"
echo -e "  • ${GREEN}Following Users:${NC}"
echo -e "    1. Find a post from a user you want to follow"
echo -e "    2. Click the 'Follow' button next to their name"
echo -e "    3. You can also follow users from their profile page"
echo -e ""
echo -e "  • ${GREEN}Managing Your Connections:${NC}"
echo -e "    1. Visit your own profile to see your follower stats"
echo -e "    2. You can unfollow a user at any time by clicking 'Unfollow'"
echo -e ""
echo -e "${YELLOW}We're constantly improving GoX Social to provide the best travel community experience!${NC}"
echo -e "${GREEN}Try following some users now to enhance your feed.${NC}" 