import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/dashboard/Hero";
import DescriptionPage from "./pages/DescriptionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Navbar rendered above the routed pages */}
        <Navbar currentStep="dashboard" onNavigate={(step) => { /* Add routing logic here if you want */ }} />
        <Routes>
          <Route path="/" element={<Hero onGetStarted={() => {/* Your logic */}} />} />
          <Route path="/description" element={<DescriptionPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
