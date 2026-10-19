import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  Store,
  CreditCard,
  Banknote,
  ShieldCheck,
  Tag,
  UserCheck,
  LogIn,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { restaurantService } from '@/services/restaurantService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, tax, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Order type: 'delivery' | 'pickup'
  const [orderType, setOrderType] = useState('delivery');

  // Customer contact info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment method: 'cash' | 'card'
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Card form state (for Stripe preview)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardPostcode, setCardPostcode] = useState('');

  // Promo voucher code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user information if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!customerName && user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
      if (!customerEmail && user.email) {
        setCustomerEmail(user.email);
      }
      if (!customerPhone && user.user_metadata?.phone) {
        setCustomerPhone(user.user_metadata.phone);
      }
    }
  }, [isAuthenticated, user]);

  const deliveryFee = orderType === 'delivery' ? (subtotal > 25 ? 0 : 2.99) : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + tax + deliveryFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'CANEY20' || code === 'FLAME20') {
      setDiscountPercent(20);
      toast.success('Voucher CANEY20 applied: 20% discount!');
    } else {
      toast.error('Invalid voucher code. Try CANEY20');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your order is empty');
      navigate('/menu');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!customerPhone.trim()) {
      toast.error('Please enter your UK phone number');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Please enter your UK delivery address and postcode');
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `SC-${randomNum}`;

    const newOrder = {
      order_number: orderNumber,
      status: 'confirmed',
      order_type: orderType,
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        customizations: i.customizations || [],
        special_instructions: i.special_instructions || '',
        image_url: i.image_url,
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      delivery_fee: parseFloat(deliveryFee.toFixed(2)),
      total: parseFloat(finalTotal.toFixed(2)),
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || (user?.email || null),
      delivery_address:
        orderType === 'delivery'
          ? deliveryAddress
          : 'Son Caney Cuban Kitchen, 24 Portobello Road, London, W11 3DL (Store Collection)',
      special_instructions: specialInstructions,
      payment_method:
        paymentMethod === 'cash'
          ? orderType === 'delivery'
            ? 'Cash on Delivery'
            : 'Cash on Collection'
          : 'Card Payment (Stripe Preview)',
    };

    // Save order in Supabase & local storage
    const savedOrder = await restaurantService.createOrder(newOrder);

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if canvas-confetti fails
    }

    clearCart();

    if (paymentMethod === 'cash') {
      toast.success(
        `Order #${orderNumber} confirmed! Pay £${finalTotal.toFixed(2)} in cash upon ${
          orderType === 'delivery' ? 'delivery' : 'collection'
        }.`
      );
    } else {
      toast.success(`Order #${orderNumber} placed via Card Gateway Preview!`);
    }

    setTimeout(() => {
      navigate(`/orders/${savedOrder.id || orderId}`);
    }, 700);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <h2 className="text-2xl font-bold font-display">Your basket is empty</h2>
        <p className="text-muted-foreground text-sm">Add some authentic Cuban dishes to your order first!</p>
        <Button asChild className="rounded-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/menu">Explore Cuban Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Complete your order details and choose your delivery and payment options
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Details Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. DELIVERY VS COLLECTION SELECTOR */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                1. Delivery or Collection?
              </h2>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Step 1 of 3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Home Delivery Card */}
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  orderType === 'delivery'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                    : 'border-border/80 hover:bg-muted/60 text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      orderType === 'delivery' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <Badge
                    variant={orderType === 'delivery' ? 'default' : 'secondary'}
                    className="text-[11px] font-semibold"
                  >
                    25-35 mins
                  </Badge>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">🛵 Home Delivery</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hot to your door • {subtotal > 25 ? 'FREE over £25' : '£2.99 fee'}
                  </p>
                </div>
              </button>

              {/* Store Collection Card */}
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  orderType === 'pickup'
                    ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20 shadow-sm'
                    : 'border-border/80 hover:bg-muted/60 text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      orderType === 'pickup' ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <Badge
                    variant={orderType === 'pickup' ? 'default' : 'secondary'}
                    className="text-[11px] font-semibold bg-emerald-600 text-white"
                  >
                    FREE • 15-20m
                  </Badge>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">🥡 Store Collection (Takeaway)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pick up from Notting Hill bar • £0.00 fee
                  </p>
                </div>
              </button>
            </div>

            {/* Collection Point info notice if collection selected */}
            {orderType === 'pickup' && (
              <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-xs text-secondary-foreground flex items-start gap-2.5 animate-in fade-in">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Pickup Location:</p>
                  <p className="text-muted-foreground mt-0.5">
                    Son Caney Cuban Kitchen & Bar, 24 Portobello Road, Notting Hill, London, W11 3DL.
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Your food will be freshly boxed and waiting for you at the counter!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. CONTACT & ADDRESS */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                2. Contact {orderType === 'delivery' ? '& Delivery Address' : 'Information'}
              </h2>
              {isAuthenticated && user ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Logged In
                </span>
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: '/checkout' } }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign in for faster checkout
                </Link>
              )}
            </div>

            {isAuthenticated && user && (
              <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60">
                Ordering as <strong className="text-foreground">{user.email}</strong>. This order will automatically appear in your account history and live tracking.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Oliver Smith"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">UK Mobile Number *</label>
                <Input
                  required
                  placeholder="e.g. +44 7700 900123"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address (for receipt & live tracking)</label>
              <Input
                type="email"
                placeholder="oliver@example.co.uk"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs font-semibold text-foreground">Delivery Address & Postcode (UK) *</label>
                <Input
                  required
                  placeholder="e.g. Flat 4B, 18 Portobello Road, London, W11 1DJ"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kitchen / {orderType === 'delivery' ? 'Courier' : 'Collection'} Notes (Optional)
              </label>
              <Textarea
                placeholder="E.g. buzzer number, leave with reception, ring doorbell, food allergies..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* 3. PAYMENT GATEWAY (PASARELA DE PAGO) */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                3. Payment Method
              </h2>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Step 3 of 3
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Cash Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-border/80 hover:bg-muted/60 text-muted-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === 'cash' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">
                      💵 Cash on {orderType === 'delivery' ? 'Delivery' : 'Collection'}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      {orderType === 'delivery' ? 'Pay courier on arrival' : 'Pay at restaurant counter'}
                    </span>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Active</Badge>
              </button>

              {/* Card Option (Stripe Preview) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20 shadow-sm'
                    : 'border-border/80 hover:bg-muted/60 text-muted-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === 'card' ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">
                      💳 Credit / Debit Card
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Visa, Mastercard, Amex, Apple Pay
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                  Preview
                </Badge>
              </button>
            </div>

            {/* DYNAMIC CONTENT BASED ON PAYMENT METHOD */}
            {paymentMethod === 'cash' ? (
              /* CASH BOX */
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ready for instant order placement</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {orderType === 'delivery' ? (
                    <>
                      You will pay <strong className="text-foreground">£{finalTotal.toFixed(2)}</strong> in cash
                      directly to our delivery driver when your food arrives. Please try to have exact change
                      ready if possible.
                    </>
                  ) : (
                    <>
                      You will pay <strong className="text-foreground">£{finalTotal.toFixed(2)}</strong> in cash (or
                      physical card) at the counter when collecting your order at 24 Portobello Road.
                    </>
                  )}
                </p>
              </div>
            ) : (
              /* CARD / STRIPE PAYMENT GATEWAY BOX */
              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4 animate-in fade-in">
                {/* Notice banner */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Stripe Payment Gateway (Preview Mode)</p>
                    <p className="mt-0.5 text-muted-foreground leading-relaxed">
                      Online card payments with Stripe will be active soon. You can test this form preview or
                      submit to test simulated orders, or switch back to <strong>Cash</strong> anytime!
                    </p>
                  </div>
                </div>

                {/* Express Checkout preview */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block text-center">
                    Express Checkout
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toast.info('Apple Pay simulation clicked')}
                      className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span> Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Google Pay simulation clicked')}
                      className="w-full py-2.5 rounded-xl bg-white border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span className="font-bold">G</span>
                      <span>Pay</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-muted-foreground uppercase font-semibold">
                    Or pay with card
                  </span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                {/* Card Fields Form */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Card Number</span>
                      <span className="text-[10px] text-muted-foreground flex gap-1 font-mono">
                        <span>VISA</span> • <span>MC</span> • <span>AMEX</span>
                      </span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="pl-10 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Expiry</label>
                      <Input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="rounded-xl font-mono text-xs text-center"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">CVC / CVV</label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="rounded-xl font-mono text-xs text-center"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Postcode</label>
                      <Input
                        type="text"
                        placeholder="W11 1DJ"
                        value={cardPostcode}
                        onChange={(e) => setCardPostcode(e.target.value)}
                        className="rounded-xl uppercase text-xs text-center font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Name on Card</label>
                    <Input
                      type="text"
                      placeholder="e.g. Oliver Smith"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Security footer */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted • Powered by Stripe</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-xl text-foreground font-display">Order Summary</h3>
              <Badge variant="secondary" className="text-xs font-bold uppercase">
                {orderType === 'delivery' ? '🛵 Delivery' : '🥡 Collection'}
              </Badge>
            </div>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartId} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {item.quantity}x
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.name}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
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

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Voucher Code (CANEY20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="pl-9 text-xs uppercase rounded-xl"
                />
              </div>
              <Button type="submit" variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                Apply
              </Button>
            </form>

            <Separator />

            {/* Calculation rows */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount (20%)</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Collection Fee'}</span>
                <span>
                  {orderType === 'pickup'
                    ? 'FREE (£0.00)'
                    : deliveryFee === 0
                    ? 'FREE'
                    : `£${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>VAT (included)</span>
                <span>£{tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-baseline pt-2">
                <div>
                  <span className="font-bold text-base text-foreground block">Total to Pay</span>
                  <span className="text-xs text-muted-foreground">
                    Via {paymentMethod === 'cash' ? 'Cash' : 'Card'} • {orderType.toUpperCase()}
                  </span>
                </div>
                <span className="text-3xl font-extrabold font-display text-primary">
                  £{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              className="w-full py-6 text-base font-semibold rounded-2xl shadow-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </div>
              ) : paymentMethod === 'cash' ? (
                `Confirm & Pay Cash • £${finalTotal.toFixed(2)}`
              ) : (
                `Place Order (Card Preview) • £${finalTotal.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
