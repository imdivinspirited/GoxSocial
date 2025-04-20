import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Comment, User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, UserPlus, UserMinus } from "lucide-react";
import { useFollow } from "@/hooks/use-follow";

interface CommentsProps {
  postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const { user: currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${postId}/comments`],
    enabled: !!postId,
  });
  
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser) throw new Error("You must be logged in to comment");
      
      const res = await apiRequest("POST", `/api/posts/${postId}/comments`, {
        content,
        userId: currentUser.id,
        postId
      });
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      setCommentContent("");
    }
  });
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    createCommentMutation.mutate(commentContent);
  };
  
  if (isLoading) {
    return <div className="text-center py-3">Loading comments...</div>;
  }
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-3 text-neutral-500 dark:text-neutral-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-600 dark:text-neutral-300">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>
      
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      
      <div className="flex items-center space-x-3 mt-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser?.profileImage || undefined} alt="Your profile" />
          <AvatarFallback>{currentUser?.fullName?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmitComment} className="flex-1 flex space-x-2">
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full"
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!commentContent.trim() || createCommentMutation.isPending}
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
}

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
        <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg px-3 py-2">
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
          {(comment.likeCount ?? 0) > 0 && (
            <div className="ml-2 flex items-center">
              <HeartIcon className="h-3 w-3 text-red-500 mr-1" />
              <span>{comment.likeCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 