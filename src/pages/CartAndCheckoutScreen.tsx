import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MapEmbedPlaceholder from '@/components/MapEmbedPlaceholder'; // Corrected import path
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customizations?: Record<string, any>; // For display
}

// Placeholder Data
const initialCartItems: CartItem[] = [
  { id: 'm1-custom-123', name: 'Classic Beef Burger (Custom)', price: 15.49, quantity: 1, imageUrl: 'https://via.placeholder.com/80x80.png?text=Burger', customizations: { size: 'Large', toppings: 'Extra Cheese' } },
  { id: 's1', name: 'French Fries', price: 4.00, quantity: 2, imageUrl: 'https://via.placeholder.com/80x80.png?text=Fries' },
  { id: 'd1', name: 'Cola', price: 2.50, quantity: 1, imageUrl: 'https://via.placeholder.com/80x80.png?text=Cola' },
];

type CheckoutStep = 'summary' | 'address' | 'payment' | 'review';

const CartAndCheckoutScreen = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('summary');
  const [promoCode, setPromoCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({ street: '', city: '', zip: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  console.log('CartAndCheckoutScreen loaded, current step:', currentStep);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCartItems(items => items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast.info("Item removed from cart.");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fee
  const taxes = subtotal * 0.1; // Example tax
  const total = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    console.log('Placing order with details:', { cartItems, deliveryAddress, paymentMethod, total });
    toast.success("Order Placed Successfully!");
    // Clear cart, navigate to order tracking
    setCartItems([]);
    // Simulating order ID for navigation
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    navigate(`/order/${orderId}/track`);
  };
  
  const renderCartSummaryStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-3"> {/* Max height for scrollability */}
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <img src={item.imageUrl || 'https://via.placeholder.com/60x60.png?text=Item'} alt={item.name} className="w-16 h-16 rounded-md object-cover"/>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    {item.customizations && <p className="text-xs text-muted-foreground">Custom: {Object.values(item.customizations).join(', ')}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4"/></Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
        {cartItems.length > 0 && (
          <>
            <div className="flex items-center space-x-2 pt-4">
              <Input 
                placeholder="Promo Code" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" onClick={() => toast.info("Promo code applied (placeholder).")}>Apply</Button>
            </div>
            <div className="space-y-1 pt-2 text-sm">
              <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes (10%):</span><span>${taxes.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {cartItems.length > 0 ? (
          <Button className="w-full" size="lg" onClick={() => setCurrentStep('address')}>Proceed to Address</Button>
        ) : (
          <Button className="w-full" size="lg" onClick={() => navigate('/')}>Continue Shopping</Button>
        )}
      </CardFooter>
    </Card>
  );

  const renderAddressStep = () => (
    <Card>
      <CardHeader><CardTitle>Delivery Address</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); setCurrentStep('payment');}}>
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input id="street" placeholder="123 Pizza Lane" value={deliveryAddress.street} onChange={e => setDeliveryAddress({...deliveryAddress, street: e.target.value})} required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Foodville" value={deliveryAddress.city} onChange={e => setDeliveryAddress({...deliveryAddress, city: e.target.value})} required/>
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" placeholder="90210" value={deliveryAddress.zip} onChange={e => setDeliveryAddress({...deliveryAddress, zip: e.target.value})} required/>
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
             <Select defaultValue="US" onValueChange={value => setDeliveryAddress({...deliveryAddress, country: value})}>
                <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <MapEmbedPlaceholder centerMessage="Confirm address on map" height="h-48"/>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep('summary')}>Back to Cart</Button>
            <Button type="submit">Proceed to Payment</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
  
  const renderPaymentStep = () => (
    <Card>
      <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
            <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-accent has-[input:checked]:border-primary">
                <RadioGroupItem value="creditCard" id="creditCard" />
                <span>Credit/Debit Card</span>
            </Label>
            <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-accent has-[input:checked]:border-primary">
                <RadioGroupItem value="paypal" id="paypal" />
                <span>PayPal</span>
            </Label>
            <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-accent has-[input:checked]:border-primary">
                <RadioGroupItem value="cod" id="cod" />
                <span>Cash on Delivery</span>
            </Label>
        </RadioGroup>
        {paymentMethod === 'creditCard' && (
            <div className="space-y-3 pt-3 border-t mt-3">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVC" />
                </div>
            </div>
        )}
        <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep('address')}>Back to Address</Button>
            <Button onClick={() => setCurrentStep('review')}>Proceed to Review</Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <Card>
        <CardHeader><CardTitle>Review Your Order</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <Accordion type="single" collapsible defaultValue="items">
                <AccordionItem value="items">
                    <AccordionTrigger>Order Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="address">
                    <AccordionTrigger>Delivery Address</AccordionTrigger>
                    <AccordionContent>
                        <p>{deliveryAddress.street}</p>
                        <p>{deliveryAddress.city}, {deliveryAddress.zip}, {deliveryAddress.country}</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment">
                    <AccordionTrigger>Payment Method</AccordionTrigger>
                    <AccordionContent>
                        <p className="capitalize">{paymentMethod.replace('creditCard', 'Credit Card')}</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="space-y-1 pt-4 border-t text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxes:</span><span>${taxes.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-xl"><span>Grand Total:</span><span>${total.toFixed(2)}</span></div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button variant="outline" onClick={() => setCurrentStep('payment')} className="w-full sm:w-auto">Back to Payment</Button>
            <Button onClick={handlePlaceOrder} size="lg" className="w-full sm:w-auto">Place Order & Pay</Button>
        </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader title="Cart & Checkout" showBackButton={true} onBackClick={() => currentStep === 'summary' ? navigate(-1) : setCurrentStep('summary')} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {currentStep === 'summary' && renderCartSummaryStep()}
          {currentStep === 'address' && renderAddressStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'review' && renderReviewStep()}
        </div>
      </main>
    </div>
  );
};

export default CartAndCheckoutScreen;