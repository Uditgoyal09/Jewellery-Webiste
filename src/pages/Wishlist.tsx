import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  weight_grams: number | null;
  purity: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  category_id: string | null;
}

const Wishlist: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchWishlist();
    }
  }, [user, authLoading, navigate]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data: wishlistItems } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);

    if (wishlistItems && wishlistItems.length > 0) {
      const productIds = wishlistItems.map((w) => w.product_id);
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsData) {
        setProducts(productsData);
      }
    } else {
      setProducts([]);
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-card/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/products">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Heart className="h-8 w-8 text-primary fill-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              My <span className="text-gradient-gold">Wishlist</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Your favorite pieces saved for later
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start adding your favorite pieces to your wishlist
              </p>
              <Link to="/products">
                <Button variant="luxury" size="lg">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {products.length} item{products.length !== 1 ? 's' : ''} in your wishlist
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard
                      product={product}
                      isWishlisted={true}
                      onWishlistChange={fetchWishlist}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
