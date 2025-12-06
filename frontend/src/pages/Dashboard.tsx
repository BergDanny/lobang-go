import { useEffect, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Target,
  Zap,
  Compass,
  ArrowRight
} from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { PixelNav } from "@/components/PixelNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuestStore } from "@/store/questStore";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
import { QuestCard } from "@/components/QuestCard";
import { mapQuestToCard } from "@/lib/quest-mapper";

const Dashboard = () => {
  const { quests, isLoading, fetchQuests } = useQuestStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  // Calculate insights from quests
  const insights = useMemo(() => {
    const totalQuests = quests.length;
    const activeQuests = quests.filter(q => q.status === 'open' || q.status === 'in_progress').length;
    const completedQuests = quests.filter(q => q.status === 'completed').length;
    const pendingQuests = quests.filter(q => q.status === 'open').length;
    const inProgressQuests = quests.filter(q => q.status === 'in_progress').length;
    
    // User-specific stats
    const userPostedQuests = quests.filter(q => q.poster?.email === user?.email).length;
    const userTakenQuests = quests.filter(q => q.runner?.email === user?.email).length;
    const userCompletedQuests = quests.filter(q => 
      q.runner?.email === user?.email && q.status === 'completed'
    ).length;

    // Category breakdown
    const categoryBreakdown = quests.reduce((acc, quest) => {
      const category = quest.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Total bounty available
    const totalBounty = quests
      .filter(q => q.status === 'open')
      .reduce((sum, q) => {
        const bounty = typeof q.bounty === 'number' ? q.bounty : parseFloat(String(q.bounty || 0));
        return sum + (isNaN(bounty) ? 0 : bounty);
      }, 0);

    // Recent quests (last 5)
    const recentQuests = [...quests]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalQuests,
      activeQuests,
      completedQuests,
      pendingQuests,
      inProgressQuests,
      userPostedQuests,
      userTakenQuests,
      userCompletedQuests,
      categoryBreakdown,
      totalBounty,
      recentQuests,
    };
  }, [quests, user]);

  const mappedRecentQuests = insights.recentQuests.map(mapQuestToCard);

  return (
    <PixelContainer>
      <PixelHeader />

      <main className="container mx-auto p-4 pb-32">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-warning border-4 border-border flex items-center justify-center shadow-pixel-gold">
              <BarChart3 className="w-6 h-6 text-primary-foreground" strokeWidth={3} />
            </div>
            <div>
              <h1 className="font-pixel text-pixel-base sm:text-pixel-lg text-primary">
                DASHBOARD
              </h1>
              <p className="font-pixel text-[0.9rem] sm:text-[1rem] text-muted-foreground">
                Your quest insights at a glance
              </p>
            </div>
          </div>
          <Link to="/quests">
            <Button variant="quest" className="gap-2">
              VIEW ALL QUESTS
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted border-4 border-border mb-4 flex items-center justify-center animate-pulse">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-pixel text-pixel-sm sm:text-pixel-base text-muted-foreground">
              LOADING INSIGHTS...
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Card className="p-4 text-center border-4 border-border shadow-pixel">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" strokeWidth={3} />
                <p className="font-pixel text-pixel-base text-primary">{insights.totalQuests}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">TOTAL QUESTS</p>
              </Card>
              
              <Card className="p-4 text-center border-4 border-border shadow-pixel">
                <Compass className="w-8 h-8 mx-auto mb-2 text-success" strokeWidth={3} />
                <p className="font-pixel text-pixel-base text-success">{insights.activeQuests}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">ACTIVE</p>
              </Card>
              
              <Card className="p-4 text-center border-4 border-border shadow-pixel">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-accent" strokeWidth={3} />
                <p className="font-pixel text-pixel-base text-accent">{insights.completedQuests}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">COMPLETED</p>
              </Card>
              
              <Card className="p-4 text-center border-4 border-border shadow-pixel">
                <Package className="w-8 h-8 mx-auto mb-2 text-warning" strokeWidth={3} />
                <p className="font-pixel text-pixel-base text-warning">RM {Number(insights.totalBounty || 0).toFixed(0)}</p>
                <p className="font-pixel text-[0.8rem] text-muted-foreground">AVAILABLE</p>
              </Card>
            </div>

            {/* User Activity Section */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="border-4 border-border shadow-pixel">
                <CardHeader className="pb-3">
                  <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" strokeWidth={3} />
                    YOUR ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">POSTED</span>
                    </div>
                    <span className="font-pixel text-pixel-base text-accent">{insights.userPostedQuests}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-success" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">TAKEN</span>
                    </div>
                    <span className="font-pixel text-pixel-base text-success">{insights.userTakenQuests}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">COMPLETED</span>
                    </div>
                    <span className="font-pixel text-pixel-base text-primary">{insights.userCompletedQuests}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-border shadow-pixel">
                <CardHeader className="pb-3">
                  <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" strokeWidth={3} />
                    QUEST STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-warning" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">PENDING</span>
                    </div>
                    <Badge variant="outline" className="font-pixel border-2">
                      {insights.pendingQuests}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">IN PROGRESS</span>
                    </div>
                    <Badge variant="outline" className="font-pixel border-2">
                      {insights.inProgressQuests}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-2 border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
                      <span className="font-pixel text-[0.9rem]">COMPLETED</span>
                    </div>
                    <Badge variant="outline" className="font-pixel border-2">
                      {insights.completedQuests}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            {Object.keys(insights.categoryBreakdown).length > 0 && (
              <Card className="mb-6 border-4 border-border shadow-pixel">
                <CardHeader className="pb-3">
                  <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" strokeWidth={3} />
                    QUESTS BY CATEGORY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(insights.categoryBreakdown).map(([category, count]) => (
                      <div
                        key={category}
                        className="p-3 bg-muted/50 border-2 border-border text-center"
                      >
                        <p className="font-pixel text-pixel-base text-primary">{count}</p>
                        <p className="font-pixel text-[0.8rem] text-muted-foreground uppercase">
                          {category}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Quests */}
            {mappedRecentQuests.length > 0 && (
              <Card className="border-4 border-border shadow-pixel">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-pixel text-pixel-sm flex items-center gap-2">
                      <Clock className="w-5 h-5 text-warning" strokeWidth={3} />
                      RECENT QUESTS
                    </CardTitle>
                    <Link to="/quests">
                      <Button variant="ghost" size="sm" className="font-pixel text-[0.8rem] gap-1">
                        VIEW ALL
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mappedRecentQuests.map((quest, index) => (
                      <div
                        key={quest.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <QuestCard {...quest} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {insights.totalQuests === 0 && (
              <Card className="border-4 border-border shadow-pixel text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 mx-auto bg-muted border-4 border-border mb-4 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-pixel text-pixel-sm sm:text-pixel-base text-muted-foreground mb-2">
                    NO QUESTS YET
                  </p>
                  <p className="font-pixel-body text-pixel-lg text-muted-foreground mb-4">
                    Start your adventure by posting your first quest!
                  </p>
                  <Link to="/post">
                    <Button variant="quest" className="gap-2">
                      POST A QUEST
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      <PixelNav />
    </PixelContainer>
  );
};

export default Dashboard;

