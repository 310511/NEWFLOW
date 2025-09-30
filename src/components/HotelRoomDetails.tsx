import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { getHotelRoom } from '@/services/hotelApi';
import { 
  Bed, 
  Wifi, 
  Car, 
  Coffee, 
  UtensilsCrossed, 
  Shield, 
  AirVent, 
  Tv, 
  Bath,
  Users,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

interface HotelRoomDetailsProps {
  bookingCode: string;
  onClose?: () => void;
  onRoomSelect?: (room: RoomOption) => void;
  selectedRoom?: RoomOption | null;
}

interface RoomOption {
  Name: string;
  BookingCode: string;
  Inclusion: string;
  TotalFare: string;
  TotalTax: string;
  MealType: string;
  IsRefundable: string;
  WithTransfers: string;
}

interface HotelRoomResponse {
  HotelCode: string;
  Currency: string;
  Rooms: RoomOption[];
}

interface RoomDetails {
  HotelCode: string;
  HotelName: string;
  RoomType: string;
  Price: number;
  Currency: string;
  Amenities: string[];
  Description?: string;
  CancellationPolicy?: string;
  MealType?: string;
  Refundable?: boolean;
  CheckIn?: string;
  CheckOut?: string;
  TotalFare?: string;
  TotalTax?: string;
}

const HotelRoomDetails: React.FC<HotelRoomDetailsProps> = ({ bookingCode, onClose, onRoomSelect, selectedRoom }) => {
  const [hotelData, setHotelData] = useState<HotelRoomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingCode) {
      fetchRoomDetails();
    }
  }, [bookingCode]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHotelRoom(bookingCode);
      console.log('🏨 Room details response:', response);
      
      // Process the response based on the actual API structure
      if (response && response.HotelResult) {
        setHotelData(response.HotelResult);
      } else {
        setError('No room details found');
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi {...iconProps} />;
      case 'parking': return <Car {...iconProps} />;
      case 'breakfast': return <Coffee {...iconProps} />;
      case 'restaurant': return <UtensilsCrossed {...iconProps} />;
      case 'security': return <Shield {...iconProps} />;
      case 'ac': return <AirVent {...iconProps} />;
      case 'tv': return <Tv {...iconProps} />;
      case 'bathroom': return <Bath {...iconProps} />;
      case 'bed': return <Bed {...iconProps} />;
      default: return <Bed {...iconProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader />
        <span className="ml-2">Loading room details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchRoomDetails} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hotelData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">No room details available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {onClose && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <CardTitle className="text-xl font-bold">Available Room Options</CardTitle>
              <p className="text-muted-foreground mt-1">Hotel Code: {hotelData.HotelCode}</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              ✕ Close
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Room Options List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Room Types & Meal Plans</h3>
          <div className="grid gap-4">
            {hotelData.Rooms.map((room, index) => {
              const isSelected = selectedRoom?.BookingCode === room.BookingCode;
              return (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => onRoomSelect?.(room)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{room.Name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{room.MealType}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={room.IsRefundable === "true" ? "default" : "destructive"}>
                          {room.IsRefundable === "true" ? "Refundable" : "Non-Refundable"}
                        </Badge>
                        {room.WithTransfers === "true" && (
                          <Badge variant="outline">With Transfers</Badge>
                        )}
                        {isSelected && (
                          <Badge variant="default" className="bg-primary">Selected</Badge>
                        )}
                      </div>
                      {room.Inclusion && (
                        <p className="text-sm text-muted-foreground">{room.Inclusion}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-primary">
                        {hotelData.Currency} {room.TotalFare}
                      </div>
                      {room.TotalTax !== "0" && (
                        <p className="text-sm text-muted-foreground">
                          Tax: {hotelData.Currency} {room.TotalTax}
                        </p>
                      )}
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          variant={isSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRoomSelect?.(room);
                          }}
                        >
                          {isSelected ? "Selected" : "Select Room"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">
            Found {hotelData.Rooms.length} room options with different meal plans and pricing. 
            Each room type offers various meal options (Room Only, Bed & Breakfast, Half Board, Full Board) 
            with different pricing and refund policies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelRoomDetails;
