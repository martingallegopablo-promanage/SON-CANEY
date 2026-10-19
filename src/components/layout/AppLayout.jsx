import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSheet from '@/components/cart/CartSheet';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartSheet />
      <Footer />
    </div>
  );
}
