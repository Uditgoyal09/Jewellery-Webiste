import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, Users, Gem, Shield, Heart, Star } from 'lucide-react';

const values = [
  {
    icon: Gem,
    title: 'Master Craftsmanship',
    description: 'Every piece is meticulously handcrafted by our skilled artisans with decades of experience.',
  },
  {
    icon: Shield,
    title: 'BIS Hallmark Certified',
    description: 'All our gold jewelry is certified for purity, ensuring you get authentic quality.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We offer lifetime maintenance and exchange policies.',
  },
  {
    icon: Star,
    title: 'Ethical Sourcing',
    description: 'We source our diamonds and gemstones responsibly, ensuring ethical practices.',
  },
];

const milestones = [
  { year: '2004', title: 'Founded', description: 'Started as a small family workshop in pundri' },
  { year: '2005', title: 'BIS Certification', description: 'Became one of the first BIS certified jewelers' },
  { year: '2016', title: 'First Showroom', description: 'Opened our store in Pundri' },
  { year: '2018', title: '30 Years Legacy', description: 'Celebrated three decades of excellence' },
  { year: '2026', title: 'Digital Presence', description: 'Launched online platform for customers worldwide' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80"
              alt="Jewelry craftsmanship"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Our <span className="text-gradient-gold">Story</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For over three decades, Ganesh Jewellers has been synonymous with trust, 
                craftsmanship, and timeless elegance. What started as a small family 
                workshop has grown into one of dist Kaithal's most trusted jewelry destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                  A Legacy of <span className="text-gradient-gold">Excellence</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded by Mr. Pardeep Kumar and Sunil Kumar in 2004, our journey began with a simple 
                    vision: to create jewelry that celebrates life's precious moments. With 
                    traditional techniques passed down through generations and a commitment 
                    to innovation, we've crafted thousands of pieces that now adorn families 
                    across India and beyond.
                  </p>
                  <p>
                    Today, under the leadership of the second generation, we continue to 
                    honor our heritage while embracing modern designs. Our master craftsmen 
                    combine age-old techniques with contemporary aesthetics, creating pieces 
                    that are both timeless and trendy.
                  </p>
                  <p>
                    Every piece that leaves our workshop carries with it our promise of 
                    quality, authenticity, and the blessing of Lord Ganesh – the remover 
                    of obstacles and the god of new beginnings.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"
                  alt="Jewelry workshop"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg shadow-xl border border-border">
                  <div className="flex items-center gap-4">
                    <Award className="h-12 w-12 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">21+</p>
                      <p className="text-muted-foreground">Years of Trust</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Our <span className="text-gradient-gold">Values</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every piece we create and every customer we serve
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="glass-card p-6 rounded-lg hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <value.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Our <span className="text-gradient-gold">Journey</span>
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div
                        className="glass-card p-6 rounded-lg inline-block animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-2xl font-display font-bold text-primary">
                          {milestone.year}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground mt-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:block w-4 h-4 bg-primary rounded-full relative z-10" />

                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <p className="text-4xl font-display font-bold text-primary">50K+</p>
                <p className="text-muted-foreground mt-2">Happy Customers</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <p className="text-4xl font-display font-bold text-primary">10K+</p>
                <p className="text-muted-foreground mt-2">Designs Created</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-4xl font-display font-bold text-primary">25+</p>
                <p className="text-muted-foreground mt-2">Master Craftsmen</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-4xl font-display font-bold text-primary">100%</p>
                <p className="text-muted-foreground mt-2">Certified Purity</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
