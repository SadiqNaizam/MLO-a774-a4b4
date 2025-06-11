import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderStatusBar from '@/components/OrderStatusBar';
import MapEmbedPlaceholder from '@/components/MapEmbedPlaceholder';
import { Textarea } from '@/components/ui/textarea'; // Corrected path

// Placeholder Data
const orderStatuses = [
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing Food' },
  { id: 'rider_assigned', label: 'Rider Assigned' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

const OrderTrackingScreen = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentStatusId, setCurrentStatusId] = useState(orderStatuses[0].id);
  const [eta, setEta] = useState('Calculating...');
  const [riderDetails, setRiderDetails] = useState('Awaiting assignment...');

  console.log('OrderTrackingScreen loaded for order ID:', orderId);

  // Simulate status updates and ETA
  useEffect(() => {
    const statusCycle = [
        { status: 'confirmed', eta: '30-40 minutes', rider: 'Order Confirmed. Restaurant is preparing your meal.', ts: new Date().toLocaleTimeString() },
        { status: 'preparing', eta: '25-35 minutes', rider: 'Your meal is being prepared with care!', ts: new Date(Date.now() + 2*60*1000).toLocaleTimeString() },
        { status: 'rider_assigned', eta: '15-20 minutes', rider: 'Rider Alex P. is on the way to the restaurant. (Bike: AB123CD)', ts: new Date(Date.now() + 5*60*1000).toLocaleTimeString() },
        { status: 'out_for_delivery', eta: '10-15 minutes', rider: 'Alex P. has picked up your order and is heading your way!', ts: new Date(Date.now() + 10*60*1000).toLocaleTimeString() },
        { status: 'delivered', eta: 'Delivered', rider: 'Your order has been delivered. Enjoy your meal!', ts: new Date(Date.now() + 15*60*1000).toLocaleTimeString() },
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusCycle.length) {
        setCurrentStatusId(statusCycle[currentIndex].status);
        setEta(statusCycle[currentIndex].eta);
        setRiderDetails(statusCycle[currentIndex].rider);
        // Update timestamp for the new current status
        const updatedStatuses = orderStatuses.map(s => 
            s.id === statusCycle[currentIndex].status ? { ...s, timestamp: statusCycle[currentIndex].ts } : s
        );
        // This is a bit hacky for demo; OrderStatusBar would ideally take full status objects with timestamps
      } else {
        clearInterval(interval);
      }
    }, 5000); // Change status every 5 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const orderSummary = {
    restaurantName: "Gourmet Burger Kitchen (Example)",
    totalAmount: "$25.99 (Example)",
    items: ["Classic Beef Burger x 1", "French Fries x 1"]
  };

  const dynamicStatuses = orderStatuses.map(status => {
    const cycleEntry = [
        { status: 'confirmed', ts: new Date().toLocaleTimeString() },
        { status: 'preparing', ts: new Date(Date.now() + 2*60*1000).toLocaleTimeString() },
        { status: 'rider_assigned', ts: new Date(Date.now() + 5*60*1000).toLocaleTimeString() },
        { status: 'out_for_delivery', ts: new Date(Date.now() + 10*60*1000).toLocaleTimeString() },
        { status: 'delivered', ts: new Date(Date.now() + 15*60*1000).toLocaleTimeString() },
    ].find(cs => cs.status === status.id);
    return { ...status, timestamp: cycleEntry?.ts };
  });

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader
        title={`Order #${orderId?.substring(0,8)}...`}
        showBackButton={true}
        onBackClick={() => navigate('/')} // Navigate to home or orders list
        showHelpIcon={true}
        onHelpClick={() => console.log('Help clicked')}
      />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Tracking for order from {orderSummary.restaurantName}</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderStatusBar statuses={dynamicStatuses} currentStatusId={currentStatusId} />
          </CardContent>
        </Card>

        <MapEmbedPlaceholder centerMessage="Live delivery tracking..." height="h-72" />

        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-lg">Estimated Delivery Time: <span className="text-primary">{eta}</span></p>
            </div>
            <div>
              <Label htmlFor="riderInfo">Rider Information & Updates:</Label>
              <Textarea id="riderInfo" value={riderDetails} readOnly rows={3} className="mt-1 bg-background"/>
            </div>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => console.log('Contact support')}>
              Contact Support
            </Button>
             <Button variant="secondary" className="w-full sm:w-auto ml-0 mt-2 sm:mt-0 sm:ml-2" onClick={() => console.log('View Receipt')}>
              View Receipt
            </Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent>
                <p><strong>Restaurant:</strong> {orderSummary.restaurantName}</p>
                <p><strong>Total:</strong> {orderSummary.totalAmount}</p>
                <ul className="list-disc list-inside mt-2">
                    {orderSummary.items.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default OrderTrackingScreen;