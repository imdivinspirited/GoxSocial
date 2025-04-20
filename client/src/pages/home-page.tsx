import { AppShell } from "@/components/layout/app-shell";
import { SocialFeed } from "@/components/home/social-feed";
import { FilteredDestinations } from "@/components/home/filtered-destinations";
import { FilteredExperiences } from "@/components/home/filtered-experiences";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filters = [
    { id: "all", name: "All" },
    { id: "beach", name: "Beach" },
    { id: "mountains", name: "Mountains" },
    { id: "city", name: "City Break" },
    { id: "nature", name: "Nature" },
    { id: "adventure", name: "Adventure" },
    { id: "culture", name: "Culture" },
  ];

  return (
    <AppShell>
      {/* Content tabs (Desktop) */}
      <div className="hidden lg:block mb-6">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab("for-you")}
              className={`py-3 border-b-2 ${
                activeTab === "for-you" 
                  ? "border-primary text-primary font-medium" 
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              For You
            </button>
            <button 
              onClick={() => setActiveTab("following")}
              className={`py-3 border-b-2 ${
                activeTab === "following" 
                  ? "border-primary text-primary font-medium" 
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              Following
            </button>
            <button 
              onClick={() => setActiveTab("trending")}
              className={`py-3 border-b-2 ${
                activeTab === "trending" 
                  ? "border-primary text-primary font-medium" 
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              Trending
            </button>
            <button 
              onClick={() => setActiveTab("nearby")}
              className={`py-3 border-b-2 ${
                activeTab === "nearby" 
                  ? "border-primary text-primary font-medium" 
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              Nearby
            </button>
          </nav>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6">
        <div className="relative rounded-full overflow-hidden shadow-sm mb-4">
          <Input
            type="text"
            placeholder="Search destinations, experiences, or users..."
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full py-3 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
        </div>
        
        <div className="flex space-x-2 home-section-scroll pb-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              variant={activeFilter === filter.id ? "default" : "outline"}
              className="rounded-full whitespace-nowrap text-sm flex-shrink-0"
            >
              {filter.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Destinations based on the selected filter */}
      <FilteredDestinations category={activeFilter} />
      
      <SocialFeed />
      
      {/* Experiences based on the selected filter */}
      <FilteredExperiences category={activeFilter} />
    </AppShell>
  );
}
