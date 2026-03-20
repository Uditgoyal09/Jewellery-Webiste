import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiCreateAdminCategory,
  apiCreateAdminProduct,
  apiDeleteAdminCategory,
  apiDeleteAdminProduct,
  apiFetchAdminDashboard,
  apiUpdateAdminCallBookingStatus,
  apiUpdateAdminCategory,
  apiUpdateAdminContactStatus,
  apiUpdateAdminProduct,
  apiUpdateAdminProductInquiryStatus,
  type AdminCallBooking,
  type AdminContactQuery,
  type AdminProductInquiry,
  type AdminSummary,
  type AdminUser,
  type Category,
  type Product,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const emptySummary: AdminSummary = {
  totalProducts: 0,
  totalCategories: 0,
  totalUsers: 0,
  pendingContactQueries: 0,
  pendingCallBookings: 0,
  pendingProductInquiries: 0,
};

const defaultCategoryForm = {
  id: '',
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
};

const defaultProductForm = {
  id: '',
  name: '',
  description: '',
  price: '',
  weightGrams: '',
  purity: '',
  categoryId: 'none',
  imageUrl: '',
  isFeatured: false,
  isAvailable: true,
};

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<AdminSummary>(emptySummary);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contactQueries, setContactQueries] = useState<AdminContactQuery[]>([]);
  const [callBookings, setCallBookings] = useState<AdminCallBooking[]>([]);
  const [productInquiries, setProductInquiries] = useState<AdminProductInquiry[]>([]);
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetchAdminDashboard();
      setSummary(response.summary);
      setUsers(response.users);
      setCategories(response.categories);
      setProducts(response.products);
      setContactQueries(response.contactQueries);
      setCallBookings(response.callBookings);
      setProductInquiries(response.productInquiries);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while loading admin data.';
      toast({
        title: 'Unable to load admin dashboard',
        description: message,
        variant: 'destructive',
      });

      if (message.includes('Please sign in')) {
        navigate('/auth');
      }

      if (message.includes('Admin access required')) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && user && !isAdmin) {
      navigate('/');
      return;
    }

    if (!loading && user && isAdmin) {
      loadDashboard();
    }
  }, [loading, user, isAdmin, navigate]);

  const handleCategorySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingCategory(true);

    try {
      if (categoryForm.id) {
        await apiUpdateAdminCategory(categoryForm.id, categoryForm);
        toast({ title: 'Category updated', description: 'Your category changes have been saved.' });
      } else {
        await apiCreateAdminCategory(categoryForm);
        toast({ title: 'Category created', description: 'A new category is now available in the catalog.' });
      }

      setCategoryForm(defaultCategoryForm);
      await loadDashboard();
    } catch (error) {
      toast({
        title: 'Category action failed',
        description: error instanceof Error ? error.message : 'Unable to save category right now.',
        variant: 'destructive',
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingProduct(true);

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        weightGrams: productForm.weightGrams ? Number(productForm.weightGrams) : null,
        purity: productForm.purity,
        categoryId: productForm.categoryId === 'none' ? null : productForm.categoryId,
        imageUrl: productForm.imageUrl,
        isFeatured: productForm.isFeatured,
        isAvailable: productForm.isAvailable,
      };

      if (productForm.id) {
        await apiUpdateAdminProduct(productForm.id, payload);
        toast({ title: 'Product updated', description: 'Catalog changes are live for this product.' });
      } else {
        await apiCreateAdminProduct(payload);
        toast({ title: 'Product created', description: 'The new product has been added to the catalog.' });
      }

      setProductForm(defaultProductForm);
      await loadDashboard();
    } catch (error) {
      toast({
        title: 'Product action failed',
        description: error instanceof Error ? error.message : 'Unable to save product right now.',
        variant: 'destructive',
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleStatusUpdate = async (action: () => Promise<unknown>, successTitle: string) => {
    try {
      await action();
      toast({ title: successTitle, description: 'The latest admin change has been saved.' });
      await loadDashboard();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Unable to save this update.',
        variant: 'destructive',
      });
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="site-grid flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading admin portal...
      </div>
    );
  }

  return (
    <div className="site-grid min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="border-b border-border bg-card/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-enter">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-primary/75">Admin Portal</p>
            <h1 className="mb-4 text-4xl font-display font-bold text-foreground md:text-5xl">
              Store <span className="text-gradient-gold">Dashboard</span>
            </h1>
            <p className="max-w-3xl text-muted-foreground">
              Control products, categories, customer requests, and account activity from one secure workspace.
            </p>
            <p className="mt-4 text-sm text-primary/85">
              Default admin login: admin@ganeshjewellers.local / Admin@123
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ['Products', summary.totalProducts],
                ['Categories', summary.totalCategories],
                ['Users', summary.totalUsers],
                ['Open Contact Queries', summary.pendingContactQueries],
                ['Open Call Bookings', summary.pendingCallBookings],
                ['Open Product Inquiries', summary.pendingProductInquiries],
              ].map(([label, value], index) => (
                <div key={label} className="glass-card rounded-2xl p-6 animate-enter" style={{ animationDelay: `${index * 0.06}s` }}>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-3 text-4xl font-display font-bold text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="catalog" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="catalog">Catalog</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <form onSubmit={handleCategorySubmit} className="glass-card rounded-2xl p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-display font-semibold text-foreground">
                        {categoryForm.id ? 'Edit Category' : 'Create Category'}
                      </h2>
                      <p className="text-sm text-muted-foreground">Organize your catalog structure here.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Name</Label>
                      <Input id="category-name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-slug">Slug</Label>
                      <Input id="category-slug" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea id="category-description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-image">Image URL</Label>
                      <Input id="category-image" value={categoryForm.imageUrl} onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })} />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" variant="luxury" disabled={savingCategory}>
                        {savingCategory ? 'Saving...' : categoryForm.id ? 'Update Category' : 'Create Category'}
                      </Button>
                      {categoryForm.id && (
                        <Button type="button" variant="outline" onClick={() => setCategoryForm(defaultCategoryForm)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>

                  <form onSubmit={handleProductSubmit} className="glass-card rounded-2xl p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-display font-semibold text-foreground">
                        {productForm.id ? 'Edit Product' : 'Create Product'}
                      </h2>
                      <p className="text-sm text-muted-foreground">Manage pricing, stock visibility, and featured items.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="product-name">Name</Label>
                        <Input id="product-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-price">Price</Label>
                        <Input id="product-price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-weight">Weight (grams)</Label>
                        <Input id="product-weight" type="number" value={productForm.weightGrams} onChange={(e) => setProductForm({ ...productForm, weightGrams: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-purity">Purity</Label>
                        <Input id="product-purity" value={productForm.purity} onChange={(e) => setProductForm({ ...productForm, purity: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="product-image">Image URL</Label>
                        <Input id="product-image" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="product-description">Description</Label>
                        <Textarea id="product-description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant={productForm.isFeatured ? 'gold' : 'outline'} onClick={() => setProductForm({ ...productForm, isFeatured: !productForm.isFeatured })}>
                        {productForm.isFeatured ? 'Featured' : 'Mark Featured'}
                      </Button>
                      <Button type="button" variant={productForm.isAvailable ? 'gold-outline' : 'outline'} onClick={() => setProductForm({ ...productForm, isAvailable: !productForm.isAvailable })}>
                        {productForm.isAvailable ? 'Available' : 'Unavailable'}
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" variant="luxury" disabled={savingProduct}>
                        {savingProduct ? 'Saving...' : productForm.id ? 'Update Product' : 'Create Product'}
                      </Button>
                      {productForm.id && (
                        <Button type="button" variant="outline" onClick={() => setProductForm(defaultProductForm)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-xl font-semibold text-foreground">Categories</h3>
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="rounded-xl border border-border/60 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-foreground">{category.name}</p>
                              <p className="text-sm text-muted-foreground">{category.slug}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setCategoryForm({
                                id: category.id,
                                name: category.name,
                                slug: category.slug,
                                description: category.description || '',
                                imageUrl: category.image_url || '',
                              })}>
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(() => apiDeleteAdminCategory(category.id), 'Category deleted')}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-xl font-semibold text-foreground">Products</h3>
                    <div className="space-y-4 max-h-[700px] overflow-auto pr-1">
                      {products.map((product) => (
                        <div key={product.id} className="rounded-xl border border-border/60 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Rs. {product.price.toLocaleString('en-IN')} {product.category ? `• ${product.category.name}` : ''}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setProductForm({
                                id: product.id,
                                name: product.name,
                                description: product.description || '',
                                price: String(product.price),
                                weightGrams: product.weight_grams ? String(product.weight_grams) : '',
                                purity: product.purity || '',
                                categoryId: product.category_id || 'none',
                                imageUrl: product.image_url || '',
                                isFeatured: Boolean(product.is_featured),
                                isAvailable: product.is_available ?? true,
                              })}>
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(() => apiDeleteAdminProduct(product.id), 'Product deleted')}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-8">
                <div className="grid gap-8 xl:grid-cols-3">
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-xl font-semibold text-foreground">Contact Queries</h3>
                    <div className="space-y-4">
                      {contactQueries.map((query) => (
                        <div key={query.id} className="rounded-xl border border-border/60 p-4 space-y-3">
                          <div>
                            <p className="font-medium text-foreground">{query.name}</p>
                            <p className="text-sm text-muted-foreground">{query.email}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{query.subject || 'General inquiry'}</p>
                          <p className="text-sm text-foreground/90">{query.message}</p>
                          <Select value={query.status} onValueChange={(value: 'new' | 'in_progress' | 'resolved') => handleStatusUpdate(() => apiUpdateAdminContactStatus(query.id, value), 'Contact query updated')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-xl font-semibold text-foreground">Call Bookings</h3>
                    <div className="space-y-4">
                      {callBookings.map((booking) => (
                        <div key={booking.id} className="rounded-xl border border-border/60 p-4 space-y-3">
                          <div>
                            <p className="font-medium text-foreground">{booking.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.phone}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.preferred_date || 'No date'} {booking.preferred_time ? `• ${booking.preferred_time}` : ''}
                          </p>
                          <p className="text-sm text-foreground/90">{booking.message || 'No additional notes provided.'}</p>
                          <Select value={booking.status} onValueChange={(value: 'pending' | 'confirmed' | 'completed') => handleStatusUpdate(() => apiUpdateAdminCallBookingStatus(booking.id, value), 'Call booking updated')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-xl font-semibold text-foreground">Product Inquiries</h3>
                    <div className="space-y-4">
                      {productInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="rounded-xl border border-border/60 p-4 space-y-3">
                          <div>
                            <p className="font-medium text-foreground">{inquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{inquiry.product?.name || 'Unknown product'} • {inquiry.inquiry_type}</p>
                          </div>
                          <p className="text-sm text-foreground/90">{inquiry.message}</p>
                          <Select value={inquiry.status} onValueChange={(value: 'pending' | 'contacted' | 'closed') => handleStatusUpdate(() => apiUpdateAdminProductInquiryStatus(inquiry.id, value), 'Product inquiry updated')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customers">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">Recent Accounts</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {users.map((account) => (
                      <div key={account.id} className="rounded-xl border border-border/60 p-4">
                        <p className="font-medium text-foreground">{account.fullName}</p>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <p className="mt-2 text-sm text-primary/80 uppercase tracking-[0.2em]">{account.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="overview">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">Admin Notes</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Use the Catalog tab to create or edit categories and products.</p>
                    <p>Use the Requests tab to track customer conversations and update their status.</p>
                    <p>The Customers tab shows recent accounts and role visibility for quick review.</p>
                    <p>{isLoading ? 'Refreshing admin data...' : 'Dashboard data is up to date.'}</p>
                    <Button variant="luxury-outline" onClick={loadDashboard}>Refresh Dashboard</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
