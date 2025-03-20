import { useQuery, useMutation } from "@tanstack/react-query";
import { Post, InsertPost } from "@shared/schema";
import { useState } from "react";
import { 
  Image, Video, MapPin, ThumbsUp, MessageSquare, Share2, 
  MoreHorizontal, Globe, Clock, Smile, Camera 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export function SocialFeed() {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      const res = await apiRequest("POST", "/api/posts", postData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setPostContent("");
    },
  });
  
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    createPostMutation.mutate({
      content: postContent,
      userId: user!.id,
      images: [],
      isPublic: true
    });
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Travel Posts</h2>
      </div>
      
      {/* Create Post */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm mb-6">
        <form onSubmit={handleCreatePost}>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage} alt="Profile" />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your travel experience..."
              className="flex-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-2 min-h-[42px] resize-none border-none hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            />
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <button type="button" className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Image className="h-4 w-4" />
              <span>Photo</span>
            </button>
            <button type="button" className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </button>
            <button type="button" className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </button>
            
            <Button 
              type="submit" 
              variant="default" 
              size="sm" 
              disabled={createPostMutation.isPending || !postContent.trim()}
              className="ml-auto"
            >
              Post
            </Button>
          </div>
        </form>
      </div>
      
      {/* Posts */}
      {postsLoading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4">
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
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">No posts yet. Be the first to share your travel experience!</p>
            </div>
          )}
          
          <Button className="w-full py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}

type PostCardProps = {
  post: Post;
};

function PostCard({ post }: PostCardProps) {
  const { data: user } = useQuery({
    queryKey: [`/api/users/${post.userId}`],
  });
  
  const formattedTime = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '2 hours ago';
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage} alt="User profile" />
              <AvatarFallback>{user?.fullName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.fullName || 'User'}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formattedTime} · <Globe className="inline h-3 w-3" /> Public
              </p>
            </div>
          </div>
          <button className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
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
        
        <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          <div className="flex items-center space-x-1">
            <span className="bg-primary rounded-full h-5 w-5 flex items-center justify-center text-white">
              <ThumbsUp className="h-3 w-3" />
            </span>
            <span>{post.likeCount} likes</span>
          </div>
          <div>
            <span>{post.commentCount} comments · {post.shareCount} shares</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
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
      
      {post.commentCount > 0 && (
        <div className="px-4 pb-4 pt-2 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-xl">
          <Comments postId={post.id} />
        </div>
      )}
      
      <div className="px-4 pb-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-xl">
        <div className="flex items-center space-x-3 mt-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImage} alt="User profile" />
            <AvatarFallback>{user?.fullName?.charAt(0) || '?'}</AvatarFallback>
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

type CommentsProps = {
  postId: number;
};

function Comments({ postId }: CommentsProps) {
  const { data: comments, isLoading } = useQuery({
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
