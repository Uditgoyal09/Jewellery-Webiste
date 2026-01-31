import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { LiveRates } from '@/components/home/LiveRates';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { CTASection } from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <LiveRates />
        <FeaturedProducts />
        <CategoriesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
