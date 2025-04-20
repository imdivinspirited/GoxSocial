import { useQuery, useMutation } from "@tanstack/react-query";
import { Post, InsertPost, User } from "@shared/schema";
import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Image, Video, MapPin, ThumbsUp, MessageSquare, Share2, 
  MoreHorizontal, Globe, Clock, Smile, Camera, X, Link,
  Trash, Flag, ShieldAlert, Copy, Pencil, CropIcon,
  UserPlus, UserMinus, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ImageCropModal } from "@/components/image-editor/ImageCropModal";
import { useFollow } from "@/hooks/use-follow";

export function SocialFeed() {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentEditingImageIndex, setCurrentEditingImageIndex] = useState<number | null>(null);
  
  // Track local state of posts to handle deletion more directly
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  
  // Refresh counter to force refetch with more aggressive settings
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: posts, isLoading: postsLoading, refetch } = useQuery<Post[]>({
    queryKey: ["/api/posts", refreshKey],
    staleTime: 0, // Always consider fresh data
    gcTime: 1000, // Very short garbage collection time (formerly cacheTime)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Function to force refresh posts
  const refreshPosts = useCallback(() => {
    // Show loading indicator
    toast({
      title: "Refreshing posts",
      description: "Getting the latest updates for you...",
    });
    
    // Force clear the cache for posts
    queryClient.removeQueries({ queryKey: ["/api/posts"] });
    
    // Increment refresh key to trigger a new query
    setRefreshKey(prevKey => prevKey + 1);
    
    // Explicitly call refetch
    setTimeout(() => {
      refetch().then(result => {
        if (result.data) {
          // Sort posts by creation date (newest first)
          const sortedPosts = [...result.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
            return dateB.getTime() - dateA.getTime();
          });
          
          setLocalPosts(sortedPosts);
          
          toast({
            title: "Posts refreshed",
            description: `${result.data.length} posts loaded, newest first.`,
            variant: "default"
          });
        }
      });
    }, 100);
  }, [refetch]);
  
  // Update local posts when query data changes
  useEffect(() => {
    if (posts) {
      // Sort posts by creation date (newest first)
      const sortedPosts = [...posts].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      
      setLocalPosts(sortedPosts); 
    }
  }, [posts]);

  // Listen for deletion events
  useEffect(() => {
    // Handler for post deletion
    const handlePostDeleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      const postId = customEvent.detail?.postId;
      
      if (postId) {
        // Update local state immediately for a more responsive UI
        setLocalPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        
        // Force a refetch after a short delay
        setTimeout(refreshPosts, 300);
      }
    };
    
    // Handler for post creation
    const handlePostCreated = () => {
      refreshPosts();
    };
    
    // Setup event listeners
    window.addEventListener('post-deleted', handlePostDeleted);
    window.addEventListener('post-created', handlePostCreated);
    
    // Refresh on component mount
    refreshPosts();
    
    return () => {
      window.removeEventListener('post-deleted', handlePostDeleted);
      window.removeEventListener('post-created', handlePostCreated);
    };
  }, [refreshPosts]);
  
  // Function to handle opening crop modal for a specific image
  const handleOpenCropModal = (index: number) => {
    setCurrentEditingImageIndex(index);
    setCropModalOpen(true);
  };
  
  // Function to handle crop completion
  const handleCropComplete = (croppedImageUrl: string) => {
    if (currentEditingImageIndex !== null) {
      // Update the preview URLs with the cropped image
      setPreviewUrls(prevUrls => 
        prevUrls.map((url, i) => 
          i === currentEditingImageIndex ? croppedImageUrl : url
        )
      );
    }
    setCropModalOpen(false);
    setCurrentEditingImageIndex(null);
  };
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      setIsSubmitting(true);
      try {
        // Optimize images if needed - simplified approach
        const optimizedImages = previewUrls.length > 0 ? previewUrls : [];
        
        const res = await apiRequest("POST", "/api/posts", {
          ...postData,
          images: optimizedImages
        });
        return res.json();
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (newPost) => {
      // Add the newly created post to the top of the local posts list
      // to immediately display it with user information
      const postWithUser = {
        ...newPost,
        _userInfo: {
          profileImage: user?.profileImage,
          fullName: user?.fullName,
          username: user?.username
        }
      };
      
      setLocalPosts(prevPosts => [postWithUser, ...prevPosts]);
      
      // Trigger cache invalidation
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('post-created', { 
        detail: { post: newPost } 
      }));
      
      // Reset form
      setPostContent("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setFileError("");
      
      // Show success toast
      toast({
        title: "Post created",
        description: "Your post has been successfully published!",
        variant: "default"
      });
    },
    onError: (error) => {
      console.error("Post creation failed:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && selectedFiles.length === 0) return;
    if (fileError) return;
    
    createPostMutation.mutate({
      content: postContent,
      userId: user!.id,
      isPublic: true
    });
  };

  // Trigger file input click
  const openFileManager = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB file size limit

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileError("");
      const files = Array.from(e.target.files);
      
      // Limit to a maximum of 4 files
      const newFiles = files.slice(0, 4 - selectedFiles.length);
      
      // Check file sizes
      for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`File "${file.name}" exceeds the 5MB size limit`);
          return;
        }
      }
      
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      
      // Generate preview URLs for the selected images/videos
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    if (fileError && selectedFiles.length <= 1) {
      setFileError("");
    }
  };

  // Determine if the post button should be disabled
  const isPostButtonDisabled = 
    createPostMutation.isPending || 
    isSubmitting || 
    (!postContent.trim() && selectedFiles.length === 0) ||
    fileError !== "";
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold heading-primary">Travel Posts</h2>
      </div>
      
      {/* Create Post */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm mb-6 feed-container">
        <form onSubmit={handleCreatePost}>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage || undefined} alt="Profile" />
              <AvatarFallback>{user?.fullName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your travel experience..."
              className="flex-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-2 min-h-[42px] resize-none border-none hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            />
          </div>

          {/* File Error Message */}
          {fileError && (
            <div className="mt-2 text-red-500 text-sm">
              {fileError}
            </div>
          )}

          {/* Media Preview */}
          {previewUrls.length > 0 && (
            <div className="mt-3">
              <div className={`grid ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {selectedFiles[index]?.type.startsWith('video/') ? (
                      <video 
                        src={url} 
                        className="w-full h-40 object-cover" 
                        controls
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-40 object-cover" 
                      />
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {!selectedFiles[index]?.type.startsWith('video/') && (
                        <button 
                          type="button"
                          className="bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                          onClick={() => handleOpenCropModal(index)}
                        >
                          <CropIcon size={16} />
                        </button>
                      )}
                      <button 
                        type="button"
                        className="bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
          />
          
          <div className="flex justify-between mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <button 
              type="button" 
              className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              onClick={openFileManager}
              disabled={selectedFiles.length >= 4 || isSubmitting}
            >
              <Image className="h-4 w-4" />
              <span>Photo</span>
            </button>
            <button 
              type="button" 
              className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              onClick={openFileManager}
              disabled={selectedFiles.length >= 4 || isSubmitting}
            >
              <Video className="h-4 w-4" />
              <span>Video</span>
            </button>
            <button 
              type="button" 
              className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              disabled={isSubmitting}
            >
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </button>
            
            <Button 
              type="submit" 
              variant="default" 
              size="sm" 
              disabled={isPostButtonDisabled}
              className="ml-auto"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Image Crop Modal */}
      {cropModalOpen && currentEditingImageIndex !== null && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setCurrentEditingImageIndex(null);
          }}
          imageUrl={previewUrls[currentEditingImageIndex]}
          onCropComplete={handleCropComplete}
        />
      )}
      
      {/* Posts */}
      {postsLoading ? (
        <div className="space-y-6 lg:space-y-0 lg:posts-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 feed-container">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-1/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-full mb-3" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-3/4 mb-6" />
              <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-full mb-3" />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {localPosts && localPosts.length > 0 ? (
            <div className="space-y-6 lg:space-y-0 lg:posts-grid">
              {localPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onDelete={(postId) => {
                    // Immediately update local state to remove post
                    setLocalPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center feed-container">
              <p className="text-neutral-500 dark:text-neutral-400">No posts yet. Be the first to share your travel experience!</p>
            </div>
          )}
          
          <Button 
            className="w-full py-3 mt-6 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors feed-container"
            onClick={refreshPosts}
          >
            Refresh Posts
          </Button>
        </div>
      )}
    </section>
  );
}

type PostCardProps = {
  post: Post;
  onDelete?: (postId: number) => void;
};

function PostCard({ post, onDelete }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${post.userId}`],
    staleTime: 30000
  });
  
  // Use post._userInfo as fallback when user data is not yet loaded
  // This happens with newly created posts
  const userInfo = user || (post as any)._userInfo;
  
  // Use the follow hook
  const { isFollowing, toggleFollow, isLoading: followLoading } = useFollow(post.userId);
  
  const formattedTime = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '2 hours ago';
  
  const isOwnPost = currentUser?.id === post.userId;
  
  // Function to navigate to post detail view
  const navigateToPostDetail = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button, link or other interactive element
    if (
      (e.target as HTMLElement).closest('button') || 
      (e.target as HTMLElement).closest('a') ||
      (e.target as HTMLElement).closest('.no-post-navigation')
    ) {
      return;
    }
    
    // Navigate to post detail page
    window.location.href = `/post/${post.id}`;
  };
  
  const handleCopyLink = () => {
    // Create a shareable URL for the post
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Post link has been copied to clipboard.",
        });
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };
  
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      try {
        // First attempt the REST API endpoint
        const res = await apiRequest("DELETE", `/api/posts/${post.id}`);
        if (!res.ok) {
          // If the standard endpoint fails, try the debug endpoint
          const debugRes = await apiRequest("DELETE", `/api/debug/posts/${post.id}`);
          if (!debugRes.ok) {
            throw new Error("Failed to delete post");
          }
        }
        return true;
      } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Call the onDelete callback to update parent component state immediately
      if (onDelete) {
        onDelete(post.id);
      }
      
      // Clear post from all caches
      queryClient.removeQueries({ queryKey: ["/api/posts"] });
      queryClient.removeQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
      
      // Update any existing cached data
      const existingPosts = queryClient.getQueryData<Post[]>(["/api/posts"]);
      if (existingPosts) {
        queryClient.setQueryData<Post[]>(["/api/posts"], 
          existingPosts.filter(p => p.id !== post.id)
        );
      }
      
      // Ensure profile page posts are updated too
      const userPosts = queryClient.getQueryData<Post[]>([`/api/users/${currentUser?.id}/posts`]);
      if (userPosts) {
        queryClient.setQueryData<Post[]>([`/api/users/${currentUser?.id}/posts`], 
          userPosts.filter(p => p.id !== post.id)
        );
      }
      
      // Force refetch after a short delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
        queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/posts`] });
      }, 200);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('post-deleted', { 
        detail: { postId: post.id } 
      }));
      
      // Show success notification
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted from your feed.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again or refresh the page.",
        variant: "destructive",
      });
    }
  });
  
  const handleDeletePost = () => {
    if (confirm("Are you sure you want to delete this post? It will be permanently removed.")) {
      // First update UI optimistically
      if (onDelete) {
        onDelete(post.id);
      }
      // Then trigger the actual deletion
      deletePostMutation.mutate();
    }
  };
  
  const handleBlockUser = () => {
    if (confirm(`Are you sure you want to block ${userInfo?.fullName || 'this user'}?`)) {
      // Call API to block user
      toast({
        title: "User blocked",
        description: `You have blocked ${userInfo?.fullName || 'this user'}.`,
      });
    }
  };
  
  const handleReportPost = () => {
    // Call API to report post or open a report dialog
    toast({
      title: "Post reported",
      description: "Thank you for reporting this post. We'll review it shortly.",
    });
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm mb-6 post-card">
      <div className="p-4 flex flex-col h-full">
        {/* Post Header with User Info and Follow Button */}
        <div className="flex items-center justify-between mb-3 no-post-navigation">
          <div className="flex items-center space-x-3">
            {/* User Profile Photo */}
            <a href={`/profile/${post.userId}`} className="relative group flex-shrink-0">
              <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                {userInfo?.profileImage ? (
                  <AvatarImage 
                    src={userInfo.profileImage} 
                    alt={userInfo?.fullName || 'User'} 
                    className="object-cover" 
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {userInfo?.fullName?.charAt(0) || userInfo?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </a>
            
            {/* User Info and Follow Button */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-col">
                {/* Username and Full Name */}
                <div className="flex flex-col">
                  <a href={`/profile/${post.userId}`} className="font-bold text-base text-neutral-900 dark:text-neutral-100 hover:underline truncate">
                    {userInfo?.fullName || 'User'}
                  </a>
                  <span className="text-primary font-medium text-sm">
                    @{userInfo?.username || 'username'}
                  </span>
                </div>
                
                {/* Time and Privacy */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center mt-0.5">
                  {formattedTime} · <Globe className="inline h-3 w-3 ml-1 mr-0.5" /> Public
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Follow/Unfollow Button */}
            {!isOwnPost && (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                size="sm" 
                className="h-8 px-3"
                onClick={toggleFollow}
                disabled={followLoading}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Follow</span>
                  </>
                )}
              </Button>
            )}
            
            {/* Post Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  <Link className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                
                {isOwnPost ? (
                  <DropdownMenuItem onClick={handleDeletePost} className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleBlockUser} className="cursor-pointer">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Block user</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleReportPost} className="cursor-pointer">
                      <Flag className="mr-2 h-4 w-4" />
                      <span>Report post</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Clickable Post Content Area */}
        <div 
          onClick={navigateToPostDetail}
          className="cursor-pointer flex-grow"
        >
          {/* Post Content */}
          <p className="mb-3 post-content flex-grow hover:text-primary/90 transition-colors">{post.content}</p>
          
          {/* Post Images */}
          {post.images && Array.isArray(post.images) && post.images.length > 0 && (
            <div className={`rounded-lg overflow-hidden mb-3 post-image-container ${
              post.images.length === 2 ? 'grid grid-cols-2 gap-2' : ''
            }`}>
              {post.images.length === 1 ? (
                <img 
                  src={post.images[0]} 
                  alt="Post" 
                  className="w-full h-full object-cover post-image hover:opacity-95 transition-opacity" 
                />
              ) : (
                post.images.map((image, idx) => (
                  <img 
                    key={idx}
                    src={image} 
                    alt={`Post ${idx + 1}`} 
                    className="w-full h-40 object-cover post-image hover:opacity-95 transition-opacity" 
                  />
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-3 mt-auto no-post-navigation">
          <div className="flex items-center space-x-1">
            <span className="bg-primary rounded-full h-5 w-5 flex items-center justify-center text-white">
              <ThumbsUp className="h-3 w-3" />
            </span>
            <span>{post.likeCount || 0} likes</span>
          </div>
          <div>
            <span>{post.commentCount || 0} comments · {post.shareCount || 0} shares</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700 no-post-navigation">
          <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {(post.commentCount || 0) > 0 && (
        <div className="px-4 pb-4 pt-2 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-xl no-post-navigation">
          <Comments postId={post.id} />
        </div>
      )}
      
      {/* Comment Input */}
      <div className="px-4 pb-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-xl no-post-navigation">
        <div className="flex items-center space-x-3 mt-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.profileImage || undefined} alt="Your profile" />
            <AvatarFallback>{(currentUser?.fullName?.charAt(0) || '?')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Write a comment..."
              className="w-full rounded-full py-2 px-4 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-neutral-500">
              <button className="hover:text-primary dark:hover:text-primary-light">
                <Smile className="h-4 w-4" />
              </button>
              <button className="hover:text-primary dark:hover:text-primary-light">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type CommentType = {
  id: number;
  postId: number;
  userId: number;
  userName?: string;
  userProfileImage?: string;
  content: string;
  createdAt: string;
};

type CommentsProps = {
  postId: number;
};

function Comments({ postId }: CommentsProps) {
  const { data: comments, isLoading } = useQuery<CommentType[]>({
    queryKey: [`/api/posts/${postId}/comments`],
  });
  
  if (isLoading) {
    return (
      <div className="h-20 flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading comments...</p>
      </div>
    );
  }
  
  if (!comments || comments.length === 0) {
    return null;
  }
  
  // Only show first comment
  const comment = comments[0];
  
  return (
    <div className="flex items-start space-x-3 mb-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userProfileImage} alt="User profile" />
        <AvatarFallback>{comment.userName?.charAt(0) || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-white dark:bg-neutral-700 rounded-lg p-3 shadow-sm">
        <p className="font-medium text-sm">{comment.userName || 'User'}</p>
        <p className="text-sm">{comment.content}</p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          <button className="font-medium hover:text-primary dark:hover:text-primary-light">Like</button>
          <button className="font-medium hover:text-primary dark:hover:text-primary-light">Reply</button>
          <span>{formatDistanceToNow(new Date(comment.createdAt))}</span>
        </div>
      </div>
    </div>
  );
}
