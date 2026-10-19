import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, XCircle } from 'lucide-react';
import { useAuth, validatePassword } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CubanFlagLogo from '@/components/ui/CubanFlagLogo';
import { toast } from 'sonner';

export default function Auth({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, signUp, loginAsDemo, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Where to redirect after login (default /orders)
  const redirectPath = location.state?.from?.pathname || '/orders';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setConfirmationNotice(false);

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { data, error } = await login(loginEmail, loginPassword);
    setLoading(false);

    if (error) {
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        setErrorMsg('Your email is registered but not yet confirmed. Please check your inbox for the Supabase confirmation email, or use the Instant Test Account below.');
      } else if (error.message?.toLowerCase().includes('invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please verify your credentials or create a new account.');
      } else {
        setErrorMsg(error.message || 'Login failed. Please try again.');
      }
      return;
    }

    toast.success('Welcome back to Son Caney!');
    navigate(redirectPath);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setConfirmationNotice(false);

    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const pwCheck = validatePassword(registerPassword);
    if (!pwCheck.isValid) {
      setErrorMsg(pwCheck.message);
      return;
    }

    setLoading(true);
    const { data, error, requiresConfirmation } = await signUp(registerEmail, registerPassword, {
      fullName: registerName,
      phone: registerPhone,
    });
    setLoading(false);

    if (error) {
      if (error.message?.toLowerCase().includes('rate limit')) {
        setErrorMsg('Email rate limit reached for Supabase free tier. You can sign in immediately using the Instant Test Account option below!');
      } else {
        setErrorMsg(error.message || 'Registration failed. Please try again.');
      }
      return;
    }

    if (requiresConfirmation) {
      setConfirmationNotice(true);
      toast.info('Account created! Please check your email to confirm registration.');
    } else {
      toast.success('Account created successfully! Welcome to Son Caney.');
      navigate(redirectPath);
    }
  };

  const handleDemoLogin = (email = 'isra@soncaney.co.uk', name = 'Israel Romero') => {
    loginAsDemo(email, name);
    toast.success(`Logged in as ${name}!`);
    navigate(redirectPath);
  };

  // If already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">You are logged in</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Signed in as <span className="font-semibold text-foreground">{user.email}</span>
            {user.user_metadata?.full_name && ` (${user.user_metadata.full_name})`}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/orders">
              View My Orders <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/menu">Browse Cuban Menu</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              toast.info('Signed out');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/20">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <CubanFlagLogo className="w-16 h-16 mx-auto shadow-lg hover:scale-105 transition-transform" />
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-foreground">
            Son Caney Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track your Cuban feasts in real time and reorder your favourites.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {confirmationNotice && (
            <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-0.5 leading-relaxed">
                  We've sent an activation link to your email. Click it to verify, or use the instant test account below to begin tracking immediately!
                </p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6 bg-muted/60 p-1 rounded-2xl">
              <TabsTrigger value="login" className="rounded-xl font-semibold text-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl font-semibold text-sm">
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* TAB: SIGN IN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.co.uk"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle login password visibility"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-6 font-semibold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground text-base mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    'Sign In to Son Caney'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* TAB: REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Carlos Hernandez"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="carlos@example.co.uk"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number (UK)
                  </label>
                  <Input
                    type="tel"
                    placeholder="+44 7700 900123"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Password (letter, number & symbol)
                  </label>
                  <div className="relative">
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle register password visibility"
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength checklist */}
                {registerPassword.length > 0 && (
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 text-xs space-y-1.5">
                    <p className="font-semibold text-foreground/80 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Password Requirements:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className={`flex items-center gap-1 ${registerPassword.length >= 6 ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                        {registerPassword.length >= 6 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>Min 6 characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[a-zA-Z]/.test(registerPassword) ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                        {/[a-zA-Z]/.test(registerPassword) ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>1+ Letter (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(registerPassword) ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                        {/[0-9]/.test(registerPassword) ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>1+ Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${/[^a-zA-Z0-9\s]/.test(registerPassword) ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                        {/[^a-zA-Z0-9\s]/.test(registerPassword) ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>1+ Symbol (!@#$)</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-6 font-semibold shadow-md bg-secondary hover:bg-secondary/90 text-white text-base mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Quick Demo Section for Immediate Testing */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Demo Mode
              </span>
              <span className="text-[11px] text-muted-foreground">No verification required</span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('isra@soncaney.co.uk', 'Israel Romero')}
              className="w-full rounded-2xl border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary text-foreground text-sm font-medium py-5 flex items-center justify-center gap-2"
            >
              <span>⚡ Log in as VIP Customer (Israel Romero)</span>
            </Button>
          </div>
        </div>

        {/* Security footer */}
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Encrypted authentication connected to Supabase Cloud
        </p>
      </div>
    </div>
  );
}
