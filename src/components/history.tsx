
'use client';

import { type AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sprout, Bug, FlaskConical, Trash2 } from 'lucide-react';

interface HistoryProps {
  history: AnalysisResult[];
  onClearHistory: () => void;
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

export default function History({ history, onClearHistory }: HistoryProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>
            Review your past plant analyses.
          </CardDescription>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={onClearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>You have no analysis history yet.</p>
            <p>Go to the "Analyzer" tab to get started.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {history.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">#{history.length - index}</span>
                    <span className="font-semibold">{item.plantSpecies}</span>
                    <span>-</span>
                    <span className="text-sm text-muted-foreground">{item.disease}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
                    <ResultItem icon={Sprout} label="Plant Species" value={item.plantSpecies} />
                    <ResultItem icon={Bug} label="Detected Disease" value={item.disease} />
                    <ResultItem icon={FlaskConical} label="Recommended Treatment" value={item.treatment} />
                    <ResultItem icon={FlaskConical} label="Dosage" value={item.dosage} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
