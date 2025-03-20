import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard,
  Lock,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Example cart items for demonstration
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "3-Day Kyoto Cultural Tour",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Experience the cultural heart of Japan with traditional tea ceremonies, temple visits, and guided tours of historic districts.",
    price: 299.99,
    quantity: 1,
    date: "Apr 15, 2025",
    duration: "3 days",
    location: "Kyoto, Japan"
  },
  {
    id: 2,
    name: "Barcelona Gaudí Architecture Tour",
    image: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Discover Antoni Gaudí's masterpieces including Sagrada Familia, Park Güell, and Casa Batlló with an expert guide.",
    price: 79.99,
    quantity: 1,
    date: "Jun 10, 2025",
    duration: "1 day",
    location: "Barcelona, Spain"
  }
];

type CartItem = typeof INITIAL_CART_ITEMS[0];

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(
      cartItems.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  const handleCheckout = () => {
    setProcessingCheckout(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setProcessingCheckout(false);
      setIsCheckoutDialogOpen(false);
      
      // Clear cart and show success message
      setCartItems([]);
      
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase. Your booking is confirmed.",
      });
    }, 2000);
  };
  
  return (
    <AppShell>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Your Cart
          <Badge variant="outline" className="ml-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Badge>
        </h1>
        
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                Looks like you haven't added any tours or experiences to your cart yet.
              </p>
              <Button asChild>
                <a href="/explore">Browse Experiences</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-40 sm:h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 sm:w-2/3">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                      </div>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%)</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => setIsCheckoutDialogOpen(true)}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <Lock className="h-3 w-3" />
                    <span>Secure checkout</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  What's included
                </h4>
                <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
                  <li>• Free cancellation up to 24 hours before the experience</li>
                  <li>• Expert guides and premium experiences</li>
                  <li>• Skip-the-line access at major attractions</li>
                  <li>• 24/7 customer support during your trip</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Checkout Dialog */}
        <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Enter your payment details to complete your booking.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
                <div className="font-medium mb-2">Order Summary</div>
                <div className="text-sm space-y-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Card Number</label>
                  <div className="border rounded-md p-2 flex items-center">
                    <input type="text" placeholder="**** **** **** ****" className="bg-transparent flex-1 focus:outline-none" disabled />
                    <CreditCard className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="border rounded-md p-2 w-full bg-transparent focus:outline-none" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">CVC</label>
                  <input type="text" placeholder="123" className="border rounded-md p-2 w-full bg-transparent focus:outline-none" disabled />
                </div>
              </div>
              
              <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Payment details are for demonstration only.</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCheckoutDialogOpen(false)}
                disabled={processingCheckout}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCheckout}
                disabled={processingCheckout}
              >
                {processingCheckout ? (
                  <>
                    <Minus className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : "Complete Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}