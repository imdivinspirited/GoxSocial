import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Destination, Experience } from "@shared/schema";
import { HeartIcon, MapPin, Search, Star } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [rating, setRating] = useState(0);
  
  // Fetch destinations and experiences
  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });
  
  const { data: experiences, isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });
  
  // Filter results based on search and filters
  const filteredDestinations = destinations?.filter(dest => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || dest.category === category;
    const matchesPrice = (dest.price / 100) >= priceRange[0] && (dest.price / 100) <= priceRange[1];
    const matchesRating = dest.rating / 10 >= rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });
  
  const filteredExperiences = experiences?.filter(exp => {
    const matchesSearch = 
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || exp.category === category;
    const matchesPrice = (exp.price / 100) >= priceRange[0] && (exp.price / 100) <= priceRange[1];
    const matchesRating = exp.rating / 10 >= rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });
  
  const isLoading = destinationsLoading || experiencesLoading;
  const hasResults = (filteredDestinations?.length || 0) + (filteredExperiences?.length || 0) > 0;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Explore</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Discover amazing destinations and experiences around the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Beach">Beach</SelectItem>
                    <SelectItem value="Mountains">Mountains</SelectItem>
                    <SelectItem value="City Break">City Break</SelectItem>
                    <SelectItem value="Nature">Nature</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Price Range (${priceRange[0]} - ${priceRange[1]})
                </label>
                <Slider
                  defaultValue={[0, 2000]}
                  max={2000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Minimum Rating: {rating}+
                </label>
                <Slider
                  defaultValue={[0]}
                  max={5}
                  step={0.5}
                  value={[rating]}
                  onValueChange={(value) => setRating(value[0])}
                  className="mt-2"
                />
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => {
                setCategory("all");
                setPriceRange([0, 2000]);
                setRating(0);
              }}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search results */}
        <div className="lg:col-span-3">
          <div className="relative rounded-xl overflow-hidden shadow-sm mb-6">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, experiences, or locations..."
              className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : !hasResults ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Destinations section */}
              {filteredDestinations && filteredDestinations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Destinations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDestinations.map((destination) => (
                      <div 
                        key={destination.id} 
                        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
                      >
                        <div className="w-1/3">
                          <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h4 className="font-bold text-lg">{destination.name}</h4>
                          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{destination.location}</span>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2">
                            {destination.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-primary">${(destination.price / 100).toFixed(0)}</span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm">{(destination.rating / 10).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Experiences section */}
              {filteredExperiences && filteredExperiences.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Experiences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExperiences.map((experience) => (
                      <div 
                        key={experience.id} 
                        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
                      >
                        <div className="w-1/3">
                          <img 
                            src={experience.image} 
                            alt={experience.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h4 className="font-bold text-lg">{experience.name}</h4>
                          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{experience.location}</span>
                            <span className="mx-1">•</span>
                            <span>{experience.duration}</span>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2">
                            {experience.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-primary">${(experience.price / 100).toFixed(0)}</span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400"> / person</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm">{(experience.rating / 10).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
