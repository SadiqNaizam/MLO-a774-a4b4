import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuItemCard from '@/components/MenuItemCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomizationModalContent from '@/components/CustomizationModalContent';
import { Button } from '@/components/ui/button'; // Used indirectly by MenuItemCard
import { toast } from "sonner"; // For "Added to cart" notification


// Placeholder Data
const restaurantMenu = {
  restaurantId: 'r1', // Matches one from listing
  name: 'Gourmet Burger Kitchen',
  categories: [
    { name: 'Burgers', items: [
      { id: 'm1', name: 'Classic Beef Burger', description: 'Juicy beef patty, lettuce, tomato, cheese, special sauce.', price: 12.99, imageUrl: 'https://via.placeholder.com/300x200.png?text=Beef+Burger', requiresCustomization: true },
      { id: 'm2', name: 'Spicy Chicken Burger', description: 'Crispy chicken, spicy mayo, jalapeños.', price: 11.50, imageUrl: 'https://via.placeholder.com/300x200.png?text=Chicken+Burger' },
    ]},
    { name: 'Sides', items: [
      { id: 's1', name: 'French Fries', description: 'Crispy golden fries.', price: 4.00, imageUrl: 'https://via.placeholder.com/300x200.png?text=Fries' },
      { id: 's2', name: 'Onion Rings', description: 'Battered and fried onion rings.', price: 5.50, imageUrl: 'https://via.placeholder.com/300x200.png?text=Onion+Rings' },
    ]},
    { name: 'Drinks', items: [
      { id: 'd1', name: 'Cola', price: 2.50 },
      { id: 'd2', name: 'Lemonade', price: 3.00 },
    ]},
  ]
};

const sampleCustomizationOptions = [
  { id: 'size', title: 'Choose Size', type: 'radio' as 'radio', required: true, choices: [ {id: 'regular', label: 'Regular'}, {id: 'large', label: 'Large', priceAdjustment: 2.00} ], defaultValue: 'regular' },
  { id: 'toppings', title: 'Add Toppings (Max 3)', type: 'checkbox' as 'checkbox', maxSelections: 3, choices: [ {id: 'cheese', label: 'Extra Cheese', priceAdjustment: 1.00}, {id: 'bacon', label: 'Bacon', priceAdjustment: 1.50}, {id: 'avocado', label: 'Avocado', priceAdjustment: 1.75} ] },
  { id: 'spice', title: 'Spice Level', type: 'radio' as 'radio', choices: [{id: 'mild', label: 'Mild'}, {id: 'medium', label: 'Medium'}, {id: 'hot', label: 'Hot'}] },
  { id: 'notes', title: 'Special Instructions', type: 'textarea' as 'textarea' },
];

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, any>;
}

const RestaurantMenuScreen = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<typeof restaurantMenu.categories[0]['items'][0] | null>(null);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  console.log('RestaurantMenuScreen loaded for restaurant ID:', restaurantId);
  // In a real app, fetch menu data based on restaurantId

  const currentRestaurant = restaurantMenu; // Using placeholder

  const handleAddToCart = (item: { id: string | number; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.id === item.id && !ci.customizations); // Simple check for non-customized
      if (existingItem) {
        return prevCart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
    console.log('Added to cart:', item);
  };

  const handleCustomize = (itemId: string | number) => {
    const itemToCustomize = currentRestaurant.categories
      .flatMap(cat => cat.items)
      .find(item => item.id === itemId);
    if (itemToCustomize) {
      setSelectedItemForCustomization(itemToCustomize);
      setIsCustomizationModalOpen(true);
      console.log('Customizing item:', itemToCustomize);
    }
  };

  const handleCustomizationSubmit = (customizations: Record<string, any>, finalPrice: number) => {
    if (selectedItemForCustomization) {
      const cartItem: CartItem = {
        id: `${selectedItemForCustomization.id}-${Date.now()}`, // Unique ID for customized item
        name: selectedItemForCustomization.name,
        price: finalPrice,
        quantity: 1, // Assuming quantity is handled within customization or added as 1
        customizations,
      };
      setCart(prevCart => [...prevCart, cartItem]);
      toast.success(`${selectedItemForCustomization.name} (customized) added to cart!`);
      console.log('Customized item added to cart:', cartItem);
    }
    setIsCustomizationModalOpen(false);
    setSelectedItemForCustomization(null);
  };
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        title={currentRestaurant.name}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        showCartIcon={true}
        cartItemCount={cartItemCount}
        onCartClick={() => navigate('/checkout')} // Navigate to cart/checkout
      />
      <main className="flex-grow">
        <Tabs defaultValue={currentRestaurant.categories[0]?.name || 'burgers'} className="w-full">
          <div className="sticky top-14 z-30 bg-background border-b"> {/* Header height is 56px (h-14) */}
            <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="container mx-auto px-4">
                {currentRestaurant.categories.map(category => (
                    <TabsTrigger key={category.name} value={category.name} className="text-sm sm:text-base">
                    {category.name}
                    </TabsTrigger>
                ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="container mx-auto px-4 py-6">
            {currentRestaurant.categories.map(category => (
              <TabsContent key={category.name} value={category.name}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map(item => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={handleAddToCart}
                      requiresCustomization={item.requiresCustomization}
                      onCustomize={item.requiresCustomization ? handleCustomize : undefined}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </main>

      {selectedItemForCustomization && (
        <Dialog open={isCustomizationModalOpen} onOpenChange={setIsCustomizationModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-0"> {/* Adjusted padding */}
            <CustomizationModalContent
              itemName={selectedItemForCustomization.name}
              basePrice={selectedItemForCustomization.price}
              options={sampleCustomizationOptions} // Use item-specific options if available
              onSubmit={handleCustomizationSubmit}
              submitButtonText={`Add to Cart - $${selectedItemForCustomization.price.toFixed(2)}`} // Example, price updates in component
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantMenuScreen;