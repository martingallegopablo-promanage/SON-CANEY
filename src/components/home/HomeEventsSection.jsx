import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Ticket,
  Sparkles,
  CheckCircle2,
  Flame,
  Music,
  Wine,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eventsService, DEFAULT_EVENTS } from '@/services/eventsService';

export default function HomeEventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic Events state connected to Supabase CMS
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  // Vertical ticker state: shows 3 of 4 events simultaneously, moving automatically from bottom to top
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerTransitioning, setIsTickerTransitioning] = useState(true);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  // Fetch live events from Supabase CMS
  useEffect(() => {
    let isMounted = true;
    eventsService.getEvents().then((loaded) => {
      if (isMounted && Array.isArray(loaded) && loaded.length > 0) {
        setEvents(loaded);
      }
    }).catch((err) => {
      console.warn('Home events loading notice:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to get matching icon for an event
  const getEventIcon = (event) => {
    if (!event) return Sparkles;
    const slug = event.slug || event.id;
    if (slug === 'event-cochinillo') return Flame;
    if (slug === 'event-salsa') return Ticket;
    if (slug === 'event-live-music') return Music;
    if (slug === 'event-rum-tasting') return Wine;
    return (event.isTicketed || event.is_ticketed) ? Ticket : Sparkles;
  };

  // Tripled list for seamless infinite loop
  const tickerItems = [...events, ...events, ...events];

  // Auto-scroll the main carousel every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, events.length]);

  // Auto-scroll the vertical ticker bottom-to-top every 2.8 seconds unless hovered
  useEffect(() => {
    if (isTickerPaused) return;
    const interval = setInterval(() => {
      setIsTickerTransitioning(true);
      setTickerIndex((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [isTickerPaused]);

  // Seamless reset when cycling through the 4 events
  useEffect(() => {
    if (tickerIndex >= events.length) {
      const timer = setTimeout(() => {
        setIsTickerTransitioning(false);
        setTickerIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTickerTransitioning(true);
          });
        });
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [tickerIndex, events.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handleTickerNext = (e) => {
    e.stopPropagation();
    setIsTickerTransitioning(true);
    setTickerIndex((prev) => prev + 1);
  };

  const handleTickerPrev = (e) => {
    e.stopPropagation();
    if (tickerIndex > 0) {
      setIsTickerTransitioning(true);
      setTickerIndex((prev) => prev - 1);
    } else {
      setIsTickerTransitioning(false);
      setTickerIndex(events.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTickerTransitioning(true);
          setTickerIndex(events.length - 1);
        });
      });
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <section className="relative overflow-hidden w-full mt-12 mb-0 border-t border-primary/20 shadow-xl bg-black">
      {/* Distressed Cuban Flag Background Layer - Gradient exposure: high intensity on the left, fading to low exposure on the right */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <img
          src="/cuban-flag-distressed.svg"
          alt="Vintage Distressed Cuban Flag"
          className="w-full h-full object-cover object-center select-none"
          style={{
            filter: 'contrast(0.95) saturate(0.95)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.25) 80%, rgba(0,0,0,0.08) 100%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.25) 80%, rgba(0,0,0,0.08) 100%)'
          }}
        />
        {/* Exposure Gradient Overlay: Lighter on left (intense exposure), darkening towards right (dim/low exposure) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/60 to-black/95 pointer-events-none" />
      </div>

      {/* Content Layer inside max-w-7xl */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Summary, Heading & Description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-3.5 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-md border-0">
                <Sparkles className="w-3.5 h-3.5" /> Fiestas, Culture & Live Food
              </Badge>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-[1.15] drop-shadow-md">
                Cuban Nights & Weekly Fiestas
              </h2>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed drop-shadow-sm font-normal">
                At <strong className="text-white font-semibold">Son Caney</strong>, food is always a celebration. Join our weekly culinary and cultural events in Notting Hill, from free Sunday tapas to our whole roast suckling pig banquets and Thursday salsa masterclasses.
              </p>
            </div>

            {/* Events Vertical Ticker: Moving automatically bottom-to-top, displaying 3 of 4 at a time */}
            <div
              className="p-4 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 shadow-2xl space-y-3"
              onMouseEnter={() => setIsTickerPaused(true)}
              onMouseLeave={() => setIsTickerPaused(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Weekly Fiestas ({events.length} Rotating • 3 Visible)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/60 font-medium hidden sm:inline">Auto ↑</span>
                  <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
                    <button
                      onClick={handleTickerPrev}
                      className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                      title="Scroll up"
                      aria-label="Scroll up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleTickerNext}
                      className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                      title="Scroll down"
                      aria-label="Scroll down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport: Exactly 3 items visible simultaneously (3 x 64px + 2 x 8px gap = 208px) */}
              <div className="h-[208px] overflow-hidden relative">
                <div
                  className="flex flex-col gap-2"
                  style={{
                    transform: `translateY(-${tickerIndex * 72}px)`,
                    transition: isTickerTransitioning
                      ? 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'none',
                  }}
                >
                  {tickerItems.map((event, idx) => {
                    const realIndex = idx % events.length;
                    const IconComponent = event.icon || getEventIcon(event);
                    const iconColor = event.iconColor || ((event.isTicketed || event.is_ticketed) ? 'text-primary' : 'text-emerald-400');
                    const isCurrent = currentIndex === realIndex;

                    return (
                      <div
                        key={`${event.id}-${idx}`}
                        onClick={() => setCurrentIndex(realIndex)}
                        className={`h-[64px] px-3.5 py-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all border select-none ${
                          isCurrent
                            ? 'bg-primary/25 border-primary text-white shadow-md ring-1 ring-primary/40'
                            : 'bg-black/40 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/25'
                        }`}
                        title="Click to view event details on the right"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg bg-white/10 shrink-0 ${iconColor}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate leading-tight">
                              {event.title}
                            </h4>
                            <p className="text-xs text-white/70 truncate mt-0.5 leading-tight">
                              {event.subtitle}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${event.badgeShortColor}`}
                        >
                          {event.badgeShort}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location & CTA Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl gap-2">
                <Link to="/events">
                  Explore All Events & Tickets <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <div className="text-xs text-white/80 flex items-center gap-1.5 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>24 Portobello Rd, London</span>
              </div>
            </div>
          </div>

        {/* RIGHT COLUMN: Interactive Events Carousel */}
        <div
          className="lg:col-span-7"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden relative group">
            {/* Carousel Event Image & Top Bar */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-muted">
              <img
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${currentEvent.badgeColor} font-bold text-xs shadow-md border-0 px-3 py-1 rounded-full`}>
                  {currentEvent.badge}
                </Badge>
              </div>

              {/* Price Tag */}
              <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md px-3.5 py-1 rounded-full font-display font-extrabold text-foreground text-sm shadow-md">
                {typeof currentEvent.price === 'number' ? (currentEvent.price > 0 ? `£${currentEvent.price.toFixed(2)}` : 'Free Entry') : currentEvent.price}
              </div>

              {/* Carousel Next / Prev floating controls */}
              <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="h-10 w-10 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md pointer-events-auto shadow-md border-border"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="h-10 w-10 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md pointer-events-auto shadow-md border-border"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Overlay Content (Title & Day) */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" /> {currentEvent.day}
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-blue-200" /> {currentEvent.time}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-snug">
                  {currentEvent.title}
                </h3>
              </div>
            </div>

            {/* Carousel Body & Action Link */}
            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentEvent.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-border/60">
                {/* Dots / Pagination indicator */}
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  {events.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] text-muted-foreground ml-2 font-mono">
                    {currentIndex + 1} / {events.length}
                  </span>
                </div>

                {/* Direct Action Button to /events */}
                <Button
                  asChild
                  className={`rounded-full font-bold text-xs sm:text-sm px-6 shadow-md gap-2 ${
                    currentEvent.isTicketed
                      ? currentEvent.id === 'event-cochinillo'
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/90 text-white'
                      : 'bg-foreground hover:bg-foreground/90 text-background'
                  }`}
                >
                  <Link to="/events">
                    {currentEvent.isTicketed && <Ticket className="w-4 h-4" />}
                    <span>{currentEvent.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
