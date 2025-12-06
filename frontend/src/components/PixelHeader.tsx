import { Home, Scroll, PlusSquare, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export const PixelHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  const navItems = [
    { path: "/", icon: Home, label: "HOME" },
    { path: "/quests", icon: Scroll, label: "QUESTS" },
    { path: "/post", icon: PlusSquare, label: "POST" },
    { path: "/profile", icon: User, label: "HERO" },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b-4 border-border p-3 sticky top-0 z-40">
      <div className="container mx-auto grid grid-cols-3 items-center gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group justify-self-start">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-warning border-4 border-border flex items-center justify-center shadow-pixel-gold group-hover:animate-bounce-pixel">
            <span className="font-pixel text-primary-foreground text-[0.9rem]">LG</span>
          </div>
          <div className="hidden sm:block">
            {isAuthenticated && user ? (
              <span className="font-pixel text-pixel-base text-primary">{user.name}</span>
            ) : (
              <>
                <span className="font-pixel text-pixel-base text-primary">LOBANG GO</span>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">ADVENTURE MODE</p>
              </>
            )}
          </div>
        </Link>
        
        {/* Center Navigation */}
        <nav className="flex items-center justify-center gap-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-4 border-border transition-all",
                "hover:bg-muted active:translate-x-1 active:translate-y-1",
                location.pathname === path
                  ? "bg-forest text-foreground shadow-pixel"
                  : "bg-card shadow-pixel-sm"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={3} />
              <span className="font-pixel text-[0.9rem] hidden sm:block">{label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Right Section: Logout */}
        <div className="flex items-center gap-2 justify-self-end">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-4 border-border transition-all",
                "hover:bg-destructive/20 active:translate-x-1 active:translate-y-1",
                "bg-card shadow-pixel-sm text-destructive hover:text-destructive"
              )}
              title="Logout"
            >
              <LogOut className="w-6 h-6" strokeWidth={3} />
              <span className="font-pixel text-[0.9rem] hidden sm:block">LOGOUT</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
