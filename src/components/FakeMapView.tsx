import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Minus, Plus, RotateCcw } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  coordinates?: { lat: number; lng: number };
}

interface FakeMapViewProps {
  hotels: Hotel[];
  selectedHotel?: string;
  onHotelSelect: (hotelId: string) => void;
  onHotelHover?: (hotelId: string | null) => void;
}

const FakeMapView = ({
  hotels: hotelsProp,
  selectedHotel,
  onHotelSelect,
  onHotelHover,
}: FakeMapViewProps) => {
  const [zoom, setZoom] = useState(11);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedHotelData = selectedHotel
    ? hotelsProp.find((h) => h.id === selectedHotel)
    : null;

  // Fake map markers with responsive positioning
  const mapMarkers = hotelsProp
    .filter((hotel) => hotel.coordinates)
    .map((hotel, index) => {
      const baseX = 20 + (index % 4) * 120 + Math.random() * 80;
      const baseY = 50 + Math.floor(index / 4) * 100 + Math.random() * 60;

      return {
        ...hotel,
        x: isMobile ? baseX * 0.7 : baseX, // Scale down for mobile
        y: isMobile ? baseY * 0.8 : baseY,
      };
    });

  const handleZoomIn = () => {
    setZoom(Math.min(18, zoom + 1));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(8, zoom - 1));
  };

  const handleReCenter = () => {
    setZoom(11);
    onHotelSelect("");
  };

  const handleMarkerClick = (hotelId: string) => {
    onHotelSelect(hotelId);
    setZoom(13);
  };

  const handleMarkerHover = (hotelId: string | null) => {
    if (!isMobile) {
      onHotelHover?.(hotelId);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0 relative">
          <div
            className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full relative overflow-hidden rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, #f0f4f8 0%, #e6f2ff 25%, #ddeeff 50%, #d6f5d6 100%)",
            }}
          >
            {/* Realistic map background pattern with streets */}
            <div className="absolute inset-0 opacity-15">
              <div className="grid grid-cols-12 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border-r border-gray-400 h-full" />
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-400 w-full" />
                ))}
              </div>
            </div>

            {/* Major street lines */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-1/4 left-0 right-0 h-1 md:h-2 bg-gray-400 rounded"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 md:h-2 bg-gray-400 rounded"></div>
              <div className="absolute left-1/3 top-0 bottom-0 w-1 md:w-2 bg-gray-400 rounded"></div>
              <div className="absolute right-1/4 top-0 bottom-0 w-1 md:w-2 bg-gray-400 rounded"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 md:h-1 bg-gray-300"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gray-300"></div>
            </div>

            {/* City blocks and buildings representation */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: isMobile ? 12 : 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-gray-500 rounded"
                  style={{
                    left: `${
                      15 +
                      (i % 5) * (isMobile ? 60 : 80) +
                      Math.random() * (isMobile ? 30 : 40)
                    }px`,
                    top: `${
                      30 +
                      Math.floor(i / 5) * (isMobile ? 60 : 100) +
                      Math.random() * (isMobile ? 30 : 50)
                    }px`,
                    width: `${15 + Math.random() * (isMobile ? 20 : 30)}px`,
                    height: `${10 + Math.random() * (isMobile ? 15 : 25)}px`,
                  }}
                />
              ))}
            </div>

            {/* Map Labels - Riyadh Areas */}
            <div
              className="absolute inset-0 text-gray-700 font-medium hidden md:block"
              style={{
                transform: `scale(${zoom / 11})`,
                transformOrigin: "center",
              }}
            >
              <div className="absolute top-12 left-16 text-xs md:text-sm bg-white/80 px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">
                King Fahd District
              </div>
              <div className="absolute top-32 right-20 text-xs md:text-sm bg-white/80 px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">
                Olaya
              </div>
              <div className="absolute bottom-32 left-20 text-xs md:text-sm bg-white/80 px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">
                Al Malaz
              </div>
              <div className="absolute bottom-16 right-16 text-xs md:text-sm bg-white/80 px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">
                Diplomatic Quarter
              </div>
            </div>

            {/* Mobile-optimized central label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base md:text-lg font-bold text-primary bg-white/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md">
              Riyadh
            </div>

            {/* Landmarks */}
            <div className="absolute inset-0 hidden sm:block">
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full shadow-lg"
                  title="Kingdom Centre"
                ></div>
              </div>
              <div className="absolute top-1/4 right-1/4">
                <div
                  className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full shadow-lg"
                  title="Al Faisaliah Tower"
                ></div>
              </div>
            </div>

            {/* Hotel Markers with responsive styling */}
            {mapMarkers.map((hotel) => (
              <div
                key={hotel.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20 touch-manipulation"
                style={{
                  left: `${hotel.x}px`,
                  top: `${hotel.y}px`,
                  transform: `scale(${zoom / 11}) translate(-50%, -50%)`,
                  transformOrigin: "center",
                }}
                onClick={() => handleMarkerClick(hotel.id)}
                onMouseEnter={() => handleMarkerHover(hotel.id)}
                onMouseLeave={() => handleMarkerHover(null)}
              >
                <div
                  className={`relative bg-white rounded-full px-2 py-1 sm:px-3 sm:py-2 shadow-xl border-2 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-110 ${
                    selectedHotel === hotel.id
                      ? "ring-2 sm:ring-4 ring-primary/50 bg-primary text-white border-primary scale-110"
                      : "hover:border-primary/30 border-gray-200"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                    ${hotel.price}
                  </span>
                  {/* Marker pin effect */}
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${
                      selectedHotel === hotel.id
                        ? "border-t-primary"
                        : "border-t-white"
                    }`}
                  ></div>
                </div>
              </div>
            ))}

            {/* Map controls with responsive styling */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col space-y-1 sm:space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReCenter}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Zoom Level Indicator with responsive styling */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 shadow-lg border">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Zoom: {zoom}</span>
              </div>
            </div>

            {/* Copyright/Attribution */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-gray-500 bg-white/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              © HotelRBS Maps
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Hotel Info with responsive layout */}
      {selectedHotelData && (
        <Card className="animate-fade-in">
          <CardContent className="p-3 sm:p-4">
            <div className="flex space-x-3 sm:space-x-4">
              <img
                src={
                  selectedHotelData.images?.[0] ||
                  selectedHotelData.FrontImage ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                }
                alt={selectedHotelData.name || selectedHotelData.HotelName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {selectedHotelData.name || selectedHotelData.HotelName}
                </h3>
                <div className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground text-xs sm:text-sm mt-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {selectedHotelData.location || selectedHotelData.Address}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                    <span className="text-xs sm:text-sm font-medium">
                      {selectedHotelData.rating ||
                        selectedHotelData.HotelRating}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({selectedHotelData.reviews})
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-semibold text-sm sm:text-base">
                      $
                      {selectedHotelData.price ||
                        selectedHotelData.Price ||
                        "N/A"}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm ml-1">
                      night
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend with responsive layout */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-5 sm:w-8 sm:h-6 bg-white rounded border shadow-sm flex items-center justify-center">
                <span className="text-[10px] sm:text-xs font-medium">$</span>
              </div>
              <span className="text-muted-foreground">Hotel prices</span>
            </div>
            <span className="text-muted-foreground">
              Click markers to view details
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FakeMapView;
