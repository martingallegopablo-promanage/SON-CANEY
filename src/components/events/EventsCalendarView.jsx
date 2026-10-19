import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Ticket,
  Sparkles,
  Flame,
  Music,
  Wine,
  MapPin,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isEventOnDate } from '@/services/eventsService';

export default function EventsCalendarView({ events = [], onBookTicket, onBookTable }) {
  // Calendar month state
  const today = new Date();
  const [activeDate, setActiveDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDayData, setSelectedDayData] = useState(null);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Days in current active month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  // Shift Sunday (0) to 6, so Monday is 0
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  // Days in previous month for trailing dates
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setActiveDate(new Date(year, month - 1, 1));
    setSelectedDayData(null);
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(year, month + 1, 1));
    setSelectedDayData(null);
  };

  const handleGoToday = () => {
    setActiveDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDayData(null);
  };

  // Match any event using the smart periodicity and date engine from eventsService
  const getEventForDate = (dateObj) => {
    if (!Array.isArray(events) || events.length === 0) return null;
    return events.find((e) => isEventOnDate(e, dateObj)) || null;
  };

  // Helper to check if a date is today
  const isDateToday = (d, m, y) => {
    return (
      d === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear()
    );
  };

  // Build grid cells (42 cells: 6 weeks x 7 days)
  const totalGridCells = 42;
  const calendarCells = [];

  // Previous month trailing days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateObj = new Date(year, month - 1, dayNum);
    calendarCells.push({
      dayNumber: dayNum,
      isCurrentMonth: false,
      dateObj,
      isToday: false,
      event: getEventForDate(dateObj)
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const isCurrentToday = isDateToday(d, month, year);
    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateObj,
      isToday: isCurrentToday,
      event: getEventForDate(dateObj)
    });
  }

  // Next month leading days
  const remainingCells = totalGridCells - calendarCells.length;
  for (let n = 1; n <= remainingCells; n++) {
    const dateObj = new Date(year, month + 1, n);
    calendarCells.push({
      dayNumber: n,
      isCurrentMonth: false,
      dateObj,
      isToday: false,
      event: getEventForDate(dateObj)
    });
  }

  // Event styling helper - dynamic for both preset and custom Supabase events
  const getEventBadgeStyle = (event) => {
    if (!event) return null;

    const isTicketed = event.isTicketed ?? event.is_ticketed;
    const slug = event.slug || event.id;

    if (slug === 'event-free-tapas') {
      return {
        pillColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        dotColor: 'bg-emerald-500',
        underlineColor: 'border-b-2 border-emerald-500',
        icon: Sparkles,
        label: event.badgeShort || 'Free Tapas'
      };
    }
    if (slug === 'event-cochinillo') {
      return {
        pillColor: 'bg-primary/20 text-primary border-primary/30',
        dotColor: 'bg-primary',
        underlineColor: 'border-b-2 border-primary',
        icon: Flame,
        label: event.badgeShort || 'Cochinillo Feast'
      };
    }
    if (slug === 'event-salsa') {
      return {
        pillColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        dotColor: 'bg-blue-500',
        underlineColor: 'border-b-2 border-blue-500',
        icon: Ticket,
        label: event.badgeShort || 'Salsa Masterclass'
      };
    }
    if (slug === 'event-live-music') {
      return {
        pillColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-500',
        underlineColor: 'border-b-2 border-amber-500',
        icon: Music,
        label: event.badgeShort || 'Live Son Cubano'
      };
    }
    if (slug === 'event-rum-tasting') {
      return {
        pillColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-500',
        underlineColor: 'border-b-2 border-amber-500',
        icon: Wine,
        label: event.badgeShort || '£18.50 Rum Flight'
      };
    }

    // Dynamic fallback for newly added events in Supabase
    return {
      pillColor: event.badge_short_color || event.badgeShortColor || (isTicketed ? 'bg-primary/20 text-primary border-primary/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'),
      dotColor: isTicketed ? 'bg-primary' : 'bg-emerald-500',
      underlineColor: isTicketed ? 'border-b-2 border-primary' : 'border-b-2 border-emerald-500',
      icon: isTicketed ? Ticket : Sparkles,
      label: event.badge_short || event.badgeShort || event.title
    };
  };

  return (
    <div className="bg-card rounded-3xl border border-border/80 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Top Header & Month Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <CalendarDays className="w-3.5 h-3.5" /> Interactive Calendar View
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              • Hover over any underlined day to preview event details
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
            Fiestas & Weekly Events Calendar
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse upcoming Cuban culinary feasts, free tapas Sundays, and salsa masterclasses in Notting Hill.
          </p>
        </div>

        {/* Month Navigation Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToday}
            className="rounded-full text-xs font-semibold px-3.5 h-9"
          >
            Today
          </Button>
          <div className="flex items-center bg-muted/60 p-1 rounded-full border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-full text-foreground hover:bg-background"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-bold text-foreground min-w-[130px] text-center select-none font-display">
              {monthNames[month]} {year}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-full text-foreground hover:bg-background"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-muted/30 p-3.5 rounded-2xl border border-border/40">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium text-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-primary rounded-full inline-block" />
            <span className="text-muted-foreground">Today (Underlined):</span>
            <strong className="text-primary font-bold">Today's Date</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Domingo Free Tapas</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Cochinillo Asado Feast</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Salsa Masterclass</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Noches de Buena Vista</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>Noche de Ron & Rumba</span>
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground italic hidden lg:inline">
          *Underlined days feature active Cuban events
        </span>
      </div>

      {/* 7-column Calendar Grid */}
      <div className="space-y-2">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-1">
          {weekDayNames.map((wd, i) => (
            <div key={wd} className={i >= 5 ? 'text-primary font-extrabold' : ''}>
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarCells.map((cell, idx) => {
            const { dayNumber, isCurrentMonth, dateObj, isToday, event } = cell;
            const eventStyle = getEventBadgeStyle(event);
            const colIndex = idx % 7; // 0 to 6
            const rowIndex = Math.floor(idx / 7); // 0 to 5

            // Formatting date label
            const fullDateStr = dateObj.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={idx}
                onClick={() => {
                  if (event) setSelectedDayData({ ...cell, fullDateStr });
                }}
                className={`relative group min-h-[78px] sm:min-h-[96px] p-2 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  !isCurrentMonth
                    ? 'bg-muted/10 border-border/30 text-muted-foreground/40 opacity-40'
                    : isToday
                    ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
                    : event
                    ? 'bg-card border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-md cursor-pointer'
                    : 'bg-card border-border/60 hover:bg-muted/20'
                }`}
              >
                {/* Cell Header: Day Number + Today / Event indicators */}
                <div className="flex items-start justify-between">
                  {/* Day Number with Underline requirement */}
                  <span
                    className={`text-sm sm:text-base font-display transition-all inline-block pb-0.5 ${
                      !isCurrentMonth
                        ? 'text-muted-foreground/40'
                        : isToday
                        ? 'font-extrabold text-primary border-b-2 border-primary'
                        : event
                        ? `font-bold text-foreground ${eventStyle?.underlineColor || 'border-b-2 border-amber-400'}`
                        : 'font-semibold text-foreground/80'
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {/* Today Badge */}
                  {isToday && (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full shadow-sm">
                      Today
                    </span>
                  )}

                  {/* Non-today event dot */}
                  {!isToday && event && (
                    <span className={`w-2 h-2 rounded-full ${eventStyle?.dotColor || 'bg-amber-400'} animate-pulse`} />
                  )}
                </div>

                {/* Event Mini Label inside cell */}
                {isCurrentMonth && event && (
                  <div className="mt-1">
                    <div
                      className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 border ${eventStyle?.pillColor}`}
                    >
                      {eventStyle?.icon && <eventStyle.icon className="w-3 h-3 shrink-0" />}
                      <span className="truncate">{eventStyle?.label}</span>
                    </div>
                  </div>
                )}

                {/* HOVER TOOLTIP CARD: Displays event details on mouse hover */}
                {isCurrentMonth && event && (
                  <div
                    className={`absolute z-40 hidden group-hover:flex flex-col w-72 sm:w-80 p-4 rounded-2xl bg-card border border-border shadow-2xl backdrop-blur-2xl pointer-events-auto transition-all duration-200 select-none ${
                      colIndex >= 4 ? 'right-0' : 'left-0'
                    } ${rowIndex >= 3 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                  >
                    {/* Popover Header with Image */}
                    <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-muted">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${event.badgeVariant === 'free' ? 'bg-emerald-600 text-white' : 'bg-primary text-white'} text-[10px] font-bold px-2 py-0.5 rounded-full border-0 shadow`}>
                          {event.isTicketed ? `£${event.price.toFixed(2)}` : 'FREE ENTRY'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                          {fullDateStr} {isToday && '• TODAY!'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold font-display leading-tight truncate">
                          {event.title}
                        </h4>
                      </div>
                    </div>

                    {/* Popover Body */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" /> {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-secondary" /> Notting Hill
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {event.subtitle || event.description}
                      </p>

                      {/* Action Button inside Hover Card */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {event.isTicketed ? `£${event.price.toFixed(2)} / ticket` : 'Free Walk-in • Table'}
                        </span>
                        {event.isTicketed ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onBookTicket) onBookTicket(event);
                            }}
                            className="h-7 px-3 text-[11px] rounded-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-1"
                          >
                            <Ticket className="w-3 h-3" /> Book Ticket
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onBookTable) onBookTable(event);
                              else if (onBookTicket) onBookTicket(event);
                              else window.location.href = 'tel:+442079460912';
                            }}
                            className="h-7 px-3 text-[11px] rounded-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-1"
                          >
                            <Users className="w-3 h-3" /> Book Table
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Spotlight (Mobile Tap or Click details) */}
      {selectedDayData && selectedDayData.event && (
        <div className="mt-4 p-5 rounded-2xl bg-muted/40 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedDayData.event.image}
              alt={selectedDayData.event.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary font-display">
                  {selectedDayData.fullDateStr}
                </span>
                {selectedDayData.isToday && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 rounded-full font-bold">
                    TODAY
                  </Badge>
                )}
              </div>
              <h4 className="text-base font-bold text-foreground font-display truncate">
                {selectedDayData.event.title}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-primary" /> {selectedDayData.event.time} • 24 Portobello Rd
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {selectedDayData.event.isTicketed ? (
              <Button
                size="sm"
                onClick={() => onBookTicket && onBookTicket(selectedDayData.event)}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md gap-1.5 text-xs px-4"
              >
                <Ticket className="w-3.5 h-3.5" /> Buy Ticket (£{selectedDayData.event.price.toFixed(2)})
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (onBookTable) onBookTable(selectedDayData.event);
                  else if (onBookTicket) onBookTicket(selectedDayData.event);
                  else window.location.href = 'tel:+442079460912';
                }}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md gap-1.5 text-xs px-4"
              >
                <Users className="w-3.5 h-3.5" /> Book Table (Free Entry)
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
