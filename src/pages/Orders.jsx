import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, Utensils, Search, RefreshCw, LogIn, Sparkles, RotateCcw, CheckCircle2, Filter } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const { addItem, setIsCartOpen } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      let data = [];
      if (isAuthenticated && user?.email) {
        data = await restaurantService.getUserOrders(user.email);
      } else {
        data = await restaurantService.getGuestOrders();
      }
      setOrders(data || []);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    toast.success('Orders refreshed');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrders();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    try {
      const results = await restaurantService.searchOrders(searchQuery.trim());
      setOrders(results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setLoading(true);
    fetchOrders();
  };

  const displayedOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => {
      const s = (o.status || '').toLowerCase();
      if (statusFilter === 'delivered') return s === 'delivered' || s === 'picked_up';
      return s === statusFilter.toLowerCase();
    });
  }, [orders, statusFilter]);

  const handleReorder = (order, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item) => {
      addItem({
        menu_item_id: item.menu_item_id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        customizations: item.customizations || [],
        image_url: item.image_url,
      });
    });

    toast.success('Items added to your basket!');
    setIsCartOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Confirmed</Badge>;
      case 'preparing':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 animate-pulse">In Kitchen 🔥</Badge>;
      case 'ready':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Ready</Badge>;
      case 'delivered':
      case 'picked_up':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-foreground">My Orders & Receipts</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAuthenticated && user
              ? `Tracking orders linked to ${user.email}`
              : 'Track current Cuban kitchen status and past receipts'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-full gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {!isAuthenticated && (
            <Button asChild size="sm" className="rounded-full gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/login">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Guest Sign-In Banner */}
      {!isAuthenticated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Want to see all your orders across devices?</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Sign in with your email to keep your order history safe, view live status, and reorder Cuban favourites in seconds.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" className="rounded-full bg-secondary hover:bg-secondary/90 text-white text-xs">
              <Link to="/login">Sign In / Register</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Order Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by order reference (e.g. SC-8492) or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl bg-card border-border/70"
            />
          </div>
          <Button type="submit" variant="secondary" className="rounded-2xl px-5 text-sm font-medium">
            Search
          </Button>
          {isSearching && (
            <Button type="button" variant="ghost" onClick={handleClearSearch} className="rounded-2xl text-xs">
              Clear
            </Button>
          )}
        </form>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl bg-card border border-border/80 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-sm"
            aria-label="Filter orders by status"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="confirmed">🔵 Confirmed</option>
            <option value="preparing">🔥 In Kitchen</option>
            <option value="ready">🛵 Ready / Delivery</option>
            <option value="picked_up">📦 Picked Up</option>
            <option value="delivered">✅ Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List / Loading State */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your orders...</p>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Package className="w-8 h-8 opacity-40" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isSearching || statusFilter !== 'all' ? 'No orders match your filter' : 'No orders found'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {isSearching || statusFilter !== 'all'
                ? 'Try changing the status filter or clearing your search term.'
                : 'Ready for authentic Cuban flavours? Explore our menu and place your first order!'}
            </p>
          </div>
          <div className="pt-2">
            {isSearching || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleClearSearch();
                  setStatusFilter('all');
                }}
                className="rounded-full"
              >
                Reset Filters & View All
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/menu">Explore Cuban Menu</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id || order.order_number}
                className="bg-card p-5 sm:p-6 rounded-3xl border border-border/80 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-base sm:text-lg">
                          Order #{order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span className="font-semibold uppercase text-foreground/80">
                          {order.order_type || 'DELIVERY'}
                        </span>
                        {order.customer_email && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{order.customer_email}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-display font-extrabold text-2xl text-primary">
                      £{Number(order.total || 0).toFixed(2)}
                    </span>
                    <Button asChild size="sm" className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-1.5 shadow-sm">
                      <Link to={`/orders/${order.id || order.order_number}`}>
                        <span>Live Status</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {order.items?.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-muted/70 font-medium text-foreground border border-border/40"
                      >
                        {item.quantity || 1}x {item.name}
                      </span>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleReorder(order, e)}
                    className="self-end sm:self-center text-xs font-semibold text-muted-foreground hover:text-primary gap-1.5 rounded-full"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
