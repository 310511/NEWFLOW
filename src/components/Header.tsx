import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Globe, ChevronDown, Home, MapPin, Tag, LogIn, UserPlus, HelpCircle, Settings, Search } from "lucide-react";
import homeIcon from "@/assets/home-icon.png";
import destinationIcon from "@/assets/destination-icon.png";
import dealsIcon from "@/assets/deals-icon.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewCustomSearchBar from "@/components/NewCustomSearchBar";
import SearchFilters from "@/components/SearchFilters";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Map } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

interface HeaderProps {
  variant?: 'default' | 'compact';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  console.log("Header component is rendering");
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCompact = variant === 'compact';

  const navigation = [
    { name: "Hotels", href: "/", icon: Home, customIcon: homeIcon },
    { name: "Destinations", href: "/destinations", icon: MapPin, customIcon: destinationIcon },
    { name: "Deals", href: "/deals", icon: Tag, customIcon: dealsIcon },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageChange = (language: { code: string; name: string; flag: string }) => {
    setCurrentLanguage(language.name);
    localStorage.setItem('language', language.code);
    // Here you would typically trigger a translation system
    console.log(`Language changed to ${language.name}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("Header about to return JSX");
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-xl shadow-black/5"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: '100%',
        display: 'block',
        visibility: 'visible'
      }}
    >
      <div className={`w-full max-w-none transition-all duration-300 ${
        isCompact ? 'px-4 lg:px-6' : 'px-6 lg:px-12 xl:px-16'
      } ${isScrolled ? 'py-2' : ''}`}>
        <div className={`flex items-center transition-all duration-300 ${
          isCompact ? 'justify-start space-x-6 h-14' : 'justify-between'
        } ${!isCompact && (isScrolled ? 'h-16' : 'h-20')}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center group cursor-pointer flex-shrink-0">
            <img 
              src={logoIcon} 
              alt="HotelRBS Logo" 
              className={`w-auto transform group-hover:scale-105 transition-all duration-300 -ml-2 mt-1 ${
                isCompact ? 'h-10' : (isScrolled ? 'h-14' : 'h-20')
              }`}
            />
          </Link>


          {/* Center Navigation - Desktop - Airbnb Style */}
          <div className={`hidden lg:flex items-center ${isCompact ? 'flex-none' : 'flex-1 justify-center'}`}>
            <nav className={`flex items-center backdrop-blur-sm rounded-full border shadow-lg transition-all duration-300 ${
              isCompact 
                ? 'bg-white/95 border-border/30 p-0.5 scale-90' 
                : (isScrolled 
                  ? 'bg-white/95 border-border/30 scale-95 p-1' 
                  : 'bg-white/90 border-border/20 p-1')
            }`}>
              {navigation.map((item, index) => (
                <button
                  key={item.name}
                  className={`relative flex items-center space-x-2 text-muted-foreground hover:text-foreground font-medium transition-all duration-300 rounded-full hover:bg-white group ${
                    isCompact ? 'text-sm py-2.5 px-5' : 'text-base py-3 px-6'
                  }`}
                  onClick={() => {
                    navigate(item.href);
                  }}
                  >
                    <img src={item.customIcon} alt={item.name} className={isCompact ? "h-5 w-5" : "h-6 w-6"} />
                    <span className="transition-all duration-300 group-hover:font-semibold">{item.name}</span>
                  
                  {/* Active indicator with glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 -z-10"></div>
                  
                  {/* Separator */}
                  {index < navigation.length - 1 && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-border/30"></div>
                  )}
                </button>
              ))}
              
               {/* Search Icon with enhanced animations */}
               {((isScrolled && isHomePage) || !isHomePage) && !showSearchBar && (
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className={`relative flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 aspect-square hover:scale-110 active:scale-95 ml-2 group ${
                      isCompact ? 'w-9 h-9' : 'w-11 h-11'
                    }`}
                   style={{ backgroundColor: '#165d31' }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = '#134a28';
                     e.currentTarget.style.transform = 'scale(1.1)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = '#165d31';
                     e.currentTarget.style.transform = 'scale(1)';
                   }}
                 >
                   <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                   <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </button>
               )}
            </nav>
          </div>

          {/* Spacer for compact header */}
          {isCompact && <div className="flex-1" />}

          {/* Right Side Actions */}
          <div className={`flex items-center space-x-4 ${isCompact ? 'ml-4' : ''}`}>
            {/* Language Selector */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hidden md:flex hover:bg-muted/80 transition-all duration-200 rounded-full shadow-sm hover:shadow-md"
                    >
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select Language</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="z-[10000] bg-background border shadow-lg">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                    {currentLanguage === language.name && (
                      <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu with Enhanced Animations */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 border border-border rounded-full p-2 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-background/90 backdrop-blur-sm hover:bg-background hover:scale-105 active:scale-95">
                  <Menu className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:rotate-180" />
                  <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                    <User className="h-4 w-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-background border shadow-xl rounded-xl p-2 z-[10000]">
                <div className="py-2">
                  <DropdownMenuItem onClick={() => { setIsLogin(true); setShowLoginDialog(true); }} className="flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <LogIn className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Log in</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setIsLogin(false); setShowLoginDialog(true); }} className="flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <UserPlus className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Sign up</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <div className="py-2">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Your account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span>Account settings</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <div className="py-2">
                  <DropdownMenuItem className="flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Help Centre</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-md">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        className="w-full text-left flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-primary transition-all duration-300 p-4 rounded-xl hover:bg-white/80 group"
                        onClick={() => {
                          navigate(item.href);
                          setIsOpen(false);
                        }}
                      >
                        <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </nav>
                  
                  <div className="border-t pt-6 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center rounded-xl h-12 border-2"
                      onClick={() => { setIsLogin(false); setShowLoginDialog(true); setIsOpen(false); }}
                    >
                      Sign up
                    </Button>
                    <Button 
                      className="w-full justify-center rounded-xl h-12"
                      onClick={() => { setIsLogin(true); setShowLoginDialog(true); setIsOpen(false); }}
                    >
                      Log in
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Integrated Search Bar inside header - only show on home page */}
        <div className={`hidden md:block pb-[37px] transition-all duration-300 ${isHomePage && !isScrolled ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 pb-0 overflow-hidden'}`}>
          {isHomePage && (
            <div className="w-full">
              <NewCustomSearchBar isSticky />
            </div>
          )}
        </div>

        {/* Overlay Search Bar - Shows when search icon is clicked */}
        {showSearchBar && (
          <div className="fixed inset-x-0 top-20 z-[10000] flex items-start justify-center px-6 lg:px-12 xl:px-16">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Hotels</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearchBar(false)}
                  className="rounded-full"
                >
                  ×
                </Button>
              </div>
              <NewCustomSearchBar isSticky />
            </div>
          </div>
        )}
      </div>
      
      {/* Login/Signup Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl z-[10000]">
          <div className="p-8">
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-semibold text-foreground">Welcome to HotelRBS</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Phone Number Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country/Region</Label>
                  <select className="w-full p-3 border border-input rounded-lg bg-background">
                    <option>Saudi Arabia (+966)</option>
                    <option>United Arab Emirates (+971)</option>
                    <option>Kuwait (+965)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="Phone number" className="p-3 text-base" />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll call or text you to confirm your number. Standard message and data rates apply.{' '}
                  <button className="underline hover:no-underline">Privacy Policy</button>
                </p>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium">
                Continue
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                or
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full py-3 rounded-lg border border-input hover:bg-muted/50">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center border">
                      <span className="text-xs font-bold text-blue-600">G</span>
                    </div>
                    <span>Continue with Google</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full py-3 rounded-lg border border-input hover:bg-muted/50">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                      <span className="text-xs text-white">🍎</span>
                    </div>
                    <span>Continue with Apple</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full py-3 rounded-lg border border-input hover:bg-muted/50">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs">📧</span>
                    </div>
                    <span>Continue with email</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;