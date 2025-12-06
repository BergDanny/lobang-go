import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PixelContainer } from "@/components/PixelContainer";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import heroSprite from "@/assets/hero-sprite.png";
import treasureChest from "@/assets/treasure-chest.png";

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AuthPage = () => {
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);
      toast({
        title: "⚔️ WELCOME BACK!",
        description: "Your adventure continues...",
      });
      navigate("/quests");
    } catch (error: any) {
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        
        // Set field-specific errors from backend
        Object.keys(backendErrors).forEach((field) => {
          const fieldName = field as keyof LoginFormData;
          if (fieldName === "email" || fieldName === "password") {
            setError(fieldName, {
              type: "server",
              message: Array.isArray(backendErrors[field])
                ? backendErrors[field][0]
                : backendErrors[field],
            });
          }
        });
      } else {
        // Show general error message
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.";
        toast({
          title: "❌ LOGIN FAILED",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <PixelContainer className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-50 hidden md:block">
        <div className="w-4 h-4 bg-primary animate-sparkle" />
      </div>
      <div className="absolute top-20 right-20 opacity-50 hidden md:block">
        <div className="w-3 h-3 bg-accent animate-sparkle stagger-2" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-50 hidden md:block">
        <div className="w-2 h-2 bg-success animate-sparkle stagger-3" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg mx-auto animate-slide-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          {/* Hero Character */}
          <div className="flex justify-center mb-4">
            <img
              src={heroSprite}
              alt="Hero"
              className="w-24 h-24 animate-bounce-pixel object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          <div className="inline-block bg-gradient-to-r from-primary via-warning to-primary bg-clip-text mb-4">
            <h1 className="font-pixel text-pixel-xl sm:text-pixel-2xl text-primary animate-glow">
              LOBANG GO
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-1 bg-primary" />
            <p className="font-pixel text-[0.5rem] text-muted-foreground tracking-widest">
              CAMPUS QUEST ADVENTURE
            </p>
            <div className="w-6 h-1 bg-primary" />
          </div>

          <p className="font-pixel-body text-pixel-lg text-foreground/80 mt-4">
            Start your journey. Complete quests. Earn rewards.
          </p>
        </div>

        {/* Treasure Chest Decoration */}
        <div className="flex justify-center mb-6">
          <img
            src={treasureChest}
            alt="Treasure"
            className="w-16 h-16 animate-float object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rpg-frame-gold p-6 space-y-6">
            <div className="text-center border-b-4 border-border pb-4">
              <h2 className="font-pixel text-pixel-xs text-primary">
                ⚔️ ADVENTURER LOGIN ⚔️
              </h2>
            </div>

            {/* Backend Error Message */}
            {error && !errors.email && !errors.password && (
              <div className="p-3 bg-destructive/20 border-4 border-destructive">
                <p className="font-pixel text-[0.5rem] text-destructive text-center">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-pixel text-[0.5rem] mb-2 text-muted-foreground">
                  EMAIL
                </label>
                <Input
                  type="email"
                  placeholder="hero@campus.edu"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="font-pixel text-[0.4rem] text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-pixel text-[0.5rem] mb-2 text-muted-foreground">
                  PASSWORD
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="font-pixel text-[0.4rem] text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              size="xl"
              disabled={isLoading}
            >
              {isLoading
                ? "LOADING..."
                : `START ADVENTURE${showCursor ? " ▶" : "  "}`}
            </Button>

            <div className="text-center space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 bg-border" />
                <p className="font-pixel text-[0.4rem] text-muted-foreground">
                  NEW HERO?
                </p>
                <div className="flex-1 h-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // TODO: Navigate to register page when created
                  toast({
                    title: "ℹ️ COMING SOON",
                    description: "Registration feature will be available soon!",
                  });
                }}
              >
                CREATE CHARACTER
              </Button>
            </div>
          </div>
        </form>

        {/* Footer Stats */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="font-pixel text-pixel-sm text-primary">1,234</p>
              <p className="font-pixel text-[0.4rem] text-muted-foreground">
                HEROES
              </p>
            </div>
            <div className="w-1 h-8 bg-border" />
            <div className="text-center">
              <p className="font-pixel text-pixel-sm text-success">5,678</p>
              <p className="font-pixel text-[0.4rem] text-muted-foreground">
                QUESTS
              </p>
            </div>
            <div className="w-1 h-8 bg-border" />
            <div className="text-center">
              <p className="font-pixel text-pixel-sm text-coin">RM 12K</p>
              <p className="font-pixel text-[0.4rem] text-muted-foreground">
                EARNED
              </p>
            </div>
          </div>

          <p className="font-pixel text-[0.4rem] text-muted-foreground">
            © 2024 LOBANG GO • CAMPUS ADVENTURE
          </p>
        </div>
      </div>
    </PixelContainer>
  );
};

export default AuthPage;

