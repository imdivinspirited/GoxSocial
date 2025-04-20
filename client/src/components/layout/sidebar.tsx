import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Compass, 
  Briefcase, 
  User, 
  Bell, 
  LogOut,
  Settings,
  MessageSquare,
  Bot,
  ShoppingCart
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  
  const isActive = (path: string) => location === path;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 sticky top-0 h-screen">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <a href="/" className="flex items-center space-x-3">
          <img src="/images/gox-icon.svg" alt="GoX Social Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-primary">GoX Social</span>
        </a>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <a 
          href="/" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </a>
        <a 
          href="/explore" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/explore") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </a>
        <a 
          href="/bookings" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/bookings") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Bookings</span>
        </a>
        <a 
          href="/profile" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/profile") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </a>
        <a 
          href="/notifications" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/notifications") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          } relative`}
        >
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
          <span className="absolute right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
        </a>
        <a 
          href="/settings" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/settings") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
        <a 
          href="/chat" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/chat") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Live Chat</span>
        </a>
        <a 
          href="/ai-assistant" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/ai-assistant") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>AI Assistant</span>
        </a>
        <a 
          href="/cart" 
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive("/cart") 
              ? "bg-primary text-white" 
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          } relative`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          <span className="absolute right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
        </a>
      </nav>
    </aside>
  );
}