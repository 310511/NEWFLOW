import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DestinationPicker,
  DatePicker,
  GuestSelector,
  SearchButton,
} from "./CustomSearchComponents";

interface Props {
  isSticky?: boolean;
}

const NewCustomSearchBar = ({ isSticky = false }: Props) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1); // Initialize rooms state
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCheckinPicker, setShowCheckinPicker] = useState(false);
  const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickedInsideSearch =
        searchBarRef.current?.contains(target as Node) ?? false;

      if (!clickedInsideSearch) {
        setShowDestinations(false);
        setShowCheckinPicker(false);
        setShowCheckoutPicker(false);
        setShowGuests(false);
        setIsExpanded(false);
        setActiveField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: destination || "Riyadh",
      guests: (adults + children).toString(),
    });

    if (startDate) {
      params.set("checkIn", startDate.toISOString());
    }
    if (endDate) {
      params.set("checkOut", endDate.toISOString());
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleFieldFocus = (field: string) => {
    setIsExpanded(true);
    setActiveField(field);

    // Close all other dropdowns
    setShowDestinations(false);
    setShowCheckinPicker(false);
    setShowCheckoutPicker(false);
    setShowGuests(false);

    // Open the relevant dropdown
    switch (field) {
      case "destination":
        setShowDestinations(true);
        break;
      case "checkin":
        setShowCheckinPicker(true);
        break;
      case "checkout":
        setShowCheckoutPicker(true);
        break;
      case "guests":
        setShowGuests(true);
        break;
    }
  };

  const handleSearchClick = () => {
    if (!isExpanded) {
      handleFieldFocus("destination");
    } else {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div
        ref={searchBarRef}
        className={`bg-background border border-border rounded-full shadow-search transition-all duration-300 ${
          isExpanded ? "scale-105 shadow-card-hover" : "hover:shadow-card-hover"
        } ${isSticky ? "scale-90" : ""} backdrop-blur-sm mx-0`}
      >
        <div className="flex items-center px-6 pr-4">
          {/* Where */}
          <div className="flex-1">
            <DestinationPicker
              value={destination}
              onChange={setDestination}
              isOpen={showDestinations}
              onOpenChange={(open) => {
                setShowDestinations(open);
                if (open) handleFieldFocus("destination");
              }}
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Check in */}
          <div className="flex-1">
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              isOpen={showCheckinPicker}
              onOpenChange={(open) => {
                setShowCheckinPicker(open);
                if (open) handleFieldFocus("checkin");
              }}
              type="checkin"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Check out */}
          <div className="flex-1">
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
              isOpen={showCheckoutPicker}
              onOpenChange={(open) => {
                setShowCheckoutPicker(open);
                if (open) handleFieldFocus("checkout");
              }}
              type="checkout"
              minDate={startDate}
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border"></div>

          {/* Who */}
          <div className="flex-1">
            <GuestSelector
              adults={adults}
              children={children}
              rooms={rooms} // Pass rooms prop
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              onRoomsChange={setRooms} // Pass onRoomsChange handler
              isOpen={showGuests}
              onOpenChange={(open) => {
                setShowGuests(open);
                if (open) handleFieldFocus("guests");
              }}
            />
          </div>

          {/* Search Button */}
          <div className="p-1">
            <SearchButton onSearch={handleSearchClick} expanded={isExpanded} />
          </div>

          {/* GIF in the blank space */}
          <div className="flex items-center ml-2">
            <img
              src="/PixVerse_V5_Image_Text_720P_with_same_plain_wh-_2_.gif"
              alt="Animated Search Element"
              style={{ width: "110px", height: "85px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomSearchBar;
