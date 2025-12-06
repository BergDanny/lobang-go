import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Coins, Zap, Clock, User, Swords, Shield, Star, Crown } from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuestStore } from "@/store/questStore";
import { formatTime, formatDateTime } from "@/lib/time-utils";

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuest, isLoading, error, fetchQuestById } = useQuestStore();

  useEffect(() => {
    if (id) {
      fetchQuestById(id);
    }
  }, [id, fetchQuestById]);

  // Calculate XP and difficulty from bounty
  const calculateXP = (bounty: number) => Math.round(bounty * 10);
  const calculateDifficulty = (bounty: number) => {
    if (bounty < 5) return "Easy";
    if (bounty < 10) return "Medium";
    return "Hard";
  };

  if (isLoading) {
    return (
      <PixelContainer>
        <PixelHeader />
        <main className="container mx-auto p-4 pb-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted border-4 border-border mb-4 flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-pixel text-pixel-sm sm:text-pixel-base text-muted-foreground">
              LOADING QUEST...
            </p>
          </div>
        </main>
      </PixelContainer>
    );
  }

  if (error || !currentQuest) {
    return (
      <PixelContainer>
        <PixelHeader />
        <main className="container mx-auto p-4 pb-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-destructive/20 border-4 border-destructive mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-destructive" />
            </div>
            <p className="font-pixel text-pixel-sm sm:text-pixel-base text-destructive">
              {error || "QUEST NOT FOUND"}
            </p>
            <Button onClick={() => navigate("/quests")} className="mt-4">
              Back to Quest Board
            </Button>
          </div>
        </main>
      </PixelContainer>
    );
  }

  const quest = currentQuest;
  const xp = calculateXP(quest.bounty);
  const difficulty = calculateDifficulty(quest.bounty);
  const categoryEmoji = quest.category.toLowerCase() === "delivery" ? "📦" : 
                        quest.category.toLowerCase() === "queue" ? "⏳" : 
                        quest.category.toLowerCase() === "printing" ? "📄" : "✨";

  return (
    <PixelContainer>
      <PixelHeader />
      
      <main className="container mx-auto p-4 pb-8">
        {/* Back Button */}
        <Link to="/quests" className="inline-flex items-center gap-2 mb-6 font-pixel text-[0.9rem] sm:text-[1rem] text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          BACK TO QUEST BOARD
        </Link>

        {/* Quest Header */}
        <div className="rpg-frame-gold p-4 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{categoryEmoji}</div>
              <div>
                <Badge variant="forest" className="mb-2">{quest.category}</Badge>
                <h1 className="font-pixel text-pixel-sm sm:text-pixel-base leading-relaxed text-foreground">
                  {quest.title}
                </h1>
              </div>
            </div>
            <Badge variant="warning">{difficulty}</Badge>
          </div>
          
          {/* Quest Poster */}
          {quest.poster && (
            <div className="flex items-center gap-3 p-3 bg-background/50 border-2 border-border">
              <div className="w-12 h-12 bg-forest border-4 border-border flex items-center justify-center">
                <span className="font-pixel text-[0.9rem] text-foreground">👤</span>
              </div>
              <div className="flex-1">
                <p className="font-pixel text-[0.9rem] sm:text-[1rem] text-primary">{quest.poster.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="xp" className="text-[0.8rem]">POSTER</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-pixel text-[0.8rem] text-muted-foreground">
                  {formatDateTime(quest.created_at)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quest Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-pixel-lg">📜 QUEST DETAILS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-pixel-body text-pixel-lg leading-relaxed">{quest.description}</p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {quest.location_from && (
                <div className="flex items-center gap-3 p-3 bg-forest/20 border-4 border-forest/50">
                  <MapPin className="w-5 h-5 text-forest-light" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">PICKUP</p>
                    <p className="font-pixel-body text-pixel-lg">{quest.location_from}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-success/20 border-4 border-success/50">
                <MapPin className="w-6 h-6 text-success" strokeWidth={3} />
                <div>
                  <p className="font-pixel text-[0.8rem] text-muted-foreground">DELIVER TO</p>
                    <p className="font-pixel-body text-pixel-lg">{quest.location_to}</p>
                </div>
              </div>
            </div>
            
            {/* Rewards */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 p-3 bg-primary/20 border-4 border-primary/50">
                <Coins className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-pixel text-pixel-sm sm:text-pixel-base text-primary">RM {quest.bounty.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-xp/20 border-4 border-xp/50">
                <Zap className="w-6 h-6 text-xp" strokeWidth={3} />
                <span className="font-pixel text-pixel-sm sm:text-pixel-base text-xp">+{xp} XP</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-destructive/20 border-4 border-destructive/50">
                <Clock className="w-6 h-6 text-destructive" strokeWidth={3} />
                <span className="font-pixel text-pixel-sm sm:text-pixel-base text-destructive">DUE: {formatTime(quest.deadline)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quest Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-pixel-lg">📊 QUEST STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={quest.status === "open" ? "success" : quest.status === "in_progress" ? "warning" : "default"}>
                {quest.status.toUpperCase()}
              </Badge>
              {quest.runner && (
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[0.9rem] text-muted-foreground">RUNNER:</span>
                  <span className="font-pixel text-[0.9rem] text-primary">{quest.runner.name}</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-pixel text-[0.8rem] text-muted-foreground">
                Created: {formatDateTime(quest.created_at)}
              </p>
              <p className="font-pixel text-[0.8rem] text-muted-foreground">
                Updated: {formatDateTime(quest.updated_at)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="quest" size="xl" className="flex-1">
            <Shield className="w-5 h-5 mr-2" strokeWidth={3} />
            MAKE AN OFFER
          </Button>
          <Button variant="gold" size="xl" className="flex-1">
            <Swords className="w-5 h-5 mr-2" strokeWidth={3} />
            INSTANT ACCEPT
          </Button>
        </div>
      </main>

    </PixelContainer>
  );
};

export default QuestDetail;
