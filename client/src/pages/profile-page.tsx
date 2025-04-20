import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, MapPin, Globe, Briefcase, Settings, 
  MessageSquare, Heart, Bookmark, Clock,
  Image as ImageIcon, Camera, Loader2,
  CropIcon, ThumbsUp
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Post, User } from "@shared/schema";
import { CreatePostButton } from "@/components/post/CreatePostButton";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ImageCropModal } from "@/components/image-editor/ImageCropModal";
import { useFollow } from "@/hooks/use-follow";
import { useParams, useLocation } from "wouter";

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  
  // Get the user ID from the URL params, or use the current user's ID
  const params = useParams<{ id: string }>();
  const userId = params.id ? parseInt(params.id) : currentUser?.id;
  
  // Use the follow hook if viewing another user's profile
  const { isFollowing, toggleFollow, isLoading: followLoading } = useFollow(userId || 0);
  const isOwnProfile = userId === currentUser?.id;
  
  // Image crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<"cover" | "profile">("cover");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  // Get profile data - could be current user or another user
  const { data: profileUser } = useQuery<User>({
    queryKey: [userId === currentUser?.id ? "/api/user" : `/api/users/${userId}`],
    enabled: !!userId,
    initialData: userId === currentUser?.id ? currentUser : undefined
  });
  
  const { data: userPosts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${userId}/posts`],
    enabled: !!userId,
  });
  
  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (userData: { profileImage?: string; coverImage?: string }) => {
      if (!profileUser) throw new Error("No user logged in");
      const res = await apiRequest("PUT", `/api/debug/users/${profileUser.id}`, userData);
      return res.json();
    },
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsUploading(false);
    },
    onError: (error: Error) => {
      setIsUploading(false);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle cover image change click
  const handleCoverImageClick = () => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.click();
    }
  };
  
  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  // Handle cover image file selection
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setOriginalFile(file);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF).",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 30MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert file to base64 for preview
      const base64 = await convertFileToBase64(file);
      
      // Open the crop modal with the selected image
      setSelectedImage(base64);
      setImageType("cover");
      setCropModalOpen(true);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to prepare image for editing. Please try again.",
        variant: "destructive",
      });
      console.error("Error preparing cover image:", error);
    }
  };
  
  // Handle crop completion
  const handleCropComplete = (croppedImageUrl: string) => {
    if (!croppedImageUrl) return;
    
    setIsUploading(true);
    
    // Update profile based on image type
    if (imageType === "cover") {
      updateProfileMutation.mutate({
        coverImage: croppedImageUrl
      });
    } else if (imageType === "profile") {
      updateProfileMutation.mutate({
        profileImage: croppedImageUrl
      });
    }
    
    setCropModalOpen(false);
    setSelectedImage(null);
  };
  
  // Navigate to post detail
  const navigateToPost = (postId: number) => {
    setLocation(`/post/${postId}`);
  };
  
  // Navigate to settings page
  const navigateToSettings = () => {
    setLocation('/settings');
  };
  
  // Like handling
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("POST", `/api/posts/${postId}/like`, {});
    },
    onSuccess: (_, postId) => {
      // Update post likes in cache
      queryClient.setQueryData<Post[]>(
        [`/api/users/${userId}/posts`],
        (oldPosts) => {
          if (!oldPosts) return [];
          return oldPosts.map(post => 
            post.id === postId 
              ? { ...post, likeCount: (post.likeCount || 0) + 1 } 
              : post
          );
        }
      );
      
      toast({
        title: "Post liked",
        description: "You liked this post.",
      });
    }
  });

  return (
    <AppShell>
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm mb-6">
        {/* Cover Photo */}
        <div className="relative h-48 bg-primary/20 group">
          {/* Cover image */}
          {profileUser?.coverImage && (
            <img 
              src={profileUser.coverImage} 
              alt="Cover" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Semi-transparent gradient overlay to make profile name visible */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Cover image edit button */}
          {isOwnProfile && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="flex space-x-2">
                {profileUser?.coverImage && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white text-neutral-800"
                    onClick={() => {
                      setSelectedImage(profileUser.coverImage);
                      setImageType("cover");
                      setCropModalOpen(true);
                    }}
                    disabled={isUploading}
                  >
                    <CropIcon className="mr-2 h-4 w-4" />
                    <span>Adjust Cover</span>
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white text-neutral-800"
                  onClick={handleCoverImageClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      <span>Change Cover</span>
                    </>
                  )}
                </Button>
              </div>
              <input 
                type="file"
                ref={coverImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-800 shadow-md">
                <AvatarImage 
                  src={profileUser?.profileImage || undefined} 
                  alt={profileUser?.fullName || 'User'} 
                  className="object-cover" 
                />
                <AvatarFallback className="text-2xl">{profileUser?.fullName?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-white/80 hover:bg-white text-neutral-800"
                    onClick={() => {
                      if (profileUser?.profileImage) {
                        setSelectedImage(profileUser.profileImage);
                        setImageType("profile");
                        setCropModalOpen(true);
                      }
                    }}
                  >
                    <CropIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-4 mb-2 flex-1">
              {/* Removed text shadow from light mode, kept it for dark mode */}
              <h1 className="text-2xl font-bold text-black dark:text-white bg-white/80 dark:bg-transparent px-2 py-1 inline-block rounded dark:bg-none dark:px-0 dark:py-0 dark:text-shadow" style={{ textShadow: "var(--tw-ring-shadow, 0 0 #0000)" }}>
                {profileUser?.fullName || 'User'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 bg-white/80 dark:bg-transparent px-2 py-1 inline-block rounded dark:px-0 dark:py-0">
                @{profileUser?.username || 'username'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              {!isOwnProfile && (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  size="sm" 
                  className="flex items-center"
                  onClick={toggleFollow}
                  disabled={followLoading}
                >
                  {isFollowing ? (
                    <>
                      <Users className="mr-1 h-4 w-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Users className="mr-1 h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </Button>
              )}
              
              {!isOwnProfile && (
                <Button variant="outline" size="sm" className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>Message</span>
                </Button>
              )}
              
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-2"
                  onClick={navigateToSettings}
                  aria-label="Settings"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Bio & Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                {profileUser?.bio || 'No bio yet. Tell people about yourself and your travel interests!'}
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
                  <span>{profileUser?.isPremium ? 'Premium Member' : 'Regular Member'}</span>
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
            <div className="instagram-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="instagram-post">
                  <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
              ))}
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="instagram-grid">
              {userPosts.map(post => (
                <div 
                  key={post.id} 
                  className="instagram-post cursor-pointer transform transition-transform hover:scale-[1.02]"
                  onClick={() => navigateToPost(post.id)}
                >
                  {post.images && post.images.length > 0 ? (
                    <>
                      <img 
                        src={post.images[0]} 
                        alt={post.content?.substring(0, 20) || 'Post'} 
                        className="w-full h-full object-cover"
                      />
                      <div className="instagram-post-overlay">
                        <div className="instagram-post-stats">
                          <div>
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likeCount || 0}</span>
                          </div>
                          <div>
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.commentCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center p-3 bg-neutral-100 dark:bg-neutral-800 text-center">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mb-2 line-clamp-4">
                        {post.content}
                      </p>
                      <div className="mt-auto flex items-center text-xs text-neutral-500">
                        <button 
                          className="flex items-center mr-3 hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            likePostMutation.mutate(post.id);
                          }}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{post.likeCount || 0}</span>
                        </button>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>{post.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">No posts yet. Share your travel experiences!</p>
              <CreatePostButton className="mt-4">Create Your First Post</CreatePostButton>
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
          <div className="instagram-grid">
            {postsLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="instagram-post">
                  <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
              ))
            ) : userPosts && userPosts.filter(post => post.images && post.images.length > 0).length > 0 ? (
              userPosts
                .filter(post => post.images && post.images.length > 0)
                .flatMap(post => post.images!.map((image, idx) => (
                  <div 
                    key={`${post.id}-${idx}`} 
                    className="instagram-post cursor-pointer transform transition-transform hover:scale-[1.02]"
                    onClick={() => navigateToPost(post.id)}
                  >
                    <img src={image} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="instagram-post-overlay">
                      <div className="instagram-post-stats">
                        <div>
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likeCount || 0}</span>
                        </div>
                        <div>
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )))
            ) : (
              <div className="col-span-full bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No photos uploaded yet. Share your travel memories!</p>
                <CreatePostButton className="mt-4">Upload Photos</CreatePostButton>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Image Crop Modal */}
      {cropModalOpen && selectedImage && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setSelectedImage(null);
          }}
          imageUrl={selectedImage}
          onCropComplete={handleCropComplete}
          isProfileImage={imageType === "profile"}
        />
      )}
    </AppShell>
  );
}
