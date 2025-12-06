import { cn } from "@/lib/utils";
import forestBg from "@/assets/forest-bg.png";

interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
  showForest?: boolean;
}

export const PixelContainer = ({ children, className, showForest = true }: PixelContainerProps) => {
  return (
    <div className={cn("min-h-screen bg-background relative", className)}>
      {/* Forest Background */}
      {showForest && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${forestBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/95" />
        </div>
      )}
      
      {/* Floating particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Scanlines overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none scanlines" />
    </div>
  );
};
