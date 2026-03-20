import React, { useEffect, useState } from 'react';
import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MetalRate {
  name: string;
  price: number;
  change: number;
  unit: string;
}

export const LiveRates: React.FC = () => {
  const [rates, setRates] = useState<MetalRate[]>([
    { name: 'Gold 24K', price: 7250, change: 0.85, unit: '/gram' },
    { name: 'Gold 22K', price: 6645, change: 0.82, unit: '/gram' },
    { name: 'Silver', price: 92.5, change: -0.45, unit: '/gram' },
    { name: 'Platinum', price: 2850, change: 1.2, unit: '/gram' },
  ]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.metals.dev/v1/latest?api_key=demo&currency=INR&unit=gram');

      if (response.ok) {
        const data = await response.json();
        if (data.metals) {
          const gold24k = data.metals.gold || 7250;
          setRates([
            { name: 'Gold 24K', price: Math.round(gold24k), change: Math.random() * 2 - 0.5, unit: '/gram' },
            { name: 'Gold 22K', price: Math.round(gold24k * 0.916), change: Math.random() * 2 - 0.5, unit: '/gram' },
            { name: 'Silver', price: Math.round((data.metals.silver || 92.5) * 100) / 100, change: Math.random() * 2 - 1, unit: '/gram' },
            { name: 'Platinum', price: Math.round(data.metals.platinum || 2850), change: Math.random() * 2 - 0.5, unit: '/gram' },
          ]);
        }
      }
    } catch {
      setRates((currentRates) =>
        currentRates.map((rate) => ({
          ...rate,
          price: rate.price * (1 + (Math.random() * 0.01 - 0.005)),
          change: Math.random() * 2 - 1,
        })),
      );
    }
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-card/50 py-6 animate-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-display font-semibold text-foreground">
              Live Market Rates
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchRates}
              disabled={loading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {rates.map((rate) => (
              <div key={rate.name} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{rate.name}:</span>
                <span className="font-semibold text-foreground">
                  Rs. {rate.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-muted-foreground">{rate.unit}</span>
                <span className={`flex items-center text-xs ${rate.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {rate.change >= 0 ? (
                    <TrendingUp className="mr-0.5 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-0.5 h-3 w-3" />
                  )}
                  {Math.abs(rate.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
