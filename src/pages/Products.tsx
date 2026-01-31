import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    if (user) {
      fetchWishlist();
    }
  }, [selectedCategory, user]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('is_featured', { ascending: false });

    if (selectedCategory) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', selectedCategory)
        .single();
      
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);
    
    if (data) {
      setWishlistIds(data.map((w) => w.product_id));
    }
  };

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-card/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Our <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-muted-foreground">
              Discover exquisite jewelry crafted with passion and precision
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Filters */}
            <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between lg:hidden">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile filter toggle */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <p className="text-muted-foreground">
                  {products.length} products found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Desktop product count */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing {products.length} products
                  {selectedCategory && (
                    <span>
                      {' '}in{' '}
                      <span className="text-primary capitalize">
                        {selectedCategory.replace('-', ' ')}
                      </span>
                    </span>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-muted rounded-lg mb-4" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard
                        product={product}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onWishlistChange={fetchWishlist}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
