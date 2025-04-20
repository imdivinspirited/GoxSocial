// Types
export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  country: string;
  state: string;
  city: string;
  location: string;
  amenities: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  type: 'flight' | 'train' | 'bus' | 'car' | 'tour' | 'food' | 'activity';
}

// Countries - Expanded list with countries from all continents
export const countries = [
  "All Countries",
  // North America
  "United States",
  "Canada",
  "Mexico",
  // South America
  "Brazil",
  "Argentina",
  "Peru",
  "Colombia",
  "Chile",
  // Europe
  "United Kingdom",
  "France",
  "Italy",
  "Spain",
  "Germany",
  "Netherlands",
  "Switzerland",
  "Greece",
  "Portugal",
  "Sweden",
  "Norway",
  "Denmark",
  "Ireland",
  "Belgium",
  "Austria",
  // Asia
  "Japan",
  "China",
  "India",
  "Thailand",
  "Vietnam",
  "Singapore",
  "South Korea",
  "Indonesia",
  "Malaysia",
  "Philippines",
  "Turkey",
  "United Arab Emirates",
  // Oceania
  "Australia",
  "New Zealand",
  "Fiji",
  // Africa
  "South Africa",
  "Morocco",
  "Egypt",
  "Kenya",
  "Tanzania",
  "Nigeria"
];

// States/Regions by Country - Added more states for existing countries and added states for new countries
export const states: Record<string, string[]> = {
  "All Countries": ["All States"],
  "United States": [
    "All States",
    "California",
    "Florida",
    "New York",
    "Texas",
    "Colorado",
    "Hawaii",
    "Nevada",
    "Washington",
    "Oregon",
    "Arizona",
    "Massachusetts",
    "Illinois",
    "Georgia",
    "Louisiana"
  ],
  "Canada": [
    "All States",
    "British Columbia",
    "Ontario",
    "Quebec",
    "Alberta",
    "Nova Scotia",
    "Manitoba",
    "Saskatchewan",
    "Newfoundland and Labrador"
  ],
  "Mexico": [
    "All States",
    "Quintana Roo",
    "Jalisco",
    "Baja California",
    "Yucatan",
    "Mexico City",
    "Oaxaca"
  ],
  "Brazil": [
    "All States",
    "Rio de Janeiro",
    "São Paulo",
    "Bahia",
    "Amazonas",
    "Pernambuco"
  ],
  "Argentina": [
    "All States",
    "Buenos Aires",
    "Mendoza",
    "Cordoba",
    "Patagonia"
  ],
  "United Kingdom": [
    "All States",
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland"
  ],
  "France": [
    "All States",
    "Île-de-France",
    "Provence-Alpes-Côte d'Azur",
    "Normandy",
    "Brittany",
    "Alsace",
    "Burgundy",
    "Loire Valley"
  ],
  "Italy": [
    "All States",
    "Tuscany",
    "Lazio",
    "Lombardy",
    "Sicily",
    "Veneto",
    "Campania",
    "Sardinia",
    "Puglia"
  ],
  "Spain": [
    "All States",
    "Catalonia",
    "Andalusia",
    "Madrid",
    "Valencia",
    "Balearic Islands",
    "Canary Islands",
    "Basque Country"
  ],
  "Germany": [
    "All States",
    "Bavaria",
    "Berlin",
    "Baden-Württemberg",
    "Hamburg",
    "Saxony"
  ],
  "Japan": [
    "All States",
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Hokkaido",
    "Okinawa",
    "Hiroshima",
    "Fukuoka"
  ],
  "Australia": [
    "All States",
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania"
  ],
  "Thailand": [
    "All States",
    "Bangkok",
    "Chiang Mai",
    "Phuket",
    "Krabi",
    "Koh Samui"
  ],
  "India": [
    "All States",
    "Rajasthan",
    "Kerala",
    "Goa",
    "Maharashtra",
    "Delhi",
    "Tamil Nadu"
  ],
  "South Africa": [
    "All States",
    "Western Cape",
    "Gauteng",
    "KwaZulu-Natal",
    "Eastern Cape"
  ],
  "Greece": [
    "All States",
    "Attica",
    "Crete",
    "Cyclades",
    "Ionian Islands",
    "Peloponnese"
  ],
  "Netherlands": [
    "All States",
    "North Holland",
    "South Holland",
    "Utrecht",
    "Friesland"
  ],
  "New Zealand": [
    "All States",
    "Auckland",
    "Wellington",
    "Canterbury",
    "Otago",
    "Bay of Plenty"
  ],
  "Egypt": [
    "All States",
    "Cairo",
    "Luxor",
    "Alexandria",
    "Aswan",
    "Sinai"
  ]
};

// Cities by Country and State - Expanded cities for existing countries/states and added cities for new countries
export const cities: Record<string, Record<string, string[]>> = {
  "United States": {
    "All States": ["All Cities"],
    "California": ["All Cities", "Los Angeles", "San Francisco", "San Diego", "Napa Valley", "Monterey", "Santa Barbara", "Palm Springs", "Lake Tahoe", "Yosemite"],
    "Florida": ["All Cities", "Miami", "Orlando", "Key West", "Tampa", "Naples", "Fort Lauderdale", "Clearwater", "St. Augustine", "Panama City Beach"],
    "New York": ["All Cities", "New York City", "Buffalo", "Albany", "Syracuse", "Niagara Falls", "Ithaca", "Long Island", "Rochester"],
    "Texas": ["All Cities", "Austin", "Dallas", "Houston", "San Antonio", "Galveston", "Fort Worth", "El Paso", "Corpus Christi"],
    "Colorado": ["All Cities", "Denver", "Aspen", "Boulder", "Colorado Springs", "Vail", "Telluride", "Breckenridge", "Steamboat Springs"],
    "Hawaii": ["All Cities", "Honolulu", "Maui", "Kauai", "Big Island", "Lanai", "Molokai", "Oahu"],
    "Nevada": ["All Cities", "Las Vegas", "Reno", "Lake Tahoe", "Carson City", "Henderson"],
    "Washington": ["All Cities", "Seattle", "Olympia", "Spokane", "Tacoma", "Leavenworth", "Olympic Peninsula"],
    "Oregon": ["All Cities", "Portland", "Eugene", "Bend", "Ashland", "Crater Lake", "Hood River"],
    "Arizona": ["All Cities", "Phoenix", "Tucson", "Sedona", "Flagstaff", "Grand Canyon Village", "Scottsdale"]
  },
  "Canada": {
    "All States": ["All Cities"],
    "British Columbia": ["All Cities", "Vancouver", "Victoria", "Whistler", "Kelowna", "Tofino", "Nanaimo"],
    "Ontario": ["All Cities", "Toronto", "Ottawa", "Niagara Falls", "Kingston", "London", "Hamilton"],
    "Quebec": ["All Cities", "Montreal", "Quebec City", "Mont-Tremblant", "Gatineau", "Sherbrooke"],
    "Alberta": ["All Cities", "Calgary", "Banff", "Edmonton", "Jasper", "Canmore", "Lake Louise"]
  },
  "Mexico": {
    "All States": ["All Cities"],
    "Quintana Roo": ["All Cities", "Cancun", "Playa del Carmen", "Tulum", "Cozumel", "Isla Mujeres"],
    "Jalisco": ["All Cities", "Guadalajara", "Puerto Vallarta", "Tequila", "Tlaquepaque"],
    "Baja California": ["All Cities", "Cabo San Lucas", "San José del Cabo", "Ensenada", "Rosarito"],
    "Yucatan": ["All Cities", "Merida", "Valladolid", "Izamal", "Progreso"]
  },
  "United Kingdom": {
    "All States": ["All Cities"],
    "England": ["All Cities", "London", "Manchester", "Liverpool", "Bath", "Oxford", "Cambridge", "York", "Bristol", "Brighton", "Cornwall"],
    "Scotland": ["All Cities", "Edinburgh", "Glasgow", "Highlands", "Isle of Skye", "Aberdeen", "Inverness", "St. Andrews"],
    "Wales": ["All Cities", "Cardiff", "Swansea", "Snowdonia", "Conwy", "Pembrokeshire"],
    "Northern Ireland": ["All Cities", "Belfast", "Derry", "Giant's Causeway", "Antrim"]
  },
  "France": {
    "All States": ["All Cities"],
    "Île-de-France": ["All Cities", "Paris", "Versailles", "Fontainebleau", "Saint-Denis"],
    "Provence-Alpes-Côte d'Azur": ["All Cities", "Nice", "Marseille", "Cannes", "Aix-en-Provence", "Saint-Tropez", "Avignon", "Antibes"],
    "Normandy": ["All Cities", "Rouen", "Caen", "Mont Saint-Michel", "Bayeux", "Honfleur", "Étretat"],
    "Brittany": ["All Cities", "Rennes", "Saint-Malo", "Brest", "Quimper", "Vannes"],
    "Loire Valley": ["All Cities", "Tours", "Amboise", "Orléans", "Blois", "Angers"]
  },
  "Italy": {
    "All States": ["All Cities"],
    "Tuscany": ["All Cities", "Florence", "Siena", "Pisa", "Lucca", "San Gimignano", "Montepulciano", "Chianti"],
    "Lazio": ["All Cities", "Rome", "Viterbo", "Tivoli", "Ostia Antica"],
    "Lombardy": ["All Cities", "Milan", "Como", "Bergamo", "Brescia", "Mantua"],
    "Sicily": ["All Cities", "Palermo", "Catania", "Taormina", "Syracuse", "Agrigento", "Cefalù"],
    "Veneto": ["All Cities", "Venice", "Verona", "Padua", "Vicenza", "Treviso", "Cortina d'Ampezzo"],
    "Campania": ["All Cities", "Naples", "Sorrento", "Amalfi", "Positano", "Capri", "Pompeii", "Ischia"]
  },
  "Japan": {
    "All States": ["All Cities"],
    "Tokyo": ["All Cities", "Shinjuku", "Shibuya", "Ginza", "Asakusa", "Odaiba"],
    "Osaka": ["All Cities", "Umeda", "Namba", "Universal Studios Japan", "Sakai"],
    "Kyoto": ["All Cities", "Higashiyama", "Arashiyama", "Gion", "Fushimi", "Kita"],
    "Hokkaido": ["All Cities", "Sapporo", "Niseko", "Otaru", "Furano", "Hakodate"],
    "Okinawa": ["All Cities", "Naha", "Ishigaki", "Miyako", "Kerama Islands"]
  },
  "Thailand": {
    "All States": ["All Cities"],
    "Bangkok": ["All Cities", "Sukhumvit", "Silom", "Rattanakosin", "Chinatown"],
    "Chiang Mai": ["All Cities", "Old City", "Nimman", "Sankamphaeng", "Doi Suthep"],
    "Phuket": ["All Cities", "Patong", "Kata", "Karon", "Phuket Town", "Mai Khao"],
    "Krabi": ["All Cities", "Ao Nang", "Railay", "Koh Lanta", "Koh Phi Phi"]
  },
  "Australia": {
    "All States": ["All Cities"],
    "New South Wales": ["All Cities", "Sydney", "Blue Mountains", "Byron Bay", "Newcastle", "Wollongong", "Port Macquarie"],
    "Victoria": ["All Cities", "Melbourne", "Great Ocean Road", "Phillip Island", "Yarra Valley", "Ballarat"],
    "Queensland": ["All Cities", "Brisbane", "Gold Coast", "Cairns", "Port Douglas", "Whitsunday Islands", "Noosa"],
    "Western Australia": ["All Cities", "Perth", "Margaret River", "Broome", "Exmouth", "Albany"]
  }
};

// Hotels - Added many new hotels from various countries
export const hotels: Hotel[] = [
  {
    id: "hotel1",
    name: "Grand Oceanview Resort",
    description: "Luxury beachfront resort with stunning ocean views, multiple infinity pools, and world-class dining options. Perfect for a relaxing beach getaway.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 35000,
    rating: 47,
    reviewCount: 532,
    country: "United States",
    state: "Hawaii",
    city: "Maui",
    location: "Wailea Beach",
    amenities: ["Beachfront", "Infinity Pools", "Spa", "Fitness Center", "Multiple Restaurants", "Room Service", "Free Wi-Fi", "Ocean View Rooms", "Tennis Courts", "Kids Club"]
  },
  {
    id: "hotel2",
    name: "Mountain Lodge & Spa",
    description: "Cozy mountain retreat with rustic-chic rooms, a luxury spa, and access to hiking trails. Enjoy panoramic mountain views and farm-to-table dining.",
    image: "https://images.unsplash.com/photo-1586375300879-542402c8c818?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 25000,
    rating: 46,
    reviewCount: 358,
    country: "United States",
    state: "Colorado",
    city: "Aspen",
    location: "Snowmass Village",
    amenities: ["Mountain Views", "Spa", "Sauna", "Hiking Trails", "Restaurant", "Bar", "Free Breakfast", "Ski Storage", "Fireplace", "Pet Friendly"]
  },
  {
    id: "hotel3",
    name: "City Lights Boutique Hotel",
    description: "Stylish boutique hotel in the heart of the city with designer furnishings, a rooftop bar, and easy access to major attractions.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 28000,
    rating: 45,
    reviewCount: 421,
    country: "United States",
    state: "New York",
    city: "New York City",
    location: "SoHo",
    amenities: ["Rooftop Bar", "Restaurant", "Room Service", "Free Wi-Fi", "Fitness Center", "Concierge", "Business Center", "Airport Shuttle", "Valet Parking"]
  },
  {
    id: "hotel4",
    name: "Tropical Paradise Resort",
    description: "Immerse yourself in tropical beauty at this all-inclusive resort featuring private bungalows, crystal-clear waters, and exceptional service.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 42000,
    rating: 48,
    reviewCount: 629,
    country: "Thailand",
    state: "Phuket",
    city: "Patong",
    location: "Patong Beach",
    amenities: ["Private Beach", "Overwater Bungalows", "All-Inclusive", "Spa", "Multiple Pools", "Water Sports", "5 Restaurants", "Yoga Classes", "Snorkeling", "Diving"]
  },
  {
    id: "hotel5",
    name: "Historic Downtown Inn",
    description: "Charming boutique inn set in a beautifully restored historic building with period furnishings, a cozy café, and personalized service.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 18500,
    rating: 43,
    reviewCount: 287,
    country: "United Kingdom",
    state: "England",
    city: "Bath",
    location: "Central Bath",
    amenities: ["Historic Building", "Free Breakfast", "Afternoon Tea", "Garden", "Library", "Free Wi-Fi", "Concierge", "Walking Tours"]
  },
  {
    id: "hotel6",
    name: "Alpine Ski Lodge",
    description: "Ski-in/ski-out lodge with rustic charm, a crackling fireplace, hot tubs, and easy access to the best slopes in the region.",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    price: 32000,
    rating: 46,
    reviewCount: 412,
    country: "Canada",
    state: "British Columbia",
    city: "Whistler",
    location: "Whistler Mountain",
    amenities: ["Ski-in/Ski-out", "Hot Tubs", "Sauna", "Fireplace Lounge", "Equipment Rental", "Ski Storage", "Restaurant", "Bar", "Heated Pool", "Shuttle Service"]
  },
  {
    id: "hotel7",
    name: "Kyoto Zen Ryokan",
    description: "Traditional Japanese inn offering authentic cultural experiences with tatami rooms, futon bedding, communal baths, and kaiseki cuisine.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 29500,
    rating: 49,
    reviewCount: 298,
    country: "Japan",
    state: "Kyoto",
    city: "Higashiyama",
    location: "Gion District",
    amenities: ["Traditional Architecture", "Onsen (Hot Spring Bath)", "Japanese Gardens", "Tea Ceremony", "Tatami Rooms", "Kaiseki Dining", "Kimono Rental", "Meditation Space", "Cultural Activities"]
  },
  {
    id: "hotel8",
    name: "Tuscan Vineyard Villa",
    description: "Elegant countryside estate surrounded by vineyards and olive groves with a private pool, cooking classes, and wine tasting experiences.",
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    price: 38500,
    rating: 47,
    reviewCount: 324,
    country: "Italy",
    state: "Tuscany",
    city: "Florence",
    location: "Chianti Region",
    amenities: ["Vineyard Views", "Private Pool", "Wine Cellar", "Cooking School", "Olive Oil Tasting", "Gardens", "Terrace", "Antique Furnishings", "Bike Rental", "Wine Tours"]
  },
  {
    id: "hotel9",
    name: "Santorini Cliffside Suites",
    description: "Stunning white-washed suites carved into the volcanic cliffs with private plunge pools and breathtaking views of the Aegean Sea and caldera.",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 52000,
    rating: 48,
    reviewCount: 512,
    country: "Greece",
    state: "Cyclades",
    city: "All Cities",
    location: "Oia",
    amenities: ["Caldera Views", "Private Plunge Pools", "Sunset Terrace", "Infinity Pool", "Spa Treatments", "Mediterranean Restaurant", "Wine Bar", "Butler Service", "Yacht Excursions"]
  },
  {
    id: "hotel10",
    name: "Balinese Garden Resort",
    description: "Serene tropical retreat with individual villas set among lush gardens, featuring private pools, outdoor showers, and traditional Balinese design.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 31000,
    rating: 47,
    reviewCount: 387,
    country: "Indonesia",
    state: "All States",
    city: "All Cities",
    location: "Ubud",
    amenities: ["Private Villa", "Plunge Pool", "Balinese Spa", "Yoga Pavilion", "Organic Restaurant", "Rice Paddy Views", "Cooking Classes", "Traditional Dance Performances", "Temple Tours"]
  },
  {
    id: "hotel11",
    name: "Moroccan Luxury Riad",
    description: "Opulent traditional mansion with a central courtyard, rooftop terrace, plunge pool, and intricately decorated rooms featuring Moroccan craftsmanship.",
    image: "https://images.unsplash.com/photo-1548018560-c7196548e84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1286&q=80",
    price: 24500,
    rating: 46,
    reviewCount: 298,
    country: "Morocco",
    state: "All States",
    city: "All Cities",
    location: "Marrakech Medina",
    amenities: ["Courtyard Garden", "Rooftop Terrace", "Plunge Pool", "Hammam", "Moroccan Restaurant", "Mint Tea Service", "Cooking Classes", "Medina Tours", "Airport Transfers"]
  },
  {
    id: "hotel12",
    name: "Swiss Alpine Chalet",
    description: "Luxurious mountain chalet with panoramic Alpine views, featuring traditional wood interiors, a private sauna, and direct access to ski slopes.",
    image: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1284&q=80",
    price: 47500,
    rating: 49,
    reviewCount: 215,
    country: "Switzerland",
    state: "All States",
    city: "All Cities",
    location: "Zermatt",
    amenities: ["Matterhorn Views", "Private Sauna", "Fireplace", "Wood-Paneled Interiors", "Ski Room", "Fondue Service", "Balcony", "Boot Warmers", "Shuttle Service", "Chef on Request"]
  },
  {
    id: "hotel13",
    name: "Sydney Harbour View Hotel",
    description: "Contemporary luxury hotel with floor-to-ceiling windows showcasing spectacular views of Sydney Harbour, the Opera House, and Harbour Bridge.",
    image: "https://images.unsplash.com/photo-1503421128266-28000a01e2af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 44000,
    rating: 47,
    reviewCount: 532,
    country: "Australia",
    state: "New South Wales",
    city: "Sydney",
    location: "Circular Quay",
    amenities: ["Harbour Views", "Rooftop Pool", "Fine Dining Restaurant", "Cocktail Bar", "Spa", "Fitness Center", "Concierge Service", "Business Center", "Water Taxi Access"]
  },
  {
    id: "hotel14",
    name: "Parisian Luxury Apartment",
    description: "Elegant apartment in a historic Haussmann building, featuring high ceilings, French balconies, and classic Parisian style with modern amenities.",
    image: "https://images.unsplash.com/photo-1549893072-4b797f1d13d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 32500,
    rating: 46,
    reviewCount: 278,
    country: "France",
    state: "Île-de-France",
    city: "Paris",
    location: "Saint-Germain-des-Prés",
    amenities: ["Eiffel Tower Views", "French Balcony", "Fully Equipped Kitchen", "Designer Furnishings", "Seine River Proximity", "Wine Selection", "Concierge Service", "Laundry Facilities", "Welcome Basket"]
  },
  {
    id: "hotel15",
    name: "Desert Luxury Camp",
    description: "Exclusive desert camp offering Bedouin-inspired luxury tents with private bathrooms, gourmet dining under the stars, and authentic desert experiences.",
    image: "https://images.unsplash.com/photo-1414679459754-1a71b9e7ecc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1286&q=80",
    price: 37500,
    rating: 48,
    reviewCount: 186,
    country: "United Arab Emirates",
    state: "All States",
    city: "All Cities",
    location: "Dubai Desert Conservation Reserve",
    amenities: ["Luxury Tent", "Private Bathroom", "Desert Views", "Stargazing", "Camel Rides", "Dune Bashing", "Falconry Displays", "Bedouin Cultural Experiences", "Gourmet Dining"]
  },
  {
    id: "hotel16",
    name: "NYC Penthouse Suite",
    description: "Ultra-luxurious penthouse suite with expansive city views, private terrace, exclusive butler service, and access to premier concierge services.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 76000,
    rating: 49,
    reviewCount: 164,
    country: "United States",
    state: "New York",
    city: "New York City",
    location: "Upper East Side",
    amenities: ["Penthouse Views", "Private Terrace", "Butler Service", "Home Theater", "Gourmet Kitchen", "Baby Grand Piano", "Marble Bathroom", "Walk-in Closet", "Private Elevator"]
  },
  {
    id: "hotel17",
    name: "Waterfront Beach House",
    description: "Contemporary beach house with direct access to pristine white sand, floor-to-ceiling windows, multiple decks, and luxurious coastal decor.",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 53500,
    rating: 48,
    reviewCount: 237,
    country: "Australia",
    state: "Queensland",
    city: "Gold Coast",
    location: "Surfers Paradise",
    amenities: ["Beachfront", "Panoramic Ocean Views", "Private Pool", "Outdoor Kitchen", "Surfboard Storage", "Fire Pit", "Smart Home Technology", "Outdoor Shower", "Hammocks"]
  },
  {
    id: "hotel18",
    name: "Safari Lodge",
    description: "Luxury safari lodge on a private reserve with thatched-roof suites, outdoor showers, private viewing decks, and unparalleled wildlife viewing.",
    image: "https://images.unsplash.com/photo-1519427668931-9cfab4eccbec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    price: 62500,
    rating: 49,
    reviewCount: 298,
    country: "South Africa",
    state: "All States",
    city: "All Cities",
    location: "Kruger National Park",
    amenities: ["Game Drives", "Bush Walks", "Plunge Pool", "Viewing Deck", "Outdoor Shower", "Wildlife Viewing", "Gourmet Safari Cuisine", "Star Deck", "Boma Dinners"]
  }
];

// Service Providers - Added many new service providers across different categories
export const serviceProviders: ServiceProvider[] = [
  {
    id: "service1",
    name: "SkyJet Airways",
    description: "Premium airline offering direct flights to major destinations with comfortable seating, in-flight entertainment, and excellent service.",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 42,
    reviewCount: 1245,
    type: "flight"
  },
  {
    id: "service2",
    name: "RapidRail Express",
    description: "High-speed train service connecting major cities with comfortable seating, onboard dining options, and WiFi connectivity.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1184&q=80",
    rating: 44,
    reviewCount: 876,
    type: "train"
  },
  {
    id: "service3",
    name: "ComfortCoach Lines",
    description: "Luxury bus service with reclining seats, onboard entertainment, refreshments, and convenient schedules to various destinations.",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 40,
    reviewCount: 623,
    type: "bus"
  },
  {
    id: "service4",
    name: "EliteAuto Rentals",
    description: "Premium car rental service offering a wide range of vehicles from economy to luxury, with convenient pickup locations and 24/7 roadside assistance.",
    image: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 43,
    reviewCount: 892,
    type: "car"
  },
  {
    id: "service5",
    name: "Culinary Adventures",
    description: "Discover local cuisine through guided food tours, cooking classes, and visits to markets, vineyards, and artisanal producers.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 47,
    reviewCount: 732,
    type: "food"
  },
  {
    id: "service6",
    name: "Heritage Walks",
    description: "Expert-guided walking tours exploring history, architecture, and cultural landmarks with knowledgeable local guides and small group sizes.",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 46,
    reviewCount: 548,
    type: "tour"
  },
  {
    id: "service7",
    name: "Wilderness Expeditions",
    description: "Outdoor adventure company offering guided hiking, camping, rock climbing, and wildlife watching with experienced guides and quality equipment.",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    rating: 45,
    reviewCount: 463,
    type: "activity"
  },
  {
    id: "service8",
    name: "AquaLife Adventures",
    description: "Water-based activities including scuba diving, snorkeling, kayaking, and sailing with certified instructors and top-quality equipment.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 46,
    reviewCount: 512,
    type: "activity"
  },
  {
    id: "service9",
    name: "SkyView Airlines",
    description: "Budget-friendly airline with routes to popular destinations, basic amenities, and add-on options for customizing your travel experience.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
    rating: 38,
    reviewCount: 1853,
    type: "flight"
  },
  {
    id: "service10",
    name: "Vineyard Tours & Tastings",
    description: "Explore wine regions with expert-led tours, tastings at premium vineyards, and insights into wine production and appreciation.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 47,
    reviewCount: 386,
    type: "tour"
  },
  {
    id: "service11",
    name: "Global Connect Airlines",
    description: "International airline with extensive route network, offering premium and economy options with modern fleet and excellent in-flight services.",
    image: "https://images.unsplash.com/photo-1581609836406-45b4c2114388?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 44,
    reviewCount: 2156,
    type: "flight"
  },
  {
    id: "service12",
    name: "Royal Orient Express",
    description: "Luxury train journey through scenic routes with elegant cabins, gourmet dining, panoramic views, and nostalgic old-world charm.",
    image: "https://images.unsplash.com/photo-1506836467174-27f1042aa48c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1285&q=80",
    rating: 48,
    reviewCount: 435,
    type: "train"
  },
  {
    id: "service13",
    name: "Alpine Bus Tours",
    description: "Scenic mountain routes with panoramic windows, comfortable seating, and stops at picturesque villages and viewpoints.",
    image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 45,
    reviewCount: 387,
    type: "bus"
  },
  {
    id: "service14",
    name: "Luxury Car Chauffeur",
    description: "High-end vehicle rentals with professional drivers, featuring luxury sedans, SUVs, and sports cars for special occasions or executive travel.",
    image: "https://images.unsplash.com/photo-1613345587253-5d5b9a6523a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 47,
    reviewCount: 512,
    type: "car"
  },
  {
    id: "service15",
    name: "Farm-to-Table Experiences",
    description: "Authentic culinary experiences connecting guests with local farmers, including harvest activities, cooking classes, and farm-fresh meals.",
    image: "https://images.unsplash.com/photo-1526399232581-2ab5608b6336?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    rating: 49,
    reviewCount: 328,
    type: "food"
  },
  {
    id: "service16",
    name: "Global Street Food Discovery",
    description: "Guided tours of local street food scenes with tastings at multiple vendors, insights into culinary traditions, and hidden gems only locals know.",
    image: "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 46,
    reviewCount: 621,
    type: "food"
  },
  {
    id: "service17",
    name: "Underground City Tours",
    description: "Explore hidden tunnels, crypts, bunkers, and subterranean spaces with expert guides sharing the secret history beneath famous cities.",
    image: "https://images.unsplash.com/photo-1541423894991-546e229c1d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1286&q=80",
    rating: 45,
    reviewCount: 489,
    type: "tour"
  },
  {
    id: "service18",
    name: "Photography Expeditions",
    description: "Guided photography tours to scenic locations with professional photographers providing tips, equipment recommendations, and perfect timing for ideal lighting.",
    image: "https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    rating: 47,
    reviewCount: 376,
    type: "tour"
  },
  {
    id: "service19",
    name: "Extreme Sports Adventures",
    description: "Adrenaline-pumping activities including bungee jumping, skydiving, white water rafting, paragliding, and ziplines with certified instructors.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1375&q=80",
    rating: 46,
    reviewCount: 724,
    type: "activity"
  },
  {
    id: "service20",
    name: "Cultural Immersion Workshops",
    description: "Hands-on experiences in traditional crafts, music, dance, and art taught by local artisans and performers in authentic settings.",
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1265&q=80",
    rating: 48,
    reviewCount: 412,
    type: "activity"
  },
  {
    id: "service21",
    name: "Panorama Helicopter Tours",
    description: "Breathtaking aerial views of iconic landmarks, natural wonders, and cityscapes with professional pilots and personalized routes.",
    image: "https://images.unsplash.com/photo-1445264618000-f1e069c5920f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 49,
    reviewCount: 287,
    type: "activity"
  },
  {
    id: "service22",
    name: "Gourmet Dining Cruise",
    description: "Luxury dinner cruises featuring multi-course meals prepared by renowned chefs while sailing past illuminated landmarks and scenic waterfronts.",
    image: "https://images.unsplash.com/photo-1520695287272-b7f67e7dbec5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 46,
    reviewCount: 543,
    type: "food"
  },
  {
    id: "service23",
    name: "Island Ferry Connections",
    description: "Regular ferry services connecting mainland and islands with comfortable seating, scenic views, and onboard amenities for a pleasant journey.",
    image: "https://images.unsplash.com/photo-1558459654-c4106f4c8e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 42,
    reviewCount: 786,
    type: "bus"
  },
  {
    id: "service24",
    name: "First Class Airways",
    description: "Premium airline experience with lie-flat beds, gourmet dining, exclusive lounges, and personalized service for discerning travelers.",
    image: "https://images.unsplash.com/photo-1540339832862-474592b89599?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    rating: 47,
    reviewCount: 1324,
    type: "flight"
  },
  {
    id: "service25",
    name: "Classic Car Experience",
    description: "Self-drive rentals of vintage and classic cars, perfect for special occasions, photoshoots, or exploring scenic routes in style.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    rating: 46,
    reviewCount: 324,
    type: "car"
  }
]; 