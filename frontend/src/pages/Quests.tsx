import questScroll from "@/assets/quest-scroll.png";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { PixelNav } from "@/components/PixelNav";
import { QuestCard } from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { mapQuestToCard } from "@/lib/quest-mapper";
import { cn } from "@/lib/utils";
import { useQuestStore } from "@/store/questStore";
import {
  Compass,
  Lock,
  Package,
  Printer,
  Sparkles,
  Sword,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "all", label: "ALL", icon: Sparkles },
  { id: "delivery", label: "DELIVERY", icon: Package },
  { id: "queue", label: "QUEUE", icon: Users },
  { id: "printing", label: "PRINTING", icon: Printer },
];

const Quests = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { quests, isLoading, error, fetchQuests } = useQuestStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  // Map backend quests to card format
  const mappedQuests = quests.map(mapQuestToCard);

  const filteredQuests =
    activeCategory === "all"
      ? mappedQuests
      : mappedQuests.filter((q) => q.category.toLowerCase() === activeCategory);

  return (
    <PixelContainer>
      <PixelHeader />

      <main className="container mx-auto p-4 pb-24">
        {/* Page Title */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={questScroll}
            alt="Quest"
            className="w-12 h-12 animate-float object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <div>
            <h1 className="font-pixel text-pixel-sm sm:text-pixel-base text-primary">
              QUEST BOARD
            </h1>
            <p className="font-pixel text-[0.5rem] text-muted-foreground">
              Choose your adventure wisely, hero
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border-4 border-border font-pixel text-[0.5rem] transition-all",
                "active:translate-x-1 active:translate-y-1 active:shadow-none",
                activeCategory === id
                  ? "bg-forest text-foreground shadow-pixel"
                  : "bg-card shadow-pixel-sm hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={3} />
              {label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted border-4 border-border mb-4 flex items-center justify-center animate-pulse">
              <Compass className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-pixel text-pixel-xs text-muted-foreground">
              LOADING QUESTS...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-destructive/20 border-4 border-destructive mb-4 flex items-center justify-center">
              {error.includes("401") || error.includes("Unauthorized") ? (
                <Lock className="w-8 h-8 text-destructive" />
              ) : (
                <Compass className="w-8 h-8 text-destructive" />
              )}
            </div>
            <p className="font-pixel text-pixel-xs text-destructive">
              {error.includes("401") || error.includes("Unauthorized")
                ? "AUTHENTICATION REQUIRED"
                : "ERROR LOADING QUESTS"}
            </p>
            <p className="font-pixel-body text-pixel-base text-muted-foreground mt-2">
              {error.includes("401") || error.includes("Unauthorized")
                ? "Please log in to view quests."
                : error}
            </p>
            {(error.includes("401") || error.includes("Unauthorized")) && (
              <Link to="/login" className="mt-4 inline-block">
                <Button variant="quest" className="mt-4">
                  GO TO LOGIN
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Quest Stats Banner */}
        {!isLoading && !error && (
          <div className="rpg-frame-gold p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sword
                  className="w-6 h-6 text-primary animate-bounce-pixel"
                  strokeWidth={3}
                />
                <div>
                  <p className="font-pixel text-pixel-xs text-primary">
                    {filteredQuests.length} ACTIVE QUESTS
                  </p>
                  <p className="font-pixel-body text-pixel-sm text-muted-foreground">
                    Awaiting brave adventurers
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-pixel text-pixel-xs text-coin">
                  +{filteredQuests.reduce((sum, q) => sum + q.xp, 0)} XP
                </p>
                <p className="font-pixel text-[0.4rem] text-muted-foreground">
                  TOTAL AVAILABLE
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quest Grid */}
        {!isLoading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuests.map((quest, index) => (
              <div
                key={quest.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuestCard {...quest} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted border-4 border-border mb-4 flex items-center justify-center">
              <Compass className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-pixel text-pixel-xs text-muted-foreground">
              NO QUESTS FOUND
            </p>
            <p className="font-pixel-body text-pixel-base text-muted-foreground mt-2">
              Check back later for new adventures
            </p>
          </div>
        )}
      </main>

      <PixelNav />
    </PixelContainer>
  );
};

export default Quests;
