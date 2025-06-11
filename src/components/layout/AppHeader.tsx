import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, HelpCircle, User } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showCartIcon?: boolean;
  cartItemCount?: number;
  onCartClick?: () => void;
  showHelpIcon?: boolean;
  onHelpClick?: () => void;
  showProfileIcon?: boolean;
  onProfileClick?: () => void;
  actions?: React.ReactNode; // For custom action buttons
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  showCartIcon = false,
  cartItemCount = 0,
  onCartClick,
  showHelpIcon = false,
  onHelpClick,
  showProfileIcon = false,
  onProfileClick,
  actions,
}) => {
  console.log("Rendering AppHeader with title:", title);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-2 mr-auto">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBackClick || (() => window.history.back())} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {title && <h1 className="font-semibold text-lg truncate">{title}</h1>}
        </div>

        <nav className="flex items-center space-x-2">
          {actions}
          {showCartIcon && (
            <Button variant="ghost" size="icon" onClick={onCartClick} aria-label="View Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          )}
          {showHelpIcon && (
            <Button variant="ghost" size="icon" onClick={onHelpClick} aria-label="Help">
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}
           {showProfileIcon && (
            <Button variant="ghost" size="icon" onClick={onProfileClick} aria-label="Profile">
              <User className="h-5 w-5" />
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;