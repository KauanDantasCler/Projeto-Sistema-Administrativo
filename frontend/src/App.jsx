import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./components/layout/AppSidebar";

import Produtos from "./pages/Produtos";
import Promocoes from "./pages/Promocoes";
import Usuarios from "./pages/Usuarios";
import LoginPage from "./pages/Login";


function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
}

import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/*" element={
              <PrivateRoute>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        Sistema Administrativo
                      </span>
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto bg-background/95">
                    <Routes>
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/promocoes" element={<Promocoes />} />
                      <Route path="/usuarios" element={<AdminRoute><Usuarios /></AdminRoute>} />
                    </Routes>
                  </main>
                </SidebarInset>
              </SidebarProvider>
              </PrivateRoute>
            } />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </Router>
  );
}


function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.perfil !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default App;