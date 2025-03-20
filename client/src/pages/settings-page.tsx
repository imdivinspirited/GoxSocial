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
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

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
            </TabsList>
          </div>

          {/* Account Settings */}
          <TabsContent value="account" className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
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
                
                {user?.isPremium ? (
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
                    <Button>Upgrade to Premium</Button>
                  </div>
                )}
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