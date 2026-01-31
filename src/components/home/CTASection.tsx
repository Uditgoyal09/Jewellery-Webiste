import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Have a <span className="text-gradient-gold">Custom Design</span> in Mind?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our master craftsmen can bring your dream jewelry to life. Whether it's a 
              special bridal piece, a unique engagement ring, or a personalized gift, 
              we're here to create something extraordinary just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="luxury" size="lg" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Share Your Ideas
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="luxury-outline" size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-lg hover-lift">
              <Phone className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Speak directly with our jewelry experts
              </p>
              <a href="tel:+919876543210" className="text-primary font-medium hover:underline">
                +91 9729861823
              </a>
            </div>

            <div className="glass-card p-6 rounded-lg hover-lift">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Visit Store</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Experience our collection in person
              </p>
              <span className="text-primary font-medium">8 AM - 8 PM Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
