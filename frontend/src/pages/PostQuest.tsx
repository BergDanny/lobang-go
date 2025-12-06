import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Scroll, MapPin, Coins, Clock, Sparkles } from "lucide-react";
import { PixelContainer } from "@/components/PixelContainer";
import { PixelHeader } from "@/components/PixelHeader";
import { PixelNav } from "@/components/PixelNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuestStore } from "@/store/questStore";
import questScroll from "@/assets/quest-scroll.png";

const categories = [
  { id: "delivery", label: "DELIVERY", emoji: "📦", color: "forest" },
  { id: "queue", label: "QUEUE", emoji: "⏳", color: "warning" },
  { id: "printing", label: "PRINTING", emoji: "📄", color: "accent" },
  { id: "other", label: "OTHER", emoji: "✨", color: "xp" },
];

const PostQuest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createQuest, isLoading } = useQuestStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationFrom: "",
    locationTo: "",
    price: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCategory) {
      toast({
        title: "⚠️ MISSING CATEGORY",
        description: "Please select a quest category.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.locationTo || !formData.price || !formData.deadline) {
      toast({
        title: "⚠️ MISSING FIELDS",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert datetime-local input to ISO string
      // datetime-local returns format: "YYYY-MM-DDTHH:mm"
      // We need to convert it to ISO datetime string
      const deadlineDateTime = formData.deadline 
        ? new Date(formData.deadline).toISOString()
        : new Date().toISOString();
      
      // Map frontend form data to backend format
      const questData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategory,
        location_from: formData.locationFrom || null,
        location_to: formData.locationTo,
        bounty: parseFloat(formData.price),
        deadline: deadlineDateTime,
        status: "open",
      };

      await createQuest(questData);
      
      toast({
        title: "⚔️ QUEST POSTED!",
        description: "Your quest is now live on the board. Heroes are on their way!",
      });
      
      // Navigate to quests page
      navigate("/quests");
    } catch (error: any) {
      toast({
        title: "❌ FAILED TO POST QUEST",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PixelContainer>
      <PixelHeader />
      
      <main className="container mx-auto p-4 pb-32">
        {/* Back Button */}
        <Link to="/quests" className="inline-flex items-center gap-2 mb-6 font-pixel text-[0.9rem] sm:text-[1rem] text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          BACK TO QUEST BOARD
        </Link>

        {/* Page Title */}
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={questScroll} 
            alt="Quest" 
            className="w-12 h-12 animate-float object-contain" 
            style={{ imageRendering: 'pixelated' }}
          />
          <div>
            <h1 className="font-pixel text-pixel-base sm:text-pixel-lg text-primary">
              POST NEW QUEST
            </h1>
            <p className="font-pixel text-[0.9rem] sm:text-[1rem] text-muted-foreground">
              Create an adventure for heroes to accept
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-pixel-lg">🎯 SELECT QUEST TYPE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map(({ id, label, emoji, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCategory(id)}
                    className={cn(
                      "p-4 border-4 border-border font-pixel text-[0.9rem] sm:text-[1rem] transition-all",
                      "active:translate-x-1 active:translate-y-1 active:shadow-none",
                      selectedCategory === id
                        ? `bg-${color} text-foreground shadow-pixel`
                        : "bg-card shadow-pixel-sm hover:bg-muted"
                    )}
                  >
                    <span className="text-4xl block mb-2">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quest Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-pixel-lg">📜 QUEST DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">QUEST TITLE</label>
                <Input
                  className="text-pixel-lg"
                  placeholder="e.g., Pick up my lunch from cafeteria"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">DESCRIPTION</label>
                <textarea
                  className="w-full h-32 bg-input px-4 py-3 font-pixel-body text-pixel-xl text-foreground border-4 border-border rounded-none shadow-pixel-inset placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Describe what needs to be done in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-forest-light" strokeWidth={3} />
                <CardTitle className="text-pixel-lg">📍 LOCATION</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">PICKUP POINT</label>
                <Input
                  className="text-pixel-lg"
                  placeholder="e.g., Main Cafeteria"
                  value={formData.locationFrom}
                  onChange={(e) => setFormData({ ...formData, locationFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">DELIVERY POINT</label>
                <Input
                  className="text-pixel-lg"
                  placeholder="e.g., Block B, Room 204"
                  value={formData.locationTo}
                  onChange={(e) => setFormData({ ...formData, locationTo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reward & Deadline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-pixel-lg">💰 REWARD & DEADLINE</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">
                  <Coins className="w-6 h-6 text-primary" strokeWidth={3} />
                  REWARD (RM)
                </label>
                <Input
                  className="text-pixel-lg"
                  type="number"
                  placeholder="5.00"
                  min="1"
                  step="0.50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 font-pixel text-[1rem] sm:text-[1.1rem] mb-2 text-muted-foreground">
                  <Clock className="w-6 h-6 text-destructive" strokeWidth={3} />
                  DEADLINE
                </label>
                <Input
                  className="text-pixel-lg"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </CardContent>
          </Card>

          {/* XP Bonus Preview */}
          <div className="rpg-frame-gold p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-xp" strokeWidth={3} />
                <span className="font-pixel text-[1rem] sm:text-[1.1rem] text-muted-foreground">HERO REWARD PREVIEW</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-pixel text-pixel-base text-primary">
                  RM {formData.price || "0"}
                </span>
                <span className="font-pixel text-pixel-base text-xp">
                  +{formData.price ? Math.round(Number(formData.price) * 10) : 0} XP
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="gold" 
            size="xl" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "POSTING QUEST..." : "⚔️ POST QUEST"}
          </Button>
        </form>
      </main>

      <PixelNav />
    </PixelContainer>
  );
};

export default PostQuest;
