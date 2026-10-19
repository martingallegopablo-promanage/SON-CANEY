import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook, Mail } from 'lucide-react';
import CubanFlagLogo from '@/components/ui/CubanFlagLogo';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-0 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <CubanFlagLogo className="w-10 h-10 shadow-md" />
              <span className="font-display font-bold text-2xl text-white">Son Caney</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Authentic Cuban street food and traditional criollo recipes. Artisan-pressed Cubano sandwiches, 24-hour slow-roasted lechón, rich ropa vieja stews, and handcrafted Havana cocktails.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@soncaney.co.uk"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Our Menu</h3>
            <div className="space-y-3 text-sm text-background/70">
              <Link to="/menu?category=Cuban%20Sandwiches" className="block hover:text-primary transition-colors">
                Cuban Sandwiches
              </Link>
              <Link to="/menu?category=Traditional%20Mains" className="block hover:text-primary transition-colors">
                Traditional Mains & Ropa Vieja
              </Link>
              <Link to="/menu?category=Street%20Food%20%26%20Sides" className="block hover:text-primary transition-colors">
                Street Food, Tostones & Yuca
              </Link>
              <Link to="/menu?category=Cocktails%20%26%20Tropical%20Drinks" className="block hover:text-primary transition-colors">
                Havana Cocktails & Mojitos
              </Link>
              <Link to="/events" className="block hover:text-primary transition-colors">
                Events & Fiestas
              </Link>
              <Link to="/orders" className="block hover:text-primary transition-colors font-medium text-primary/90">
                Track Your Order
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Find Us</h3>
            <div className="space-y-3 text-sm text-background/70">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                24 Portobello Road, London, W11 3DL
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +44 20 7946 0912
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                hello@soncaney.co.uk
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kitchen Hours</h3>
            <div className="space-y-2 text-sm text-background/70">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                Tuesday to Thursday: 12:00 - 22:30
              </p>
              <p className="pl-6">Friday & Saturday: 12:00 - 23:30</p>
              <p className="pl-6">Sunday: 12:00 - 22:00</p>
              <p className="pl-6 text-xs text-amber-400 font-semibold">Monday: Closed for prep</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <div>© {new Date().getFullYear()} Son Caney UK. All rights reserved. Authentic Cuban Street Food & Bar.</div>
          <div className="flex gap-4 text-xs">
            <span className="hover:text-background/80 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-background/80 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-background/80 cursor-pointer">Allergen Information</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
