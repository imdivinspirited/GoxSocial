import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileMenu } from "./mobile-menu";
import { useAuth } from "@/hooks/use-auth";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <header className="lg:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between p-4 w-full mx-auto">
          <div className="flex items-center space-x-2">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <Menu className="text-neutral-700 dark:text-neutral-200" />
            </button>
            <a href="/" className="flex items-center space-x-2">
              <img src="/images/gox-icon.svg" alt="GoX Social Logo" className="h-6 w-6" />
              <span className="text-xl font-bold text-primary">GoX Social</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-3">
            <button type="button" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 relative">
              <Bell className="text-neutral-700 dark:text-neutral-200" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">3</span>
            </button>
            <a href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage === null ? undefined : user?.profileImage} alt="User profile" />
                <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </a>
          </div>
        </div>
      </header>
      
      {isMenuOpen && <MobileMenu onClose={toggleMenu} />}
    </>
  );
}
