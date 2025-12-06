import { Coins, Zap, Star } from "lucide-react";

interface StatsDisplayProps {
  credits: number;
  xp: number;
  maxXp: number;
  level: number;
  rating: number;
}

export const StatsDisplay = ({ credits, xp, maxXp, level, rating }: StatsDisplayProps) => {
  const xpPercentage = (xp / maxXp) * 100;
  
  return (
    <div className="space-y-4">
      {/* Credits */}
      <div className="bg-card border-4 border-foreground p-4 shadow-pixel">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-accent" strokeWidth={3} />
          <span className="font-pixel text-pixel-xs">CREDITS</span>
        </div>
        <div className="font-pixel text-pixel-xl text-accent">
          RM {credits.toFixed(2)}
        </div>
      </div>
      
      {/* XP Bar */}
      <div className="bg-card border-4 border-foreground p-4 shadow-pixel">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-xp" strokeWidth={3} />
            <span className="font-pixel text-pixel-xs">LEVEL {level}</span>
          </div>
          <span className="font-pixel-body text-pixel-base text-muted-foreground">
            {xp}/{maxXp} XP
          </span>
        </div>
        <div className="h-6 bg-secondary border-4 border-foreground relative overflow-hidden">
          <div 
            className="h-full bg-xp transition-all duration-500 pixel-progress"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Rating */}
      <div className="bg-card border-4 border-foreground p-4 shadow-pixel">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-warning" strokeWidth={3} />
          <span className="font-pixel text-pixel-xs">REPUTATION</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-6 h-6 border-2 border-foreground ${
                star <= Math.floor(rating) ? "bg-warning" : "bg-secondary"
              }`}
            />
          ))}
          <span className="font-pixel text-pixel-xs ml-2">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
