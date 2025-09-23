
'use client';

import { type AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sprout, Bug, FlaskConical } from 'lucide-react';

interface AnalysisResultsProps {
  data: AnalysisResult;
}

const ResultItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start gap-4">
    <div className="bg-primary/10 text-primary p-3 rounded-lg">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Here is the diagnosis for your plant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ResultItem icon={Sprout} label="Plant Species" value={data.plantSpecies} />
          <ResultItem icon={Bug} label="Detected Disease" value={data.disease} />
          <ResultItem icon={FlaskConical} label="Recommended Treatment" value={data.treatment} />
          <ResultItem icon={FlaskConical} label="Dosage" value={data.dosage} />
        </div>
      </CardContent>
    </>
  );
}
