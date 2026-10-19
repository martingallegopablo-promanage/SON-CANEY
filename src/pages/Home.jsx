import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Star } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import PromoSection from '@/components/home/PromoSection';
import CategorySection from '@/components/home/CategorySection';
import HomeEventsSection from '@/components/home/HomeEventsSection';
import { restaurantService } from '@/services/restaurantService';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Home() {
  const { addItem } = useCart();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    restaurantService.getMenuItems().then(setMenuItems);
  }, []);

  const featuredItems = menuItems.filter((item) => item.is_featured);

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
      customizations: [],
    });
    toast.success(`Added ${item.name} to order!`);
  };

  return (
    <div className="space-y-4">
      <HeroSection />
      <PromoSection />
      <CategorySection />

      {/* Featured Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">House Specials & Cuban Favourites</h2>
            <p className="text-muted-foreground mt-1">Our most popular authentic Cuban dishes prepared fresh to order</p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary gap-1">
            <Link to="/menu">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              to={`/menu/${item.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-1">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs shadow">
                      {item.tags[0]}
                    </Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
                  <Star className="w-3 h-3 text-secondary fill-secondary" />
                  <span>4.9</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-semibold text-primary/80">{item.category}</span>
                    {item.calories ? <span>{item.calories} kcal</span> : null}
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                  <span className="text-lg font-bold font-display text-primary">
                    £{item.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    className="rounded-full gap-1 shadow-sm"
                    onClick={(e) => handleQuickAdd(e, item)}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Events & Fiestas Preview Carousel Section */}
      <HomeEventsSection />
    </div>
  );
}
