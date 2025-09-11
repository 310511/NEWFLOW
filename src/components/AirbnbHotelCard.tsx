import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Hotel } from '@/data/hotels';
import { Button } from '@/components/ui/button';

interface AirbnbHotelCardProps {
  hotel: Hotel;
  onHover?: (hotelId: string | null) => void;
  isSelected?: boolean;
  variant?: 'list' | 'map';
}

const AirbnbHotelCard = ({ hotel, onHover, isSelected, variant = 'list' }: AirbnbHotelCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  if (variant === 'map') {
    return (
      <div 
        className={`bg-background rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-3d hover:shadow-3d-hover hover:scale-[1.02] ${
          isSelected ? 'ring-2 ring-primary shadow-3d-hover scale-[1.02]' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => onHover?.(hotel.id)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className="flex h-20">
          <div className="relative w-20 flex-shrink-0">
            <img 
              src={hotel.images[0]} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={handleLike}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between h-full">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate mb-1">{hotel.name}</h3>
                <p className="text-muted-foreground text-xs truncate">{hotel.location}</p>
              </div>
              <div className="ml-2 text-right">
                <div className="flex items-center mb-1">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  <span className="text-xs font-medium">{hotel.rating}</span>
                </div>
                <div>
                  <span className="font-semibold text-sm">${hotel.price}</span>
                  <div className="text-xs text-muted-foreground">night</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-background rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-3d hover:shadow-3d-hover hover:scale-[1.02] animate-fade-in"
      onClick={handleClick}
      onMouseEnter={() => onHover?.(hotel.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={hotel.images[currentImageIndex]} 
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Navigation Buttons */}
        {hotel.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevImage}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNextImage}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {hotel.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Guest Favourite Badge */}
        {hotel.isNew && (
          <div className="absolute top-6 left-2 bg-white px-2 py-1 rounded-md text-xs font-medium">
            Guest favourite
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{hotel.name}</h3>
            <p className="text-muted-foreground text-sm">{hotel.location}</p>
          </div>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>

        {hotel.checkIn && hotel.checkOut && (
          <div className="text-muted-foreground text-sm mb-2">
            {hotel.checkIn} – {hotel.checkOut}
          </div>
        )}

        <div className="flex items-baseline">
          <span className="font-semibold text-foreground">${hotel.price}</span>
          <span className="text-muted-foreground text-sm ml-1">night</span>
          {hotel.originalPrice && (
            <span className="text-muted-foreground text-sm line-through ml-2">
              ${hotel.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirbnbHotelCard;