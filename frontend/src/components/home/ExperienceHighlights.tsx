import React from 'react';
import { Crown, ShieldCheck, Sparkles } from 'lucide-react';

const highlights = [
  {
    icon: Crown,
    title: 'Private Jewelry Concierge',
    description: 'Get one-to-one support for bridal sets, gifting, and milestone purchases.',
  },
  {
    icon: Sparkles,
    title: 'Custom Design Journey',
    description: 'Share your idea, approve sketches, and watch a signature piece come to life.',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Confidence',
    description: 'BIS hallmark assurance, transparent pricing, and long-term care support.',
  },
];

export const ExperienceHighlights: React.FC = () => {
  return (
    <section className="py-16 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-enter">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-primary/80">Why Customers Return</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            More Than a Store, <span className="text-gradient-gold">A Guided Experience</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="glass-card rounded-2xl p-6 hover-lift animate-enter"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <highlight.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{highlight.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
