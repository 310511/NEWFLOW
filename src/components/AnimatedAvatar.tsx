import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import avatarImage from "@/assets/hotel-avatar.png";

interface AnimatedAvatarProps {
  onClick: () => void;
  isOpen: boolean;
}

const AnimatedAvatar = ({ onClick, isOpen }: AnimatedAvatarProps) => {
  const [isWaving, setIsWaving] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Initial wave animation after component mounts
    const waveTimer = setTimeout(() => {
      setIsWaving(true);
      setShowGreeting(true);
      setTimeout(() => {
        setIsWaving(false);
        setTimeout(() => setShowGreeting(false), 2000);
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Greeting Bubble */}
      {showGreeting && !isOpen && (
        <div className="absolute bottom-20 right-0 mb-2 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg p-3 max-w-48 border">
            <p className="text-sm text-gray-700 font-medium">
              Hi! I'm here to help you find the perfect hotel! 👋
            </p>
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      )}

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
        className={`w-20 h-20 rounded-full shadow-2xl bg-gradient-to-br from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 border-4 border-white transition-all duration-300 hover:scale-110 p-0 overflow-hidden ${
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