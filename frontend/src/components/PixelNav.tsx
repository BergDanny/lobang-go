import { Home, Scroll, PlusSquare, User, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const PixelNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "HOME" },
    { path: "/quests", icon: Compass, label: "QUESTS" },
    { path: "/post", icon: PlusSquare, label: "POST" },
    { path: "/profile", icon: User, label: "HERO" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t-4 border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }, index) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all",
              "active:translate-y-0.5"
            )}
          >
            <div className={cn(
              "p-2 border-4 border-border transition-all",
              location.pathname === path
                ? "bg-forest text-foreground shadow-pixel-sm animate-bounce-pixel"
                : "bg-card hover:bg-muted"
            )}>
              <Icon className="w-6 h-6" strokeWidth={3} />
            </div>
            <span className={cn(
              "font-pixel text-[0.9rem] sm:text-[1rem]",
              location.pathname === path ? "text-primary" : "text-muted-foreground"
            )}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
