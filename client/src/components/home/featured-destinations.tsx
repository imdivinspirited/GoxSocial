import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import { HeartIcon, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedDestinations() {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ["/api/destinations/featured"],
  });

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold heading-primary">Featured Destinations</h2>
        <a href="#" className="text-primary text-sm font-medium">View All</a>
      </div>
      
      {isLoading && (
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-none w-64 md:w-80 h-72 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-red-500 dark:text-red-300">
          Failed to load featured destinations
        </div>
      )}
      
      {destinations && (
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
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
