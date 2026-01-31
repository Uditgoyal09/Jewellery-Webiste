import React, { useState } from 'react';
import { Heart, Phone, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  weight_grams: number | null;
  purity: string | null;
  image_url: string | null;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (e: React.MouseEvent) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onWishlistToggle,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryType, setInquiryType] = useState<'buy' | 'custom'>('buy');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('product_inquiries').insert({
      user_id: user?.id || null,
      product_id: product.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      inquiry_type: inquiryType,
      message: formData.message || `Interested in purchasing ${product.name}`,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Inquiry Submitted!',
        description: 'Our team will contact you shortly.',
      });
      setShowInquiryForm(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      onClose();
    }

    setLoading(false);
  };

  const openInquiryForm = (type: 'buy' | 'custom') => {
    setInquiryType(type);
    setShowInquiryForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{product.name}</DialogTitle>
        </DialogHeader>

        {!showInquiryForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                {product.purity && (
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {product.purity}
                  </span>
                )}
                {product.weight_grams && (
                  <span className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">
                    {product.weight_grams}g
                  </span>
                )}
              </div>

              <p className="text-3xl font-bold text-primary mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              {product.description && (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              )}

              <div className="flex flex-col gap-3 mt-auto">
                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => openInquiryForm('buy')}
                >
                  <Phone className="h-5 w-5" />
                  Buy Now - Get Quote
                </Button>

                <Button
                  variant="luxury-outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => openInquiryForm('custom')}
                >
                  <MessageSquare className="h-5 w-5" />
                  Request Custom Design
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full gap-2"
                  onClick={onWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">
                {inquiryType === 'buy' ? 'Purchase Inquiry' : 'Custom Design Request'}
              </h3>
              <p className="text-muted-foreground text-sm">
                Fill in your details and we'll contact you shortly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+91 9729861823"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {inquiryType === 'custom' ? 'Describe Your Custom Design *' : 'Additional Notes'}
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  inquiryType === 'custom'
                    ? 'Describe the design you have in mind, preferred metals, stones, budget...'
                    : 'Any specific requirements or questions...'
                }
                rows={4}
                required={inquiryType === 'custom'}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowInquiryForm(false)}
              >
                Back
              </Button>
              <Button type="submit" variant="luxury" className="flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
