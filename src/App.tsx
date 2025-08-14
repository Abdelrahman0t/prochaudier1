import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ContactUs from "./pages/ContactUs";
import APropos from "./pages/APropos";
import CheckoutPage from './pages/CheckOut'
import Login from './pages/Login'
import Register from './pages/register'
import Profile from './pages/Profile'
import Admin from "./pages/Admin";





import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import CartSidebar from "./components/CartSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/CheckOut" element={<CheckoutPage />} />
          <Route path="/Apropos" element={<APropos />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          



          <Route path="/Admin" element={<Admin />} />


          <Route path="/product/:id" element={<ProductDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
