import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CartSheet() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, tax, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-6">
        <SheetHeader className="text-left pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl font-display font-bold">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Order ({items.reduce((s, i) => s + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-8 h-8 opacity-40" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Your basket is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't added any authentic Cuban dishes yet. Explore our menu and treat yourself!
              </p>
            </div>
            <Button
              className="mt-2 rounded-full"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/menu');
              }}
            >
              Explore Cuban Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-3 bg-card p-3 rounded-xl border border-border/60 hover:border-primary/30 transition-colors shadow-sm"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm leading-tight text-foreground truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.customizations.join(', ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-sm text-primary">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>

                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-md"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-md"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations & Checkout */}
            <div className="pt-4 border-t space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated VAT</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base text-foreground pt-1">
                  <span>Total</span>
                  <span className="text-primary font-display text-lg">£{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full py-6 text-base font-semibold rounded-xl shadow-md gap-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
