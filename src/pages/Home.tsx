import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import ReviewsSection from "@/components/ReviewsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart, Search } from "lucide-react";
import SimpleHotelCard from "@/components/SimpleHotelCard";
import { hotels } from "@/data/hotels";
import { useFavorites } from "@/hooks/useFavorites";
import NewCustomSearchBar from "@/components/NewCustomSearchBar";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Test debug info
  console.log('🏠 Home component is rendering!');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowStickySearch(currentScrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredHotels = hotels.slice(0, 6);
  const luxuryHotels = hotels.slice(4, 10);
  const businessHotels = hotels.slice(2, 8);
  const weekendHotels = hotels.slice(1, 7);
  const familyHotels = hotels.slice(3, 9);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Add top padding to account for fixed header - responsive */}
      <main
        className="relative pt-16 sm:pt-20 md:pt-24 lg:pt-32"
        style={{
          paddingTop: "clamp(64px, calc(var(--header-height-default) + 20px), calc(var(--header-height-default) + 37px + 56px + 26px))",
        }}
      >
        {/* Mobile Search Bar - Always visible on mobile */}
        <section className="block md:hidden px-4 py-4 bg-white border-b">
          <div className="w-full">
            <NewCustomSearchBar isSticky={false} />
          </div>
        </section>

        {/* Hotel Categories Quick Access */}
        <section className="py-6 md:py-8 bg-muted/30">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Browse by Category
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Find the perfect accommodation for your needs
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  name: "Luxury Hotels",
                  image:
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
                  description: "5-star accommodations",
                  link: "/search?category=luxury",
                },
                {
                  name: "Business Hotels",
                  image:
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
                  description: "Perfect for business trips",
                  link: "/search?category=business",
                },
                {
                  name: "Family Suites",
                  image:
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
                  description: "Spacious family rooms",
                  link: "/search?category=family",
                },
                {
                  name: "Weekend Getaways",
                  image:
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
                  description: "Perfect for short trips",
                  link: "/search?category=weekend",
                },
              ].map((category, index) => (
                <Link key={index} to={category.link}>
                  <Card className="overflow-hidden shadow-intense-3d hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.2),0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer rounded-xl md:rounded-2xl group hover:scale-[1.02]">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-3 md:p-4">
                        <h3 className="text-white font-bold text-sm md:text-lg mb-1">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-xs md:text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Hotels */}
        <section className="py-8 md:py-10 bg-muted/30">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Featured Hotels
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Hand-picked accommodations for your perfect stay
                </p>
              </div>
              <Link to="/search">
                <Button variant="outline" className="text-sm">
                  View all hotels
                </Button>
              </Link>
            </div>

            {/* Responsive grid - 1 col on mobile, 2 on sm, 3 on lg, up to 6 on xl */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {featuredHotels.map((hotel, index) => (
                <SimpleHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(hotel.id)}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Luxury Hotels */}
        <section className="py-8 md:py-10">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Luxury Hotels
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Experience the finest hospitality
                </p>
              </div>
              <Link to="/search">
                <Button variant="outline" className="text-sm">
                  View all luxury
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {luxuryHotels.map((hotel, index) => (
                <SimpleHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(hotel.id)}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Business Hotels */}
        <section className="py-8 md:py-10 bg-muted/30">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Business Hotels
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Perfect for business travelers
                </p>
              </div>
              <Link to="/search">
                <Button variant="outline" className="text-sm">
                  View all business
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {businessHotels.map((hotel, index) => (
                <SimpleHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(hotel.id)}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Weekend Getaways */}
        <section className="py-8 md:py-10">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Weekend Getaways
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Perfect escapes for short trips
                </p>
              </div>
              <Link to="/search">
                <Button variant="outline" className="text-sm">
                  View all getaways
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {weekendHotels.map((hotel, index) => (
                <SimpleHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(hotel.id)}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Family Hotels */}
        <section className="py-8 md:py-10 bg-muted/30">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Family-Friendly Hotels
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Great accommodations for the whole family
                </p>
              </div>
              <Link to="/search">
                <Button variant="outline" className="text-sm">
                  View all family hotels
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {familyHotels.map((hotel, index) => (
                <SimpleHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={isFavorite(hotel.id)}
                  animationDelay={index * 80}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <ReviewsSection />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Home;