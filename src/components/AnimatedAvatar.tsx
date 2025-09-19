import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import avatarImage from "@/assets/hotel-avatar.png";

interface AnimatedAvatarProps {
  onClick: () => void;
  isOpen: boolean;
}

const AnimatedAvatar = ({ onClick, isOpen }: AnimatedAvatarProps) => {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    // Initial wave animation after component mounts
    const waveTimer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => {
        setIsWaving(false);
      }, 1000);
    }, 1000);

    // Periodic wave every 30 seconds
    const periodicWave = setInterval(() => {
      if (!isOpen) {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1000);
      }
    }, 30000);

    return () => {
      clearTimeout(waveTimer);
      clearInterval(periodicWave);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">

      {/* Floating indicators */}
      <div className="absolute -top-2 -left-2 animate-pulse">
        <div className="w-4 h-4 bg-green-400 rounded-full opacity-80"></div>
      </div>
      <div className="absolute -top-1 -right-1 animate-ping">
        <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
      </div>

      {/* Avatar Button */}
      <Button
        onClick={onClick}
        className={`w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 border-4 border-white transition-all duration-300 hover:scale-110 p-0 overflow-hidden ${
          isOpen ? 'rotate-12 scale-105' : ''
        } ${isWaving ? 'animate-bounce' : ''}`}
      >
        <img 
          src={avatarImage} 
          alt="Hotel Assistant Avatar"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isWaving ? 'animate-pulse scale-110' : ''
          } ${isOpen ? 'scale-110' : ''}`}
        />
        
        {/* Animated glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-green-400/20 animate-pulse ${
          isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}></div>
        
        {/* Ripple effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
      </Button>

      {/* Floating action indicators */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Heart animation for likes */}
        <div className={`absolute top-2 right-2 transition-all duration-500 ${
          isWaving ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <div className="text-red-500 animate-bounce">❤️</div>
        </div>
        
        {/* Star animation for ratings */}
        <div className={`absolute top-4 left-2 transition-all duration-700 ${
          isWaving ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <div className="text-yellow-500 animate-spin">⭐</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAvatar;