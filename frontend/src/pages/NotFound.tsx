import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 font-pixel text-pixel-2xl sm:text-pixel-3xl text-primary">404</h1>
        <p className="mb-4 font-pixel-body text-pixel-xl sm:text-pixel-2xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="font-pixel text-pixel-base sm:text-pixel-lg text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
