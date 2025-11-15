import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./Hero"; // Homepage
import DescriptionPage from "./pages/DescriptionPage"; // Description page
import NotFound from "./pages/NotFound"; // 404 page (you may need to implement this)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero onGetStarted={() => {/*Your logic*/}} />} />
          <Route path="/description" element={<DescriptionPage />} />
          {/* Add all custom routes above the catch-all "*" route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
