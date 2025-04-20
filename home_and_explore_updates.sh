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

echo -e "${GREEN}${BOLD}✨ GoX Social Update: Home & Explore Enhancements! ✨${NC}"
echo -e "${BLUE}We've improved the home and explore sections for a better travel planning experience${NC}"

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
echo -e "  ${CYAN}1. Improved Home Page${NC}"
echo -e "     • ${BOLD}Smoother browsing experience${NC} with hidden scrollbars"
echo -e "     • ${BOLD}Category filters${NC} for Beach, Mountains, City Breaks, Nature, Adventure, and Culture"
echo -e "     • ${BOLD}Matching destinations and experiences${NC} for each category filter"
echo -e "     • ${BOLD}Mobile-optimized horizontal scrolling${NC} for better touch navigation"
echo -e ""
echo -e "  ${PURPLE}2. Enhanced Explore Section${NC}"
echo -e "     • ${BOLD}Advanced location filtering${NC} by country, state/region, and city/area"
echo -e "     • ${BOLD}More travel options${NC} including hotels and various travel services"
echo -e "     • ${BOLD}Tabbed interface${NC} for easy navigation between destinations, experiences, hotels, and services"
echo -e "     • ${BOLD}Hotel search and booking${NC} with amenity listings and detailed information"
echo -e "     • ${BOLD}Travel services${NC} for flights, trains, buses, car rentals, food tours, and activities"
echo -e ""
echo -e "${BLUE}${BOLD}How to Use:${NC}"
echo -e ""
echo -e "  ${GREEN}• Home Page:${NC}"
echo -e "     - Scroll horizontally through categories using the filter buttons at the top"
echo -e "     - Each category shows matching destinations and experiences"
echo -e "     - Swipe or scroll to navigate through items in each section"
echo -e ""
echo -e "  ${GREEN}• Explore Page:${NC}"
echo -e "     - Use the tabs to switch between destinations, experiences, hotels, and services"
echo -e "     - Refine your search with the advanced filters in the sidebar"
echo -e "     - Find location-specific services by filtering down to city level"
echo -e "     - Discover transportation, food, tour and activity options for your chosen destination"
echo -e ""
echo -e "${RED}${BOLD}Pro Tip:${NC} ${YELLOW}Try selecting a country, then state, then city in the Explore page filters to find all available services in that location!${NC}"
echo -e ""
echo -e "${BLUE}We're constantly improving GoX Social based on your feedback.${NC}"
echo -e "${GREEN}Enjoy your enhanced travel planning experience!${NC}" 