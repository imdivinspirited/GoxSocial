import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  CropIcon, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Check,
  X,
  CircleIcon,
  SquareIcon
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  isProfileImage?: boolean;
}

export function ImageCropModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  onCropComplete,
  isProfileImage = false
}: ImageCropModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [circularCrop, setCircularCrop] = useState(isProfileImage);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setCircularCrop(isProfileImage);
    }
  }, [isOpen, isProfileImage]);

  // Create a hidden image element to handle the actual image
  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        imageRef.current = img;
        drawImage();
      };
    }
    
    return () => {
      imageRef.current = null;
    };
  }, [isOpen, imageUrl]);

  // Update canvas when scale, rotation, position, or crop shape changes
  useEffect(() => {
    if (isOpen && imageRef.current) {
      drawImage();
    }
  }, [scale, rotation, position, circularCrop, isOpen]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Draw the image on the canvas
  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10; // 10px margin
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw crop overlay
    if (circularCrop) {
      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw circular hole
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.clearRect(0, 0, width, height);
      ctx.restore();
      
      // Draw circle outline
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Save context state
    ctx.save();
    
    // Apply clipping if using circular crop
    if (circularCrop) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      ctx.clip();
    }
    
    // Move to center of canvas
    ctx.translate(centerX, centerY);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply scale
    ctx.scale(scale, scale);
    
    // Apply position offset
    ctx.translate(position.x / scale, position.y / scale);
    
    // Draw image centered
    const img = imageRef.current;
    const aspectRatio = img.width / img.height;
    
    // Calculate dimensions to maintain aspect ratio
    let drawWidth, drawHeight;
    if (aspectRatio > 1) {
      // Landscape image
      drawHeight = 200;
      drawWidth = drawHeight * aspectRatio;
    } else {
      // Portrait or square image
      drawWidth = 200;
      drawHeight = drawWidth / aspectRatio;
    }
    
    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    
    // Restore context state
    ctx.restore();
  };

  // Handle apply crop/adjustments
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a new canvas for the final cropped image
    const cropCanvas = document.createElement('canvas');
    const size = Math.min(canvas.width, canvas.height) - 20; // Same as radius * 2
    cropCanvas.width = size;
    cropCanvas.height = size;
    
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;
    
    if (circularCrop) {
      // For circular crops, create a circular clipping path
      cropCtx.beginPath();
      cropCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      cropCtx.clip();
    }
    
    // Draw the center portion of the original canvas to our new canvas
    const centerX = (canvas.width - size) / 2;
    const centerY = (canvas.height - size) / 2;
    cropCtx.drawImage(
      canvas,
      centerX, centerY, size, size,  // Source x, y, width, height
      0, 0, size, size               // Destination x, y, width, height
    );
    
    // Get the cropped image data
    const croppedImageUrl = cropCanvas.toDataURL('image/png');
    onCropComplete(croppedImageUrl);
    onClose();
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CropIcon className="mr-2 h-5 w-5" />
            Adjust Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 flex flex-col items-center">
          <div 
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4"
            style={{ width: "100%", height: "300px", position: "relative" }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Zoom</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Slider
              value={[scale * 100]}
              min={50}
              max={300}
              step={5}
              onValueChange={(value) => setScale(value[0] / 100)}
              className="w-full"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                {circularCrop ? <CircleIcon className="h-4 w-4" /> : <SquareIcon className="h-4 w-4" />}
                <span className="text-sm font-medium">Circular Crop</span>
              </div>
              <Switch
                checked={circularCrop}
                onCheckedChange={setCircularCrop}
              />
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleRotate}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Rotate 90°
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleApply}
          >
            <Check className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 