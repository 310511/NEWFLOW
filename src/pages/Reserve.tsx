import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Clock, User, Calendar, Users } from "lucide-react";
import { prebookHotel } from "@/services/bookingapi";
import { getHotelDetails, searchHotels } from "@/services/hotelApi";
import { APP_CONFIG, getCurrentDate, getDateFromNow } from "@/config/constants";

const Reserve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [loading, setIsLoading] = useState(false);
  const [prebookLoading, setPrebookLoading] = useState(false);
  const [prebookData, setPrebookData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get search parameters from URL
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  const fetchHotelDetails = async (hotelCode: string) => {
    setIsLoading(true);
    try {
      const response = await getHotelDetails(hotelCode);
      setHotelDetails(response.HotelDetails);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      // Provide mock data if API fails
      setHotelDetails({
        HotelCode: hotelCode,
        HotelName: "Sample Hotel",
        Address: "Sample Address",
        CityName: "Sample City",
        CountryName: "Sample Country",
        HotelRating: "4.5",
        FrontImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrebook = async () => {
    try {
      setPrebookLoading(true);
      setError(null);
      console.log("🔒 Starting prebook process...");

      // First, get a real booking code from search API
      let bookingCode = null;
      
      try {
        console.log("🔍 Getting real booking code from search API...");
        
      const searchParams = {
        CheckIn: checkIn || getCurrentDate(),
        CheckOut: checkOut || getDateFromNow(1),
        HotelCodes: id || "",
        GuestNationality: APP_CONFIG.DEFAULT_GUEST_NATIONALITY,
        PreferredCurrencyCode: APP_CONFIG.DEFAULT_CURRENCY,
        PaxRooms: Array.from({ length: parseInt(rooms) || APP_CONFIG.DEFAULT_ROOMS }, () => ({
          Adults: parseInt(guests) || APP_CONFIG.DEFAULT_GUESTS,
          Children: APP_CONFIG.DEFAULT_CHILDREN,
          ChildrenAges: []
        })),
        IsDetailResponse: true,
        ResponseTime: APP_CONFIG.DEFAULT_RESPONSE_TIME
      };
        
        const searchResponse = await searchHotels(searchParams);
        console.log("🔍 Search response for booking code:", searchResponse);
        
        if (searchResponse?.HotelResult) {
          const hotel = searchResponse.HotelResult;
          // Handle both array and object structures
          if (Array.isArray(hotel)) {
            const foundHotel = hotel.find(h => h.HotelCode === id);
            if (foundHotel?.Rooms && Array.isArray(foundHotel.Rooms) && foundHotel.Rooms.length > 0) {
              bookingCode = foundHotel.Rooms[0].BookingCode;
              console.log("✅ Found real booking code (array structure):", bookingCode);
            }
          } else if (hotel.HotelCode === id && hotel.Rooms && hotel.Rooms.BookingCode) {
            // Handle object structure where Rooms is an object
            bookingCode = hotel.Rooms.BookingCode;
            console.log("✅ Found real booking code (object structure):", bookingCode);
          }
        }
      } catch (searchError) {
        console.error("❌ Error getting booking code from search:", searchError);
      }
      
      // If no real booking code found, show error
      if (!bookingCode) {
        console.log("📭 No real booking code found");
        setError("No booking code available. Please try searching again.");
        return;
      }

      const prebookResponse = await prebookHotel({
        BookingCode: bookingCode,
        PaymentMode: "Limit",
      });

      console.log("✅ Prebook successful:", prebookResponse);

      // Check if prebook was successful
      if (prebookResponse.Status && prebookResponse.Status.Code === "200") {
        setPrebookData({
          ...prebookResponse,
          BookingCode: bookingCode,
        });
      } else {
        setError(prebookResponse.Status?.Description || "Prebook failed");
      }
    } catch (error) {
      console.error("Prebook error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setPrebookLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchHotelDetails(id);
    }
  }, [id]);

  // Check if we have prebook data from navigation state
  useEffect(() => {
    if (location.state?.prebookData) {
      setPrebookData(location.state.prebookData);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading hotel details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hotel Details
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {hotelDetails?.HotelName || "Hotel Name"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {hotelDetails?.Address || "Hotel Address"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Check-in: {checkIn || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Check-out: {checkOut || "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{guests || "N/A"} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{rooms || "N/A"} rooms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prebook Status */}
            {prebookData ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Reservation Confirmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Booking Reference</Label>
                        <p className="font-medium">{prebookData.BookingReference || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Total Amount</Label>
                        <p className="font-medium">
                          {prebookData.Currency} {prebookData.TotalAmount || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Expiry Time</Label>
                        <p className="font-medium">{prebookData.ExpiryTime || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <p className="font-medium text-green-600">
                          {prebookData.Status?.Description || "Confirmed"}
                        </p>
                      </div>
                    </div>
                    
                    <Alert className="mt-4">
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Your reservation is confirmed! You can complete the booking by providing payment details.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Reserve Your Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Click the button below to reserve your room. This will hold your reservation for a limited time.
                  </p>
                  
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    onClick={handlePrebook}
                    disabled={prebookLoading}
                    className="w-full"
                    size="lg"
                  >
                    {prebookLoading ? "Reserving..." : "Reserve Room"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel</span>
                    <span className="font-medium">{hotelDetails?.HotelName || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">{checkIn || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{checkOut || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium">{guests || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rooms</span>
                    <span className="font-medium">{rooms || "N/A"}</span>
                  </div>
                  
                  {prebookData && (
                    <>
                      <hr />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-bold text-lg">
                          {prebookData.Currency} {prebookData.TotalAmount || "N/A"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Reserve;
