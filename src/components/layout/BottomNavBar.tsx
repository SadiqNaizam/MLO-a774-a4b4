import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Package, User } from 'lucide-react'; // Package for Orders
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center space-y-1 flex-1 p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
      isActive ? "text-primary" : "text-muted-foreground"
    )}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs">{label}</span>
  </Link>
);

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  console.log("Rendering BottomNavBar, current path:", location.pathname);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' }, // Assuming a /search route
    { to: '/orders', icon: Package, label: 'Orders' }, // Assuming an /orders route
    { to: '/profile', icon: User, label: 'Profile' }, // Assuming a /profile route
  ];

  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background">
      <nav className="container flex h-16 max-w-screen-2xl items-center justify-around px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to || (item.to === "/" && location.pathname.startsWith("/home"))} // Adjust active logic as needed
          />
        ))}
      </nav>
    </footer>
  );
};

export default BottomNavBar;