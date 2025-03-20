import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileHeader } from "./mobile-header";
import { MobileNav } from "./mobile-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 py-4 lg:py-6 pb-16 lg:pb-6">
          {children}
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
