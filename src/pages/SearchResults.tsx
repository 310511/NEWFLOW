import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Map as MapIcon,
  Loader2,
  AlertCircle,
  X,
  Grid3x3,
  Map,
} from "lucide-react";

import SearchFilters from "@/components/SearchFilters";
import Footer from "@/components/Footer";
import AirbnbHotelCard from "@/components/AirbnbHotelCard";
import Header from "@/components/Header";
import { useHotelSearch } from "@/hooks/useHotelSearch";
import FakeMapView from "@/components/FakeMapView";
import { getCountryList, getCityList, getHotelCodeList } from "@/services/hotelCodeApi";
import { APP_CONFIG, getCurrentDate, getDateFromNow } from "@/config/constants";

const SearchResults = () => {
  console.log('🚀 SearchResults component rendering...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destination = searchParams.get("destination") || "Riyadh";
  const guests = searchParams.get("guests") || APP_CONFIG.DEFAULT_GUESTS.toString();
  const checkInRaw = searchParams.get("checkIn") || "";
  const checkOutRaw = searchParams.get("checkOut") || "";
  
  // Parse ISO dates to YYYY-MM-DD format
  const parseDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return "";
    }
  };
  
  const checkIn = parseDate(checkInRaw);
  const checkOut = parseDate(checkOutRaw);

  const [priceRange, setPriceRange] = useState<[number, number]>([50, 5000]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>();
  const [hoveredHotel, setHoveredHotel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const itemsPerPage = viewMode === "map" ? 15 : 20;

  // Use the hotel search hook
  const { hotels, loading, error, search } = useHotelSearch();
  
  // Local loading state for the dynamic search process
  const [isSearching, setIsSearching] = useState(false);
  
  // Debug logging
  console.log('📊 SearchResults state:', { 
    destination,
    guests,
    checkInRaw,
    checkOutRaw,
    checkIn,
    checkOut,
    hotels: hotels, 
    hotelsType: typeof hotels, 
    hotelsIsArray: Array.isArray(hotels),
    hotelsLength: hotels?.length, 
    loading, 
    error 
  });

  // Additional debugging for hotels
  if (hotels && hotels.length > 0) {
    console.log('🏨 Hotels found in state:', hotels);
    console.log('🏨 First hotel:', hotels[0]);
  } else {
    console.log('❌ No hotels in state');
  }
  
  // Additional debugging
  console.log('🔍 Search function available:', typeof search);


  // Dynamic search based on destination
  useEffect(() => {
    console.log('🚨 SEARCHRESULTS USEEFFECT TRIGGERED!');
    console.log('🔍 SearchResults useEffect triggered with:', { checkIn, checkOut, destination, guests });
    console.log('📊 SearchResults state:', { hotels, loading, error });
    console.log('📊 Hotels array length:', hotels.length);
    console.log('📊 Hotels array:', hotels);
    console.log('🔍 Search function in useEffect:', typeof search);
    
    // Only search if we have valid parameters
    if (checkIn && checkOut && destination && guests) {
      console.log('✅ All parameters valid, starting search...');
      
      // No hardcoded city codes - everything will be fetched dynamically from API

      // Simple 4-step flow: Country → City → Hotel Codes → Search
      const performSearch = async () => {
        console.log('🔍 Starting simple 4-step search for:', destination);
        setIsSearching(true);
        
        try {
          // Step 1: Get country code
          console.log('🌍 Step 1: Getting country code...');
          const countryResponse = await getCountryList();
          const countryName = destination.split(',')[1]?.trim() || destination.split(',')[0]?.trim();
          const country = countryResponse.CountryList?.find(c =>
            c.Name.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(c.Name.toLowerCase())
          );
          
          if (!country) {
            console.log('❌ Country not found:', countryName);
            setIsSearching(false);
            return;
          }
          
          const countryCode = country.Code;
          console.log('✅ Step 1 complete - Country:', country.Name, '→', countryCode);

          // Step 2: Get city code
          console.log('🏙️ Step 2: Getting city code...');
          const cityResponse = await getCityList(countryCode);
          const cityName = destination.split(',')[0]?.trim();
          const city = cityResponse.CityList?.find(c =>
            c.CityName.toLowerCase().includes(cityName.toLowerCase()) ||
            cityName.toLowerCase().includes(c.CityName.toLowerCase())
          );
          
          if (!city) {
            console.log('❌ City not found:', cityName);
            setIsSearching(false);
            return;
          }
          
          const cityCode = city.CityCode;
          console.log('✅ Step 2 complete - City:', city.CityName, '→', cityCode);

          // Step 3: Get hotel codes
          console.log('🏨 Step 3: Getting hotel codes...');
          const hotelResponse = await getHotelCodeList(countryCode, cityCode, false);
          
          if (!hotelResponse.HotelList || hotelResponse.HotelList.length === 0) {
            console.log('❌ No hotels found for:', cityName);
            setIsSearching(false);
            return;
          }
          
          // Filter hotels to only include those from the specific city
          const cityHotels = hotelResponse.HotelList.filter(hotel => 
            hotel.CityCode === cityCode
          );
          
          if (cityHotels.length === 0) {
            console.log('❌ No hotels found for city:', cityName, 'with city code:', cityCode);
            setIsSearching(false);
            return;
          }
          
          // Take first 20 hotel codes from the filtered city hotels
          const hotelCodes = cityHotels.slice(0, 20).map(hotel => hotel.HotelCode).join(',');
          console.log('✅ Step 3 complete - Found', cityHotels.length, 'hotels for', cityName, 'using first 20');

          // Step 4: Search hotels
          console.log('🔍 Step 4: Searching hotels...');
          const searchParams = {
            CheckIn: checkIn,
            CheckOut: checkOut,
            HotelCodes: hotelCodes,
            GuestNationality: APP_CONFIG.DEFAULT_GUEST_NATIONALITY,
            PreferredCurrencyCode: APP_CONFIG.DEFAULT_CURRENCY,
            PaxRooms: [{ 
              Adults: parseInt(guests) || APP_CONFIG.DEFAULT_GUESTS, 
              Children: APP_CONFIG.DEFAULT_CHILDREN, 
              ChildrenAges: [] 
            }],
            IsDetailResponse: true,
            ResponseTime: APP_CONFIG.DEFAULT_RESPONSE_TIME
          };
          
             const searchResult = await search(searchParams);
             console.log('✅ Step 4 complete - Search finished');
             console.log('🔍 Search result:', searchResult);
             console.log('🔍 Hotels state after search:', hotels);
             
             // Force a small delay to ensure state updates
             await new Promise(resolve => setTimeout(resolve, 100));
          
          // Debug: Log the first hotel's room structure to understand pricing
          if (hotels && hotels.length > 0) {
            console.log('🔍 Debug - First hotel rooms structure:', hotels[0].Rooms);
            if (hotels[0].Rooms && hotels[0].Rooms.length > 0) {
              console.log('🔍 Debug - First room details:', hotels[0].Rooms[0]);
            }
          }
          
      } catch (error) {
          console.error('❌ Search failed:', error);
        } finally {
          setIsSearching(false);
        }
        
        // Safety timeout to ensure isSearching gets reset
        setTimeout(() => {
          setIsSearching(false);
        }, 10000);
      };
      
      // Call async function (fire and forget)
      performSearch().catch(error => {
        console.error('❌ Error in hotel search:', error);
        setIsSearching(false);
      });
    }
  }, [checkIn, checkOut, destination, guests, search]);

  // Filter hotels based on selected filters and price range
  const filteredHotels = useMemo(() => {
    console.log('🔍 Filtering hotels...');
    console.log('🏨 Input hotels:', hotels);
    
    if (!hotels || !Array.isArray(hotels)) {
      console.log('❌ Hotels is not an array:', hotels);
      return [];
    }
    
    let filtered = hotels.filter((hotel) => {
        // Extract price from API response - Rooms is an object with TotalFare
        let price = hotel.Price;
        console.log('🔍 SearchResults price extraction:', {
          hotelName: hotel.HotelName,
          Price: hotel.Price,
          Rooms: hotel.Rooms,
          TotalFare: (hotel.Rooms as any)?.TotalFare
        });
        
        // Always prioritize TotalFare from Rooms object (this is the real price from API)
        if (hotel.Rooms && (hotel.Rooms as any).TotalFare) {
          price = (hotel.Rooms as any).TotalFare;
          console.log('✅ SearchResults using TotalFare from Rooms:', price);
        } else if (hotel.Price) {
          price = hotel.Price;
          console.log('⚠️ SearchResults using hotel.Price as fallback:', price);
        } else {
          console.log('❌ SearchResults no price found - Rooms:', hotel.Rooms, 'Price:', hotel.Price);
          price = 0; // No hardcoded fallback - show 0 if no price found
        }
        // Convert string to number if needed
        price = typeof price === 'string' ? parseFloat(price) : price;
        
        console.log('🔍 SearchResults final price:', price);
        return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedFilters.includes("Free cancellation")) {
      filtered = filtered.filter((hotel) =>
        hotel.CancellationPolicy?.includes("Free")
      );
    }

    console.log('✅ Filtered hotels:', filtered);
    console.log('✅ Filtered hotels length:', filtered.length);
    console.log('✅ Price range:', priceRange);
    return filtered;
  }, [hotels, priceRange, selectedFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, priceRange, viewMode]);

  // Debug logging for render
  console.log('🔍 Rendering SearchResults with:');
  console.log('🏨 Total hotels:', hotels?.length || 0);
  console.log('🏨 Filtered hotels:', filteredHotels.length);
  console.log('🏨 Paginated hotels:', paginatedHotels.length);
  console.log('🏨 Loading state:', loading);
  console.log('🏨 Is searching:', isSearching);
  console.log('🏨 Error state:', error);
  console.log('🏨 Hotels array:', hotels);
  console.log('🏨 Paginated hotels:', paginatedHotels);
  console.log('🏨 Should show hotels:', !loading && !error && !isSearching && paginatedHotels.length > 0);
  
  // Debug first hotel if exists
  if (hotels && hotels.length > 0) {
    console.log('🔍 First hotel details:', hotels[0]);
    console.log('🔍 First hotel price extraction:', {
      Price: hotels[0].Price,
      Rooms: hotels[0].Rooms,
      TotalFare: (hotels[0].Rooms as any)?.TotalFare,
      extractedPrice: hotels[0].Price || (hotels[0].Rooms && (hotels[0].Rooms as any).TotalFare ? (hotels[0].Rooms as any).TotalFare : 100)
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="w-full pt-16 sm:pt-20 md:pt-24 lg:pt-32">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Search Header - Responsive */}
          <div className="flex flex-col gap-4 py-4 sm:py-6 border-b border-gray-200">
            {/* Top Row: Back button and destination info */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 mt-1"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">
                  {destination}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  <span className="inline-block">{checkIn} - {checkOut}</span>
                  <span className="mx-1.5">•</span>
                  <span className="inline-block">{guests} guests</span>
                </p>
              </div>
            </div>

            {/* Bottom Row: View mode buttons - Responsive */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                <span className="hidden xs:inline">List</span>
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                <Map className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                <span className="hidden xs:inline">Map</span>
              </Button>
            </div>
          </div>

          {/* Content Area - Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 py-4 sm:py-6">
            {/* Filters Sidebar - Mobile: Full screen overlay, Desktop: Sidebar */}
            {showFilters && (
              <>
                {/* Mobile Overlay Background */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setShowFilters(false)}
                />
                
                {/* Filters Panel */}
                <div className={`
                  fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
                  w-full sm:w-96 lg:w-80 xl:w-96
                  bg-white lg:bg-transparent
                  transform transition-transform duration-300 ease-in-out
                  ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                  overflow-y-auto
                  lg:flex-shrink-0
                `}>
                  <div className="h-full p-4 sm:p-6 lg:p-0 lg:pr-4 space-y-4 sm:space-y-6">
                    {/* Close Button - Only on mobile */}
                    <div className="flex justify-between items-center lg:hidden sticky top-0 bg-white z-10 pb-4 -mt-4">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  
                    {/* Price Range */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center">
                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full mr-2 sm:mr-3"></div>
                        Price range
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <Slider
                          value={priceRange}
                          onValueChange={(range) => setPriceRange(range)}
                          max={5000}
                          min={50}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between gap-2">
                          <div className="bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border flex-1 text-center">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">${priceRange[0]}</span>
                          </div>
                          <div className="bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border flex-1 text-center">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">${priceRange[1]}+</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Type */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center">
                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-2 sm:mr-3"></div>
                        Type of place
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { id: 'hotel', label: 'Hotels', count: 198 },
                          { id: 'apartment', label: 'Apartments', count: 89 },
                          { id: 'resort', label: 'Resorts', count: 45 },
                          { id: 'villa', label: 'Villas', count: 23 }
                        ].map((type) => (
                          <div key={type.id} className="flex items-center justify-between hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-all duration-200">
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                              <Checkbox 
                                id={type.id}
                                checked={selectedFilters.includes(type.id)}
                                onCheckedChange={() => {
                                  setSelectedFilters(
                                    selectedFilters.includes(type.id)
                                      ? selectedFilters.filter(id => id !== type.id)
                                      : [...selectedFilters, type.id]
                                  );
                                }}
                              />
                              <label htmlFor={type.id} className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer truncate">
                                {type.label}
                              </label>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ml-2">
                              {type.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center">
                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-2 sm:mr-3"></div>
                        Amenities
                      </h3>
                      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {[
                          { id: 'wifi', label: 'Wi-Fi', count: 245 },
                          { id: 'parking', label: 'Free parking', count: 189 },
                          { id: 'pool', label: 'Pool', count: 156 },
                          { id: 'gym', label: 'Gym', count: 134 },
                          { id: 'restaurant', label: 'Restaurant', count: 176 },
                          { id: 'kitchen', label: 'Kitchen', count: 156 },
                          { id: 'ac', label: 'Air conditioning', count: 298 },
                          { id: 'workspace', label: 'Workspace', count: 87 }
                        ].map((amenity) => (
                          <div key={amenity.id} className="flex items-center justify-between hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-all duration-200">
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                              <Checkbox 
                                id={amenity.id}
                                checked={selectedFilters.includes(amenity.id)}
                                onCheckedChange={() => {
                                  setSelectedFilters(
                                    selectedFilters.includes(amenity.id)
                                      ? selectedFilters.filter(id => id !== amenity.id)
                                      : [...selectedFilters, amenity.id]
                                  );
                                }}
                              />
                              <label htmlFor={amenity.id} className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer truncate">
                                {amenity.label}
                              </label>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ml-2">
                              {amenity.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Filters Button - Mobile Only */}
                    <div className="lg:hidden sticky bottom-0 bg-white pt-4 pb-2 -mb-4">
                      <Button
                        variant="default"
                        onClick={() => setShowFilters(false)}
                        className="w-full h-10 sm:h-11"
                      >
                        Show {filteredHotels.length} results
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Results Section - Flexible width */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="hidden xs:inline">Searching...</span>
                    </span>
                  ) : (
                    `${filteredHotels.length} properties found`
                  )}
                </p>
              </div>

              {/* Loading State */}
              {(loading || isSearching) && (
                <div className="flex items-center justify-center py-12 sm:py-16 min-h-[300px] sm:min-h-[400px]">
                  <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
                    <span className="text-base sm:text-lg font-medium text-center">
                      {isSearching ? 'Fetching hotels...' : 'Finding the best hotels...'}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md">
                      {isSearching 
                        ? 'Please wait while we fetch hotel data' 
                        : 'Please wait while we search for accommodations'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && !isSearching && (
                <div className="flex items-center justify-center py-12 px-4">
                  <div className="flex items-center gap-2 text-red-600 text-sm sm:text-base">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>Error: {error}</span>
                  </div>
                </div>
              )}

              {/* No Results State */}
              {!loading && !error && !isSearching && filteredHotels.length === 0 && (
                <div className="flex items-center justify-center py-12 px-4">
                  <div className="text-center">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      No hotels found
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Try adjusting your filters or search criteria.
                    </p>
                  </div>
                </div>
              )}

              {/* Hotels Grid - Responsive columns */}
              {hotels && hotels.length > 0 && viewMode === "list" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {hotels.map((hotel, index) => (
                    <div
                      key={hotel.HotelCode || index}
                      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{hotel.HotelName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">★ {hotel.StarRating}</p>
                        <p className="text-base sm:text-lg font-bold mt-2">${hotel.Price}/night</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Map View - Responsive */}
              {viewMode === "map" && hotels && hotels.length > 0 && (
                <div className="bg-gray-200 rounded-lg sm:rounded-xl h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-600">Map View (Implementation needed)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;