import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

const HotelDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [loading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (id) {
      fetchHotelDetails(id);
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
            </div>

            {/* Price & Dates */}
            <Card>
              <CardContent className="p-6">
                {hotelDetails.CheckInTime && hotelDetails.CheckOutTime && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>
                      {hotelDetails.CheckInTime} – {hotelDetails.CheckOutTime}
                        </span>
                      </div>
                    )}
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-medium text-center px-2">
                    Book Now
                  </span>
                </div>
                {/* Reserve button (Id for booking), passing hotel code */}
                <Link to={`/booking/${hotelDetails.HotelCode}`}>
                  <Button size="lg" className="w-full">
                    Reserve
                  </Button>
                </Link>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                What this place offers
              </h3>
              <div className="flex flex-wrap gap-3">
                {hotelDetails.HotelFacilities &&
                  hotelDetails.HotelFacilities.map((amenity: string) => (
                  <div
                    key={amenity}
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
                    FrontImage: hotelDetails.FrontImage,
                    HotelName: hotelDetails.HotelName,
                    Address: hotelDetails.Address,
                    HotelRating: hotelDetails.HotelRating,
                    Price: hotelDetails.Price,
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
      </main>
      <Footer />
    </div>
  );
};

export default HotelDetails;