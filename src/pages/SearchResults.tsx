import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Map as MapIcon,
} from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import Footer from "@/components/Footer";
import AirbnbHotelCard from "@/components/AirbnbHotelCard";
import Header from "@/components/Header";
import { hotels } from "@/data/hotels";
import FakeMapView from "@/components/FakeMapView";

const NewSearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destination = searchParams.get("destination") || "Riyadh";
  const guests = searchParams.get("guests") || "2";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const [priceRange, setPriceRange] = useState<[number, number]>([50, 1000]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>();
  const [hoveredHotel, setHoveredHotel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  const itemsPerPage = viewMode === "map" ? 15 : 20;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter hotels based on selected filters and price range
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const priceInRange =
        hotel.price >= priceRange[0] && hotel.price <= priceRange[1];

      if (!priceInRange) return false;

      // Check amenity filters
      if (selectedFilters.length > 0) {
        const hotelAmenities = hotel.amenities.map((a) => a.toLowerCase());
        return selectedFilters.some(
          (filter) =>
            hotelAmenities.includes(filter) ||
            (filter === "wifi" && hotelAmenities.includes("wifi")) ||
            (filter === "parking" && hotelAmenities.includes("parking")) ||
            (filter === "pool" && hotelAmenities.includes("pool")) ||
            (filter === "gym" && hotelAmenities.includes("gym")) ||
            (filter === "restaurant" &&
              hotelAmenities.includes("restaurant")) ||
            (filter === "kitchen" && hotelAmenities.includes("kitchen")) ||
            (filter === "ac" && hotelAmenities.includes("ac"))
        );
      }

      return true;
    });
  }, [hotels, priceRange, selectedFilters]);

  // Paginated hotels
  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHotels.slice(startIndex, endIndex);
  }, [filteredHotels, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const handleHotelHover = (hotelId: string | null) => {
    setHoveredHotel(hotelId);
    if (hotelId) setSelectedHotel(hotelId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main
        className="w-full pt-header"
        style={{ paddingTop: "calc(var(--header-height-default) + 36px)" }}
      >
        {/* Search Controls Bar */}
        <div className="px-6 py-4 bg-white border-b border-border/30 sticky sticky-below-header z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">
                {filteredHotels.length}+ stays
              </h1>
              <SearchFilters
                priceRange={priceRange}
                setPriceRange={(range) =>
                  setPriceRange(range as [number, number])
                }
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                totalResults={filteredHotels.length}
              />

              {/* Quick Filter Badges */}
              {(priceRange[0] !== 50 ||
                priceRange[1] !== 1000 ||
                selectedFilters.length > 0) && (
                <div className="flex items-center space-x-2">
                  {(priceRange[0] !== 50 || priceRange[1] !== 1000) && (
                    <Badge
                      variant="secondary"
                      className="bg-black text-white text-xs"
                    >
                      ${priceRange[0]} - ${priceRange[1]}+
                    </Badge>
                  )}
                  {selectedFilters.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedFilters.length} filter
                      {selectedFilters.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg border p-1 bg-white shadow-sm">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-md h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                <span className="text-sm">List</span>
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="rounded-md h-8 px-3"
              >
                <MapIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">Map</span>
              </Button>
            </div>
          </div>
        </div>
        {viewMode === "list" ? (
          <div className="px-6 py-8">
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
              {paginatedHotels.map((hotel) => (
                <AirbnbHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  variant="list"
                  onHover={handleHotelHover}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 pb-6 pt-8">
            <div className="flex h-[calc(100vh-200px)] max-h-[800px] rounded-lg overflow-hidden border shadow-lg">
              {/* Hotel List - Left Side - Airbnb Style */}
              <div className="w-1/2 border-r bg-background">
                <div className="h-full flex flex-col">
                  {/* Scrollable Hotel List */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                      {paginatedHotels.map((hotel) => (
                        <AirbnbHotelCard
                          key={hotel.id}
                          hotel={hotel}
                          variant="map"
                          onHover={handleHotelHover}
                          isSelected={
                            selectedHotel === hotel.id ||
                            hoveredHotel === hotel.id
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Map View Pagination - Fixed at bottom */}
                  {totalPages > 1 && (
                    <div className="border-t bg-background p-4 flex justify-center items-center space-x-2 shadow-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground font-medium px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Map - Right Side */}
              <div className="w-1/2 relative">
                <FakeMapView
                  hotels={filteredHotels.map((hotel) => ({
                    ...hotel,
                    coordinates: hotel.coordinates || {
                      lat: 24.7136 + (Math.random() - 0.5) * 0.1,
                      lng: 46.6753 + (Math.random() - 0.5) * 0.1,
                    },
                  }))}
                  selectedHotel={selectedHotel || hoveredHotel || undefined}
                  onHotelSelect={setSelectedHotel}
                  onHotelHover={setHoveredHotel}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewSearchResults;
