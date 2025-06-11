import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Using Sonner for notifications
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeScreen from "./pages/HomeScreen";
import RestaurantListingScreen from "./pages/RestaurantListingScreen";
import RestaurantMenuScreen from "./pages/RestaurantMenuScreen";
import CartAndCheckoutScreen from "./pages/CartAndCheckoutScreen";
import OrderTrackingScreen from "./pages/OrderTrackingScreen";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> {/* For shadcn Toasts */}
      <Sonner richColors position="top-right" /> {/* For Sonner notifications */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/restaurants" element={<RestaurantListingScreen />} />
          <Route path="/search" element={<RestaurantListingScreen />} /> {/* Alias for search to listing */}
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenuScreen />} />
          <Route path="/checkout" element={<CartAndCheckoutScreen />} />
          <Route path="/cart" element={<CartAndCheckoutScreen />} /> {/* Alias for cart to checkout */}
          <Route path="/order/:orderId/track" element={<OrderTrackingScreen />} />
          <Route path="/orders" element={<NotFound />} /> {/* Placeholder for future Orders List Page */}
          <Route path="/profile" element={<NotFound />} /> {/* Placeholder for future Profile Page */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;