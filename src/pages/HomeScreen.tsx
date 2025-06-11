import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FoodCategoryChip from '@/components/FoodCategoryChip';
import RestaurantCard from '@/components/RestaurantCard';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { MapPin, Search } from 'lucide-react';

// Placeholder Data
const foodCategories = [
  { id: '1', name: 'Pizza', imageUrl: 'https://via.placeholder.com/80x80.png?text=Pizza' },
  { id: '2', name: 'Burgers', imageUrl: 'https://via.placeholder.com/80x80.png?text=Burgers' },
  { id: '3', name: 'Sushi', imageUrl: 'https://via.placeholder.com/80x80.png?text=Sushi' },
  { id: '4', name: 'Pasta', imageUrl: 'https://via.placeholder.com/80x80.png?text=Pasta' },
  { id: '5', name: 'Desserts', imageUrl: 'https://via.placeholder.com/80x80.png?text=Desserts' },
  { id: '6', name: 'Salads', imageUrl: 'https://via.placeholder.com/80x80.png?text=Salads' },
];

const featuredRestaurants = [
  { id: 'r1', name: 'Gourmet Burger Kitchen', imageUrl: 'https://via.placeholder.com/300x200.png?text=Burger+Place', cuisineTypes: ['Burgers', 'Fries'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: 'r2', name: 'The Sushi Spot', imageUrl: 'https://via.placeholder.com/300x200.png?text=Sushi+Restaurant', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: 'r3', name: 'Pizzeria Bella', imageUrl: 'https://via.placeholder.com/300x200.png?text=Pizza+Joint', cuisineTypes: ['Pizza', 'Italian'], rating: 4.3, deliveryTime: '20-30 min' },
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState('123 Main St, Anytown');

  console.log('HomeScreen loaded');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log('Category selected:', categoryId);
    // Navigate or filter based on category
  };

  const handleRestaurantClick = (restaurantId: string | number) => {
    console.log('Restaurant clicked:', restaurantId);
    // Navigate to restaurant menu page, e.g., /restaurant/${restaurantId}/menu
    // For now, using a placeholder navigation action
    // navigate(`/restaurant/${restaurantId}/menu`); // Assuming navigate function is available
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6 pb-20"> {/* Added pb-20 for BottomNavBar */}
        {/* Location Section */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{currentLocation}</span>
          </div>
          <Button variant="link" className="text-sm" onClick={() => console.log('Change location clicked')}>
            Change
          </Button>
        </section>

        {/* Search Bar */}
        <section className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search restaurants or dishes..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        {/* Food Categories */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Categories</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-3">
              {foodCategories.map(category => (
                <FoodCategoryChip
                  key={category.id}
                  categoryName={category.name}
                  imageUrl={category.imageUrl}
                  isActive={activeCategory === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Featured Restaurants/Promotions */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Featured Restaurants</h2>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {featuredRestaurants.map((restaurant, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <RestaurantCard
                      id={restaurant.id}
                      name={restaurant.name}
                      imageUrl={restaurant.imageUrl}
                      cuisineTypes={restaurant.cuisineTypes}
                      rating={restaurant.rating}
                      deliveryTime={restaurant.deliveryTime}
                      onClick={handleRestaurantClick}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default HomeScreen;