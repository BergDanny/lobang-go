import { useState } from "react";
import { User, Award, History, CreditCard, Star, Sword, Shield, Zap, Target } from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { PixelNav } from "@/components/PixelNav";
import { StatsDisplay } from "@/components/StatsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import heroSprite from "@/assets/hero-sprite.png";
import goldCoin from "@/assets/gold-coin.png";
import treasureChest from "@/assets/treasure-chest.png";

const mockPlayer = {
  name: "PLAYER_ONE",
  email: "player@campus.edu",
  credits: 50.00,
  xp: 450,
  maxXp: 1000,
  level: 5,
  ratingAsClient: 4.8,
  ratingAsProvider: 4.9,
  questsCompleted: 23,
  questsPosted: 15,
  title: "APPRENTICE HERO",
};

const mockTransactions = [
  { id: "1", type: "deposit", amount: 50.00, description: "TOP UP", date: "Today" },
  { id: "2", type: "payment", amount: -5.00, description: "Quest: Lunch Pickup", date: "Yesterday" },
  { id: "3", type: "refund", amount: 8.00, description: "Quest: Library Book", date: "2 days ago" },
];

const mockAchievements = [
  { id: "1", emoji: "🏃", name: "First Quest", unlocked: true },
  { id: "2", emoji: "📦", name: "Delivery Pro", unlocked: true },
  { id: "3", emoji: "⭐", name: "5 Star Hero", unlocked: true },
  { id: "4", emoji: "🎯", name: "Perfect Score", unlocked: false },
  { id: "5", emoji: "🔥", name: "On Fire", unlocked: false },
  { id: "6", emoji: "👑", name: "Legend", unlocked: false },
];

const topUpAmounts = [10, 20, 50];

const Profile = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  return (
    <PixelContainer>
      <PixelHeader />
      
      <main className="container mx-auto p-4 pb-32">
        {/* Hero Card */}
        <div className="rpg-frame-gold p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-forest border-4 border-border shadow-pixel overflow-hidden">
                <img 
                  src={heroSprite} 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary border-2 border-border px-2 py-1">
                <span className="font-pixel text-[0.9rem] text-primary-foreground">LV{mockPlayer.level}</span>
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex-1">
              <h1 className="font-pixel text-pixel-base sm:text-pixel-lg text-primary mb-1">{mockPlayer.name}</h1>
              <Badge variant="accent" className="mb-2 text-pixel-sm">{mockPlayer.title}</Badge>
              <p className="font-pixel-body text-pixel-lg text-muted-foreground">{mockPlayer.email}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(mockPlayer.ratingAsProvider) 
                        ? "text-coin fill-coin" 
                        : "text-muted"
                    )}
                  />
                ))}
                <span className="font-pixel text-[0.9rem] text-coin ml-1">{mockPlayer.ratingAsProvider}</span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-[0.9rem] text-muted-foreground">EXPERIENCE</span>
              <span className="font-pixel text-[0.9rem] text-xp">{mockPlayer.xp} / {mockPlayer.maxXp} XP</span>
            </div>
            <div className="h-6 bg-muted border-4 border-border relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-xp to-accent pixel-progress transition-all duration-500"
                style={{ width: `${(mockPlayer.xp / mockPlayer.maxXp) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-pixel text-[0.8rem] text-foreground drop-shadow-lg">
                  {Math.round((mockPlayer.xp / mockPlayer.maxXp) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <img src={goldCoin} alt="Credits" className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
            </div>
            <p className="font-pixel text-pixel-sm text-primary">RM {mockPlayer.credits.toFixed(0)}</p>
            <p className="font-pixel text-[0.8rem] text-muted-foreground">CREDITS</p>
          </Card>
          <Card className="p-4 text-center">
            <Sword className="w-10 h-10 mx-auto mb-2 text-success" strokeWidth={3} />
            <p className="font-pixel text-pixel-base text-success">{mockPlayer.questsCompleted}</p>
            <p className="font-pixel text-[0.8rem] text-muted-foreground">COMPLETED</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-10 h-10 mx-auto mb-2 text-accent" strokeWidth={3} />
            <p className="font-pixel text-pixel-base text-accent">{mockPlayer.questsPosted}</p>
            <p className="font-pixel text-[0.8rem] text-muted-foreground">POSTED</p>
          </Card>
          <Card className="p-4 text-center">
            <Zap className="w-10 h-10 mx-auto mb-2 text-xp" strokeWidth={3} />
            <p className="font-pixel text-pixel-base text-xp">{mockPlayer.xp}</p>
            <p className="font-pixel text-[0.8rem] text-muted-foreground">TOTAL XP</p>
          </Card>
        </div>

        {/* Top Up Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={treasureChest} alt="Top Up" className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
                <CardTitle className="text-pixel-lg">💰 TOP UP CREDITS</CardTitle>
              </div>
              <Button
                variant={showTopUp ? "outline" : "gold"}
                size="sm"
                onClick={() => setShowTopUp(!showTopUp)}
              >
                {showTopUp ? "CLOSE" : "TOP UP"}
              </Button>
            </div>
          </CardHeader>
          {showTopUp && (
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {topUpAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={cn(
                      "p-4 border-4 border-border font-pixel text-pixel-xs transition-all",
                      "active:translate-x-1 active:translate-y-1 active:shadow-none",
                      selectedAmount === amount
                        ? "bg-primary text-primary-foreground shadow-pixel-gold"
                        : "bg-card shadow-pixel-sm hover:bg-muted"
                    )}
                  >
                    <img src={goldCoin} alt="" className="w-6 h-6 mx-auto mb-2" style={{ imageRendering: 'pixelated' }} />
                    RM {amount}
                  </button>
                ))}
              </div>
              <Button variant="gold" className="w-full" disabled={!selectedAmount}>
                PROCEED TO PAYMENT
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Achievements */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-coin" strokeWidth={3} />
              <CardTitle className="text-pixel-lg">🏆 ACHIEVEMENTS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {mockAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "aspect-square border-4 border-border flex flex-col items-center justify-center p-2 transition-all",
                    achievement.unlocked
                      ? "bg-primary/20 shadow-pixel-gold hover:scale-105"
                      : "bg-muted/50 opacity-50"
                  )}
                >
                  <span className="text-3xl mb-1">{achievement.emoji}</span>
                  <span className="font-pixel text-[0.7rem] text-center text-muted-foreground">
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-accent" strokeWidth={3} />
              <CardTitle className="text-pixel-lg">📜 TRANSACTION LOG</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border-b-2 border-border last:border-b-0 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 border-4 border-border flex items-center justify-center",
                    tx.type === "deposit" ? "bg-success" : tx.type === "refund" ? "bg-warning" : "bg-destructive"
                  )}>
                    <span className="font-pixel text-[0.9rem]">
                      {tx.type === "deposit" ? "+" : tx.type === "refund" ? "↩" : "-"}
                    </span>
                  </div>
                  <div>
                    <p className="font-pixel text-[0.9rem]">{tx.description}</p>
                    <p className="font-pixel-body text-pixel-lg text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-pixel text-pixel-base",
                  tx.amount > 0 ? "text-success" : "text-destructive"
                )}>
                  {tx.amount > 0 ? "+" : ""}RM {Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <PixelNav />
    </PixelContainer>
  );
};

export default Profile;
