import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import welcomeBanner from "@/assets/welcome-banner.jpg";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome popup before
    const hasSeenPopup = localStorage.getItem('champion-school-welcome-seen');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('champion-school-welcome-seen', 'true');
  };

  const handleExplore = () => {
    setIsOpen(false);
    localStorage.setItem('champion-school-welcome-seen', 'true');
    // Smooth scroll to quick access section
    document.getElementById('quick-access')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-background border-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white/90 text-gray-800"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="relative animate-scale-in">
            <img
              src={welcomeBanner}
              alt="Welcome to Champion English School"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-4 animate-fade-in">
                Welcome to Champion English School!
              </h2>
              <p className="text-xl mb-6 opacity-90 animate-fade-in animation-delay-200">
                Discover excellence in education at Nepal's premier English school
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400">
                <Button
                  onClick={handleExplore}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Explore Our School
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogHeader className="sr-only">
          <DialogTitle>Welcome to Champion English School</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}