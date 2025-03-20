import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  Check,
  History,
  Code,
  ArrowUpRight,
  UserX,
  MessageSquare,
  Sparkles,
  Share2,
  Mic,
  Download,
  ScrollText,
  Phone,
  Twitter
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
    
    // Mock check if user is premium (would be from API/database)
    setIsPremium(user?.isPremium || false);
  }, [user]);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  
  const upgradeToPremium = () => {
    // This would typically connect to a payment processor
    toast({
      title: "Upgrade initiated",
      description: "You'll be redirected to our payment processor.",
    });
    
    // Mock successful upgrade for demo
    setTimeout(() => {
      setIsPremium(true);
      toast({
        title: "Upgrade successful!",
        description: "You are now a premium member. Enjoy all the benefits!",
      });
    }, 2000);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold heading-primary mb-2">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <div className="flex overflow-x-auto">
            <TabsList className="inline-flex h-auto p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <TabsTrigger value="account" className="flex items-center gap-2 px-3 py-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 px-3 py-2">
                <Settings className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 px-3 py-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2 px-3 py-2">
                <Lock className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2 px-3 py-2">
                <CreditCard className="h-4 w-4" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2 px-3 py-2">
                <Shield className="h-4 w-4" />
                <span>Premium</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 px-3 py-2">
                <Lock className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="blocked" className="flex items-center gap-2 px-3 py-2">
                <Shield className="h-4 w-4" />
                <span>Blocked</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2 px-3 py-2">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Account Settings */}
          <TabsContent value="account" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImage || ""} alt={user?.fullName || ""} />
                <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              
              <div>
                <Button size="sm" variant="outline">Change Avatar</Button>
                <p className="text-xs text-neutral-500 mt-1">JPG, GIF or PNG. 1MB max size.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user?.fullName} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  className="w-full min-h-[100px] p-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  defaultValue={user?.bio || ""}
                />
              </div>
              
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    {isDarkMode ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />}
                    <span className="text-base font-medium">Dark Mode</span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Toggle between dark and light mode
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Text Size</h3>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline" size="sm" className="bg-primary/10">Medium</Button>
                  <Button variant="outline" size="sm">Large</Button>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Language</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-5 w-5 text-neutral-500" />
                  <select 
                    className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md p-2"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive emails about your account activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive notifications on your device</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">New Follower Notifications</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified when someone follows you</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Comment Notifications</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified when someone comments on your post</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive promotional offers and updates</p>
                </div>
                <Switch />
              </div>
              
              <Button onClick={handleSaveSettings} className="mt-4">Save Preferences</Button>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Make your profile visible to everyone</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Show Online Status</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Let others see when you're online</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Password</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <Button>Update Password</Button>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-6">
                <h3 className="text-lg font-medium flex items-center text-red-600">
                  <Shield className="mr-2 h-5 w-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  These actions are irreversible. Please be certain.
                </p>
                
                <div className="flex space-x-3">
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Deactivate Account
                  </Button>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm mb-4">No payment methods added yet.</p>
                <Button>Add Payment Method</Button>
              </div>
              
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium mb-3">Billing Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingName">Full Name</Label>
                    <Input id="billingName" defaultValue={user?.fullName} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingEmail">Email</Label>
                    <Input id="billingEmail" type="email" defaultValue={user?.email} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input id="billingAddress" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">City</Label>
                    <Input id="billingCity" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingZip">Zip Code</Label>
                    <Input id="billingZip" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingCountry">Country</Label>
                    <select 
                      id="billingCountry"
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md p-2"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Country</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                      <option value="in">India</option>
                      <option value="jp">Japan</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Billing Information</Button>
              </div>
              
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700 mt-6">
                <h3 className="text-lg font-medium mb-3">Subscription</h3>
                
                {isPremium ? (
                  <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Premium Plan</p>
                      <span className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 px-2 py-0.5 rounded text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Your subscription renews on April 15, 2025
                    </p>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                ) : (
                  <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <p className="font-medium mb-2">Free Plan</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Upgrade to Premium for additional features
                    </p>
                    <Button onClick={upgradeToPremium}>Upgrade to Premium</Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Premium Tab */}
          <TabsContent value="premium" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              Premium Membership
              {isPremium && (
                <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black">
                  Premium Member
                </Badge>
              )}
            </h2>
            
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Unlock exclusive features and enhance your travel experience
            </p>
            
            {isPremium ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
                  <h3 className="text-lg font-medium">You're a Premium Member!</h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Thanks for supporting TourviaHPT. You now have access to all premium features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black">
                    View Premium Dashboard
                  </Button>
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium">Upgrade to Premium</h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Get unlimited access to all premium features for just $9.99/month.
                </p>
                <Button onClick={upgradeToPremium} className="w-full md:w-auto">
                  Upgrade Now
                </Button>
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-4">Premium Benefits</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Exclusive Premium Themes</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Customize your experience with premium themes and visual options
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">AI-Powered Travel Recommendations</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Get personalized travel suggestions based on your preferences
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Live Chat Support</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Get 24/7 priority support from our travel experts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Developer Mode</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    List your properties and manage your hotel listings
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Advanced Analytics</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Get detailed insights on your posts and engagement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Ad-Free Experience</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Enjoy TourviaHPT without any advertisements
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Premium Badge</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Stand out with a distinctive premium badge on your profile
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Exclusive Discounts</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Special pricing on hotels, experiences, and travel packages
                  </p>
                </div>
              </div>
            </div>
            
            {!isPremium && (
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-neutral-100 dark:bg-neutral-700/30 p-4 rounded-lg">
                <div className="mb-4 sm:mb-0">
                  <h4 className="font-medium">Ready to enhance your experience?</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Join thousands of premium members today</p>
                </div>
                <Button onClick={upgradeToPremium}>Upgrade Now</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium mb-3">Account Protection</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Suspicious Activity Alerts</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Be alerted about unusual account activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium mb-3">Device Management</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Chrome • Windows • Last active now
                      </p>
                    </div>
                    <Badge>Current</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <p className="font-medium">iPhone 14</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Safari • iOS • Last active 2 hours ago
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Log Out
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div>
                      <p className="font-medium">MacBook Pro</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Safari • macOS • Last active yesterday
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Log Out
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Log Out of All Devices
                  </Button>
                </div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium mb-3">Password</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordSecurity">Current Password</Label>
                    <Input id="currentPasswordSecurity" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPasswordSecurity">New Password</Label>
                    <Input id="newPasswordSecurity" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPasswordSecurity">Confirm New Password</Label>
                    <Input id="confirmPasswordSecurity" type="password" />
                  </div>
                  
                  <Button>Update Password</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Blocked Users Tab */}
          <TabsContent value="blocked" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Manage the users you've blocked. Blocked users cannot see your profile, posts, or contact you.
            </p>
            
            <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-6">
              {/* Mock blocked users */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@johndoe</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Unblock</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@janesmith</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Unblock</Button>
                </div>
                
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Robert Johnson</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@robertj</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Unblock</Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Blocking Policy</h3>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <p>When you block someone:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>They won't be able to see your profile or posts</li>
                  <li>They won't be able to follow you or message you</li>
                  <li>They won't be able to find you in search results</li>
                  <li>Existing conversations will be hidden from both of you</li>
                  <li>You won't receive any notifications from them</li>
                </ul>
                <p className="mt-4">You can unblock a user at any time.</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Help Tab */}
          <TabsContent value="help" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center mb-3">
                  <MessageSquare className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium">Live Chat Support</h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Chat with our support team for immediate assistance.
                </p>
                <Button className="w-full">Start Live Chat</Button>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                  Available 24/7 for premium users
                </p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center mb-3">
                  <HelpCircle className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium">FAQ</h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Browse our frequently asked questions.
                </p>
                <Button variant="outline" className="w-full">View FAQs</Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Common Questions</h3>
                
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
                    <h4 className="font-medium mb-1">How do I reset my password?</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You can reset your password in the Security tab of your settings. If you're locked out, use the "Forgot Password" option on the login page.
                    </p>
                  </div>
                  
                  <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
                    <h4 className="font-medium mb-1">How do I change my username?</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You can change your username in the Account tab of your settings. Usernames can only be changed once every 14 days.
                    </p>
                  </div>
                  
                  <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
                    <h4 className="font-medium mb-1">How do I cancel my premium subscription?</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You can cancel your subscription in the Payment tab of your settings or contact customer support for assistance.
                    </p>
                  </div>
                  
                  <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
                    <h4 className="font-medium mb-1">How do I report a user or content?</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You can report users or content by clicking the three dots menu on any post or profile and selecting "Report".
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">How do I delete my account?</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Account deletion can be initiated in the Privacy tab of your settings. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Contact Us</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 dark:bg-neutral-700/30 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center">
                    <MessageSquare className="h-5 w-5 mx-auto mb-2 text-neutral-500" />
                    <p className="font-medium text-sm">support@tourviahpt.com</p>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-700/30 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center">
                    <Phone className="h-5 w-5 mx-auto mb-2 text-neutral-500" />
                    <p className="font-medium text-sm">+1 (555) 123-4567</p>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-700/30 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center">
                    <ArrowUpRight className="h-5 w-5 mx-auto mb-2 text-neutral-500" />
                    <p className="font-medium text-sm">@TourviaHPT</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <HelpCircle className="h-4 w-4" />
            <span>Need help with your account? <a href="#" className="text-primary underline">Contact Support</a></span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}