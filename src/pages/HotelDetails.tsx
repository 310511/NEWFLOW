import { useState } from "react";
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
import { hotels } from "@/data/hotels";

const HotelDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find hotel by ID
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
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
                src={hotel.images[currentImageIndex]}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
                }}
              />

              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {hotel.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/60"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {hotel.images.slice(1, 5).map((image, index) => (
                <button
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg"
                  onClick={() => setCurrentImageIndex(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Hotel Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {hotel.isNew && (
                    <Badge className="bg-primary text-primary-foreground">
                      New
                    </Badge>
                  )}
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
                {hotel.name}
              </h1>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <span className="font-medium">{hotel.rating}</span>
                  <span>({hotel.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.location}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-baseline space-x-2 mb-2">
                      {" "}
                      {/* Adjusted mb-4 to mb-2 */}
                      {hotel.originalPrice && (
                        <span className="text-muted-foreground line-through text-lg">
                          ${hotel.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-foreground">
                        ${hotel.price}
                      </span>
                      <span className="text-muted-foreground">night</span>
                    </div>

                    {hotel.checkIn && hotel.checkOut && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {" "}
                        {/* Removed mb-4 */}
                        <Calendar className="h-4 w-4" />
                        <span>
                          {hotel.checkIn} – {hotel.checkOut}
                        </span>
                      </div>
                    )}
                  </div>
                  <img
                    src="/Couple-Going-On-Vacation.gif"
                    alt="Couple Going On Vacation"
                    className="w-28 h-28 object-cover rounded-md"
                  />
                </div>

                <Link to={`/booking/${hotel.id}`}>
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
                {hotel.amenities.map((amenity) => (
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

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              About this place
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Experience luxury and comfort at {hotel.name}, located in the
              heart of {hotel.location}. This property offers exceptional
              service and amenities to make your stay memorable. With a{" "}
              {hotel.rating}-star rating from {hotel.reviews} guests, you can
              trust in the quality of your accommodation.
            </p>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Where you'll be
            </h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <FakeMapView
                hotels={[hotel]}
                selectedHotel={hotel.id}
                onHotelSelect={() => {}}
              />
            </div>
            <div className="mt-4 flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{hotel.location}</span>
              <span>•</span>
              <span>{hotel.distance} from city center</span>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Preview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Star className="h-5 w-5 fill-black text-black" />
              <span className="text-xl font-semibold">
                {hotel.rating} · {hotel.reviews} reviews
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample reviews */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        A
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Ahmed</p>
                      <p className="text-sm text-muted-foreground">
                        March 2024
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent location and service. The staff was very helpful
                    and the room was clean and comfortable.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        S
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah</p>
                      <p className="text-sm text-muted-foreground">
                        February 2024
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amazing experience! The hotel exceeded my expectations in
                    every way. Highly recommended.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="mt-6">
              Show all {hotel.reviews} reviews
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HotelDetails;
