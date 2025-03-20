import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Compass, 
  Briefcase, 
  User, 
  Bell, 
  BookmarkCheck, 
  Settings, 
  HelpCircle,
  X,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type MobileMenuProps = {
  onClose: () => void;
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => location === path;
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-neutral-800 shadow-xl flex flex-col transform transition-transform">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-primary">TourviaHPT</a>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="text-neutral-700 dark:text-neutral-200" />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profileImage} alt="User profile" />
              <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {user?.isPremium ? "Premium Member" : "Regular Member"}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
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
              href="#saved" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <BookmarkCheck className="w-5 h-5" />
              <span>Saved Items</span>
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 space-y-1">
            <p className="px-3 text-xs font-medium text-neutral-500 uppercase mb-2">Settings</p>
            <a 
              href="#settings" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Account Settings</span>
            </a>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span>Dark Mode</span>
              </div>
              <ThemeToggle />
            </div>
            <a 
              href="#help" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help &amp; Support</span>
            </a>
          </div>
        </nav>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full p-3 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
