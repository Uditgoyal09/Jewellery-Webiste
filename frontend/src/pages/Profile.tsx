import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Heart, Shield, Sparkles, User2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PROFILE_PREFS_KEY = 'ganesh-jewellers-profile-preferences';

type ProfilePreferences = {
  priceAlerts: boolean;
  designUpdates: boolean;
  appointmentReminders: boolean;
};

const defaultPreferences: ProfilePreferences = {
  priceAlerts: true,
  designUpdates: true,
  appointmentReminders: false,
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [preferences, setPreferences] = useState<ProfilePreferences>(defaultPreferences);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, navigate, user]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  useEffect(() => {
    const storedPreferences = localStorage.getItem(PROFILE_PREFS_KEY);

    if (!storedPreferences) {
      return;
    }

    try {
      setPreferences({
        ...defaultPreferences,
        ...(JSON.parse(storedPreferences) as Partial<ProfilePreferences>),
      });
    } catch {
      localStorage.removeItem(PROFILE_PREFS_KEY);
    }
  }, []);

  const updatePreferences = (key: keyof ProfilePreferences, value: boolean) => {
    const nextPreferences = { ...preferences, [key]: value };
    setPreferences(nextPreferences);
    localStorage.setItem(PROFILE_PREFS_KEY, JSON.stringify(nextPreferences));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const { error } = await updateProfile({
      fullName: form.fullName,
      phone: form.phone,
    });

    if (error) {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile saved',
        description: 'Your account details have been updated successfully.',
      });
    }

    setSaving(false);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="site-grid min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-border bg-card/30 py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-enter">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-primary/75">My Account</p>
            <h1 className="mb-4 text-4xl font-display font-bold text-foreground md:text-5xl">
              Profile <span className="text-gradient-gold">Settings</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Manage your personal details, wishlist access, and premium notifications from one place.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="glass-card rounded-2xl p-8 animate-enter">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                  <User2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Keep your account details up to date.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" value={user.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <Button type="submit" variant="luxury" size="lg" disabled={saving}>
                  {saving ? 'Saving changes...' : 'Save Profile'}
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8 animate-enter" style={{ animationDelay: '0.12s' }}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-foreground">Member Preferences</h2>
                    <p className="text-sm text-muted-foreground">Choose the updates you want from us.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Gold price alerts</p>
                      <p className="text-sm text-muted-foreground">Receive rate-change updates before you buy.</p>
                    </div>
                    <Switch checked={preferences.priceAlerts} onCheckedChange={(value) => updatePreferences('priceAlerts', value)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Custom design updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about sketches and order progress.</p>
                    </div>
                    <Switch checked={preferences.designUpdates} onCheckedChange={(value) => updatePreferences('designUpdates', value)} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Appointment reminders</p>
                      <p className="text-sm text-muted-foreground">Helpful nudges before your showroom or call booking.</p>
                    </div>
                    <Switch checked={preferences.appointmentReminders} onCheckedChange={(value) => updatePreferences('appointmentReminders', value)} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/wishlist" className="glass-card rounded-2xl p-6 hover-lift animate-enter" style={{ animationDelay: '0.2s' }}>
                  <Heart className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Wishlist</h3>
                  <p className="text-sm text-muted-foreground">Review your saved pieces and shortlisted favorites.</p>
                </Link>
                <div className="glass-card rounded-2xl p-6 hover-lift animate-enter" style={{ animationDelay: '0.28s' }}>
                  <Shield className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Trusted Account</h3>
                  <p className="text-sm text-muted-foreground">Your session is protected and linked to your secure account.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 animate-enter" style={{ animationDelay: '0.36s' }}>
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-display font-semibold text-foreground">Premium assistance</h3>
                    <p className="mb-4 text-muted-foreground">
                      Planning a bridal set or custom order? Use your profile phone number to speed up callback bookings.
                    </p>
                    <Link to="/contact">
                      <Button variant="gold-outline">Book a Consultation</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
