import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { CreatePostModal } from "./CreatePostModal";

interface CreatePostButtonProps extends ButtonProps {
  text?: string;
}

export function CreatePostButton({ 
  text = "Create Post", 
  variant = "default", 
  size = "default",
  className,
  ...props
}: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {text}
      </Button>
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onSuccess={() => {
          console.log("Post created successfully!");
        }}
      />
    </>
  );
} 