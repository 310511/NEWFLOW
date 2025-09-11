import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DestinationPickerProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DestinationPicker = ({
  value,
  onChange,
  isOpen,
  onOpenChange,
}: DestinationPickerProps) => {
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const popularDestinations = [
    { name: "Riyadh", country: "Saudi Arabia" },
    { name: "Jeddah", country: "Saudi Arabia" },
    { name: "Dubai", country: "UAE" },
    { name: "Abu Dhabi", country: "UAE" },
    { name: "Doha", country: "Qatar" },
    { name: "Mecca", country: "Saudi Arabia" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleDestinationSelect = (destination: string) => {
    setInputValue(destination);
    onChange(destination);
    onOpenChange(false);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col items-start space-y-1 cursor-pointer p-4 hover:bg-muted/50 rounded-lg transition-all duration-200 min-w-[200px] group"
        onClick={() => onOpenChange(!isOpen)}
      >
        <Label className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          Where
        </Label>
        <div
          className={cn(
            "text-base font-normal transition-colors truncate w-full",
            value ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {value || "Search destinations"}
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="p-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Search destinations</h4>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Where to?"
                  className="border border-border focus-visible:ring-1 focus-visible:ring-ring"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Popular destinations</h4>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => handleDestinationSelect(dest.name)}
                    className="flex items-center space-x-3 w-full p-3 hover:bg-muted/50 rounded-lg transition-colors text-left"
                  >
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-medium">{dest.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dest.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "checkin" | "checkout";
  minDate?: Date;
}

export const DatePicker = ({
  date,
  onDateChange,
  isOpen,
  onOpenChange,
  type,
  minDate,
}: DatePickerProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    onOpenChange(false);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col items-start space-y-1 cursor-pointer p-4 hover:bg-muted/50 rounded-lg transition-all duration-200 min-w-[140px] group"
        onClick={() => onOpenChange(!isOpen)}
      >
        <Label className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {type === "checkin" ? "Check in" : "Check out"}
        </Label>
        <div
          className={cn(
            "text-base font-normal transition-colors",
            date ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {date ? format(date, "MMM d, yyyy") : "Add dates"}
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) return true;
              if (minDate && date <= minDate) return true;
              return false;
            }}
            initialFocus
            className="rounded-lg border-0 pointer-events-auto"
          />
        </div>
      )}
    </div>
  );
};

interface GuestSelectorProps {
  adults: number;
  children: number;
  rooms: number; // New prop for number of rooms
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  onRoomsChange: (count: number) => void; // New prop for changing room count
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GuestSelector = ({
  adults,
  children,
  rooms, // Destructure new rooms prop
  onAdultsChange,
  onChildrenChange,
  onRoomsChange, // Destructure new onRoomsChange prop
  isOpen,
  onOpenChange,
}: GuestSelectorProps) => {
  const totalGuests = adults + children;
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        className="flex flex-col items-start space-y-1 cursor-pointer p-4 hover:bg-muted/50 rounded-lg transition-all duration-200 min-w-[140px] group"
        onClick={() => onOpenChange(!isOpen)}
      >
        <Label className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          Who
        </Label>
        <div
          className={cn(
            "text-base font-normal transition-colors",
            totalGuests > 0
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          {totalGuests > 0
            ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
            : "Add guests"}
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="p-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Adults</div>
                  <div className="text-xs text-muted-foreground">
                    Ages 13 or above
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {adults}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onAdultsChange(adults + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Children</div>
                  <div className="text-xs text-muted-foreground">Ages 2-12</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onChildrenChange(Math.max(0, children - 1))}
                    disabled={children <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {children}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onChildrenChange(children + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Rooms Selector */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Rooms</div>
                  <div className="text-xs text-muted-foreground">
                    Number of rooms
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onRoomsChange(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {rooms}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-110 transition-transform duration-200"
                    onClick={() => onRoomsChange(rooms + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SearchButtonProps {
  onSearch: () => void;
  expanded: boolean;
}

export const SearchButton = ({ onSearch, expanded }: SearchButtonProps) => {
  return (
    <Button
      onClick={onSearch}
      className={cn(
        "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105",
        expanded
          ? "px-12 py-4 rounded-full text-lg font-semibold h-auto min-w-[120px]"
          : "p-4 rounded-full h-auto min-w-[60px]"
      )}
    >
      <Search
        className={cn("transition-all", expanded ? "h-6 w-6 mr-3" : "h-6 w-6")}
      />
      {expanded && "Search"}
    </Button>
  );
};
