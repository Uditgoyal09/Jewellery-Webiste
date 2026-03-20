import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiAddToWishlist, apiRemoveFromWishlist, ApiError, type Product } from '@/lib/api';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onWishlistChange?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted = false,
  onWishlistChange,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsInWishlist(isWishlisted);
  }, [isWishlisted]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist) {
        await apiRemoveFromWishlist(product.id);
        setIsInWishlist(false);
        toast({
          title: 'Removed from wishlist',
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await apiAddToWishlist(product.id);
        setIsInWishlist(true);
        toast({
          title: 'Added to wishlist',
          description: `${product.name} has been added to your wishlist`,
        });
      }

      onWishlistChange?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Failed to update wishlist.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover-lift">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={toggleWishlist}
              disabled={loading}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={() => setShowModal(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {product.is_featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            {product.purity && <span>{product.purity}</span>}
            {product.weight_grams && (
              <>
                <span>•</span>
                <span>{product.weight_grams}g</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <Button
              variant="gold"
              size="sm"
              className="gap-1"
              onClick={() => setShowModal(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              Buy
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isWishlisted={isInWishlist}
        onWishlistToggle={toggleWishlist}
      />
    </>
  );
};
