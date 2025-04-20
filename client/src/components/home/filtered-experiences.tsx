import { useState, useEffect } from "react";
import { MapPin, Star } from "lucide-react";

// Experience type definition
type Experience = {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  rating: number;
  reviewCount: number;
  category: string;
  bookingPercentage?: number;
};

// Props type
type FilteredExperiencesProps = {
  category: string;
};

// Dummy data for each category
const DUMMY_EXPERIENCES: Record<string, Experience[]> = {
  beach: [
    {
      id: 101,
      name: "Snorkeling Tour in Bali",
      location: "Bali, Indonesia",
      description: "Discover the vibrant underwater world of Bali with an expert guide to all the best snorkeling spots.",
      price: 7900, // in cents
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "4 hours",
      rating: 47, // 4.7 out of 5
      reviewCount: 342,
      category: "Beach",
      bookingPercentage: 75
    },
    {
      id: 102,
      name: "Sunset Catamaran Cruise",
      location: "Santorini, Greece",
      description: "Sail along the coast of Santorini as the sun sets, with drinks, snacks, and swimming stops included.",
      price: 12900,
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "3 hours",
      rating: 48,
      reviewCount: 219,
      category: "Beach",
      bookingPercentage: 82
    },
    {
      id: 103,
      name: "Private Beach Picnic",
      location: "Maldives",
      description: "Enjoy a gourmet picnic on a secluded sandbank surrounded by crystal clear waters.",
      price: 19900,
      image: "https://images.unsplash.com/photo-1528913775512-624d24b27b96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Half day",
      rating: 49,
      reviewCount: 156,
      category: "Beach",
      bookingPercentage: 90
    }
  ],
  mountains: [
    {
      id: 201,
      name: "Alpine Ski Experience",
      location: "Zermatt, Switzerland",
      description: "World-class skiing with expert guides against the backdrop of the Matterhorn.",
      price: 29900,
      image: "https://images.unsplash.com/photo-1548132141-d2b4a633c9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Full day",
      rating: 48,
      reviewCount: 276,
      category: "Mountains",
      bookingPercentage: 85
    },
    {
      id: 202,
      name: "Annapurna Base Camp Trek",
      location: "Nepal",
      description: "A guided trek to the stunning Annapurna Base Camp, surrounded by majestic peaks.",
      price: 149900,
      image: "https://images.unsplash.com/photo-1469125155630-7ed75f1b0a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "12 days",
      rating: 49,
      reviewCount: 198,
      category: "Mountains",
      bookingPercentage: 65
    },
    {
      id: 203,
      name: "Mountain Biking Tour",
      location: "Whistler, Canada",
      description: "Thrilling downhill mountain biking with rental equipment and expert guides.",
      price: 12900,
      image: "https://images.unsplash.com/photo-1594035900144-1203e5e798d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "5 hours",
      rating: 47,
      reviewCount: 234,
      category: "Mountains",
      bookingPercentage: 70
    }
  ],
  city: [
    {
      id: 301,
      name: "Tokyo Street Food Tour",
      location: "Tokyo, Japan",
      description: "Taste your way through Tokyo's vibrant street food scene with a local foodie guide.",
      price: 9900,
      image: "https://images.unsplash.com/photo-1554797589-7241bb691973?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "3 hours",
      rating: 47,
      reviewCount: 315,
      category: "City Break",
      bookingPercentage: 88
    },
    {
      id: 302,
      name: "Rome by Vespa",
      location: "Rome, Italy",
      description: "See Rome like a local on this guided Vespa tour of the Eternal City's most iconic landmarks.",
      price: 11900,
      image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "4 hours",
      rating: 48,
      reviewCount: 267,
      category: "City Break",
      bookingPercentage: 78
    },
    {
      id: 303,
      name: "New York Rooftop Bar Crawl",
      location: "New York, USA",
      description: "Experience NYC's best skyline views while enjoying craft cocktails at exclusive rooftop bars.",
      price: 14900,
      image: "https://images.unsplash.com/photo-1567529692333-de9fd6772897?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "4 hours",
      rating: 46,
      reviewCount: 187,
      category: "City Break",
      bookingPercentage: 72
    }
  ],
  nature: [
    {
      id: 401,
      name: "Amazon River Expedition",
      location: "Brazil",
      description: "Navigate the Amazon River by boat, spot exotic wildlife, and spend nights in jungle lodges.",
      price: 32900,
      image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "5 days",
      rating: 48,
      reviewCount: 145,
      category: "Nature",
      bookingPercentage: 60
    },
    {
      id: 402,
      name: "Northern Lights Safari",
      location: "Tromsø, Norway",
      description: "Chase the Aurora Borealis with expert guides in one of the world's best locations for viewing.",
      price: 19900,
      image: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Evening",
      rating: 49,
      reviewCount: 298,
      category: "Nature",
      bookingPercentage: 92
    },
    {
      id: 403,
      name: "Whale Watching Tour",
      location: "Kaikoura, New Zealand",
      description: "Observe magnificent sperm whales and dolphins in their natural habitat with marine biologists.",
      price: 17900,
      image: "https://images.unsplash.com/photo-1570654330108-fd95e1e737d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "3 hours",
      rating: 47,
      reviewCount: 187,
      category: "Nature",
      bookingPercentage: 85
    }
  ],
  adventure: [
    {
      id: 501,
      name: "Cappadocia Hot Air Balloon",
      location: "Turkey",
      description: "Experience the magical landscapes of Cappadocia from above as you float in a hot air balloon at sunrise.",
      price: 17900,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "5 hours",
      rating: 49,
      reviewCount: 219,
      category: "Adventure",
      bookingPercentage: 95
    },
    {
      id: 502,
      name: "Great Barrier Reef Diving",
      location: "Cairns, Australia",
      description: "Discover the underwater paradise of the Great Barrier Reef with certified diving instructors.",
      price: 19900,
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Full day",
      rating: 47,
      reviewCount: 279,
      category: "Adventure",
      bookingPercentage: 85
    },
    {
      id: 503,
      name: "Atacama Desert Stargazing",
      location: "Chile",
      description: "Observe the clearest night skies in the world with professional astronomers and telescopes.",
      price: 12900,
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Evening",
      rating: 48,
      reviewCount: 164,
      category: "Adventure",
      bookingPercentage: 75
    }
  ],
  culture: [
    {
      id: 601,
      name: "Authentic Thai Cooking Class",
      location: "Bangkok, Thailand",
      description: "Learn to cook authentic Thai dishes with a local chef. Includes market tour and all ingredients.",
      price: 4900,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "3 hours",
      rating: 48,
      reviewCount: 183,
      category: "Culture",
      bookingPercentage: 80
    },
    {
      id: 602,
      name: "Maasai Village Visit",
      location: "Kenya",
      description: "Experience the traditions and daily life of the Maasai people with a respectful guided tour.",
      price: 8900,
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "Half day",
      rating: 46,
      reviewCount: 129,
      category: "Culture",
      bookingPercentage: 65
    },
    {
      id: 603,
      name: "Flamenco Show & Dinner",
      location: "Seville, Spain",
      description: "Enjoy an authentic flamenco performance followed by traditional Spanish cuisine at a historic venue.",
      price: 9900,
      image: "https://images.unsplash.com/photo-1566913485252-011147e52ddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      duration: "4 hours",
      rating: 47,
      reviewCount: 214,
      category: "Culture",
      bookingPercentage: 88
    }
  ],
  all: [] // Will be filled with experiences from all categories
};

// Populate the "all" category with experiences from all other categories
DUMMY_EXPERIENCES.all = [
  ...DUMMY_EXPERIENCES.beach,
  ...DUMMY_EXPERIENCES.mountains,
  ...DUMMY_EXPERIENCES.city,
  ...DUMMY_EXPERIENCES.nature,
  ...DUMMY_EXPERIENCES.adventure,
  ...DUMMY_EXPERIENCES.culture
];

export function FilteredExperiences({ category }: FilteredExperiencesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  
  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      const categoryKey = category.toLowerCase() === "city break" ? "city" : category.toLowerCase();
      setExperiences(DUMMY_EXPERIENCES[categoryKey] || []);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [category]);

  const getCategoryTitle = () => {
    switch (category.toLowerCase()) {
      case "all":
        return "Popular Experiences";
      case "beach":
        return "Beach Experiences";
      case "mountains":
        return "Mountain Activities";
      case "city":
      case "city break":
        return "City Experiences";
      case "nature":
        return "Nature & Wildlife";
      case "adventure":
        return "Adventure Activities";
      case "culture":
        return "Cultural Experiences";
      default:
        return `${category} Experiences`;
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold heading-primary">{getCategoryTitle()}</h2>
        <a href="#" className="text-primary text-sm font-medium">View All</a>
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
          ))}
        </div>
      )}
      
      {!isLoading && experiences.length === 0 && (
        <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-6 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No {category.toLowerCase()} experiences found.
          </p>
        </div>
      )}
      
      {!isLoading && experiences.length > 0 && (
        <>
          {/* Mobile Horizontal Scrolling View */}
          <div className="flex space-x-4 home-section-scroll pb-4 md:hidden">
            {experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="flex-none w-80 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={experience.image} 
                    alt={experience.name} 
                    className="w-full h-48 object-cover" 
                  />
                  {experience.category && (
                    <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      {experience.category.toUpperCase()}
                    </div>
                  )}
                  {experience.bookingPercentage && experience.bookingPercentage > 75 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-bold px-2 py-1 rounded">
                      <span className="text-red-500 mr-1">🔥</span> {experience.bookingPercentage}% Booked
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{experience.name}</h3>
                  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{experience.location}</span>
                    <span className="mx-2">•</span>
                    <span>{experience.duration}</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 line-clamp-2">{experience.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-primary">${(experience.price / 100).toFixed(0)}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-1">
                        <Star className="h-3 w-3 fill-yellow-400" />
                      </div>
                      <span className="text-sm font-medium">{(experience.rating / 10).toFixed(1)}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({experience.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={experience.image} 
                    alt={experience.name} 
                    className="w-full h-48 object-cover" 
                  />
                  {experience.category && (
                    <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      {experience.category.toUpperCase()}
                    </div>
                  )}
                  {experience.bookingPercentage && experience.bookingPercentage > 75 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-bold px-2 py-1 rounded">
                      <span className="text-red-500 mr-1">🔥</span> {experience.bookingPercentage}% Booked
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{experience.name}</h3>
                  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{experience.location}</span>
                    <span className="mx-2">•</span>
                    <span>{experience.duration}</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 line-clamp-2">{experience.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-primary">${(experience.price / 100).toFixed(0)}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-1">
                        <Star className="h-3 w-3 fill-yellow-400" />
                      </div>
                      <span className="text-sm font-medium">{(experience.rating / 10).toFixed(1)}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({experience.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
} 