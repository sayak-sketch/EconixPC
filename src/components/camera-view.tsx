
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, RefreshCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';

interface CameraViewProps {
  onPhotoTaken: (dataUri: string) => void;
  isOpen: boolean;
}

export default function CameraView({ onPhotoTaken, isOpen }: CameraViewProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getCameraPermission = useCallback(async () => {
    setHasCameraPermission(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API not available');
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  }, [toast]);

  const cleanupCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      getCameraPermission();
    } else {
      cleanupCamera();
      setCapturedImage(null);
    }
    return cleanupCamera;
  }, [isOpen, getCameraPermission, cleanupCamera]);

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        cleanupCamera();
      }
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    getCameraPermission();
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoTaken(capturedImage);
    }
  };

  const renderContent = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Requesting camera access...</p>
        </div>
      );
    }

    if (hasCameraPermission === false) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Camera access is disabled or not available. Please enable it in your browser settings and refresh the page.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured plant" className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <div className="flex justify-center gap-4">
          {capturedImage ? (
            <>
              <Button variant="outline" onClick={handleRetakePhoto}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <DialogClose asChild>
                  <Button onClick={handleUsePhoto}>
                  Use Photo
                  </Button>
              </DialogClose>
            </>
          ) : (
            <Button onClick={handleTakePhoto} disabled={hasCameraPermission !== true}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
}
