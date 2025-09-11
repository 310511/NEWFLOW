import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationPicker, DatePicker, GuestSelector, SearchButton } from "./SearchComponents";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

interface Props {
  isSticky?: boolean;
}

const AirbnbSearchBar = ({ isSticky = false }: Props) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowDestinations(false);
        setShowDatePicker(false);
        setShowGuests(false);
        setShowCheckout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: destination || 'Riyadh',
      guests: (adults + children).toString(),
      checkIn: dateRange[0].startDate.toISOString(),
      checkOut: dateRange[0].endDate.toISOString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleFieldClick = (field: string) => {
    setIsExpanded(true);
    setActiveField(field);
  };

  const handleSearchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setActiveField('destination');
    } else {
      handleSearch();
    }
  };

  const totalGuests = adults + children;

  return (
    <div className="w-full">
      <div 
        ref={searchBarRef}
        className={`bg-background border border-border rounded-full shadow-search transition-all duration-300 ${
          isExpanded ? 'scale-105 shadow-card-hover' : 'hover:shadow-card-hover'
        } ${isSticky ? 'scale-90' : ''} backdrop-blur-sm mx-0`}
      >
        <div className="flex items-center px-6 pr-8">
          {/* Where */}
          <div className="flex-1">
            <DestinationPicker
              value={destination}
              onChange={setDestination}
              isOpen={showDestinations}
              onOpenChange={setShowDestinations}
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Check in */}
          <div className="flex-1">
            <DatePicker
              startDate={dateRange[0].startDate}
              endDate={dateRange[0].endDate}
              onStartDateChange={(date) => {
                if (date) {
                  setDateRange([{
                    startDate: date,
                    endDate: dateRange[0].endDate || date,
                    key: 'selection'
                  }]);
                }
              }}
              onEndDateChange={() => {}}
              isOpen={showDatePicker && activeField === 'checkin'}
              onOpenChange={(open) => {
                setShowDatePicker(open);
                if (open) setActiveField('checkin');
              }}
              type="checkin"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Check out */}
          <div className="flex-1">
            <DatePicker
              startDate={dateRange[0].startDate}
              endDate={dateRange[0].endDate}
              onStartDateChange={() => {}}
              onEndDateChange={(date) => {
                if (date) {
                  setDateRange([{
                    startDate: dateRange[0].startDate || date,
                    endDate: date,
                    key: 'selection'
                  }]);
                }
              }}
              isOpen={showCheckout}
              onOpenChange={setShowCheckout}
              type="checkout"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Who */}
          <div className="flex-1">
            <GuestSelector
              adults={adults}
              children={children}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              isOpen={showGuests}
              onOpenChange={setShowGuests}
            />
          </div>

          {/* Search Button */}
          <div className="p-1">
            <SearchButton
              onSearch={handleSearch}
              expanded={isExpanded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirbnbSearchBar;