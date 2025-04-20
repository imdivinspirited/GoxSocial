#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}New Feature Added to GoX Social!${NC}"
echo -e "${YELLOW}Instagram-Style Grid Layout for Profile Posts${NC}"

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
echo -e "${GREEN}Instagram-Style Grid Layout Features:${NC}"
echo -e ""
echo -e "  ${BLUE}Enhanced Profile Layout:${NC}"
echo -e "     • 4 posts per row on desktop screens"
echo -e "     • 5 posts per row on extra large screens"
echo -e "     • Responsive down to mobile devices"
echo -e "     • Consistent square aspect ratio for all posts"
echo -e ""
echo -e "  ${BLUE}Interactive Elements:${NC}"
echo -e "     • Hover effects show post stats"
echo -e "     • Clean, minimalist presentation"
echo -e "     • Focused on visual content"
echo -e "     • Text posts supported with preview"
echo -e ""
echo -e "  ${BLUE}Organized Content:${NC}"
echo -e "     • Posts tab shows all content in grid format"
echo -e "     • Photos tab shows only image posts"
echo -e "     • Same grid layout across all tabs for consistency"
echo -e ""
echo -e "${YELLOW}Your profile now presents content in a visually appealing grid layout,${NC}"
echo -e "${YELLOW}similar to popular social media platforms like Instagram!${NC}"
echo -e ""
echo -e "${GREEN}Try It Out:${NC}"
echo -e "  1. Create several posts with images to see the grid in action"
echo -e "  2. Switch between tabs to see organized content"
echo -e "  3. Hover over posts to see engagement stats"
echo -e "  4. Resize your browser to see the responsive layout" 