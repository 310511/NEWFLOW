import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FakeMapView from "@/components/FakeMapView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  Share,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Users,
  Calendar,
  ArrowLeft,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Shield,
  AirVent,
  Tv,
  Bath,
  Bed,
  Shirt,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { getHotelDetails } from "@/services/hotelApi";
import HotelRoomDetails from "@/components/HotelRoomDetails";
import BookingModal from "@/components/BookingModal";
import { prebookHotel } from "@/services/bookingapi";
import { searchHotels } from "@/services/hotelApi";
import { APP_CONFIG, getCurrentDate, getDateFromNow } from "@/config/constants";

  const HotelDetails = () => {
    const { id } = useParams();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract search parameters
  const rooms = parseInt(searchParams.get("rooms") || "1");
  const guests = parseInt(searchParams.get("guests") || "1");
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [loading, setIsLoading] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedBookingCode, setSelectedBookingCode] = useState<string | null>(null);
  const [prebookLoading, setPrebookLoading] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [searchingForBookingCode, setSearchingForBookingCode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showRoomDetails) {
          handleCloseRoomDetails();
        } else if (showBookingModal) {
          handleCloseBookingModal();
        }
      }
    };

    if (showRoomDetails || showBookingModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showRoomDetails, showBookingModal]);


  const fetchHotelDetails = async (hotelCode: string) => {
    setIsLoading(true);
    try {
      const response = await getHotelDetails(hotelCode);
      setHotelDetails(response.HotelDetails);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingCode = async () => {
    if (!id) {
      return;
    }
    
    setSearchingForBookingCode(true);
    try {
      // Get search parameters from URL
      let checkIn = searchParams.get("checkIn");
      let checkOut = searchParams.get("checkOut");
      const guests = searchParams.get("guests");
      const rooms = searchParams.get("rooms");
      
      // Parse ISO dates to YYYY-MM-DD format
      if (checkIn && checkIn.includes('T')) {
        try {
          checkIn = new Date(checkIn).toISOString().split('T')[0];
        } catch (error) {
          console.error('Error parsing checkIn date:', checkIn, error);
        }
      }
      
      if (checkOut && checkOut.includes('T')) {
        try {
          checkOut = new Date(checkOut).toISOString().split('T')[0];
        } catch (error) {
          console.error('Error parsing checkOut date:', checkOut, error);
        }
      }
      
        if (checkIn && checkOut && guests) {
        // Use rooms parameter if available, otherwise default to 1
        const roomsCount = rooms ? parseInt(rooms) : 1;
        const guestsCount = parseInt(guests);
        
        // Validate that parsing was successful
        if (isNaN(roomsCount) || isNaN(guestsCount)) {
          setBookingCode(null);
          return;
        }
        
        const searchParams = {
          CheckIn: checkIn,
          CheckOut: checkOut,
          HotelCodes: id,
          GuestNationality: APP_CONFIG.DEFAULT_GUEST_NATIONALITY,
          PreferredCurrencyCode: APP_CONFIG.DEFAULT_CURRENCY,
          PaxRooms: Array.from({ length: roomsCount }, () => ({
            Adults: guestsCount,
            Children: APP_CONFIG.DEFAULT_CHILDREN,
            ChildrenAges: []
          })),
          IsDetailResponse: true,
          ResponseTime: APP_CONFIG.DEFAULT_RESPONSE_TIME
        };
        
        const searchResponse = await searchHotels(searchParams);
        
        if (searchResponse?.HotelResult) {
          const hotel = searchResponse.HotelResult;
          
          // Handle both array and object structures
          if (Array.isArray(hotel)) {
            const foundHotel = hotel.find(h => h.HotelCode === id);
            
            if (foundHotel?.Rooms) {
              if (Array.isArray(foundHotel.Rooms) && foundHotel.Rooms.length > 0) {
                const foundBookingCode = foundHotel.Rooms[0].BookingCode;
                setBookingCode(foundBookingCode);
                return;
              } else if (foundHotel.Rooms.BookingCode) {
                // Handle object structure where Rooms is an object
                const foundBookingCode = foundHotel.Rooms.BookingCode;
                setBookingCode(foundBookingCode);
                return;
              }
            }
          } else if (hotel.HotelCode && hotel.Rooms && hotel.Rooms.BookingCode) {
            // Handle object structure where Rooms is an object
            if (hotel.HotelCode === id || hotel.HotelCode === String(id)) {
              const foundBookingCode = hotel.Rooms.BookingCode;
              setBookingCode(foundBookingCode);
              return;
            }
          }
        }
      }
      
      // If no search parameters available, try with default values
      if (!checkIn || !checkOut || !guests) {
        const defaultSearchParams = {
          CheckIn: getCurrentDate(),
          CheckOut: getDateFromNow(1),
          HotelCodes: id,
          GuestNationality: APP_CONFIG.DEFAULT_GUEST_NATIONALITY,
          PreferredCurrencyCode: APP_CONFIG.DEFAULT_CURRENCY,
          PaxRooms: [{ 
            Adults: APP_CONFIG.DEFAULT_GUESTS, 
            Children: APP_CONFIG.DEFAULT_CHILDREN, 
            ChildrenAges: [] 
          }],
          IsDetailResponse: true,
          ResponseTime: APP_CONFIG.DEFAULT_RESPONSE_TIME
        };
        
        const defaultSearchResponse = await searchHotels(defaultSearchParams);
        
        if (defaultSearchResponse?.HotelResult) {
          const hotel = defaultSearchResponse.HotelResult;
          
          if (Array.isArray(hotel)) {
            const foundHotel = hotel.find(h => h.HotelCode === id);
            if (foundHotel?.Rooms && Array.isArray(foundHotel.Rooms) && foundHotel.Rooms.length > 0) {
              const foundBookingCode = foundHotel.Rooms[0].BookingCode;
              setBookingCode(foundBookingCode);
              return;
            }
          } else if (hotel.HotelCode && hotel.Rooms && hotel.Rooms.BookingCode) {
            if (hotel.HotelCode === id || hotel.HotelCode === String(id)) {
              const foundBookingCode = hotel.Rooms.BookingCode;
              setBookingCode(foundBookingCode);
              return;
            }
          }
        }
      }
      
      // If no booking code found from search, show error
      setBookingCode(null);
      
    } catch (error) {
      console.error("Error fetching booking code:", error);
      // Set booking code to null if search fails
      setBookingCode(null);
    } finally {
      setSearchingForBookingCode(false);
    }
  };

  const handleViewRoomDetails = (bookingCode: string) => {
    setSelectedBookingCode(bookingCode);
    setShowRoomDetails(true);
  };

  const handleCloseRoomDetails = () => {
    setShowRoomDetails(false);
    setSelectedBookingCode(null);
  };

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    setBookingCode(room.BookingCode);
    console.log("Selected room:", room);
  };

  const handleBookingClick = () => {
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  const handleReserveClick = async () => {
    if (!bookingCode) {
      console.error("No booking code available, trying to fetch again...");
      // Try to fetch booking code again
      await fetchBookingCode();
      if (!bookingCode) {
        alert("Booking code is not available. Please try again.");
        return;
      }
    }

    setPrebookLoading(true);
    try {
      console.log("🔒 Starting prebook process with booking code:", bookingCode);

      const prebookResponse = await prebookHotel({
        BookingCode: bookingCode,
        PaymentMode: "Limit",
      });

      console.log("✅ Prebook successful:", prebookResponse);

      // Check if prebook was successful
      if (prebookResponse.Status && prebookResponse.Status.Code === "200") {
        // Navigate to booking page with hotel code and prebook data
        navigate(`/booking/${hotelDetails.HotelCode}`, {
          state: {
            prebookData: prebookResponse,
            bookingCode: bookingCode,
            hotelDetails: hotelDetails,
          },
        });
      } else {
        // Handle prebook failure
        console.error("Prebook failed:", prebookResponse);
        alert(
          `Prebook failed: ${
            prebookResponse.Status?.Description || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("💥 Prebook error:", error);
      alert(
        `Prebook failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setPrebookLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchHotelDetails(id);
      fetchBookingCode();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!hotelDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Hotel Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The hotel you're looking for doesn't exist.
          </p>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (html: string) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/andlt;/g, '<')
      .replace(/andgt;/g, '>')
      .replace(/andamp;/g, '&')
      .replace(/andquot;/g, '"')
      .replace(/and#39;/g, "'");
  };

  // Helper function to extract sections from description
  const extractSections = (description: string) => {
    const decoded = decodeHtmlEntities(description);
    const sections: { [key: string]: string } = {};
    
    // Extract different sections using regex
    const sectionRegex = /<b>([^<]+)<\/b><br\s*\/?>(.*?)(?=<b>|$)/gs;
    let match;
    
    while ((match = sectionRegex.exec(decoded)) !== null) {
      const sectionName = match[1].trim();
      const sectionContent = match[2].trim();
      sections[sectionName] = sectionContent;
    }
    
    return sections;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
      case "free wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "restaurant":
        return <Coffee className="h-4 w-4" />;
      case "pool":
        return <Waves className="h-4 w-4" />;
      case "gym":
        return <Dumbbell className="h-4 w-4" />;
      case "spa":
        return <Bath className="h-4 w-4" />;
      case "ac":
      case "air conditioning":
        return <AirVent className="h-4 w-4" />;
      case "kitchen":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "concierge":
        return <Users className="h-4 w-4" />;
      case "workspace":
        return <Bed className="h-4 w-4" />;
      case "laundry":
        return <Shirt className="h-4 w-4" />;
      case "security":
      case "24/7 support":
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to search</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-bold truncate mx-4">
            Hotel Details
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hotel Images - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-[16/10] sm:aspect-[4/3] relative overflow-hidden rounded-xl">
              <img
                src={hotelDetails.FrontImage}
                alt={hotelDetails.HotelName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail images - hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:grid grid-cols-2 gap-2">
              {hotelDetails.Images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-video relative overflow-hidden rounded-lg"
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Details Section */}
          <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {hotelDetails.HotelName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <span className="font-medium">
                    {hotelDetails.HotelRating}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {hotelDetails.Address}, {hotelDetails.CityName}
                  </span>
                </div>
              </div>

              {/* Selected Room - Responsive */}
              {selectedRoom && (
                <div className="mt-4 lg:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-base sm:text-lg mb-2">
                    Selected Room
                  </h4>
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">
                        {selectedRoom.Name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedRoom.MealType}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="default">Refundable</Badge>
                        <Badge variant="outline">With Transfers</Badge>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {hotelDetails.Currency} {selectedRoom.TotalFare}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Including taxes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-6">
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  onClick={() => alert("Reserve clicked")}
                >
                  Reserve
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Now
                </Button>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                You won't be charged yet
              </p>

              {/* Available Rooms Section - Responsive */}
              <div className="mt-6 lg:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Available Rooms
                </h3>
                <div className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base">
                        Room Options Available
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Multiple room types available
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Various Options</Badge>
                        <Badge variant="outline">Different Meals</Badge>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-bold">
                        From ${hotelDetails.Price}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        per night
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowRoomDetails(true)}
                    variant="outline"
                    className="w-full mt-3 sm:mt-4"
                  >
                    View Room Options
                  </Button>
                </div>
              </div>
            </div>

            {/* Amenities - Responsive Grid */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                {hotelDetails.HotelFacilities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-100 text-sm"
                  >
                    <Wifi className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Responsive */}
        <Card className="mb-6 lg:mb-8">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Where you'll be
            </h3>
            <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <FakeMapView hotelDetails={hotelDetails} />
            </div>
            <div className="mt-3 sm:mt-4 flex items-start space-x-2 text-sm sm:text-base text-gray-600">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <span className="break-words">
                {hotelDetails.Address}, {hotelDetails.CityName},{" "}
                {hotelDetails.CountryName}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reviews - Responsive */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <Star className="h-5 w-5 fill-black text-black" />
              <span className="text-lg sm:text-xl font-semibold">
                {hotelDetails.HotelRating} · Guest Reviews
              </span>
            </div>
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-gray-600">
                Guest reviews are not available at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Room Details Modal - Responsive */}
      {showRoomDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-lg w-full sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <HotelRoomDetailsResponsive
              onClose={() => setShowRoomDetails(false)}
              onRoomSelect={(room) => {
                setSelectedRoom(room);
                setShowRoomDetails(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Booking Modal - Responsive */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-lg w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Complete Booking</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600">Booking form would go here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;