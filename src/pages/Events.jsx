import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Sparkles,
  Music,
  Flame,
  Wine,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import EventsCalendarView from '@/components/events/EventsCalendarView';
import { eventsService, DEFAULT_EVENTS } from '@/services/eventsService';

export default function Events() {
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  // Dynamic Events state connected to Supabase CMS with offline resilience
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Mobile collapsible state for event cards
  const [expandedEventId, setExpandedEventId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  // Modal state for ticketed events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Fetch live events from Supabase CMS
  useEffect(() => {
    let isMounted = true;
    eventsService.getEvents().then((loaded) => {
      if (isMounted && Array.isArray(loaded) && loaded.length > 0) {
        setEvents(loaded);
      }
      if (isMounted) setIsLoadingEvents(false);
    }).catch((err) => {
      console.warn('Events loading error:', err);
      if (isMounted) setIsLoadingEvents(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenTicketModal = (event) => {
    setSelectedEvent(event);
    setTicketQuantity(1);
  };

  const handleConfirmTicketPurchase = (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!guestName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (selectedEvent.isTicketed && selectedEvent.price > 0) {
      const ticketItem = {
        menu_item_id: selectedEvent.id,
        name: `${selectedEvent.title} (Ticket)`,
        price: selectedEvent.price,
        quantity: ticketQuantity,
        customizations: [
          `Attendee: ${guestName}`,
          guestEmail ? `Email: ${guestEmail}` : null,
          `Date: ${selectedEvent.date_text || selectedEvent.day}`
        ].filter(Boolean),
        image_url: selectedEvent.image_url || selectedEvent.image,
      };

      addItem(ticketItem);
      toast.success(`${ticketQuantity}x Ticket(s) added to your basket!`);
      setSelectedEvent(null);
      setIsCartOpen(true);
    } else {
      // Free Table Booking
      toast.success(`Table booked for ${guestName} (${ticketQuantity} guests) for ${selectedEvent.title}! See you at Son Caney.`);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-foreground text-background py-16 sm:py-24">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80"
            alt="Cuban fiesta and live music background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-3 py-1 rounded-full">
            🇨🇺 Son Caney Weekly Fiestas
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight">
            Cuban Nights, Fiestas & Culture
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 text-base sm:text-lg leading-relaxed">
            From our legendary charcoal-roasted suckling pig feasts and free Sunday tapas to high-energy salsa dance classes, there is always a celebration at Son Caney.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> 24 Portobello Road, Notting Hill, London
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Walk-ins & Ticketed Specials
            </span>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Upcoming Weekly Events
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Book your tickets in advance for special culinary feasts and salsa workshops
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-8">
          {events.map((evt) => {
            const isExpanded = expandedEventId === evt.id;

            return (
              <div
                key={evt.id}
                className="bg-card rounded-2xl sm:rounded-3xl border border-border/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Event Image & Header (Tappable on Mobile to Expand/Collapse) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleToggleExpand(evt.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleExpand(evt.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                    className="relative h-56 sm:h-64 w-full overflow-hidden bg-muted cursor-pointer md:cursor-default select-none active:scale-[0.99] md:active:scale-100 transition-transform touch-manipulation"
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      {evt.badgeVariant === 'free' ? (
                        <Badge className="bg-emerald-600 text-white font-bold border-0 text-xs shadow-md">
                          {evt.badge}
                        </Badge>
                      ) : evt.badgeVariant === 'ticketed-red' ? (
                        <Badge className="bg-primary text-primary-foreground font-bold border-0 text-xs shadow-md">
                          {evt.badge}
                        </Badge>
                      ) : (
                        <Badge className="bg-secondary text-white font-bold border-0 text-xs shadow-md">
                          {evt.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Price tag if ticketed */}
                    {evt.isTicketed && (
                      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md px-3 py-1 rounded-full text-foreground font-display font-extrabold text-sm shadow-md">
                        £{evt.price.toFixed(2)}
                      </div>
                    )}

                    {/* Day & Time Header overlay */}
                    <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-3 text-xs font-semibold text-white/90 mb-1">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                          <Calendar className="w-3.5 h-3.5 text-amber-300" /> {evt.day}
                        </span>
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-blue-200" /> {evt.time}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-display leading-snug">
                        {evt.title}
                      </h3>

                      {/* Mobile Expand / Collapse Indicator */}
                      <div className="flex items-center justify-between text-xs font-medium text-white/90 pt-1.5 mt-1.5 border-t border-white/20 md:hidden">
                        <span className="text-[11px] font-semibold text-amber-300/90">
                          {isExpanded ? 'Tap to collapse details' : 'Tap to see details & book'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">
                          {isExpanded ? 'Less' : 'Details'}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Lower Section on Mobile (Always Visible on Desktop) */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'block animate-in fade-in-50 slide-in-from-top-2' : 'hidden md:block'
                    }`}
                  >
                    {/* Body Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <p className="text-sm font-semibold text-primary">
                        {evt.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Bullet Highlights */}
                      <div className="pt-2 border-t border-border/50">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Event Highlights:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {evt.highlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="p-5 sm:p-6 pt-0 border-t border-border/40 mt-4 flex items-center justify-between gap-4">
                      <div>
                        {evt.isTicketed ? (
                          <div>
                            <span className="text-xs text-muted-foreground block">Ticket Price</span>
                            <span className="text-2xl font-display font-extrabold text-foreground">
                              £{evt.price.toFixed(2)}{' '}
                              <span className="text-xs font-normal text-muted-foreground">/ person</span>
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-muted-foreground block">Admission</span>
                            <span className="text-lg font-display font-bold text-emerald-600">
                              Free Entry
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        {/* IF TICKETED: RENDER BUY TICKETS BUTTON */}
                        {evt.isTicketed ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTicketModal(evt);
                            }}
                            className={`rounded-2xl font-bold text-sm shadow-md gap-2 ${
                              evt.id === 'event-cochinillo'
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/90 text-white'
                            }`}
                          >
                            <Ticket className="w-4 h-4" />
                            <span>{evt.ctaText}</span>
                          </Button>
                        ) : (
                          /* IF FREE (E.G. DOMINGO FREE TAPAS): NO BUY TICKET BUTTON */
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTicketModal(evt);
                            }}
                            variant="outline"
                            className="rounded-2xl text-xs font-semibold border-border hover:bg-muted text-foreground gap-1.5"
                          >
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span>Book Table (Free)</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cuban Party Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-gradient-to-r from-primary/10 via-card to-secondary/10 p-8 sm:p-10 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Private Parties & Birthdays
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Hosting a Cuban Celebration?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rent out our heated terrace or entire Notting Hill venue. We provide live Cuban salsa bands, custom roasted suckling pig banquets, and rum cocktail masterclasses.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 shrink-0">
            <a href="mailto:events@soncaney.co.uk">
              Enquire Private Event <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* Calendar View Section - Last section on the page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <EventsCalendarView
          events={events}
          onBookTicket={handleOpenTicketModal}
          onBookTable={handleOpenTicketModal}
        />
      </section>

      {/* TICKET / TABLE BOOKING MODAL DIALOG */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
            <DialogHeader className="text-left space-y-2">
              <Badge className={`w-fit ${selectedEvent.isTicketed && selectedEvent.price > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                {selectedEvent.isTicketed && selectedEvent.price > 0 ? 'Ticket Reservation' : 'Table Reservation • Free Entry'}
              </Badge>
              <DialogTitle className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedEvent.date_text || selectedEvent.day} • {selectedEvent.time} • 24 Portobello Road, London
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmTicketPurchase} className="space-y-4 pt-2">
              {/* Quantity selector */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-foreground block">
                    {selectedEvent.isTicketed && selectedEvent.price > 0 ? 'Number of Tickets' : 'Table Party Size (Guests)'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedEvent.isTicketed && selectedEvent.price > 0
                      ? `£${selectedEvent.price.toFixed(2)} each`
                      : 'Free Entry • Complimentary Cuban Bites'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    disabled={ticketQuantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-base w-6 text-center">{ticketQuantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Contact info inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Lead Guest Name *</label>
                  <Input
                    required
                    placeholder="e.g. Oliver Hernandez"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Contact Email</label>
                  <Input
                    type="email"
                    placeholder="oliver@example.co.uk"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">UK Phone</label>
                  <Input
                    type="tel"
                    placeholder="+44 7700 900123"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    {selectedEvent.isTicketed && selectedEvent.price > 0 ? 'Total Ticket Amount' : 'Table Booking Cost'}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    {selectedEvent.isTicketed && selectedEvent.price > 0 ? 'Includes entry & event feast' : 'Free Entry & Table Guarantee'}
                  </span>
                </div>
                <span className="text-2xl font-extrabold font-display text-primary">
                  {selectedEvent.isTicketed && selectedEvent.price > 0
                    ? `£${(selectedEvent.price * ticketQuantity).toFixed(2)}`
                    : 'FREE'}
                </span>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                className={`w-full py-6 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 ${
                  selectedEvent.isTicketed && selectedEvent.price > 0
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedEvent.isTicketed && selectedEvent.price > 0 ? (
                  <>
                    <Ticket className="w-5 h-5" />
                    <span>Add Tickets to Basket & Checkout</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Confirm Free Table Booking</span>
                  </>
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {selectedEvent.isTicketed && selectedEvent.price > 0
                  ? 'Instant confirmation • Shows in your order receipts'
                  : 'Or call direct to reserve: +44 20 7946 0912'}
              </p>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
