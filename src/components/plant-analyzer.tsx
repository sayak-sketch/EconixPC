
'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzePlantImageAction, type AnalysisResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/image-uploader';
import AnalysisResults from '@/components/analysis-results';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CameraView from './camera-view';

interface PlantAnalyzerProps {
    onAnalysisComplete: (result: AnalysisResult | null) => void;
    analysisResult: AnalysisResult | null;
}

export default function PlantAnalyzer({ onAnalysisComplete, analysisResult }: PlantAnalyzerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!analysisResult) {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [analysisResult]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    onAnalysisComplete(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handlePhotoTaken = (dataUri: string) => {
    fetch(dataUri)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
        handleImageSelect(file);
      });
    setIsCameraOpen(false);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    onAnalysisComplete(null);
  }

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    onAnalysisComplete(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const result = await analyzePlantImageAction({ photoDataUri: base64data });
        onAnalysisComplete(result);
        toast({
          title: "Analysis Complete",
          description: "We've identified your plant and recommended a treatment.",
        });
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: e.message || "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the image file.",
      });
      setIsLoading(false);
    };
  };
  
  const getTankInfo = (treatment: string | undefined): { name: string; tank: number } => {
    if (!treatment) return { name: 'Unknown', tank: 0 };
    const lowerTreatment = treatment.toLowerCase();
    if (lowerTreatment.includes('pesticide')) return { name: 'Pesticide', tank: 1 };
    if (lowerTreatment.includes('insecticide')) return { name: 'Insecticide', tank: 2 };
    if (lowerTreatment.includes('herbicide')) return { name: 'Herbicide', tank: 3 };
    return { name: 'General', tank: 0 };
  }

  const tankInfo = getTankInfo(analysisResult?.treatment);

  return (
    <div className="space-y-8">
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Use Camera</DialogTitle>
                    <DialogDescription>
                        Position your plant leaf in the frame and click "Take Photo".
                    </DialogDescription>
                </DialogHeader>
                <CameraView onPhotoTaken={handlePhotoTaken} isOpen={isCameraOpen} />
            </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              onClear={handleClear}
              disabled={isLoading}
              onUseCamera={() => setIsCameraOpen(true)}
            />
          </CardContent>
          {imageFile && !analysisResult && (
            <CardFooter className="flex justify-center">
              <Button onClick={handleAnalyze} disabled={isLoading || !imageFile}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Plant'
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">Our AI is analyzing your plant, please wait...</p>
        </div>
      )}

      {analysisResult && (
        <Card>
          <AnalysisResults data={analysisResult} />
           <CardContent>
            <div className="mt-4 rounded-lg border bg-card text-card-foreground p-4">
              <h3 className="font-semibold text-lg mb-2">Sprayer Tank Information</h3>
              <p>For this treatment, use the <span className="font-bold text-primary">{tankInfo.name} (Tank {tankInfo.tank})</span> tank.</p>
              <p>The required dosage is <span className="font-bold text-primary">{analysisResult.dosage}</span>.</p>
            </div>
          </CardContent>
           <CardFooter className="flex justify-center">
                <Button onClick={handleClear} variant="outline">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Analyze Another Plant
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
