import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '@/services/restaurantService';

export default function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    restaurantService.getCategories().then(setCategories);
  }, []);

  const bgColors = [
    'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200/60',
    'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200/60',
    'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/60',
    'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200/60',
    'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/60',
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
          Explore Our Cuban Menu
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          The authentic tastes of Cuba: from hot-pressed sandwiches to slow-cooked family stews and tropical cocktails.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, idx) => (
          <div key={cat.id || cat.name} className="transition-transform duration-200 hover:-translate-y-1">
            <Link
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center text-center gap-3 p-5 rounded-2xl ${bgColors[idx % bgColors.length]} border shadow-sm hover:shadow-md transition-all h-full justify-center`}
            >
              <span className="text-4xl filter drop-shadow-sm">{cat.emoji}</span>
              <div>
                <span className="text-sm font-bold text-foreground block leading-tight">
                  {cat.name}
                </span>
                <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                  {cat.description}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
