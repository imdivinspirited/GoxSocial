import { useState, useEffect } from "react";
import { HeartIcon, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Destination type definition
type Destination = {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
};

// Props type
type FilteredDestinationsProps = {
  category: string;
};

// Dummy data for each category
const DUMMY_DESTINATIONS: Record<string, Destination[]> = {
  beach: [
    {
      id: 101,
      name: "Bora Bora Lagoon",
      location: "French Polynesia",
      description: "Experience the most beautiful lagoon in the world with crystal clear waters and overwater bungalows.",
      price: 299900, // in cents
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 49, // 4.9 out of 5
      reviewCount: 832,
      category: "Beach"
    },
    {
      id: 102,
      name: "Maldives Paradise",
      location: "South Asia",
      description: "Crystal clear waters and white sand beaches make this the perfect tropical getaway.",
      price: 129900,
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 48,
      reviewCount: 423,
      category: "Beach"
    },
    {
      id: 103,
      name: "Phi Phi Islands",
      location: "Thailand",
      description: "Stunning beach paradise with limestone cliffs, clear waters and white sand beaches.",
      price: 89900,
      image: "https://images.unsplash.com/photo-1589614958802-abc561694683?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 46,
      reviewCount: 319,
      category: "Beach"
    }
  ],
  mountains: [
    {
      id: 201,
      name: "Swiss Alps Experience",
      location: "Switzerland",
      description: "Breathtaking mountain views with world-class skiing and luxury accommodations.",
      price: 179900,
      image: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 49,
      reviewCount: 512,
      category: "Mountains"
    },
    {
      id: 202,
      name: "Rocky Mountain Retreat",
      location: "Colorado, USA",
      description: "Experience the majestic Rockies with hiking, wildlife viewing and luxury lodges.",
      price: 149900,
      image: "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 47,
      reviewCount: 387,
      category: "Mountains"
    },
    {
      id: 203,
      name: "Himalayan Adventure",
      location: "Nepal",
      description: "Trek through the world's highest mountains with expert guides and stunning views.",
      price: 119900,
      image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 48,
      reviewCount: 246,
      category: "Mountains"
    }
  ],
  city: [
    {
      id: 301,
      name: "Tokyo Experience",
      location: "Japan",
      description: "Immerse yourself in the unique blend of traditional culture and futuristic technology.",
      price: 149900,
      image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 47,
      reviewCount: 349,
      category: "City Break"
    },
    {
      id: 302,
      name: "Paris Luxury Stay",
      location: "France",
      description: "Experience the city of love with elegant accommodations, fine dining and cultural experiences.",
      price: 189900,
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 46,
      reviewCount: 512,
      category: "City Break"
    },
    {
      id: 303,
      name: "New York City Adventure",
      location: "USA",
      description: "The city that never sleeps offers world-class dining, entertainment and shopping experiences.",
      price: 169900,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 45,
      reviewCount: 429,
      category: "City Break"
    }
  ],
  nature: [
    {
      id: 401,
      name: "Amazon Rainforest",
      location: "Brazil",
      description: "Explore the world's largest rainforest with guided eco-tours and wildlife experiences.",
      price: 119900,
      image: "https://images.unsplash.com/photo-1597433557924-a1388480c109?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 47,
      reviewCount: 218,
      category: "Nature"
    },
    {
      id: 402,
      name: "Serengeti Safari",
      location: "Tanzania",
      description: "Witness the incredible wildlife and landscapes of one of Africa's most famous national parks.",
      price: 259900,
      image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 49,
      reviewCount: 342,
      category: "Nature"
    },
    {
      id: 403,
      name: "Yellowstone Expedition",
      location: "Wyoming, USA",
      description: "Explore geysers, hot springs, and wildlife in America's first national park.",
      price: 129900,
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 48,
      reviewCount: 287,
      category: "Nature"
    }
  ],
  adventure: [
    {
      id: 501,
      name: "Costa Rica Zip-lining",
      location: "Costa Rica",
      description: "Soar above the rainforest canopy with the most thrilling zip-line tours in Central America.",
      price: 99900,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 48,
      reviewCount: 267,
      category: "Adventure"
    },
    {
      id: 502,
      name: "Grand Canyon Rafting",
      location: "Arizona, USA",
      description: "Navigate the thrilling rapids of the Colorado River through the magnificent Grand Canyon.",
      price: 189900,
      image: "https://images.unsplash.com/photo-1594058573823-d8edf1ad3380?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 49,
      reviewCount: 193,
      category: "Adventure"
    },
    {
      id: 503,
      name: "New Zealand Bungee",
      location: "Queenstown, New Zealand",
      description: "Experience the ultimate adrenaline rush with bungee jumping in the adventure capital of the world.",
      price: 129900,
      image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 47,
      reviewCount: 219,
      category: "Adventure"
    }
  ],
  culture: [
    {
      id: 601,
      name: "Ancient Egypt Tour",
      location: "Egypt",
      description: "Explore the pyramids, temples and tombs of one of the world's oldest civilizations.",
      price: 179900,
      image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 48,
      reviewCount: 412,
      category: "Culture"
    },
    {
      id: 602,
      name: "Kyoto Temple Experience",
      location: "Japan",
      description: "Immerse yourself in Japanese tradition with temple stays, tea ceremonies, and cultural workshops.",
      price: 139900,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 47,
      reviewCount: 328,
      category: "Culture"
    },
    {
      id: 603,
      name: "Tuscany Food & Wine",
      location: "Italy",
      description: "Experience authentic Italian culture through its world-renowned cuisine and vineyard tours.",
      price: 159900,
      image: "https://images.unsplash.com/photo-1518790909408-3638e75941dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      rating: 49,
      reviewCount: 389,
      category: "Culture"
    }
  ],
  all: [] // Will be filled with destinations from all categories
};

// Populate the "all" category with destinations from all other categories
DUMMY_DESTINATIONS.all = [
  ...DUMMY_DESTINATIONS.beach,
  ...DUMMY_DESTINATIONS.mountains,
  ...DUMMY_DESTINATIONS.city,
  ...DUMMY_DESTINATIONS.nature,
  ...DUMMY_DESTINATIONS.adventure,
  ...DUMMY_DESTINATIONS.culture
];

export function FilteredDestinations({ category }: FilteredDestinationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      const categoryKey = category.toLowerCase() === "city break" ? "city" : category.toLowerCase();
      setDestinations(DUMMY_DESTINATIONS[categoryKey] || []);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [category]);

  const getCategoryTitle = () => {
    switch (category.toLowerCase()) {
      case "all":
        return "All Destinations";
      case "beach":
        return "Beach Getaways";
      case "mountains":
        return "Mountain Adventures";
      case "city":
      case "city break":
        return "City Escapes";
      case "nature":
        return "Nature Experiences";
      case "adventure":
        return "Adventure Activities";
      case "culture":
        return "Cultural Discoveries";
      default:
        return `${category} Destinations`;
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold heading-primary">{getCategoryTitle()}</h2>
        <a href="#" className="text-primary text-sm font-medium">View All</a>
      </div>
      
      {isLoading && (
        <div className="flex space-x-4 home-section-scroll pb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-none w-64 md:w-80 h-72 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
          ))}
        </div>
      )}
      
      {!isLoading && destinations.length === 0 && (
        <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-6 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No {category.toLowerCase()} destinations found.
          </p>
        </div>
      )}
      
      {!isLoading && destinations.length > 0 && (
        <div className="flex space-x-4 home-section-scroll pb-4">
          {destinations.map((destination) => (
            <div 
              key={destination.id} 
              className="flex-none w-64 md:w-80 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="relative h-40 md:h-52">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold">{destination.name}</h3>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{destination.location}</span>
                  </div>
                </div>
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <HeartIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center space-x-1 text-yellow-400 text-sm mb-2">
                  {[...Array(Math.floor(destination.rating / 10))].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                  {destination.rating % 10 >= 5 && (
                    <div className="relative">
                      <Star className="h-3 w-3 text-neutral-300 dark:text-neutral-600" />
                      <Star className="h-3 w-3 fill-current absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    </div>
                  )}
                  <span className="text-neutral-500 dark:text-neutral-400 ml-1">
                    {(destination.rating / 10).toFixed(1)} ({destination.reviewCount})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary">${(destination.price / 100).toFixed(0)}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                  </div>
                  <Button size="sm" className="px-3 py-1.5 text-xs">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 