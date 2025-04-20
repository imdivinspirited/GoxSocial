import { useMutation, useQuery } from "@tanstack/react-query";
import { Follower } from "@shared/schema";
import { useAuth } from "./use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export function useFollow(userId: number) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Check if the current user is following the given user
  const { data: followStatus, isLoading: followStatusLoading } = useQuery<boolean>({
    queryKey: [`/api/users/${currentUser?.id}/following/${userId}`],
    enabled: !!currentUser && currentUser.id !== userId,
  });
  
  // Update local state when data from API changes
  useEffect(() => {
    if (followStatus !== undefined) {
      setIsFollowing(followStatus);
    }
  }, [followStatus]);
  
  // Mutation to follow a user
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in to follow users");
      if (currentUser.id === userId) throw new Error("You cannot follow yourself");
      
      try {
        const res = await apiRequest("POST", "/api/followers", {
          followerId: currentUser.id,
          followingId: userId
        });
        
        return res.json();
      } catch (error) {
        console.error("Error following user:", error);
        throw error;
      }
    },
    onMutate: () => {
      // Optimistically update
      setIsFollowing(true);
    },
    onSuccess: () => {
      // Update cache
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${currentUser?.id}/following/${userId}`] 
      });
      
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    },
    onError: (error) => {
      // Revert optimistic update
      setIsFollowing(false);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to follow user",
        variant: "destructive",
      });
    }
  });
  
  // Mutation to unfollow a user
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in");
      
      try {
        const res = await apiRequest("DELETE", `/api/followers/${currentUser.id}/${userId}`);
        
        if (!res.ok) {
          throw new Error("Failed to unfollow user");
        }
        
        return true;
      } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
      }
    },
    onMutate: () => {
      // Optimistically update
      setIsFollowing(false);
    },
    onSuccess: () => {
      // Update cache
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${currentUser?.id}/following/${userId}`] 
      });
      
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
    },
    onError: (error) => {
      // Revert optimistic update
      setIsFollowing(true);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unfollow user",
        variant: "destructive",
      });
    }
  });
  
  const toggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };
  
  return {
    isFollowing,
    toggleFollow,
    isLoading: followStatusLoading || followMutation.isPending || unfollowMutation.isPending,
    // For mock purposes (until the API is fully implemented)
    mockSetFollowing: setIsFollowing
  };
} 