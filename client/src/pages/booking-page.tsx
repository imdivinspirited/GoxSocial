import { AppShell } from "@/components/layout/app-shell";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Booking, Destination, Experience } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Star, CreditCard, CalendarCheck } from "lucide-react";

// Schema for booking form
const bookingSchema = z.object({
  destinationId: z.number().optional(),
  experienceId: z.number().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  persons: z.number({
    required_error: "Number of persons is required",
  }).min(1, "At least 1 person required").max(10, "Maximum 10 persons allowed"),
  status: z.string().default("pending"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBookingType, setSelectedBookingType] = useState<"destination" | "experience">("destination");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Fetch user bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: [`/api/users/${user?.id}/bookings`],
    enabled: !!user,
  });

  // Fetch destinations and experiences
  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === "confirmed" || booking.status === "pending");
  const pastBookings = bookings.filter(booking => booking.status === "completed" || booking.status === "cancelled");

  // Form for new booking
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date(),
      persons: 1,
      status: "pending",
    },
  });

  // Mutation for creating a new booking
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      const res = await apiRequest("POST", "/api/bookings", {
        ...data,
        userId: user!.id,
        totalPrice: calculateTotalPrice(data),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking created",
        description: "Your booking has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/bookings`] });
      form.reset();
      setSelectedItemId(null);
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate total price based on selection and number of persons
  const calculateTotalPrice = (data: BookingFormValues): number => {
    let basePrice = 0;
    
    if (data.destinationId && selectedBookingType === "destination") {
      const destination = destinations.find(d => d.id === data.destinationId);
      basePrice = destination?.price || 0;
    } else if (data.experienceId && selectedBookingType === "experience") {
      const experience = experiences.find(e => e.id === data.experienceId);
      basePrice = experience?.price || 0;
    }
    
    return basePrice * data.persons;
  };

  // Handle form submission
  const onSubmit = (data: BookingFormValues) => {
    if (selectedBookingType === "destination" && selectedItemId) {
      data.destinationId = selectedItemId;
      data.experienceId = undefined;
    } else if (selectedBookingType === "experience" && selectedItemId) {
      data.experienceId = selectedItemId;
      data.destinationId = undefined;
    } else {
      toast({
        title: "Selection required",
        description: "Please select a destination or experience",
        variant: "destructive",
      });
      return;
    }
    
    createBookingMutation.mutate(data);
  };

  // Get details of a booked item (destination or experience)
  const getBookingDetails = (booking: Booking) => {
    if (booking.destinationId) {
      const destination = destinations.find(d => d.id === booking.destinationId);
      return {
        name: destination?.name || "Unknown destination",
        location: destination?.location || "Unknown location",
        image: destination?.image || "",
        price: destination?.price || 0,
      };
    } else if (booking.experienceId) {
      const experience = experiences.find(e => e.id === booking.experienceId);
      return {
        name: experience?.name || "Unknown experience",
        location: experience?.location || "Unknown location",
        image: experience?.image || "",
        price: experience?.price || 0,
      };
    }
    
    return {
      name: "Unknown booking",
      location: "Unknown location",
      image: "",
      price: 0,
    };
  };

  // Loading state for initial data fetch
  const isLoading = bookingsLoading || destinationsLoading || experiencesLoading;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your travel bookings and plan new adventures
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings list section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
              <TabsTrigger value="past">Past Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="bg-neutral-100 dark:bg-neutral-800 animate-pulse h-40"></Card>
                  ))}
                </div>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => {
                  const details = getBookingDetails(booking);
                  
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-40 md:h-auto">
                          <img 
                            src={details.image} 
                            alt={details.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold">{details.name}</h3>
                              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{details.location}</span>
                              </div>
                            </div>
                            <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-neutral-500 dark:text-neutral-400 flex items-center">
                                <CalendarCheck className="h-3 w-3 mr-1" />
                                Date
                              </p>
                              <p className="font-medium">{format(new Date(booking.date), "PPP")}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 dark:text-neutral-400 flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Total Price
                              </p>
                              <p className="font-medium">${(booking.totalPrice / 100).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" variant="outline">View Details</Button>
                            {booking.status === "pending" && (
                              <Button size="sm" variant="default">Confirm</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No upcoming bookings</CardTitle>
                    <CardDescription>
                      You don't have any upcoming bookings. Start by creating a new booking.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="bg-neutral-100 dark:bg-neutral-800 animate-pulse h-40"></Card>
                  ))}
                </div>
              ) : pastBookings.length > 0 ? (
                pastBookings.map(booking => {
                  const details = getBookingDetails(booking);
                  
                  return (
                    <Card key={booking.id} className="overflow-hidden opacity-80">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-40 md:h-auto">
                          <img 
                            src={details.image} 
                            alt={details.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold">{details.name}</h3>
                              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{details.location}</span>
                              </div>
                            </div>
                            <Badge variant={booking.status === "completed" ? "default" : "destructive"}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-neutral-500 dark:text-neutral-400 flex items-center">
                                <CalendarCheck className="h-3 w-3 mr-1" />
                                Date
                              </p>
                              <p className="font-medium">{format(new Date(booking.date), "PPP")}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 dark:text-neutral-400 flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Total Price
                              </p>
                              <p className="font-medium">${(booking.totalPrice / 100).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {booking.status === "completed" && (
                            <div className="mt-4">
                              <Button size="sm" variant="outline">Write a Review</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No past bookings</CardTitle>
                    <CardDescription>
                      You don't have any past bookings yet.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* New booking section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Booking</CardTitle>
              <CardDescription>
                Book your next destination or experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Tabs 
                  defaultValue="destination" 
                  onValueChange={(value) => setSelectedBookingType(value as "destination" | "experience")}
                >
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="destination">Destination</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="destination">
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                      {destinations.map(destination => (
                        <Card 
                          key={destination.id}
                          className={`cursor-pointer transition-all ${selectedItemId === destination.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedItemId(destination.id)}
                        >
                          <div className="flex items-center p-2">
                            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
                              <img 
                                src={destination.image} 
                                alt={destination.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{destination.name}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{destination.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs ml-1">{(destination.rating / 10).toFixed(1)}</span>
                                </div>
                              </div>
                              <p className="text-primary font-medium text-sm mt-1">
                                ${(destination.price / 100).toFixed(0)}/person
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience">
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                      {experiences.map(experience => (
                        <Card 
                          key={experience.id}
                          className={`cursor-pointer transition-all ${selectedItemId === experience.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedItemId(experience.id)}
                        >
                          <div className="flex items-center p-2">
                            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
                              <img 
                                src={experience.image} 
                                alt={experience.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{experience.name}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{experience.location}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{experience.duration}</span>
                                </div>
                              </div>
                              <p className="text-primary font-medium text-sm mt-1">
                                ${(experience.price / 100).toFixed(0)}/person
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="persons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Persons</FormLabel>
                        <Select 
                          onValueChange={value => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of persons" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(10)].map((_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1} {i === 0 ? 'person' : 'persons'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-500 dark:text-neutral-400">Price per person</span>
                      <span>
                        ${selectedBookingType === "destination" 
                          ? (destinations.find(d => d.id === selectedItemId)?.price || 0) / 100
                          : (experiences.find(e => e.id === selectedItemId)?.price || 0) / 100
                        }
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-500 dark:text-neutral-400">Number of persons</span>
                      <span>× {form.watch("persons")}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          ${(calculateTotalPrice(form.getValues()) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createBookingMutation.isPending || !selectedItemId}
                  >
                    {createBookingMutation.isPending ? "Processing..." : "Book Now"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
