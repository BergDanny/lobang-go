import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Coins, Zap, Clock, User, Swords, Shield, Star, Info, Calendar, UserCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuestStore } from "@/store/questStore";
import { formatTime, formatDateTime, formatDate, getRelativeTime } from "@/lib/time-utils";

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuest, isLoading, error, fetchQuestById } = useQuestStore();

  useEffect(() => {
    if (id) {
      fetchQuestById(id);
    }
  }, [id, fetchQuestById]);

  // Calculate XP from bounty
  const calculateXP = (bounty: number) => Math.round(bounty * 10);

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
  const bountyValue = typeof quest.bounty === 'number' ? quest.bounty : parseFloat(String(quest.bounty || 0));
  const xp = calculateXP(bountyValue);
  const categoryEmoji = quest.category.toLowerCase() === "delivery" ? "📦" : 
                        quest.category.toLowerCase() === "queue" ? "⏳" : 
                        quest.category.toLowerCase() === "printing" ? "📄" : "✨";
  
  // Calculate time until deadline
  const deadlineDate = new Date(quest.deadline);
  const now = new Date();
  const timeUntilDeadline = deadlineDate.getTime() - now.getTime();
  const hoursUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
  const isOverdue = timeUntilDeadline < 0;

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
        <div className="rpg-frame-gold p-4 mb-4 border-4 border-border shadow-pixel-gold">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{categoryEmoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="forest" className="text-[0.9rem] px-3 py-1">{quest.category.toUpperCase()}</Badge>
                <Badge 
                  variant={quest.status === "open" ? "success" : quest.status === "in_progress" ? "warning" : "default"}
                  className="text-[0.9rem] px-3 py-1"
                >
                  {quest.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="font-pixel text-pixel-base sm:text-pixel-lg leading-relaxed text-foreground mb-1">
                {quest.title}
              </h1>
              {quest.poster && (
                <p className="font-pixel text-[0.8rem] text-muted-foreground">
                  Posted by {quest.poster.name} • {getRelativeTime(quest.created_at)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quest Description */}
        <Card className="mb-4 border-4 border-border shadow-pixel">
          <CardHeader className="pb-2">
            <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" strokeWidth={3} />
              DESCRIPTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-pixel-body text-pixel-lg leading-relaxed whitespace-pre-wrap">{quest.description}</p>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="mb-4 border-4 border-border shadow-pixel">
          <CardHeader className="pb-2">
            <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success" strokeWidth={3} />
              LOCATIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quest.location_from && (
                <div className="flex items-start gap-2 p-3 bg-forest/20 border-2 border-forest/50">
                  <MapPin className="w-5 h-5 text-forest-light mt-1" strokeWidth={3} />
                  <div className="flex-1">
                    <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">PICKUP</p>
                    <p className="font-pixel-body text-pixel-base">{quest.location_from}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 p-3 bg-success/20 border-2 border-success/50">
                <MapPin className="w-5 h-5 text-success mt-1" strokeWidth={3} />
                <div className="flex-1">
                  <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">DELIVER TO</p>
                  <p className="font-pixel-body text-pixel-base">{quest.location_to}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards & Deadline */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Rewards */}
          <Card className="border-4 border-border shadow-pixel">
            <CardHeader className="pb-2">
              <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-warning" strokeWidth={3} />
                REWARDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-primary/20 border-2 border-primary/50">
                <Coins className="w-6 h-6 text-primary" strokeWidth={3} />
                <div>
                  <p className="font-pixel text-[0.8rem] text-muted-foreground">BOUNTY</p>
                  <p className="font-pixel text-pixel-base text-primary">RM {bountyValue.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-xp/20 border-2 border-xp/50">
                <Zap className="w-6 h-6 text-xp" strokeWidth={3} />
                <div>
                  <p className="font-pixel text-[0.8rem] text-muted-foreground">EXPERIENCE</p>
                  <p className="font-pixel text-pixel-base text-xp">+{xp} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deadline */}
          <Card className="border-4 border-border shadow-pixel">
            <CardHeader className="pb-2">
              <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                <Calendar className="w-5 h-5 text-destructive" strokeWidth={3} />
                DEADLINE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted/50 border-2 border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`w-5 h-5 ${isOverdue ? 'text-destructive' : 'text-warning'}`} strokeWidth={3} />
                  <div className="flex-1">
                    <p className="font-pixel text-pixel-base text-foreground">{formatDate(quest.deadline)}</p>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">{formatTime(quest.deadline)}</p>
                  </div>
                </div>
                {isOverdue ? (
                  <Badge variant="destructive" className="mt-2">OVERDUE</Badge>
                ) : hoursUntilDeadline < 24 ? (
                  <Badge variant="warning" className="mt-2">
                    {hoursUntilDeadline > 0 ? `${hoursUntilDeadline} HOURS LEFT` : 'DUE SOON'}
                  </Badge>
                ) : (
                  <Badge variant="success" className="mt-2">
                    {Math.floor(hoursUntilDeadline / 24)} DAYS LEFT
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        {quest.status === 'open' && !quest.runner && (
          <div className="mb-4">
            <Button variant="quest" size="xl" className="w-full">
              <Swords className="w-5 h-5 mr-2" strokeWidth={3} />
              ACCEPT QUEST
            </Button>
          </div>
        )}
        
        {quest.status === 'in_progress' && quest.runner && (
          <div className="mb-4">
            <Card className="border-4 border-warning/50 bg-warning/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-warning" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-pixel-sm text-warning">QUEST IN PROGRESS</p>
                    <p className="font-pixel-body text-[0.9rem] text-muted-foreground">
                      Being completed by {quest.runner.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {quest.status === 'completed' && (
          <div className="mb-4">
            <Card className="border-4 border-success/50 bg-success/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-pixel-sm text-success">QUEST COMPLETED</p>
                    <p className="font-pixel-body text-[0.9rem] text-muted-foreground">
                      This quest has been successfully completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </PixelContainer>
  );
};

export default QuestDetail;
