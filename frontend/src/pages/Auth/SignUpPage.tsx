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

// Zod schema for signup validation
const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type SignUpFormData = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      clearError();
      await registerUser(data);
      toast({
        title: "🎉 WELCOME HERO!",
        description: "Your adventure begins now...",
      });
      navigate("/quests");
    } catch (error: any) {
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;

        // Set field-specific errors from backend
        Object.keys(backendErrors).forEach((field) => {
          const fieldName = field as keyof SignUpFormData;
          if (
            fieldName === "name" ||
            fieldName === "email" ||
            fieldName === "password" ||
            fieldName === "password_confirmation"
          ) {
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
          "Registration failed. Please try again.";
        toast({
          title: "❌ REGISTRATION FAILED",
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

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rpg-frame-gold p-6 space-y-6">
            <div className="text-center border-b-4 border-border pb-4">
              <h2 className="font-pixel text-pixel-xs text-primary">
                ⚔️ CREATE CHARACTER ⚔️
              </h2>
            </div>

            {/* Backend Error Message */}
            {error &&
              !errors.name &&
              !errors.email &&
              !errors.password &&
              !errors.password_confirmation && (
                <div className="p-3 bg-destructive/20 border-4 border-destructive">
                  <p className="font-pixel text-[0.5rem] text-destructive text-center">
                    {error}
                  </p>
                </div>
              )}

            <div className="space-y-4">
              <div>
                <label className="block font-pixel text-[0.5rem] mb-2 text-muted-foreground">
                  NAME
                </label>
                <Input
                  type="text"
                  placeholder="Hero Name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="font-pixel text-[0.4rem] text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              <div>
                <label className="block font-pixel text-[0.5rem] mb-2 text-muted-foreground">
                  CONFIRM PASSWORD
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password_confirmation")}
                  className={
                    errors.password_confirmation ? "border-destructive" : ""
                  }
                />
                {errors.password_confirmation && (
                  <p className="font-pixel text-[0.4rem] text-destructive mt-1">
                    {errors.password_confirmation.message}
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
                : `CREATE CHARACTER${showCursor ? " ▶" : "  "}`}
            </Button>

            <div className="text-center space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 bg-border" />
                <p className="font-pixel text-[0.4rem] text-muted-foreground">
                  ALREADY A HERO?
                </p>
                <div className="flex-1 h-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                LOGIN
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

export default SignUpPage;

