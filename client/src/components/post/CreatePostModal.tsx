import { useState, useRef, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { InsertPost } from "@shared/schema";
import { 
  Image, Video, MapPin, X, Trash2, Smile, Edit3, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB file size limit

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
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

  // Function to remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      
      // Ensure the UI updates after file removal
      if (updatedFiles.length === 0) {
        setFileError(""); // Clear error if no files left
      }
      
      return updatedFiles;
    });
  
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  
  {selectedFiles.length > 0 ? (
    selectedFiles.map((file, index) => (
      <div key={file.name || index}> 
        <img src={previewUrls[index]} alt="Preview" />
        <button onClick={() => removeFile(index)}>Remove</button>
      </div>
    ))
  ) : (
    <p>No files selected.</p>
  )}
  

  // Mutation for creating a post
  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      try {
        // Process images - in a real app, you would optimize them
        const optimizedImages = previewUrls.length > 0 ? previewUrls : [];
        
        const res = await apiRequest("POST", "/api/posts", {
          ...postData,
          images: optimizedImages
        });
        return res.json();
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Reset form
      setPostContent("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setFileError("");
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/posts`] });
      }
      
      // Close modal and call success callback
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  // Handle post submission
  const handleCreatePost = () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;
    if (fileError) return;
    
    createPostMutation.mutate({
      content: postContent,
      userId: user!.id,
      isPublic: isPublic
    });
  };

  // Trigger file input click
  const openFileManager = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determine if the post button should be disabled
  const isPostButtonDisabled = 
    createPostMutation.isPending || 
    (!postContent.trim() && selectedFiles.length === 0) ||
    fileError !== "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage} alt="Profile" />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <div className="flex items-center text-sm text-neutral-500">
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  {isPublic ? (
                    <>
                      <span>Public</span>
                      <span className="text-xs">▼</span>
                    </>
                  ) : (
                    <>
                      <span>Private</span>
                      <span className="text-xs">▼</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share your travel experience..."
            className="w-full min-h-[150px] max-h-[300px] border-none bg-transparent resize-none focus:ring-0 p-0 text-lg post-content"
          />
          
          {/* File Error Message */}
          {fileError && (
            <div className="mt-2 text-red-500 text-sm">
              {fileError}
            </div>
          )}
          
          {/* Media Preview */}
          {previewUrls.length > 0 && (
            <div className={`grid ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-3 post-image-container`}>
              {previewUrls.map((url, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {selectedFiles[index]?.type.startsWith('video/') ? (
                    <video 
                      src={url} 
                      className="w-full h-40 object-cover post-image" 
                      controls
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-40 object-cover post-image" 
                    />
                  )}
                  <button 
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
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
        </div>
        
        <div className="flex items-center justify-between mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="flex-1">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Add to your post</p>
          </div>
          <div className="flex space-x-4">
            <button 
              type="button" 
              onClick={openFileManager}
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              disabled={selectedFiles.length >= 4}
              title={selectedFiles.length >= 4 ? "Maximum 4 files allowed" : "Add Photo"}
            >
              <Image className="h-6 w-6" />
            </button>
            <button 
              type="button"
              onClick={openFileManager}
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              disabled={selectedFiles.length >= 4}
              title={selectedFiles.length >= 4 ? "Maximum 4 files allowed" : "Add Video"}
            >
              <Video className="h-6 w-6" />
            </button>
            <button 
              type="button" 
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              <MapPin className="h-6 w-6" />
            </button>
            <button 
              type="button" 
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              <Smile className="h-6 w-6" />
            </button>
            <button 
              type="button" 
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              <Edit3 className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleCreatePost}
            disabled={isPostButtonDisabled}
            className="bg-primary hover:bg-primary/90"
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 