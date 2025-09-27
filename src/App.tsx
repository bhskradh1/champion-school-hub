import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Results from "./pages/Results";
import Leadership from "./pages/Leadership";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminNotices from "./pages/admin/Notices";
import AdminGallery from "./pages/admin/Gallery";
import AdminResults from "./pages/admin/Results";
import AdminLeadership from "./pages/admin/Leadership";
import AdminMessages from "./pages/admin/Messages";
import ChangePassword from "./pages/admin/ChangePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/results" element={<Results />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
            <Route path="/admin/notices" element={<AdminLayout><AdminNotices /></AdminLayout>} />
            <Route path="/admin/gallery" element={<AdminLayout><AdminGallery /></AdminLayout>} />
            <Route path="/admin/results" element={<AdminLayout><AdminResults /></AdminLayout>} />
            <Route path="/admin/leadership" element={<AdminLayout><AdminLeadership /></AdminLayout>} />
            <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
            <Route path="/admin/change-password" element={<AdminLayout><ChangePassword /></AdminLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
