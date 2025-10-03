import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Clock, User, Calendar, Users } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import CancelModal from "@/components/CancelModal";

const Booking = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prebookData, setPrebookData] = useState<any>(null);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (location.state?.prebookData) {
      setPrebookData(location.state.prebookData);
    }
    if (location.state?.hotelDetails) {
      setHotelDetails(location.state.hotelDetails);
    }
  }, [location.state]);

  if (!prebookData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">No prebooking data found</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Go Back
              </Button>
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
                      <span>Check-in: {location.state?.checkIn || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Check-out: {location.state?.checkOut || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prebook Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Prebooking Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Booking Reference</p>
                      <p className="font-medium">{location.state?.bookingCode || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium">
                        {prebookData.HotelResult?.Currency} {prebookData.HotelResult?.Rooms?.TotalFare || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Room Type</p>
                      <p className="font-medium">{prebookData.HotelResult?.Rooms?.Name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium text-green-600">
                        {prebookData.Status?.Description || "Confirmed"}
                      </p>
                    </div>
                  </div>
                  
                  <Alert className="mt-4">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Your prebooking is confirmed! You can now proceed with the final booking by providing payment details.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
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
                    <span className="font-medium">{location.state?.checkIn || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{location.state?.checkOut || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{prebookData.HotelResult?.Rooms?.Name || "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meal Type</span>
                    <span className="font-medium">{prebookData.HotelResult?.Rooms?.MealType || "N/A"}</span>
                  </div>
                  
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-lg">
                      {prebookData.HotelResult?.Currency} {prebookData.HotelResult?.Rooms?.TotalFare || "N/A"}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setShowBookingModal(true)}
                    >
                      Book Now
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="flex-1 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Booking Modal */}
      {showBookingModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setShowBookingModal(false)}
        >
          <div 
            className="bg-background rounded-lg max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <BookingModal 
              hotelDetails={hotelDetails}
              selectedRoom={prebookData?.HotelResult?.Rooms}
              rooms={location.state?.rooms}
              guests={location.state?.guests}
              onClose={() => setShowBookingModal(false)}
            />
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setShowCancelModal(false)}
        >
          <div 
            className="bg-background rounded-lg max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <CancelModal 
              hotelName={hotelDetails?.HotelName}
              bookingReference={location.state?.bookingCode}
              onClose={() => setShowCancelModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
