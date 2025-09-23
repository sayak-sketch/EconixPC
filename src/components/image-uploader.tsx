
'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
  onClear: () => void;
  disabled?: boolean;
  onUseCamera: () => void;
}

export default function ImageUploader({ onImageSelect, imagePreview, onClear, disabled, onUseCamera }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    // Reset the input value to allow re-selecting the same file
    if(event.target) {
      event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
        // Ensure capture attribute is removed for standard file uploads
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  if (imagePreview) {
    return (
      <div className="relative group">
        <Image
          src={imagePreview}
          alt="Plant preview"
          width={600}
          height={400}
          className="rounded-lg object-cover w-full aspect-video"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onClear}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear image</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center aspect-video transition-colors",
        isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50",
        disabled && "opacity-50"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      <div className="space-y-4">
        <div className="flex justify-center text-muted-foreground">
            <Camera className="w-16 h-16" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Upload or Capture a Photo</h3>
        <p className="text-muted-foreground">Drag & drop an image of a plant leaf here, or use the buttons below.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleUploadClick} disabled={disabled}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photo
          </Button>
          <Button onClick={onUseCamera} variant="secondary" disabled={disabled}>
            <Camera className="mr-2 h-4 w-4" />
            Use Camera
          </Button>
        </div>
      </div>
    </div>
  );
}
