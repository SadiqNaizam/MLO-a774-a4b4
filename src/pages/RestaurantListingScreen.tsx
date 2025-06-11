import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import RestaurantCard from '@/components/RestaurantCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter } from 'lucide-react';

// Placeholder Data
const initialRestaurants = [
  { id: 'r1', name: 'Gourmet Burger Kitchen', imageUrl: 'https://via.placeholder.com/300x200.png?text=Burger+Place', cuisineTypes: ['Burgers', 'Fries'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: 'r2', name: 'The Sushi Spot', imageUrl: 'https://via.placeholder.com/300x200.png?text=Sushi+Restaurant', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: 'r3', name: 'Pizzeria Bella', imageUrl: 'https://via.placeholder.com/300x200.png?text=Pizza+Joint', cuisineTypes: ['Pizza', 'Italian'], rating: 4.3, deliveryTime: '20-30 min' },
  { id: 'r4', name: 'Healthy Eats', imageUrl: 'https://via.placeholder.com/300x200.png?text=Salad+Bar', cuisineTypes: ['Salads', 'Healthy'], rating: 4.7, deliveryTime: '15-25 min' },
  { id: 'r5', name: 'Taco Town', imageUrl: 'https://via.placeholder.com/300x200.png?text=Tacos', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.2, deliveryTime: '20-30 min' },
];

const cuisineOptions = ['Burgers', 'Sushi', 'Pizza', 'Italian', 'Mexican', 'Healthy', 'Japanese'];

const RestaurantListingScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof initialRestaurants>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    cuisine: [] as string[],
    priceRange: [0, 50],
    sortBy: 'rating',
  });
  const itemsPerPage = 6; // Example

  console.log('RestaurantListingScreen loaded');

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // Basic filtering logic (example)
      let filteredData = initialRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (filters.cuisine.length > 0) {
        filteredData = filteredData.filter(r => 
          filters.cuisine.some(fc => r.cuisineTypes.includes(fc))
        );
      }
      // Add sorting and price range filtering if needed
      
      setRestaurants(filteredData);
      setIsLoading(false);
    }, 1000);
  }, [searchQuery, filters]);

  const handleRestaurantClick = (restaurantId: string | number) => {
    console.log('Navigating to restaurant:', restaurantId);
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  const handleFilterChange = (type: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // Trigger re-fetch or re-filter of data
    // For this example, useEffect will handle it when `filters` state changes.
    // Close sheet if open
    // For a real app, you might want to manage sheet open/close state explicitly
  };

  // Pagination Logic
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const paginatedRestaurants = restaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader title="Restaurants" showBackButton={true} onBackClick={() => navigate(-1)} />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Input
            type="search"
            placeholder="Search restaurants..."
            className="flex-grow"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filter & Sort</SheetTitle>
                <SheetDescription>Refine your restaurant search.</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-180px)] pr-6"> {/* Adjust height as needed */}
                <div className="grid gap-6 py-4">
                  <div>
                    <Label className="text-base font-semibold">Cuisine</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {cuisineOptions.map(cuisine => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cuisine-${cuisine}`}
                            checked={filters.cuisine.includes(cuisine)}
                            onCheckedChange={(checked) => {
                              const newCuisines = checked
                                ? [...filters.cuisine, cuisine]
                                : filters.cuisine.filter(c => c !== cuisine);
                              handleFilterChange('cuisine', newCuisines);
                            }}
                          />
                          <Label htmlFor={`cuisine-${cuisine}`} className="font-normal">{cuisine}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sortBy" className="text-base font-semibold">Sort By</Label>
                    <RadioGroup
                      defaultValue="rating"
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                      className="mt-2 space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rating" id="sort-rating" />
                        <Label htmlFor="sort-rating" className="font-normal">Rating</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deliveryTime" id="sort-deliveryTime" />
                        <Label htmlFor="sort-deliveryTime" className="font-normal">Delivery Time</Label>
                      </div>
                      {/* Add more sort options if needed */}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="priceRange" className="text-base font-semibold">Price Range (Example)</Label>
                    <Slider
                      id="priceRange"
                      defaultValue={[0, 50]} // Assuming a 0-50 range for example
                      max={100}
                      step={5}
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      className="mt-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <SheetFooter className="mt-auto pt-4 border-t">
                <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[180px] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} aria-disabled={currentPage === 1} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                     <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }} isActive={currentPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                     </PaginationItem>
                  ))}
                  {/* Add Ellipsis logic if many pages */}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} aria-disabled={currentPage === totalPages}/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No restaurants found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantListingScreen;