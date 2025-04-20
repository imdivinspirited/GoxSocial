#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${GREEN}${BOLD}✨ GoX Social Update: Explore Page Data Enhancement! ✨${NC}"
echo -e "${BLUE}We've significantly expanded the explore page data for a more comprehensive travel planning experience${NC}"

# Try to detect the OS and open the browser accordingly
if command -v xdg-open &> /dev/null; then
    # Linux - Open with default browser
    echo -e "${BLUE}Opening GoX Social in your default browser...${NC}"
    xdg-open http://localhost:5001/explore
elif command -v open &> /dev/null; then
    # macOS - Open with default browser
    echo -e "${BLUE}Opening GoX Social in your default browser...${NC}"
    open http://localhost:5001/explore
else
    echo -e "${YELLOW}Please manually navigate to: http://localhost:5001/explore${NC}"
fi

echo -e ""
echo -e "${GREEN}${BOLD}🌟 What's New:${NC}"
echo -e ""
echo -e "  ${CYAN}1. Expanded Global Coverage${NC}"
echo -e "     • ${BOLD}40+ countries${NC} from all continents now available"
echo -e "     • ${BOLD}Detailed location hierarchy${NC} with countries, states/regions, and cities"
echo -e "     • ${BOLD}Enhanced city data${NC} with hundreds of destinations worldwide"
echo -e "     • ${BOLD}More specific filtering options${NC} for finding exact locations"
echo -e ""
echo -e "  ${PURPLE}2. Extensive Hotel Collection${NC}"
echo -e "     • ${BOLD}Added 12 new luxury hotels${NC} (18 total) across various destinations"
echo -e "     • ${BOLD}Diverse accommodation types${NC} including beachfront resorts, city hotels, desert camps, and more"
echo -e "     • ${BOLD}Authentic cultural stays${NC} like Japanese ryokans, Moroccan riads, and Alpine chalets"
echo -e "     • ${BOLD}Detailed amenity listings${NC} for each property to help with decision making"
echo -e ""
echo -e "  ${BLUE}3. Comprehensive Travel Services${NC}"
echo -e "     • ${BOLD}Added 15 new service providers${NC} (25 total) across all categories"
echo -e "     • ${BOLD}Enhanced transportation options${NC} with premium airlines, luxury trains, and specialty vehicles"
echo -e "     • ${BOLD}Expanded activity offerings${NC} including cultural workshops, extreme sports, and helicopter tours"
echo -e "     • ${BOLD}More food experiences${NC} including farm-to-table, street food tours, and dining cruises"
echo -e ""
echo -e "${YELLOW}${BOLD}How To Use:${NC}"
echo -e ""
echo -e "  ${GREEN}• Try the improved filters:${NC}"
echo -e "     - Select a country to see its states/regions"
echo -e "     - Select a state/region to see its cities"
echo -e "     - Filter by rating and price range for more specific results"
echo -e ""
echo -e "  ${GREEN}• Explore new tabs:${NC}"
echo -e "     - Check the Hotels tab for luxury and boutique accommodations worldwide"
echo -e "     - Visit the Travel Services tab to discover activities and transportation options"
echo -e ""
echo -e "${RED}${BOLD}Pro Tip:${NC} ${YELLOW}Try searching for specific hotels like 'Ryokan' (Japan), 'Safari Lodge' (South Africa), or 'Desert Camp' (UAE) to discover unique accommodations!${NC}"
echo -e ""
echo -e "${BLUE}We're constantly improving GoX Social based on your feedback.${NC}"
echo -e "${GREEN}Enjoy your enhanced travel planning experience!${NC}" 