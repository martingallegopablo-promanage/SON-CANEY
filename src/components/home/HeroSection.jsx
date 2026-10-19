import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, Flame, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80"
          alt="Mesa de comida tradicional cubana y caribeña"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-36">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3.5 py-1.5 bg-blue-600/30 backdrop-blur-md text-blue-100 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-400/40 shadow-sm flex items-center gap-1.5">
              <span>🇨🇺</span> Traditional Cuban Recipes in the UK
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.15]">
            Authentic Cuban<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-300 to-blue-300">
              Street Food & Kitchen
            </span>
          </h1>

          <p className="mt-5 text-lg text-white/85 max-w-xl leading-relaxed font-normal">
            Experience the vibrant tastes of Havana delivered hot to your door. Freshly pressed Cubano sandwiches, 24-hour slow-roasted lechón pork, shredded beef Ropa Vieja, crispy plantains and handcrafted mojitos.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-8">
            <Button
              asChild
              className="h-12 sm:h-13 px-7 text-sm sm:text-base font-bold rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 hover:scale-105 transition-all"
            >
              <Link to="/menu" className="flex items-center gap-2">
                Order Delivery & Collection <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 sm:h-13 px-6 text-sm sm:text-base font-semibold rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:scale-105 transition-all border border-blue-400/30"
            >
              <Link to="/events" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                <span>Events & Fiestas</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Fast hot delivery in 20-30 min</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9 ★ (1,800+ reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
