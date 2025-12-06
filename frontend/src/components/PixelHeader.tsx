import { Coins, Scroll, Map, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import goldCoin from "@/assets/gold-coin.png";

export const PixelHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  const navItems = [
    { path: "/quests", icon: Scroll, label: "QUESTS" },
    { path: "/profile", icon: Map, label: "STATS" },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b-4 border-border p-3 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-warning border-4 border-border flex items-center justify-center shadow-pixel-gold group-hover:animate-bounce-pixel">
            <span className="font-pixel text-primary-foreground text-[0.9rem]">LG</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-pixel text-pixel-base text-primary">LOBANG GO</span>
            <p className="font-pixel text-[0.8rem] text-muted-foreground">ADVENTURE MODE</p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-warning/20 border-4 border-primary/50 shadow-pixel-gold">
            <img src={goldCoin} alt="Coins" className="w-7 h-7 animate-sparkle" style={{ imageRendering: 'pixelated' }} />
            <span className="font-pixel text-[0.9rem] text-primary">RM 50</span>
          </div>
          
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
        </nav>
      </div>
    </header>
  );
};
