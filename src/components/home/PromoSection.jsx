import React from 'react';
import { Percent, Truck, UtensilsCrossed } from 'lucide-react';

export default function PromoSection() {
  const promos = [
    {
      icon: Percent,
      title: '20% Off Your First Order',
      description: 'Apply voucher code CANEY20 at checkout',
      bgClass: 'bg-primary/10 border-primary/20',
      iconClass: 'text-primary',
    },
    {
      icon: Truck,
      title: 'Free UK Home Delivery',
      description: 'On all takeaway orders over £25',
      bgClass: 'bg-blue-500/10 dark:bg-blue-950/30 border-blue-500/20',
      iconClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: UtensilsCrossed,
      title: 'Cuban Street Food Deal',
      description: 'Pressed Cubano + Plantains/Fries + Drink for £12.95',
      bgClass: 'bg-indigo-500/10 dark:bg-indigo-950/30 border-indigo-500/20',
      iconClass: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {promos.map((promo, idx) => {
          const Icon = promo.icon;
          return (
            <div
              key={idx}
              className={`${promo.bgClass} rounded-2xl p-6 flex items-start gap-4 transition-transform hover:-translate-y-1 duration-200 border border-border/50 shadow-sm`}
            >
              <div className={`p-3 rounded-xl bg-background ${promo.iconClass} shadow-sm shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{promo.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
