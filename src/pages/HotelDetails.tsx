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
import HotelRoomDetails from "@/components/HotelRoomDetails";
import { prebookHotel } from "@/services/bookingapi";
import { searchHotels, getHotelDetails } from "@/services/hotelApi";
import { APP_CONFIG, getCurrentDate, getDateFromNow } from "@/config/constants";

const HotelDetails = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract search parameters (will be redefined below)
  
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
  // console.log(HotelDetails , " details")
  console.log(id ,'id')
  
  // Extract search parameters at component level
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showRoomDetails) {
        handleCloseRoomDetails();
        }
      }
    };

    if (showRoomDetails) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showRoomDetails]);

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



  // const fetchHotelDetails = async (hotelCode: string) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getHotelDetails(hotelCode);
  //     setHotelDetails(response.HotelDetails);
  //   } catch (error) {
  //     console.error("Error fetching hotel details:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchBookingCode = async () => {
    console.log('🔍 fetchBookingCode called with id:', id);
    console.log('🔍 Current state - searchingForBookingCode:', searchingForBookingCode);
    
    if (!id) {
      console.log('❌ No id provided');
      return;
    }
    
    // Prevent multiple simultaneous calls
    if (searchingForBookingCode) {
      console.log('⏳ Already searching for booking code, skipping...');
      return;
    }
    
    setSearchingForBookingCode(true);
    console.log('🚀 Starting booking code fetch...');
    try {
      // Parse ISO dates to YYYY-MM-DD format
      console.log('📅 Raw checkIn:', checkIn);
      console.log('📅 Raw checkOut:', checkOut);
      console.log('👥 Raw guests:', guests);
      console.log('🏠 Raw rooms:', rooms);
      
      let parsedCheckIn = checkIn;
      let parsedCheckOut = checkOut;
      
      if (checkIn && checkIn.includes('T')) {
        try {
          parsedCheckIn = new Date(checkIn).toISOString().split('T')[0];
          console.log('📅 Parsed checkIn:', parsedCheckIn);
        } catch (error) {
          console.error('Error parsing checkIn date:', checkIn, error);
        }
      }
      
      if (checkOut && checkOut.includes('T')) {
        try {
          parsedCheckOut = new Date(checkOut).toISOString().split('T')[0];
          console.log('📅 Parsed checkOut:', parsedCheckOut);
        } catch (error) {
          console.error('Error parsing checkOut date:', checkOut, error);
        }
      }
      
        if (checkIn && checkOut && guests) {
        console.log('✅ All required parameters available, proceeding with search...');
        // Use rooms parameter if available, otherwise default to 1
        const roomsCount = rooms ? parseInt(rooms) : 1;
        const guestsCount = parseInt(guests);
        
        console.log('🏠 roomsCount:', roomsCount);
        console.log('👥 guestsCount:', guestsCount);
        
        // Validate that parsing was successful
        if (isNaN(roomsCount) || isNaN(guestsCount)) {
          console.log('❌ Invalid room or guest count');
          setBookingCode(null);
          return;
        }
        
        const searchParams = {
          CheckIn: parsedCheckIn,
          CheckOut: parsedCheckOut,
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
        
        // Try to get booking code from hotel details first (faster)
        console.log('🚀 Trying to get booking code from hotel details...');
        try {
          const hotelDetailsResponse = await getHotelDetails(id);
          if (hotelDetailsResponse?.Rooms?.BookingCode) {
            console.log('✅ Found booking code from hotel details:', hotelDetailsResponse.Rooms.BookingCode);
            setBookingCode(hotelDetailsResponse.Rooms.BookingCode);
            return;
          }
        } catch (error) {
          console.log('⚠️ Hotel details approach failed, trying search API...');
        }
        
        // Fallback to search API with timeout
        const searchResponse = await Promise.race([
          searchHotels(searchParams),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Search request timeout after 30 seconds')), 30000)
          )
        ]);
        
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
        
        // Add timeout to prevent hanging requests (increased to 30 seconds)
        const defaultSearchResponse = await Promise.race([
          searchHotels(defaultSearchParams),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Default search request timeout after 30 seconds')), 30000)
          )
        ]);
        
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


  const handleReserveClick = async () => {
    console.log("🔍 Debug - checkIn:", checkIn);
    console.log("🔍 Debug - checkOut:", checkOut);
    console.log("🔍 Debug - guests:", guests);
    console.log("🔍 Debug - rooms:", rooms);
    
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
            checkIn: checkIn,
            checkOut: checkOut,
            guests: guests,
            rooms: rooms,
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
  }, [id, searchParams]);

  if (loading) {
    return <Loader />;
  }

  console.log(HotelDetails , " details")

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
    <div className="min-h-screen bg-background">
      <Header />
      <main
        className="w-full px-6 lg:px-8 py-8 pt-header-plus-25"
        style={{
          paddingTop: "calc(var(--header-height-default) + 41px + 19px)",
        }}
      >
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/search">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to search</span>
            </Button>
          </Link>
        </div>

        {/* Hotel Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="aspect-[4/3] relative overflow-hidden rounded-xl">
              <img
                src={
                  hotelDetails.Images?.[0] || 
                  hotelDetails.FrontImage || 
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                }
                alt={hotelDetails.HotelName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hotel Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {/* API does not provide isNew; can skip */}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                {hotelDetails.HotelName}
              </h1>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <span className="font-medium">
                    {hotelDetails.HotelRating
                      ? hotelDetails.HotelRating
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {hotelDetails.Address}, {hotelDetails.CityName},{" "}
                    {hotelDetails.CountryName}
                  </span>
                </div>
              </div>

              {/* Selected Room Information */}
              {selectedRoom && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Selected Room</h4>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{selectedRoom.Name}</p>
                      <p className="text-sm text-muted-foreground">{selectedRoom.MealType}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={selectedRoom.IsRefundable === "true" ? "default" : "destructive"}>
                          {selectedRoom.IsRefundable === "true" ? "Refundable" : "Non-Refundable"}
                        </Badge>
                        {selectedRoom.WithTransfers === "true" && (
                          <Badge variant="outline">With Transfers</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-primary">
                        {hotelDetails.Currency || 'USD'} {selectedRoom.TotalFare}
                      </div>
                      {selectedRoom.TotalTax !== "0" && (
                        <p className="text-sm text-muted-foreground">
                          Tax: {hotelDetails.Currency || 'USD'} {selectedRoom.TotalTax}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <div className="flex gap-3 mt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={handleReserveClick}
                  disabled={prebookLoading || !bookingCode || searchingForBookingCode}
                >
                  {searchingForBookingCode ? "Finding booking code..." : prebookLoading ? "Processing..." : "Reserve"}
                </Button>
            </div>

            {!bookingCode && !searchingForBookingCode && (
              <div className="text-center text-sm text-red-500 mt-2">
                <p>Booking code not available. Please try again.</p>
                <button 
                  onClick={fetchBookingCode}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry Fetch Booking Code
                </button>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-3">
              You won't be charged yet
            </p>

              {/* Available Rooms Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Click on a room to view detailed information including amenities, pricing, and booking details.
                  </p>
                  <div className="grid gap-4">
                    {/* Show selected room if available, otherwise show default room */}
                    {selectedRoom ? (
                      <div className="border border-primary rounded-lg p-4 bg-primary/5">
                      <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{selectedRoom.Name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedRoom.MealType}</p>
                          <div className="flex items-center gap-2 mt-2">
                              <Badge variant={selectedRoom.IsRefundable === "true" ? "default" : "destructive"}>
                                {selectedRoom.IsRefundable === "true" ? "Refundable" : "Non-Refundable"}
                              </Badge>
                              {selectedRoom.WithTransfers === "true" && (
                                <Badge variant="outline">With Transfers</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {hotelDetails.Currency || 'USD'} {selectedRoom.TotalFare}
                            </div>
                            <div className="text-sm text-muted-foreground">total</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            onClick={() => handleViewRoomDetails(bookingCode || "no-booking-code")}
                            variant="outline"
                            className="w-full"
                          >
                            Change Room Selection
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Room Options Available</h4>
                            <p className="text-sm text-muted-foreground">Multiple room types and meal plans available</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">Various Options</Badge>
                              <Badge variant="outline">Different Meal Plans</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold">From $200</div>
                          <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                </div>
                      <div className="mt-4">
                        <Button 
                            onClick={() => handleViewRoomDetails(bookingCode || "no-booking-code")}
                          variant="outline"
                          className="w-full"
                        >
                            View Room Options
                  </Button>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                What this place offers
              </h3>
              <div className="flex flex-wrap gap-3">
                {hotelDetails.HotelFacilities &&
                  hotelDetails.HotelFacilities.map((amenity: string, index: number) => (
                  <div
                    key={`${amenity}-${index}`}
                    className="flex items-center space-x-2 py-1 px-2 rounded-full bg-muted/50"
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description and Hotel Information */}
        {hotelDetails.Description && (() => {
          const sections = extractSections(hotelDetails.Description);
          return (
            <div className="space-y-6 mb-8">
              {/* About this place */}
              {(sections['Amenities'] || sections['Dining'] || sections['Business Amenities'] || sections['Rooms']) && (
                <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              About this place
            </h3>
                    <div className="space-y-4">
                      {sections['Amenities'] && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Amenities</h4>
                          <div 
                            className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: sections['Amenities'] }}
                          />
                        </div>
                      )}
                      {sections['Dining'] && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Dining</h4>
                          <div 
                            className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: sections['Dining'] }}
                          />
                        </div>
                      )}
                      {sections['Business Amenities'] && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Business Amenities</h4>
                          <div 
                            className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: sections['Business Amenities'] }}
                          />
                        </div>
                      )}
                      {sections['Rooms'] && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Rooms</h4>
                          <div 
                            className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: sections['Rooms'] }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attractions */}
              {sections['Attractions'] && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Nearby Attractions
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: sections['Attractions'] }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Location */}
              {sections['Location'] && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Location
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: sections['Location'] }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Check In Instructions */}
              {sections['Check In Instructions'] && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Check In Information
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: sections['Check In Instructions'] }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Fees */}
              {sections['Fees'] && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Fees & Charges
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: sections['Fees'] }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Policies */}
              {sections['Policies'] && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Policies
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: sections['Policies'] }}
                    />
          </CardContent>
        </Card>
              )}
            </div>
          );
        })()}

        {/* Location */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Where you'll be
            </h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <FakeMapView
                hotels={[
                  {
                    id: hotelDetails.HotelCode,
                    name: hotelDetails.HotelName,
                    location: hotelDetails.Address,
                    images: hotelDetails.Images || [hotelDetails.FrontImage],
                    rating: hotelDetails.HotelRating,
                    price: hotelDetails.Price || 200,
                    reviews: 0,
                  },
                ]}
                selectedHotel={hotelDetails.HotelCode}
                onHotelSelect={() => {}}
              />
            </div>
            <div className="mt-4 flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {hotelDetails.Address}, {hotelDetails.CityName},{" "}
                {hotelDetails.CountryName}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Preview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Star className="h-5 w-5 fill-black text-black" />
              <span className="text-xl font-semibold">
                {hotelDetails.HotelRating ? hotelDetails.HotelRating : "N/A"} ·
                Guest Reviews
              </span>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Guest reviews are not available through the API at this time.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This hotel has a {hotelDetails.HotelRating || "N/A"} star rating.
              </p>
            </div>
          </CardContent>
        </Card>


        {/* Room Details Modal */}
        {showRoomDetails && selectedBookingCode && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={handleCloseRoomDetails}
          >
            <div 
              className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <HotelRoomDetails 
                bookingCode={selectedBookingCode} 
                onClose={handleCloseRoomDetails}
                onRoomSelect={handleRoomSelect}
                selectedRoom={selectedRoom}
              />
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default HotelDetails;