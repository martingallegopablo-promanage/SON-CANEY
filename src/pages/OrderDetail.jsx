import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Bike, PackageCheck, MapPin, Phone, CreditCard, RotateCcw, Truck, Store, Banknote } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    restaurantService.getOrder(id).then((ord) => {
      setOrder(ord);
      setLoading(false);
    });

    // Suscripción a cambios en tiempo real vía WebSockets de Supabase
    const unsubscribe = restaurantService.subscribeToOrderUpdates(id, (updated) => {
      setOrder(updated);
      toast.info(`Status updated: ${updated.status?.toUpperCase()}`);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Tracking your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <p className="text-muted-foreground">We couldn't locate the order with reference #{id}.</p>
        <Button asChild className="rounded-full">
          <Link to="/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  // Progress timeline steps
  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'In Kitchen 🔥', icon: ChefHat },
    { key: 'ready', label: order.order_type === 'delivery' ? 'Out for Delivery' : 'Ready for Collection', icon: Bike },
    { key: 'delivered', label: 'Completed', icon: PackageCheck },
  ];

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getStepIndex = (status) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivered':
      case 'picked_up': return 3;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = getStepIndex(order.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdatingStatus(true);
    try {
      const { data, error } = await restaurantService.updateOrderStatus(order.id || order.order_number, newStatus);
      if (error) {
        toast.error('Failed to update status.');
      } else {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Order status updated to "${newStatus.toUpperCase()}"!`);
      }
    } catch (err) {
      toast.error('Error updating order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReorder = () => {
    order.items?.forEach((item) => {
      addItem({
        menu_item_id: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        image_url: item.image_url,
      });
    });
    toast.success('Items added to basket!');
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </Link>

      {/* Header card */}
      <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                Order #{order.order_number}
              </h1>
              <Badge
                className={
                  order.order_type === 'pickup'
                    ? 'bg-secondary/10 text-secondary border-secondary/20 font-semibold'
                    : 'bg-primary/10 text-primary border-primary/20 font-semibold'
                }
              >
                {order.order_type === 'pickup' ? '🥡 STORE COLLECTION' : '🛵 HOME DELIVERY'}
              </Badge>
              <Badge
                className={
                  order.payment_method?.toLowerCase().includes('cash')
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold'
                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20 font-semibold'
                }
              >
                {order.payment_method?.toLowerCase().includes('cash')
                  ? `💵 Cash Due: £${Number(order.total || 0).toFixed(2)}`
                  : `💳 ${order.payment_method || 'Card Paid'}`}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {new Date(order.created_at || Date.now()).toLocaleString('en-GB')}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Campo de selección de estado de la orden */}
            <div className="flex items-center gap-2 bg-muted/60 p-1 px-3 rounded-2xl border border-border/80">
              <label htmlFor="order-status-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Status:
              </label>
              <select
                id="order-status-select"
                value={order.status || 'confirmed'}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                className="bg-background text-foreground font-semibold text-xs rounded-xl px-2.5 py-1.5 border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-60"
              >
                <option value="confirmed">🔵 Confirmed</option>
                <option value="preparing">🔥 In Kitchen (Preparing)</option>
                <option value="ready">🛵 Ready / Out for Delivery</option>
                <option value="picked_up">📦 Picked Up</option>
                <option value="delivered">✅ Completed (Delivered)</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2 self-start sm:self-auto"
              onClick={handleReorder}
            >
              <RotateCcw className="w-4 h-4" /> Reorder All Items
            </Button>
          </div>
        </div>

        {/* Visual Tracker Timeline */}
        <div className="pt-4 border-t border-border/60">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isPast
                        ? 'bg-primary text-primary-foreground font-bold ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isPast
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.status === 'cancelled' ? (
            <div className="mt-6 bg-destructive/15 border border-destructive/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-destructive text-sm font-semibold">
              <span>This order has been cancelled.</span>
            </div>
          ) : order.status === 'delivered' || order.status === 'picked_up' ? (
            <div className="mt-6 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Order completed and fulfilled successfully! Thank you for dining with Son Caney.</span>
            </div>
          ) : (
            <div className="mt-6 bg-primary/10 rounded-2xl p-4 flex items-center justify-center gap-3 text-primary text-sm font-semibold">
              <Clock className="w-5 h-5 shrink-0" />
              <span>Estimated fulfillment: 15-20 minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Two columns: Details & Receipt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer & Delivery details */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-foreground font-display">
            {order.order_type === 'pickup' ? 'Collection & Contact Details' : 'Delivery & Contact Details'}
          </h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-start gap-3 text-muted-foreground">
              {order.order_type === 'pickup' ? (
                <Store className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              ) : (
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="text-foreground block text-sm">
                  {order.order_type === 'pickup' ? 'Pickup Location:' : 'Delivery Address:'}
                </strong>
                <span className="text-sm">
                  {order.delivery_address ||
                    (order.order_type === 'pickup'
                      ? 'Son Caney Cuban Kitchen, 24 Portobello Road, London, W11 3DL'
                      : 'Delivery address on record')}
                </span>
                {order.order_type === 'pickup' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ℹ️ Please present this screen or mention <strong>#{order.order_number}</strong> to the counter staff.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <div>
                <strong className="text-foreground block">Customer:</strong>
                <span>
                  {order.customer_name} • {order.customer_phone}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              {order.payment_method?.toLowerCase().includes('cash') ? (
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="text-foreground block">Payment Status:</strong>
                <span className="text-foreground font-medium">
                  {order.payment_method || 'Cash'}
                </span>
                {order.payment_method?.toLowerCase().includes('cash') && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-semibold">
                    Amount to pay:{' '}
                    <span className="text-foreground font-bold">
                      £{Number(order.total || 0).toFixed(2)}
                    </span>{' '}
                    (Exact cash preferred)
                  </p>
                )}
              </div>
            </div>

            {order.special_instructions && (
              <div className="p-3 bg-muted/40 rounded-2xl border border-border/40 mt-2 text-xs">
                <span className="font-semibold block text-foreground">Special Instructions:</span>
                <span className="text-muted-foreground">{order.special_instructions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Receipt / Items Breakdown */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-foreground font-display">Items in Order</h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2 text-sm border-b pb-2 last:border-0">
                <div className="flex gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{item.name}</p>
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.customizations.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-foreground shrink-0">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm pt-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>£{order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{order.order_type === 'pickup' ? 'Collection Fee' : 'Delivery Fee'}</span>
              <span>
                {order.order_type === 'pickup' || order.delivery_fee === 0
                  ? 'FREE'
                  : `£${order.delivery_fee?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (included)</span>
              <span>£{order.tax?.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg text-foreground pt-1">
              <span>
                {order.payment_method?.toLowerCase().includes('cash')
                  ? 'Total Due (Cash)'
                  : 'Total Paid'}
              </span>
              <span className="text-primary font-display text-2xl font-extrabold">
                £{order.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
