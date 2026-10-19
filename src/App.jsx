import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';

import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import MenuItemDetail from '@/pages/MenuItemDetail';
import Checkout from '@/pages/Checkout';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/OrderDetail';
import Auth from '@/pages/Auth';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';
import ScrollToTop from '@/components/layout/ScrollToTop';

const MainAppRoutes = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">Welcome to Son Caney...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuItemDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mi-perfil" element={<Profile />} />
        <Route path="/login" element={<Auth defaultTab="login" />} />
        <Route path="/signup" element={<Auth defaultTab="register" />} />
        <Route path="/auth" element={<Auth defaultTab="login" />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <MainAppRoutes />
          </Router>
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
