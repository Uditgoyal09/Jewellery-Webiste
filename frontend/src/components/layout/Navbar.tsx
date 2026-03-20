import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, Settings, Sparkles, User, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const initials = useMemo(
    () =>
      user?.fullName
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'GJ',
    [user?.fullName],
  );

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="border-b border-border/30 bg-primary/8">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-2 px-4 text-center text-xs text-foreground/85 sm:px-6 sm:text-sm lg:px-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Certified jewelry, custom designs, and personal guidance for every occasion.</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-gold sm:flex">
              GJ
            </div>
            <div>
              <span className="block text-2xl font-display font-bold text-gradient-gold md:text-3xl">
                Ganesh Jewellers
              </span>
              <span className="hidden text-[11px] uppercase tracking-[0.35em] text-muted-foreground sm:block">
                Timeless Craftsmanship
              </span>
            </div>
          </Link>

          <div className="hidden items-center space-x-2 rounded-full border border-border/50 bg-card/50 px-3 py-2 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.8)] md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-primary ${
                  location.pathname === link.path
                    ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_rgba(212,163,55,0.2)]'
                    : 'text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center space-x-3 md:flex">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="rounded-full border border-border/50 text-muted-foreground hover:text-primary">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="gold-outline" size="sm" className="h-auto gap-3 rounded-full px-3 py-2">
                      <Avatar className="h-9 w-9 border border-primary/40">
                        <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left leading-tight">
                        <span className="block max-w-32 truncate text-sm text-foreground">{user.fullName}</span>
                        <span className="block text-[11px] uppercase tracking-[0.25em] text-primary/80">Member</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="space-y-1">
                      <p className="font-medium text-foreground">{user.fullName}</p>
                      <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        My Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="gold" size="sm" className="rounded-full px-5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="pb-5 md:hidden animate-enter">
            <div className="glass-card flex flex-col space-y-3 rounded-3xl p-4">
              {user && (
                <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-primary/40">
                      <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-border pt-4">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start rounded-2xl">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start rounded-2xl">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start rounded-2xl">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleSignOut} className="w-full rounded-2xl">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="gold" className="w-full rounded-2xl">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
