import { AppShell } from "@/components/layout/app-shell";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Destination, Experience } from "@shared/schema";
import { 
  HeartIcon, MapPin, Search, Star, Plane, Bus, Train, Car, 
  Building, Utensils, MapIcon, Calendar, Phone
} from "lucide-react";
import { countries, states, cities, hotels, serviceProviders, Hotel, ServiceProvider } from "@/data/explore-data";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("destinations");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [rating, setRating] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Fetch destinations and experiences
  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });
  
  const { data: experiences, isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });
  
  // Update available states based on selected country
  useEffect(() => {
    if (selectedCountry === "All Countries") {
      setAvailableStates(["All States"]);
    } else if (states[selectedCountry]) {
      setAvailableStates(states[selectedCountry]);
      setSelectedState("All States");
    } else {
      setAvailableStates(["All States"]);
    }
    setSelectedCity("All Cities");
  }, [selectedCountry]);
  
  // Update available cities based on selected state
  useEffect(() => {
    if (selectedCountry === "All Countries" || selectedState === "All States") {
      setAvailableCities(["All Cities"]);
    } else if (cities[selectedCountry]?.[selectedState]) {
      setAvailableCities(cities[selectedCountry][selectedState]);
    } else {
      setAvailableCities(["All Cities"]);
    }
  }, [selectedCountry, selectedState]);
  
  // Filter destinations based on search and filters
  const filteredDestinations = destinations?.filter(dest => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || dest.category === category;
    const matchesPrice = (dest.price / 100) >= priceRange[0] && (dest.price / 100) <= priceRange[1];
    const matchesRating = dest.rating / 10 >= rating;
    
    // Location filtering would require more sophisticated data
    // For now, we'll assume simple string matching
    const matchesLocation = 
      selectedCountry === "All Countries" || 
      dest.location.includes(selectedCountry) ||
      (selectedState !== "All States" && dest.location.includes(selectedState)) ||
      (selectedCity !== "All Cities" && dest.location.includes(selectedCity));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesLocation;
  });
  
  // Filter experiences
  const filteredExperiences = experiences?.filter(exp => {
    const matchesSearch = 
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || exp.category === category;
    const matchesPrice = (exp.price / 100) >= priceRange[0] && (exp.price / 100) <= priceRange[1];
    const matchesRating = exp.rating / 10 >= rating;
    
    const matchesLocation = 
      selectedCountry === "All Countries" || 
      exp.location.includes(selectedCountry) ||
      (selectedState !== "All States" && exp.location.includes(selectedState)) ||
      (selectedCity !== "All Cities" && exp.location.includes(selectedCity));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesLocation;
  });
  
  // Filter hotels
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = (hotel.price / 100) >= priceRange[0] && (hotel.price / 100) <= priceRange[1];
    const matchesRating = hotel.rating / 10 >= rating;
    
    const matchesCountry = selectedCountry === "All Countries" || hotel.country === selectedCountry;
    const matchesState = selectedState === "All States" || hotel.state === selectedState;
    const matchesCity = selectedCity === "All Cities" || hotel.city === selectedCity;
    
    return matchesSearch && matchesPrice && matchesRating && matchesCountry && matchesState && matchesCity;
  });
  
  // Filter services
  const filteredServices = serviceProviders.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = service.rating / 10 >= rating;
    
    return matchesSearch && matchesRating;
  });
  
  const isLoading = destinationsLoading || experiencesLoading;
  const hasResults = 
    (activeTab === "destinations" && (filteredDestinations?.length || 0) > 0) ||
    (activeTab === "experiences" && (filteredExperiences?.length || 0) > 0) ||
    (activeTab === "hotels" && filteredHotels.length > 0) ||
    (activeTab === "services" && filteredServices.length > 0);

  // Reset all filters
  const resetFilters = () => {
    setCategory("all");
    setPriceRange([0, 2000]);
    setRating(0);
    setSelectedCountry("All Countries");
    setSelectedState("All States");
    setSelectedCity("All Cities");
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Explore</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Discover amazing destinations, experiences, hotels, and travel services around the world
        </p>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-sm mb-6">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations, experiences, hotels, or locations..."
          className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="services">Travel Services</TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                {/* Location Filters */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">State/Region</label>
                  <Select 
                    value={selectedState} 
                    onValueChange={setSelectedState}
                    disabled={availableStates.length <= 1}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">City/Area</label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={availableCities.length <= 1}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city/area" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Category filter - only show for destinations and experiences */}
                {(activeTab === "destinations" || activeTab === "experiences") && (
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
                )}
                
                {/* Price filter - hide for services */}
                {activeTab !== "services" && (
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
                )}
                
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
                
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search results */}
          <div className="lg:col-span-3">
            <TabsContent value="destinations" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : !filteredDestinations?.length ? (
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No destinations found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-3">Destinations ({filteredDestinations.length})</h3>
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
            </TabsContent>
            
            <TabsContent value="experiences" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : !filteredExperiences?.length ? (
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No experiences found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-3">Experiences ({filteredExperiences.length})</h3>
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
            </TabsContent>
            
            <TabsContent value="hotels" className="mt-0">
              {!filteredHotels.length ? (
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No hotels found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-3">Hotels ({filteredHotels.length})</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredHotels.map((hotel) => (
                      <div 
                        key={hotel.id} 
                        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-48 md:h-auto">
                            <img 
                              src={hotel.image} 
                              alt={hotel.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-full md:w-2/3 p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h4 className="font-bold text-lg">{hotel.name}</h4>
                                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  <span>{hotel.location}, {hotel.city}, {hotel.state}, {hotel.country}</span>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-lg font-semibold">{(hotel.rating / 10).toFixed(1)}</span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">({hotel.reviewCount} reviews)</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 my-2">
                              {hotel.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 my-2">
                              {hotel.amenities.slice(0, 6).map((amenity, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 6 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                                  +{hotel.amenities.length - 6} more
                                </span>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <span className="font-bold text-primary text-xl">${(hotel.price / 100).toFixed(0)}</span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400"> / night</span>
                              </div>
                              <Button className="bg-primary hover:bg-primary/90">View Rooms</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              {!filteredServices.length ? (
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No services found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group services by type */}
                  {["flight", "train", "bus", "car", "tour", "food", "activity"].map(serviceType => {
                    const servicesOfType = filteredServices.filter(s => s.type === serviceType);
                    if (servicesOfType.length === 0) return null;
                    
                    return (
                      <div key={serviceType} className="mb-8">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          {serviceType === "flight" && <Plane className="mr-2 h-5 w-5" />}
                          {serviceType === "train" && <Train className="mr-2 h-5 w-5" />}
                          {serviceType === "bus" && <Bus className="mr-2 h-5 w-5" />}
                          {serviceType === "car" && <Car className="mr-2 h-5 w-5" />}
                          {serviceType === "hotel" && <Building className="mr-2 h-5 w-5" />}
                          {serviceType === "food" && <Utensils className="mr-2 h-5 w-5" />}
                          {serviceType === "tour" && <MapIcon className="mr-2 h-5 w-5" />}
                          {serviceType === "activity" && <Calendar className="mr-2 h-5 w-5" />}
                          {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {servicesOfType.map(service => (
                            <div
                              key={service.id}
                              className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
                            >
                              <div className="w-1/3">
                                <img
                                  src={service.image}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="w-2/3 p-4">
                                <h4 className="font-bold text-lg">{service.name}</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2">
                                  {service.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span className="text-sm">{(service.rating / 10).toFixed(1)}</span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({service.reviewCount} reviews)</span>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-primary border-primary hover:bg-primary/10"
                                  >
                                    <Phone className="h-3 w-3 mr-1" />
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </AppShell>
  );
}
