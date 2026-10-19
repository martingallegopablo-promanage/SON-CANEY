import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const { addItem } = useCart();

  useEffect(() => {
    restaurantService.getCategories().then(setCategories);
    restaurantService.getMenuItems().then(setMenuItems);
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  const allTags = ['All', 'Bestseller', 'Chef Special', 'Traditional', 'Sharing', 'Vegetarian', 'Gluten Free'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        selectedCategory.toLowerCase() === 'todos' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === 'All' ||
        selectedTag.toLowerCase() === 'todos' ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [menuItems, selectedCategory, searchQuery, selectedTag]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All' || category === 'Todos') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Our Cuban Menu</h1>
          <p className="text-muted-foreground mt-1">Authentic criollo street food and family recipes prepared fresh to order</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cubano, ropa vieja, tostones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-card shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
            selectedCategory === 'All' || selectedCategory === 'Todos'
              ? 'bg-primary text-primary-foreground shadow-md scale-105'
              : 'bg-card text-muted-foreground hover:bg-muted border border-border/60'
          }`}
        >
          All Items ({menuItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id || cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 ${
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-card text-muted-foreground hover:bg-muted border border-border/60'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="text-muted-foreground flex items-center gap-1 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              selectedTag === tag
                ? 'bg-secondary text-secondary-foreground font-semibold'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border p-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold">No dishes found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Try searching for something else or explore our other Cuban categories.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSelectedTag('All');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <Link to={`/menu/${item.id}`} className="block">
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
                </div>

                <div className="p-5 pb-0">
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
              </Link>

              <div className="p-5 pt-4">
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-xl font-bold font-display text-foreground">
                    £{item.price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                    >
                      <Link to={`/menu/${item.id}`}>Details</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full gap-1 shadow-sm"
                      onClick={(e) => handleQuickAdd(e, item)}
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
