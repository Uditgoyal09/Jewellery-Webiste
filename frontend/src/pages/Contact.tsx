import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiCreateCallBooking, apiCreateContactQuery, ApiError } from '@/lib/api';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [callForm, setCallForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiCreateContactQuery({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: contactForm.subject,
        message: contactForm.message,
      });
      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We will respond shortly.',
      });
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Failed to submit your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiCreateCallBooking({
        name: callForm.name,
        email: callForm.email,
        phone: callForm.phone,
        preferredDate: callForm.preferredDate,
        preferredTime: callForm.preferredTime,
        message: callForm.message,
      });
      toast({
        title: 'Call Booked!',
        description: 'Our team will call you at your preferred time.',
      });
      setCallForm({ name: '', email: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Failed to book your call. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-grid min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-card/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-enter">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our jewelry? Want to book a consultation or share your 
              custom design ideas? We're here to help you find your perfect piece.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8 animate-enter">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Phone</p>
                      <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary">
                        +91 9729861823
                      </a>
                      <p className="text-muted-foreground">+91 9053260980</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <a href="mailto:pardeepgoyal1823@gmail.com" className="text-muted-foreground hover:text-primary">
                        pardeepgoyal1823@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Address</p>
                      <p className="text-muted-foreground">
                        Opp of Kali Devi Mandir , Near Rikshaw Stand <br />
                        Pundri dist Kaithal 136026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Working Hours</p>
                      <p className="text-muted-foreground">
                        Monday - Saturday: 10 AM - 8 PM<br />
                        Sunday: 11 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d898.0277366308198!2d76.56102521703787!3d29.762063682417953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e1945fc933415%3A0x62925ed130000000!2sGanesh%20Jewellers!5e0!3m2!1sen!2sin!4v1769887387575!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 animate-enter" style={{ animationDelay: '0.12s' }}>
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="contact" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </TabsTrigger>
                  <TabsTrigger value="call" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Book a Call
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <div className="glass-card p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Send us a Message
                    </h3>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Full Name *</Label>
                          <Input
                            id="contact-name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email *</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-subject">Subject *</Label>
                          <Input
                            id="contact-subject"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            required
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message *</Label>
                        <Textarea
                          id="contact-message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                          placeholder="Tell us about your inquiry, custom design ideas, or any questions..."
                          rows={5}
                        />
                      </div>

                      <Button type="submit" variant="luxury" size="lg" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="call">
                  <div className="glass-card p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Schedule a Call
                    </h3>
                    <form onSubmit={handleCallSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="call-name">Full Name *</Label>
                          <Input
                            id="call-name"
                            value={callForm.name}
                            onChange={(e) => setCallForm({ ...callForm, name: e.target.value })}
                            required
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="call-email">Email *</Label>
                          <Input
                            id="call-email"
                            type="email"
                            value={callForm.email}
                            onChange={(e) => setCallForm({ ...callForm, email: e.target.value })}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="call-phone">Phone Number *</Label>
                        <Input
                          id="call-phone"
                          type="tel"
                          value={callForm.phone}
                          onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                          required
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="call-date">Preferred Date</Label>
                          <Input
                            id="call-date"
                            type="date"
                            value={callForm.preferredDate}
                            onChange={(e) => setCallForm({ ...callForm, preferredDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="call-time">Preferred Time</Label>
                          <Input
                            id="call-time"
                            type="time"
                            value={callForm.preferredTime}
                            onChange={(e) => setCallForm({ ...callForm, preferredTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="call-message">What would you like to discuss?</Label>
                        <Textarea
                          id="call-message"
                          value={callForm.message}
                          onChange={(e) => setCallForm({ ...callForm, message: e.target.value })}
                          placeholder="Tell us briefly what you'd like to discuss - purchase, custom design, pricing, etc."
                          rows={4}
                        />
                      </div>

                      <Button type="submit" variant="luxury" size="lg" disabled={loading}>
                        {loading ? 'Booking...' : 'Book Call'}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
