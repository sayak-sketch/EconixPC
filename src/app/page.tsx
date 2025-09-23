
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import PlantAnalyzer from "@/components/plant-analyzer";
import DeviceConnector from "@/components/device-connector";
import History from "@/components/history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AnalysisResult } from '@/app/actions';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('analysisHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleAnalysisComplete = (result: AnalysisResult | null) => {
    setAnalysisResult(result);
    if (result) {
      const newHistory = [result, ...history];
      setHistory(newHistory);
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('analysisHistory');
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

  const csvData = analysisResult
    ? `${tankInfo.tank},${analysisResult.dosage}`
    : null;


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Analyzer</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
              <PlantAnalyzer 
                onAnalysisComplete={handleAnalysisComplete} 
                analysisResult={analysisResult}
              />
              <div className="space-y-8">
                 <DeviceConnector csvData={csvData} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <History history={history} onClearHistory={handleClearHistory} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
