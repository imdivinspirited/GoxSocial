import { useLocation } from "wouter";
import { Home, Compass, PlusCircle, Briefcase, User, ShoppingCart, MessageSquare } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-30">
      <div className="grid grid-cols-5 py-2 w-full">
        <a 
          href="/" 
          className={`flex flex-col items-center p-2 ${
            isActive("/") 
              ? "text-primary" 
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <Home className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </a>
        <a 
          href="/explore" 
          className={`flex flex-col items-center p-2 ${
            isActive("/explore") 
              ? "text-primary" 
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <Compass className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Explore</span>
        </a>
        <a 
          href="/chat" 
          className={`flex flex-col items-center p-2 relative`}
        >
          <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white -mt-6 shadow-lg">
            <MessageSquare className="text-lg w-5 h-5" />
          </div>
        </a>
        <a 
          href="/cart" 
          className={`flex flex-col items-center p-2 ${
            isActive("/cart") 
              ? "text-primary" 
              : "text-neutral-500 dark:text-neutral-400"
          } relative`}
        >
          <ShoppingCart className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Cart</span>
          <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
        </a>
        <a 
          href="/profile" 
          className={`flex flex-col items-center p-2 ${
            isActive("/profile") 
              ? "text-primary" 
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <User className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </nav>
  );
}
