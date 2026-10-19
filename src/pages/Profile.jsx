import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Package,
  ShoppingBag,
  LogOut,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CubanFlagLogo from '@/components/ui/CubanFlagLogo';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, updatePassword, validatePassword, logout } = useAuth();

  // Profile data form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password change form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Pre-fill user data when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setPhone(user.user_metadata?.phone || '');
      setDeliveryAddress(user.user_metadata?.delivery_address || localStorage.getItem('soncaney_saved_address') || '');
    }
  }, [user]);

  // If user is not logged in, prompt to log in
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground">Sign In to View Your Profile</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Please log in or create an account to manage your profile details, delivery addresses, and orders.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link to="/login">
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/menu">Explore Menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Live password validation checks
  const pwLengthValid = newPassword.length >= 6;
  const pwLetterValid = /[a-zA-Z]/.test(newPassword);
  const pwNumberValid = /[0-9]/.test(newPassword);
  const pwSymbolValid = /[^a-zA-Z0-9\s]/.test(newPassword);
  const pwMatches = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordFormValid = pwLengthValid && pwLetterValid && pwNumberValid && pwSymbolValid && pwMatches;

  // Handle personal profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      if (deliveryAddress) {
        localStorage.setItem('soncaney_saved_address', deliveryAddress);
      }

      const { data, error } = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });

      if (error) {
        toast.error(error.message || 'Could not update profile');
      } else {
        toast.success('Your profile details were updated successfully!');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while updating profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.message);
      toast.error(validation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { data, error } = await updatePassword(newPassword);
      if (error) {
        setPasswordError(error.message || 'Could not change password.');
        toast.error(error.message || 'Could not change password.');
      } else {
        toast.success('Your password has been changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      }
    } catch (err) {
      setPasswordError('Failed to change password. Please try again.');
      toast.error('Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const displayName = fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest';
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 border border-primary/30 p-6 sm:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {initialLetter}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-display font-bold">{displayName}</h1>
                <Badge className="bg-primary/90 text-primary-foreground text-xs shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Account
                </Badge>
              </div>
              <p className="text-zinc-300 text-sm mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
              </p>
              {user.created_at && (
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Member since {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
            >
              <Link to="/orders">
                <Package className="w-3.5 h-3.5 mr-1.5 text-primary" /> My Orders
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logout();
                toast.info('Signed out successfully');
                navigate('/');
              }}
              className="rounded-full text-red-300 hover:text-red-200 hover:bg-red-500/20 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: Personal Details */}
        <Card className="rounded-3xl border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4" /> Personal Profile
            </div>
            <CardTitle className="text-xl font-bold font-display">Personal Details (Mis Datos)</CardTitle>
            <CardDescription>
              Keep your contact details up to date for smooth food delivery & collection in London.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Full Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Israel Romero"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Email (Read-Only account identifier) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="rounded-xl bg-muted/60 text-muted-foreground cursor-not-allowed"
                />
                <span className="text-[11px] text-muted-foreground block">
                  Email is linked to your Supabase credentials and order receipts.
                </span>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number (UK / Delivery)
                </label>
                <Input
                  type="tel"
                  placeholder="+44 7700 900123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Saved Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Default Delivery Address
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 24 Portobello Road, Notting Hill, London W11"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="rounded-xl bg-background"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full rounded-full py-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all"
                >
                  {isUpdatingProfile ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Changes...
                    </div>
                  ) : (
                    'Save Personal Details'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Form 2: Password and Security */}
        <Card className="rounded-3xl border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" /> Security & Access
            </div>
            <CardTitle className="text-xl font-bold font-display">Change Password (Contraseña)</CardTitle>
            <CardDescription>
              Ensure your account is protected with a secure password containing letters, numbers, and symbols.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" /> New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="rounded-xl bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="rounded-xl bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Password Strength Requirements Checklist */}
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-2 text-xs">
                <p className="font-semibold text-foreground/90 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-1.5 ${pwLengthValid ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                    {pwLengthValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>At least 6 characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${pwLetterValid ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                    {pwLetterValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>At least 1 letter (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${pwNumberValid ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                    {pwNumberValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>At least 1 number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${pwSymbolValid ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                    {pwSymbolValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>At least 1 symbol (!@#$)</span>
                  </div>
                </div>

                {confirmPassword && (
                  <div className={`pt-1 border-t border-border/40 flex items-center gap-1.5 ${pwMatches ? 'text-emerald-500 font-medium' : 'text-destructive'}`}>
                    {pwMatches ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{pwMatches ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword || !isPasswordFormValid}
                  className="w-full rounded-full py-5 font-semibold bg-secondary hover:bg-secondary/90 text-white shadow-md transition-all"
                >
                  {isUpdatingPassword ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Helpful Shortcuts Banner */}
      <div className="rounded-3xl bg-muted/40 border border-border/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Craving Authentic Cuban Flavour?</h3>
            <p className="text-xs text-muted-foreground">Order hot pressed Cubanos, slow roasted lechón or refreshing cocktails right now.</p>
          </div>
        </div>
        <Button asChild className="rounded-full shrink-0">
          <Link to="/menu">Order Food Now</Link>
        </Button>
      </div>
    </div>
  );
}
