import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Eventos from "./pages/Eventos";
import Presencas from "./pages/Presencas";
import Equipes from "./pages/Equipes";
import Questionarios from "./pages/Questionarios";
import Ranking from "./pages/Ranking";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute resource="dashboard">
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute resource="usuarios">
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="/eventos" element={
              <ProtectedRoute resource="eventos">
                <Eventos />
              </ProtectedRoute>
            } />
            <Route path="/presencas" element={
              <ProtectedRoute resource="presencas">
                <Presencas />
              </ProtectedRoute>
            } />
            <Route path="/equipes" element={
              <ProtectedRoute resource="equipes">
                <Equipes />
              </ProtectedRoute>
            } />
            <Route path="/questionarios" element={
              <ProtectedRoute resource="questionarios">
                <Questionarios />
              </ProtectedRoute>
            } />
            <Route path="/ranking" element={
              <ProtectedRoute resource="ranking">
                <Ranking />
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute resource="relatorios">
                <Relatorios />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute resource="configuracoes">
                <Configuracoes />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
