import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import CubanFlagLogo from '@/components/ui/CubanFlagLogo';
import { toast } from 'sonner';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Cuban Menu', path: '/menu' },
    { label: 'Events & Fiestas', path: '/events' },
    { label: 'My Orders', path: '/orders' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await logout();
    setUserDropdownOpen(false);
    toast.info('Signed out successfully');
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <CubanFlagLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-foreground block leading-tight">
                Son Caney
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-primary block -mt-0.5">
                Cuban Street Food & Bar
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Auth Section (Desktop) */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/70 hover:border-primary/50 bg-card hover:bg-accent/40 transition-colors shadow-sm text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border/80 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-border/60">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                        >
                          <User className="w-4 h-4 text-primary" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                        >
                          <Package className="w-4 h-4 text-amber-500" />
                          My Orders & Receipts
                        </Link>
                        <Link
                          to="/menu"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-secondary" />
                          Order Food
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-border/60">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 font-medium border-border hover:border-primary text-foreground"
                >
                  <Link to="/login">
                    <User className="w-4 h-4 text-primary" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent text-foreground"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2">
          {/* User info on mobile */}
          {isAuthenticated && user ? (
            <div className="p-3.5 mb-2 rounded-2xl bg-muted/60 border border-border/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-destructive hover:bg-destructive/10 text-xs rounded-xl shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Exit
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs font-semibold">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-primary" /> My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-amber-500" /> My Orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="pb-2">
              <Button asChild className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 mr-2" /> Sign In / Create Account
                </Link>
              </Button>
            </div>
          )}

          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
