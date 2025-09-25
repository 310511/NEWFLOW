import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import HotelDetails from "./pages/HotelDetails";
import Reserve from "./pages/Reserve";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import DestinationDynamic from "./pages/DestinationDynamic";
import Deals from "./pages/Deals";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/reserve/:id" element={<Reserve />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destination/:destination" element={<DestinationDynamic />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
