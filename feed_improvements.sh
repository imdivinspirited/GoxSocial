#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${GREEN}${BOLD}✨ GoX Social Update: Feed & Notifications Improvements! ✨${NC}"
echo -e "${BLUE}We've enhanced the social feed and notifications for a better experience${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening GoX Social in your default browser...${NC}"
    xdg-open http://localhost:5001
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening GoX Social in your default browser...${NC}"
    open http://localhost:5001
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001${NC}"
fi

echo -e ""
echo -e "${GREEN}${BOLD}🌟 What's New:${NC}"
echo -e ""
echo -e "  ${CYAN}1. Enhanced Social Feed${NC}"
echo -e "     • ${BOLD}Fixed profile pictures${NC} and usernames in newly created posts"
echo -e "     • ${BOLD}Added follow/unfollow buttons${NC} for all user posts"
echo -e "     • ${BOLD}Posts are now sorted${NC} with newest at the top"
echo -e "     • ${BOLD}Improved refresh button${NC} with loading indicators"
echo -e ""
echo -e "  ${CYAN}2. Notification Improvements${NC}"
echo -e "     • ${BOLD}Added refresh functionality${NC} to notifications page"
echo -e "     • ${BOLD}Notifications are sorted${NC} with newest first"
echo -e "     • ${BOLD}Added visual loading indicators${NC} when refreshing"
echo -e "     • ${BOLD}Improved 'Mark All as Read'${NC} functionality"
echo -e ""
echo -e "${BLUE}${BOLD}How to Use:${NC}"
echo -e ""
echo -e "  ${GREEN}• Home Feed:${NC}"
echo -e "     - Create a new post and see your profile picture appear instantly"
echo -e "     - Click the ${YELLOW}Refresh Posts${NC} button at the bottom to get the latest content"
echo -e "     - Use the follow/unfollow buttons to manage your connections"
echo -e ""
echo -e "  ${GREEN}• Notifications:${NC}"
echo -e "     - Click the ${YELLOW}Refresh${NC} button to check for new notifications"
echo -e "     - Use the ${YELLOW}Mark All as Read${NC} button to clear unread indicators"
echo -e "     - Filter notifications using the tabs or sidebar options"
echo -e ""
echo -e "${RED}${BOLD}Pro Tip:${NC} ${YELLOW}The refresh button now sorts content with newest posts first, making it easier to see what's new!${NC}"
echo -e ""
echo -e "${BLUE}We're constantly improving GoX Social based on your feedback.${NC}"
echo -e "${GREEN}Enjoy your enhanced social experience!${NC}" 