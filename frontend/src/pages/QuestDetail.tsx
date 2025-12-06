import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Coins, Zap, Clock, User, Swords, Shield, Star, Crown, Info, Calendar, UserCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { PixelNav } from "@/components/PixelNav";
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
  const bountyValue = typeof quest.bounty === 'number' ? quest.bounty : parseFloat(String(quest.bounty || 0));
  const xp = calculateXP(bountyValue);
  const difficulty = calculateDifficulty(bountyValue);
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
      
      <main className="container mx-auto p-4 pb-32">
        {/* Back Button */}
        <Link to="/quests" className="inline-flex items-center gap-2 mb-6 font-pixel text-[0.9rem] sm:text-[1rem] text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          BACK TO QUEST BOARD
        </Link>

        {/* Quest Header */}
        <div className="rpg-frame-gold p-6 mb-6 border-4 border-border shadow-pixel-gold">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-4xl">{categoryEmoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="forest" className="text-[0.9rem] px-3 py-1">{quest.category.toUpperCase()}</Badge>
                  <Badge variant="warning" className="text-[0.9rem] px-3 py-1">{difficulty.toUpperCase()}</Badge>
                  <Badge 
                    variant={quest.status === "open" ? "success" : quest.status === "in_progress" ? "warning" : "default"}
                    className="text-[0.9rem] px-3 py-1"
                  >
                    {quest.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>
                <h1 className="font-pixel text-pixel-base sm:text-pixel-lg leading-relaxed text-foreground mb-2">
                  {quest.title}
                </h1>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">
                  Posted {getRelativeTime(quest.created_at)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quest Poster Info */}
          {quest.poster && (
            <div className="flex items-center gap-4 p-4 bg-background/50 border-4 border-border">
              <div className="w-16 h-16 bg-forest border-4 border-border flex items-center justify-center shadow-pixel">
                <UserCircle className="w-8 h-8 text-foreground" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="xp" className="text-[0.8rem]">QUEST POSTER</Badge>
                </div>
                <p className="font-pixel text-pixel-sm sm:text-pixel-base text-primary">{quest.poster.name}</p>
                {quest.poster.email && (
                  <p className="font-pixel-body text-[0.8rem] text-muted-foreground mt-1">{quest.poster.email}</p>
                )}
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">POSTED</p>
                <p className="font-pixel text-[0.9rem] text-foreground">{formatDate(quest.created_at)}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">{formatTime(quest.created_at)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quest Description */}
        <Card className="mb-6 border-4 border-border shadow-pixel">
          <CardHeader className="pb-3">
            <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" strokeWidth={3} />
              QUEST DESCRIPTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-pixel-body text-pixel-lg leading-relaxed whitespace-pre-wrap">{quest.description}</p>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="mb-6 border-4 border-border shadow-pixel">
          <CardHeader className="pb-3">
            <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success" strokeWidth={3} />
              LOCATION DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {quest.location_from && (
                <div className="flex items-start gap-3 p-4 bg-forest/20 border-4 border-forest/50">
                  <MapPin className="w-6 h-6 text-forest-light mt-1" strokeWidth={3} />
                  <div className="flex-1">
                    <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">PICKUP LOCATION</p>
                    <p className="font-pixel-body text-pixel-base font-semibold">{quest.location_from}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-success/20 border-4 border-success/50">
                <MapPin className="w-6 h-6 text-success mt-1" strokeWidth={3} />
                <div className="flex-1">
                  <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">DELIVERY LOCATION</p>
                  <p className="font-pixel-body text-pixel-base font-semibold">{quest.location_to}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards & Timeline */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Rewards Card */}
          <Card className="border-4 border-border shadow-pixel">
            <CardHeader className="pb-3">
              <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-warning" strokeWidth={3} />
                REWARDS & BENEFITS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-primary/20 border-4 border-primary/50">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">BOUNTY</p>
                    <p className="font-pixel text-pixel-base text-primary">RM {bountyValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-xp/20 border-4 border-xp/50">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-xp" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">EXPERIENCE POINTS</p>
                    <p className="font-pixel text-pixel-base text-xp">+{xp} XP</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/20 border-4 border-accent/50">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-accent" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">DIFFICULTY</p>
                    <p className="font-pixel text-pixel-base text-accent">{difficulty}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="border-4 border-border shadow-pixel">
            <CardHeader className="pb-3">
              <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                <Calendar className="w-5 h-5 text-destructive" strokeWidth={3} />
                TIMELINE & DEADLINE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-muted/50 border-4 border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className={`w-6 h-6 ${isOverdue ? 'text-destructive' : 'text-warning'}`} strokeWidth={3} />
                  <div className="flex-1">
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">DEADLINE</p>
                    <p className="font-pixel text-pixel-base text-foreground">{formatDate(quest.deadline)}</p>
                    <p className="font-pixel text-[0.9rem] text-muted-foreground">{formatTime(quest.deadline)}</p>
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
              <div className="p-4 bg-muted/50 border-4 border-border">
                <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">CREATED</p>
                <p className="font-pixel text-[0.9rem] text-foreground">{formatDate(quest.created_at)}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">{formatTime(quest.created_at)}</p>
              </div>
              <div className="p-4 bg-muted/50 border-4 border-border">
                <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">LAST UPDATED</p>
                <p className="font-pixel text-[0.9rem] text-foreground">{formatDate(quest.updated_at)}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">{formatTime(quest.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quest Status & Runner Info */}
        <Card className="mb-6 border-4 border-border shadow-pixel">
          <CardHeader className="pb-3">
            <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" strokeWidth={3} />
              QUEST STATUS & ASSIGNMENT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="font-pixel text-[0.8rem] text-muted-foreground mb-1">CURRENT STATUS</p>
                <Badge 
                  variant={quest.status === "open" ? "success" : quest.status === "in_progress" ? "warning" : "default"}
                  className="text-[0.9rem] px-3 py-1"
                >
                  {quest.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>
              {quest.runner && (
                <div className="flex items-center gap-3 p-3 bg-accent/20 border-4 border-accent/50 flex-1 min-w-[200px]">
                  <UserCircle className="w-6 h-6 text-accent" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-[0.8rem] text-muted-foreground">ASSIGNED RUNNER</p>
                    <p className="font-pixel text-pixel-sm text-primary">{quest.runner.name}</p>
                    {quest.runner.email && (
                      <p className="font-pixel-body text-[0.8rem] text-muted-foreground">{quest.runner.email}</p>
                    )}
                  </div>
                </div>
              )}
              {!quest.runner && quest.status === 'open' && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 border-4 border-border">
                  <UserCircle className="w-6 h-6 text-muted-foreground" strokeWidth={3} />
                  <p className="font-pixel text-[0.9rem] text-muted-foreground">No runner assigned yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {quest.status === 'open' && !quest.runner && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button variant="quest" size="xl" className="flex-1">
              <Shield className="w-5 h-5 mr-2" strokeWidth={3} />
              MAKE AN OFFER
            </Button>
            <Button variant="gold" size="xl" className="flex-1">
              <Swords className="w-5 h-5 mr-2" strokeWidth={3} />
              INSTANT ACCEPT
            </Button>
          </div>
        )}
        
        {quest.status === 'in_progress' && quest.runner && (
          <div className="mb-6">
            <Card className="border-4 border-warning/50 bg-warning/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-warning" strokeWidth={3} />
                  <div>
                    <p className="font-pixel text-pixel-sm text-warning">QUEST IN PROGRESS</p>
                    <p className="font-pixel-body text-[0.9rem] text-muted-foreground">
                      This quest is currently being completed by {quest.runner.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {quest.status === 'completed' && (
          <div className="mb-6">
            <Card className="border-4 border-success/50 bg-success/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success" strokeWidth={3} />
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

      <PixelNav />
    </PixelContainer>
  );
};

export default QuestDetail;
