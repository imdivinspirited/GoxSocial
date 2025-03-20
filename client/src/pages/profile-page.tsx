import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, MapPin, Globe, Briefcase, Settings, 
  MessageSquare, Heart, Bookmark, Clock 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const { data: userPosts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${user?.id}/posts`],
    enabled: !!user,
  });

  return (
    <AppShell>
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-primary/20"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-800">
              <AvatarImage src={user?.profileImage} alt={user?.fullName} />
              <AvatarFallback className="text-2xl">{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4 md:mt-0 md:ml-4 mb-2 flex-1">
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-neutral-500 dark:text-neutral-400">@{user?.username}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>Follow</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>Message</span>
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Bio & Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                {user?.bio || 'No bio yet. Tell people about yourself and your travel interests!'}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>New York, USA</span>
                </div>
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <Globe className="mr-1 h-4 w-4" />
                  <span>15 countries visited</span>
                </div>
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span>{user?.isPremium ? 'Premium Member' : 'Regular Member'}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-2 rounded-lg">
                <p className="font-bold text-xl">258</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Followers</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-2 rounded-lg">
                <p className="font-bold text-xl">124</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Following</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-700/30 p-2 rounded-lg">
                <p className="font-bold text-xl">{userPosts?.length || 0}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
                  <p className="mb-3">{post.content}</p>
                  
                  {post.images && post.images.length > 0 && (
                    <div className={`rounded-lg overflow-hidden mb-3 ${
                      post.images.length === 2 ? 'grid grid-cols-2 gap-2' : ''
                    }`}>
                      {post.images.length === 1 ? (
                        <img 
                          src={post.images[0]} 
                          alt="Post" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        post.images.map((image, idx) => (
                          <img 
                            key={idx}
                            src={image} 
                            alt={`Post ${idx + 1}`} 
                            className="w-full h-40 object-cover" 
                          />
                        ))
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likeCount}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.commentCount}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">No posts yet. Share your travel experiences!</p>
              <Button className="mt-4">Create Your First Post</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trips">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">No trips planned yet. Start planning your next adventure!</p>
            <Button className="mt-4">Plan a Trip</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">No saved items yet. Save destinations and experiences to view them later!</p>
            <Button className="mt-4">Explore Destinations</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="photos">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">No photos uploaded yet. Share your travel memories!</p>
            <Button className="mt-4">Upload Photos</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
