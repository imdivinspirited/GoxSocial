import { AppShell } from "@/components/layout/app-shell";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Clock, UserPlus, Heart, MessageSquare, Tag, ThumbsUp, Users, ShoppingBag, Settings, Calendar, MapPin, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Notification mock data for demonstration
const notifications = [
  {
    id: 1,
    type: "follow",
    user: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
    },
    isRead: false,
    timestamp: new Date(Date.now() - 25 * 60000) // 25 minutes ago
  },
  {
    id: 2,
    type: "like",
    user: {
      name: "Michael Rodriguez",
      username: "mikerod",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
    },
    post: {
      text: "Just experienced the most amazing sunset at Santorini!"
    },
    isRead: false,
    timestamp: new Date(Date.now() - 1.5 * 3600000) // 1.5 hours ago
  },
  {
    id: 3,
    type: "comment",
    user: {
      name: "Emily Chen",
      username: "emilyc",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
    },
    post: {
      text: "Hiking in the Swiss Alps was absolutely breathtaking!"
    },
    comment: {
      text: "Looks amazing! Which trail did you take?"
    },
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 3600000) // 3 hours ago
  },
  {
    id: 4,
    type: "booking",
    booking: {
      destination: "Maldives Paradise",
      date: new Date(Date.now() + 30 * 24 * 3600000) // 30 days from now
    },
    isRead: true,
    timestamp: new Date(Date.now() - 5 * 3600000) // 5 hours ago
  },
  {
    id: 5,
    type: "system",
    text: "Welcome to GoX Social! Complete your profile to connect with travelers and find amazing destinations.",
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 3600000) // 1 day ago
  },
  {
    id: 6,
    type: "mention",
    user: {
      name: "David Peterson",
      username: "davidp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80"
    },
    post: {
      text: "Planning a trip to Japan next month. Any recommendations?"
    },
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 24 * 3600000) // 2 days ago
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();
  
  // Function to refresh notifications
  const refreshNotifications = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // Show loading toast
    toast({
      title: "Refreshing notifications",
      description: "Getting your latest updates...",
    });
    
    // Simulate API fetch delay
    setTimeout(() => {
      setIsRefreshing(false);
      
      // Success toast
      toast({
        title: "Notifications refreshed",
        description: "Your notifications are now up to date",
        variant: "default",
      });
    }, 1500);
  }, [toast]);
  
  // Filter notifications based on active tab and read status
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    if (activeTab === "mentions") {
      filtered = filtered.filter(n => n.type === "mention");
    } else if (activeTab === "comments") {
      filtered = filtered.filter(n => n.type === "comment");
    } else if (activeTab === "follows") {
      filtered = filtered.filter(n => n.type === "follow");
    } else if (activeTab === "bookings") {
      filtered = filtered.filter(n => n.type === "booking");
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }
    
    // Sort by newest first
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return filtered;
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Render notification icon based on type
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "mention":
        return <Tag className="h-5 w-5 text-purple-500" />;
      case "booking":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Mark all as read function
  const markAllAsRead = () => {
    // In a real app, this would update the server
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications have been marked as read`,
      variant: "default",
    });
  };

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Notifications</h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Stay updated with activity from your network
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={refreshNotifications}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
            <Button variant="outline" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with notification settings on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notification Center</h3>
                  {unreadCount > 0 && (
                    <Badge variant="default">{unreadCount} unread</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="unread-toggle" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Show unread only</span>
                  </Label>
                  <Switch 
                    id="unread-toggle" 
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Quick Filters</h3>
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === "all" ? "default" : "ghost"} 
                      onClick={() => setActiveTab("all")}
                      className="w-full justify-start"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      All Notifications
                    </Button>
                    <Button 
                      variant={activeTab === "mentions" ? "default" : "ghost"}
                      onClick={() => setActiveTab("mentions")}
                      className="w-full justify-start"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Mentions
                    </Button>
                    <Button 
                      variant={activeTab === "comments" ? "default" : "ghost"}
                      onClick={() => setActiveTab("comments")}
                      className="w-full justify-start"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comments
                    </Button>
                    <Button 
                      variant={activeTab === "follows" ? "default" : "ghost"}
                      onClick={() => setActiveTab("follows")}
                      className="w-full justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Follows
                    </Button>
                    <Button 
                      variant={activeTab === "bookings" ? "default" : "ghost"}
                      onClick={() => setActiveTab("bookings")}
                      className="w-full justify-start"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Bookings
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark All as Read
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main notification list */}
        <div className="lg:col-span-3">
          {/* Mobile tabs */}
          <div className="block lg:hidden mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="follows">Follows</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Label htmlFor="mobile-unread-toggle" className="mr-2">Show unread only</Label>
                <Switch 
                  id="mobile-unread-toggle" 
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshNotifications}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? "..." : "Refresh"}
                </Button>
                
                {unreadCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Notification list */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No notifications</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    {showUnreadOnly 
                      ? "You have no unread notifications" 
                      : "You don't have any notifications yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex">
                      <div className="mr-4">
                        {notification.type === "system" ? (
                          <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            {renderNotificationIcon(notification.type)}
                          </div>
                        ) : notification.user ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            {renderNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm">
                              {notification.type === "follow" && (
                                <span>
                                  <span className="font-semibold">{notification.user?.name}</span> started following you
                                </span>
                              )}
                              
                              {notification.type === "like" && (
                                <span>
                                  <span className="font-semibold">{notification.user?.name}</span> liked your post: "{notification.post?.text.substring(0, 30)}..."
                                </span>
                              )}
                              
                              {notification.type === "comment" && (
                                <span>
                                  <span className="font-semibold">{notification.user?.name}</span> commented on your post: "{notification.comment?.text.substring(0, 30)}..."
                                </span>
                              )}
                              
                              {notification.type === "mention" && (
                                <span>
                                  <span className="font-semibold">{notification.user?.name}</span> mentioned you in a post: "{notification.post?.text.substring(0, 30)}..."
                                </span>
                              )}
                              
                              {notification.type === "booking" && (
                                <span>
                                  Your booking for <span className="font-semibold">{notification.booking?.destination}</span> is confirmed
                                </span>
                              )}
                              
                              {notification.type === "system" && (
                                <span>{notification.text}</span>
                              )}
                            </p>
                            
                            <div className="flex items-center mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                            </div>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                          )}
                        </div>
                        
                        {notification.type === "booking" && (
                          <div className="mt-2 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-md text-xs">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-primary" />
                              <span className="font-medium">
                                {notification.booking?.date.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1 text-primary" />
                              <span>{notification.booking?.destination}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-2 space-x-2">
                          {(notification.type === "follow" || notification.type === "mention") && (
                            <Button variant="outline" size="sm">View Profile</Button>
                          )}
                          
                          {(notification.type === "like" || notification.type === "comment" || notification.type === "mention") && (
                            <Button variant="outline" size="sm">View Post</Button>
                          )}
                          
                          {notification.type === "booking" && (
                            <Button variant="outline" size="sm">View Booking</Button>
                          )}
                          
                          {notification.type === "follow" && (
                            <Button variant="default" size="sm">Follow Back</Button>
                          )}
                          
                          {notification.type === "comment" && (
                            <Button variant="default" size="sm">Reply</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {filteredNotifications.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
