import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check, Flame, ShieldAlert, ShoppingBag } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function MenuItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    setLoading(true);
    restaurantService.getMenuItemById(id).then((data) => {
      setItem(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading dish details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Dish not found</h2>
        <p className="text-muted-foreground mt-2">The item you requested does not exist or is currently unavailable.</p>
        <Button className="mt-6 rounded-full" onClick={() => navigate('/menu')}>
          Return to Menu
        </Button>
      </div>
    );
  }

  // Handle single option selection (radio like)
  const handleSelectOption = (groupName, optionName, isSingle = true) => {
    setSelectedCustomizations((prev) => {
      if (isSingle) {
        return { ...prev, [groupName]: [optionName] };
      }
      const existing = prev[groupName] || [];
      if (existing.includes(optionName)) {
        return { ...prev, [groupName]: existing.filter((o) => o !== optionName) };
      } else {
        return { ...prev, [groupName]: [...existing, optionName] };
      }
    });
  };

  // Calculate total price based on customizations and quantity
  let extraCost = 0;
  if (item.customizations) {
    item.customizations.forEach((group) => {
      const selected = selectedCustomizations[group.group_name] || [];
      selected.forEach((optName) => {
        const opt = group.options.find((o) => o.name === optName);
        if (opt && opt.price_add) extraCost += opt.price_add;
      });
    });
  }

  const unitPrice = item.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    // Check required customizations
    if (item.customizations) {
      for (const group of item.customizations) {
        if (group.required && (!selectedCustomizations[group.group_name] || selectedCustomizations[group.group_name].length === 0)) {
          toast.error(`Please select an option for "${group.group_name}"`);
          return;
        }
      }
    }

    const customizationStrings = [];
    Object.entries(selectedCustomizations).forEach(([groupName, opts]) => {
      opts.forEach((optName) => {
        const group = item.customizations?.find((g) => g.group_name === groupName);
        const opt = group?.options?.find((o) => o.name === optName);
        if (opt && opt.price_add > 0) {
          customizationStrings.push(`${optName} (+£${opt.price_add.toFixed(2)})`);
        } else {
          customizationStrings.push(optName);
        }
      });
    });

    addItem({
      menu_item_id: item.id,
      name: item.name,
      price: unitPrice,
      quantity,
      image_url: item.image_url,
      customizations: customizationStrings,
      special_instructions: specialInstructions,
    });

    toast.success(`Added ${quantity}x ${item.name} to order!`);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Item Image */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-lg border border-border/60">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.tags && item.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} className="bg-primary/95 text-primary-foreground shadow">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {item.calories ? (
            <div className="flex items-center justify-center p-3 bg-muted/40 rounded-2xl border border-border/40 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Calories: <strong>{item.calories} kcal</strong></span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Item Details and Customization Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {item.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-1">
              {item.name}
            </h1>
            <p className="text-2xl font-bold text-primary mt-2">
              £{unitPrice.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-3 leading-relaxed text-sm">
              {item.description}
            </p>

            {/* Customizations Groups */}
            {item.customizations && item.customizations.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="font-bold text-base text-foreground border-b pb-2">
                  Customize Your Meal
                </h3>

                {item.customizations.map((group) => {
                  const isSingle = group.max_select === 1;
                  const currentSelected = selectedCustomizations[group.group_name] || [];

                  return (
                    <div key={group.group_name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {group.group_name}
                          {group.required && (
                            <span className="text-xs font-normal text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          )}
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {isSingle ? 'Choose 1' : `Up to ${group.max_select || 'any'}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((option) => {
                          const isChecked = currentSelected.includes(option.name);

                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={() => handleSelectOption(group.group_name, option.name, isSingle)}
                              className={`p-3 rounded-xl border text-left flex items-center justify-between text-sm transition-all ${
                                isChecked
                                  ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-sm'
                                  : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                    isChecked
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-muted-foreground/40'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{option.name}</span>
                              </div>
                              {option.price_add > 0 && (
                                <span className="text-xs text-primary font-bold">
                                  +£{option.price_add.toFixed(2)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Special Instructions */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Kitchen Notes & Instructions (Optional)
              </label>
              <Textarea
                placeholder="E.g., extra crispy, sauce on the side, allergies, lime on the side..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="resize-none text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Quantity and Add to Cart Bar */}
          <div className="pt-6 border-t border-border flex items-center gap-4">
            {/* Quantity Controller */}
            <div className="flex items-center border border-border rounded-xl bg-card p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-sm min-w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart button */}
            <Button
              className="flex-1 h-12 text-base font-semibold rounded-xl shadow-md gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Order • £{totalPrice.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
