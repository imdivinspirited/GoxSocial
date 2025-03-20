import { useQuery } from "@tanstack/react-query";
import { Experience } from "@shared/schema";
import { MapPin, Star } from "lucide-react";

export function TrendingExperiences() {
  const { data: experiences, isLoading, error } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/trending"],
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold heading-primary">Trending Experiences</h2>
        <a href="#" className="text-primary text-sm font-medium">View All</a>
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-red-500 dark:text-red-300">
          Failed to load trending experiences
        </div>
      )}
      
      {experiences && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  TRENDING
                </div>
                {experience.bookingPercentage && experience.bookingPercentage > 50 && (
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
      )}
    </section>
  );
}
