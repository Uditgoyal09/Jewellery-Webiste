import React from 'react';
import { Award, Gem, Heart, Shield, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

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
  { year: '2004', title: 'Founded', description: 'Started as a small family workshop in Pundri.' },
  { year: '2005', title: 'BIS Certification', description: 'Became one of the first BIS-certified jewellers in the area.' },
  { year: '2016', title: 'First Showroom', description: 'Opened our store in Pundri and expanded our bridal collection.' },
  { year: '2018', title: 'Growing Legacy', description: 'Reached a new milestone with trusted repeat customers across generations.' },
  { year: '2026', title: 'Digital Presence', description: 'Launched our online platform to serve customers with the same personal care.' },
];

const About: React.FC = () => {
  return (
    <div className="site-grid min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80"
              alt="Jewelry craftsmanship"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl animate-enter">
              <h1 className="mb-6 text-4xl font-display font-bold text-foreground md:text-5xl">
                Our <span className="text-gradient-gold">Story</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                For over two decades, Ganesh Jewellers has been synonymous with trust,
                craftsmanship, and timeless elegance. What started as a family workshop
                has grown into one of District Kaithal&apos;s trusted jewelry destinations.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="animate-enter">
                <h2 className="mb-6 text-3xl font-display font-bold text-foreground">
                  A Legacy of <span className="text-gradient-gold">Excellence</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded by Mr. Pardeep Kumar and Sunil Kumar in 2004, our journey began with
                    a simple vision: create jewelry that celebrates life&apos;s precious moments.
                    With traditional techniques passed down through generations and a commitment
                    to innovation, we&apos;ve crafted pieces that now become part of family stories.
                  </p>
                  <p>
                    Today, we continue to honor our heritage while embracing modern design. Our
                    master craftsmen combine age-old skill with contemporary aesthetics so every
                    piece feels timeless, elegant, and personal.
                  </p>
                  <p>
                    Every piece that leaves our workshop carries our promise of quality,
                    authenticity, and the blessing of Lord Ganesh, the remover of obstacles and
                    the god of new beginnings.
                  </p>
                </div>
              </div>

              <div className="relative animate-enter" style={{ animationDelay: '0.12s' }}>
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"
                  alt="Jewelry workshop"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 rounded-lg border border-border bg-card p-6 shadow-xl">
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

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center animate-enter">
              <h2 className="mb-4 text-3xl font-display font-bold text-foreground">
                Our <span className="text-gradient-gold">Values</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                The principles that guide every piece we create and every customer we serve.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="glass-card rounded-lg p-6 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <value.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center animate-enter">
              <h2 className="text-3xl font-display font-bold text-foreground">
                Our <span className="text-gradient-gold">Journey</span>
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 transform bg-border md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`flex flex-col items-center gap-8 md:flex-row ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div
                        className="glass-card inline-block rounded-lg p-6 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-2xl font-display font-bold text-primary">
                          {milestone.year}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-foreground">
                          {milestone.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 hidden h-4 w-4 rounded-full bg-primary md:block" />
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div className="animate-fade-in">
                <p className="text-4xl font-display font-bold text-primary">50K+</p>
                <p className="mt-2 text-muted-foreground">Happy Customers</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <p className="text-4xl font-display font-bold text-primary">10K+</p>
                <p className="mt-2 text-muted-foreground">Designs Created</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-4xl font-display font-bold text-primary">25+</p>
                <p className="mt-2 text-muted-foreground">Master Craftsmen</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-4xl font-display font-bold text-primary">100%</p>
                <p className="mt-2 text-muted-foreground">Certified Purity</p>
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
