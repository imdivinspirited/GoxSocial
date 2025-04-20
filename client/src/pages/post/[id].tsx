import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Post, User, Comment } from '@shared/schema';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { queryClient } from '@/lib/queryClient';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeft,
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Globe, 
  Smile, 
  Camera,
  UserPlus,
  UserMinus,
  Calendar,
  Clock,
  MapPin,
  Info,
  Heart,
  Eye,
  Bookmark,
  Award,
  Users,
  Flag,
  Link as LinkIcon
} from 'lucide-react';
import { useFollow } from '@/hooks/use-follow';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Extended Post type with additional properties
interface ExtendedPost extends Post {
  viewCount?: number;
  location?: string;
}

export default function PostDetailPage() {
  // Use wouter's routing hooks
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/post/:id');
  const id = params?.id;
  
  const { user: currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  
  // Fetch post data
  const { data: post, isLoading: postLoading } = useQuery<ExtendedPost>({
    queryKey: [`/api/posts/${id}`],
    enabled: !!id,
  });
  
  // Fetch post author data
  const { data: author } = useQuery<User>({
    queryKey: [`/api/users/${post?.userId}`],
    enabled: !!post?.userId,
  });
  
  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${id}/comments`],
    enabled: !!id,
  });
  
  // Use follow hook if we have an author
  const { isFollowing, toggleFollow, isLoading: followLoading } = 
    useFollow(post?.userId || 0);
  
  // Function to return to previous page
  const goBack = () => {
    window.history.back();
  };
  
  const handleReportPost = () => {
    // Placeholder for report functionality
    alert("Report functionality will be implemented soon");
  };
  
  if (postLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Post</h1>
        </div>
        
        <div className="animate-pulse flex flex-col md:flex-row gap-6">
          {/* Left Column - Details */}
          <div className="md:w-1/3 bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm h-fit">
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-neutral-200 dark:bg-neutral-700 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            </div>
          </div>
          
          {/* Right Column - Post Content */}
          <div className="md:w-2/3 bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="space-y-3 mb-4">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
            </div>
            <div className="h-72 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-4"></div>
            <div className="space-y-4 mt-6">
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
              <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Post Not Found</h1>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center">
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            The post you're looking for doesn't exist or may have been deleted.
          </p>
          <Button onClick={() => setLocation('/')}>Return Home</Button>
        </div>
      </div>
    );
  }
  
  const formattedTime = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
    : '2 hours ago';
    
  const exactDate = post.createdAt 
    ? format(new Date(post.createdAt), 'MMMM d, yyyy') 
    : 'Unknown date';
    
  const exactTime = post.createdAt 
    ? format(new Date(post.createdAt), 'h:mm a') 
    : 'Unknown time';
    
  const isOwnPost = currentUser?.id === post.userId;
  
  // Extract post title (first 50 chars if the post is long)
  const postTitle = post.content && post.content.length > 50 
    ? `${post.content.substring(0, 50)}...` 
    : post.content || 'Untitled Post';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">Post Detail</h1>
      </div>
      
      {/* Split View Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Post Details & Stats */}
        <div className="md:w-1/3 space-y-6">
          {/* Author Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Post Details
            </h2>
            
            <div className="flex items-center space-x-3 mb-4">
              <a href={`/profile/${post.userId}`} className="relative group flex-shrink-0">
                <Avatar className="h-14 w-14 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                  {author?.profileImage ? (
                    <AvatarImage 
                      src={author.profileImage} 
                      alt={author?.fullName || 'User'} 
                      className="object-cover" 
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {author?.fullName?.charAt(0) || author?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </a>
              
              <div className="flex flex-col">
                <a href={`/profile/${post.userId}`} className="font-bold text-base hover:underline truncate">
                  {author?.fullName || 'User'}
                </a>
                <span className="text-primary text-sm">
                  @{author?.username || 'username'}
                </span>
                
                {!isOwnPost && (
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    size="sm" 
                    className="h-8 mt-2 w-full"
                    onClick={toggleFollow}
                    disabled={followLoading}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Follow</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <hr className="border-neutral-200 dark:border-neutral-700 my-4" />
            
            {/* Post Metadata */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Date</span>
                </div>
                <span className="text-sm font-medium">{exactDate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Time</span>
                </div>
                <span className="text-sm font-medium">{exactTime}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Visibility</span>
                </div>
                <span className="text-sm font-medium">Public</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Location</span>
                </div>
                <span className="text-sm font-medium">{post.location || 'Not specified'}</span>
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Post Stats
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-750 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="text-lg font-bold">{post.likeCount || 0}</p>
                <p className="text-xs text-neutral-500">Likes</p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-750 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <p className="text-lg font-bold">{post.commentCount || 0}</p>
                <p className="text-xs text-neutral-500">Comments</p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-750 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1 text-primary">
                  <Share2 className="h-5 w-5" />
                </div>
                <p className="text-lg font-bold">{post.shareCount || 0}</p>
                <p className="text-xs text-neutral-500">Shares</p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-750 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1 text-primary">
                  <Eye className="h-5 w-5" />
                </div>
                <p className="text-lg font-bold">{post.viewCount || 0}</p>
                <p className="text-xs text-neutral-500">Views</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}>
                <LinkIcon className="h-4 w-4 mr-2" />
                <span>Copy Link</span>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                <Bookmark className="h-4 w-4 mr-2" />
                <span>Save Post</span>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center text-red-500 hover:text-red-600" onClick={handleReportPost}>
                <Flag className="h-4 w-4 mr-2" />
                <span>Report Post</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Post Content and Comments */}
        <div className="md:w-2/3">
          {/* Post Content Container */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="p-5">
              {/* Post Title - First few words of content as header */}
              <h1 className="text-2xl font-bold mb-4">{postTitle}</h1>
              
              {/* Post Content */}
              <div className="mb-6">
                <p className="text-lg leading-relaxed whitespace-pre-line">{post.content}</p>
                
                {/* Post Images */}
                {post.images && Array.isArray(post.images) && post.images.length > 0 && (
                  <div className={`mt-5 rounded-lg overflow-hidden ${
                    post.images.length === 2 ? 'grid grid-cols-2 gap-2' : ''
                  }`}>
                    {post.images.length === 1 ? (
                      <img 
                        src={post.images[0]} 
                        alt="Post" 
                        className="w-full max-h-[600px] object-contain rounded-lg" 
                      />
                    ) : (
                      post.images.map((image, idx) => (
                        <img 
                          key={idx}
                          src={image} 
                          alt={`Post ${idx + 1}`} 
                          className="w-full h-auto object-cover rounded-lg" 
                          loading="lazy"
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>Like</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show appreciation for this post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Comment</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a comment to this post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors py-1">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this post with others</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="px-5 py-5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h3>
                
                <Button variant="outline" size="sm">
                  Most recent
                </Button>
              </div>
              
              {commentsLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-sm text-neutral-500">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-3 text-neutral-500 dark:text-neutral-400">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-4 mb-5">
                  {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
              
              {/* Add Comment */}
              <div className="flex items-start space-x-3 mt-5 border-t border-neutral-200 dark:border-neutral-700 pt-5">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser?.profileImage || undefined} alt="Your profile" />
                  <AvatarFallback>{(currentUser?.fullName?.charAt(0) || '?')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-lg py-2 px-4 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                    rows={2}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2 text-neutral-500">
                    <button className="hover:text-primary dark:hover:text-primary-light">
                      <Smile className="h-4 w-4" />
                    </button>
                    <button className="hover:text-primary dark:hover:text-primary-light">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button 
                  type="button" 
                  size="sm"
                  disabled={!commentContent.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type CommentItemProps = {
  comment: Comment;
};

function CommentItem({ comment }: CommentItemProps) {
  const { user: currentUser } = useAuth();
  const { data: commentUser } = useQuery<User>({
    queryKey: [`/api/users/${comment.userId}`],
  });
  
  const { isFollowing, toggleFollow, isLoading: followLoading } = useFollow(comment.userId);
  const isOwnComment = currentUser?.id === comment.userId;
  
  const formattedTime = comment.createdAt 
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) 
    : '2 mins ago';
  
  return (
    <div className="flex space-x-3">
      <a href={`/profile/${comment.userId}`} className="flex-shrink-0">
        <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-colors">
          {commentUser?.profileImage ? (
            <AvatarImage 
              src={commentUser.profileImage} 
              alt={commentUser?.fullName || 'User'} 
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {commentUser?.fullName?.charAt(0) || commentUser?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      </a>
      <div className="flex-1">
        <div className="bg-white dark:bg-neutral-700 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <a href={`/profile/${comment.userId}`} className="font-bold text-sm hover:underline">
                {commentUser?.fullName || 'User'}
              </a>
              <span className="text-primary text-xs font-medium">
                @{commentUser?.username || 'username'}
              </span>
            </div>
            
            {!isOwnComment && (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                size="sm" 
                className="h-7 px-2 text-xs ml-2"
                onClick={toggleFollow}
                disabled={followLoading}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-3 w-3 mr-1" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3 mr-1" />
                    <span>Follow</span>
                  </>
                )}
              </Button>
            )}
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 pl-3 text-xs text-neutral-500 dark:text-neutral-400">
          <button className="hover:text-primary mr-3">Like</button>
          <button className="hover:text-primary mr-3">Reply</button>
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
} 