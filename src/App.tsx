import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DebateDetails from "./pages/DebateDetails";
import Debates from "./pages/Debates";
import Members from "./pages/Members";
import Resolutions from "./pages/Resolutions";
import ProtectedRoute from "./components/ProtectedRoute";
import { MainNav } from "./components/MainNav";
import { SidebarInset } from "./components/ui/sidebar";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen w-full">
    <div className="w-64 flex-shrink-0">
      <MainNav />
    </div>
    <main className="flex-1 p-6 overflow-auto">
      <div className="w-full">
        {children}
      </div>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Index />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/members" element={
            <ProtectedRoute>
              <Layout>
                <Members />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/resolutions" element={
            <ProtectedRoute>
              <Layout>
                <Resolutions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/debates" element={
            <ProtectedRoute>
              <Layout>
                <Debates />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/debates/:id" element={
            <ProtectedRoute>
              <Layout>
                <DebateDetails />
              </Layout>
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
