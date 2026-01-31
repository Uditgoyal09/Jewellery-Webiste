import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
          alt="Luxury jewelry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Timeless Elegance
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up">
            <span className="text-foreground">Where Dreams</span>
            <br />
            <span className="text-gradient-gold">Shine Bright</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover exquisite handcrafted jewelry that tells your unique story. 
            From traditional gold ornaments to contemporary diamond designs, 
            find your perfect piece at Ganesh Jewellers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/products">
              <Button variant="luxury" size="xl" className="group">
                Explore Collection
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="luxury-outline" size="xl">
                Book Appointment
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary">21+</p>
              <p className="text-sm text-muted-foreground">Years Legacy</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary">BIS</p>
              <p className="text-sm text-muted-foreground">Certified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
