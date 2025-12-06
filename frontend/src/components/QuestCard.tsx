import { MapPin, Coins, Zap, Clock, ChevronRight, Sword, Shield, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  locationFrom: string;
  locationTo: string;
  bounty: number;
  xp: number;
  category: string;
  deadline: string;
  status: "open" | "assigned" | "completed";
  difficulty?: string;
}

export const QuestCard = ({
  id,
  title,
  description,
  locationFrom,
  locationTo,
  bounty,
  xp,
  category,
  deadline,
  status,
  difficulty = "Easy",
}: QuestCardProps) => {
  const categoryStyles: Record<string, { variant: "default" | "success" | "warning" | "xp" | "forest" | "accent"; icon: any }> = {
    delivery: { variant: "forest", icon: "📦" },
    queue: { variant: "warning", icon: "⏳" },
    printing: { variant: "accent", icon: "📄" },
    other: { variant: "xp", icon: "✨" },
  };

  const difficultyColors: Record<string, string> = {
    easy: "text-success",
    medium: "text-warning",
    hard: "text-destructive",
  };

  const { variant, icon } = categoryStyles[category.toLowerCase()] || categoryStyles.other;

  return (
    <Card className="hover:shadow-pixel-glow transition-all group relative overflow-hidden">
      {/* Difficulty indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 bg-background/80 border-2 border-border",
          difficultyColors[difficulty.toLowerCase()]
        )}>
          <Star className="w-4 h-4" fill="currentColor" strokeWidth={0} />
          <span className="font-pixel text-[0.6rem]">{difficulty.toUpperCase()}</span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{icon}</div>
          <div className="flex-1">
            <Badge variant={variant} className="mb-2">{category}</Badge>
            <CardTitle className="text-foreground leading-relaxed text-[0.8rem] sm:text-[0.9rem]">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="font-pixel-body text-pixel-lg text-muted-foreground line-clamp-2">
          {description}
        </p>
        
        {/* Location */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 border-2 border-border">
          <MapPin className="w-5 h-5 text-forest-light" strokeWidth={3} />
          <span className="font-pixel-body text-pixel-base flex-1 truncate">{locationFrom}</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={3} />
          <span className="font-pixel-body text-pixel-base flex-1 truncate">{locationTo}</span>
        </div>
        
        {/* Rewards Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 border-2 border-primary/50">
            <Coins className="w-5 h-5 text-primary" strokeWidth={3} />
            <span className="font-pixel text-[0.7rem] text-primary">RM {typeof bounty === 'number' ? bounty.toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-xp/20 border-2 border-xp/50">
            <Zap className="w-5 h-5 text-xp" strokeWidth={3} />
            <span className="font-pixel text-[0.7rem] text-xp">+{xp} XP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Clock className="w-4 h-4" strokeWidth={3} />
            <span className="font-pixel text-[0.6rem]">{deadline}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/quest/${id}`} className="w-full">
          <Button variant="quest" className="w-full group-hover:bg-forest-light">
            <Sword className="w-4 h-4 mr-2" strokeWidth={3} />
            ACCEPT QUEST
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
