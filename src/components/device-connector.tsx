
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendDataToDeviceAction } from '@/app/actions';
import { Wifi, WifiOff, Loader2, SprayCan, CheckCircle, XCircle, Download } from 'lucide-react';

interface DeviceConnectorProps {
  csvData: string | null;
}

export default function DeviceConnector({ csvData }: DeviceConnectorProps) {
  const [ipAddress, setIpAddress] = useState('');
  const [savedIpAddress, setSavedIpAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [isSpraying, setIsSpraying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedIp = localStorage.getItem('esp32-ip');
    if (storedIp) {
      setIpAddress(storedIp);
      setSavedIpAddress(storedIp);
      setStatus('connected');
    }
  }, []);

  const handleSaveIp = () => {
    localStorage.setItem('esp32-ip', ipAddress);
    setSavedIpAddress(ipAddress);
    setStatus('connected');
    toast({ title: 'IP Address Saved', description: 'Your device IP address has been saved.' });
  };

  const handleForgetIp = () => {
    localStorage.removeItem('esp32-ip');
    setIpAddress('');
    setSavedIpAddress(null);
    setStatus('disconnected');
    toast({ title: 'IP Address Forgotten', description: 'Your device IP address has been removed.' });
  }

  const handleSpray = async () => {
    if (!savedIpAddress || !csvData) {
      toast({ variant: 'destructive', title: 'Cannot Spray', description: 'Device IP not set or no analysis data available.' });
      return;
    }
    setIsSpraying(true);
    try {
      const result = await sendDataToDeviceAction(savedIpAddress, csvData);
      if (result.success) {
        toast({ title: 'Spray command sent!', description: 'Your device should now be dispensing the treatment.' });
      } else {
        toast({ variant: 'destructive', title: 'Spray Failed', description: result.message });
      }
    } catch (error: any) {
      console.error('Failed to send spray command:', error);
      toast({ variant: 'destructive', title: 'Spray Failed', description: error.message });
    } finally {
      setIsSpraying(false);
    }
  };
  
  const handleDownloadCsv = () => {
    if (!csvData) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No analysis data available to download.' });
      return;
    }
    const blob = new Blob([`tank,dosage\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'treatment_command.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({ title: 'CSV Downloaded', description: 'The treatment command has been downloaded.' });
  };

  const statusInfo = {
    disconnected: { icon: WifiOff, text: 'Connect to your Econix device to dispense treatment.', color: 'text-muted-foreground' },
    connected: { icon: Wifi, text: `Ready to send commands to ${savedIpAddress}.`, color: 'text-green-500' },
    error: { icon: XCircle, text: 'Connection failed. Please check the IP and try again.', color: 'text-destructive' },
  };

  const { icon: StatusIcon, text: statusText, color: statusColor } = statusInfo[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Control</CardTitle>
        <CardDescription>Connect to your ESP32-powered sprayer via WiFi to apply the treatment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status !== 'connected' ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Enter ESP32 IP Address</p>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="e.g., 192.168.1.100" 
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <Button onClick={handleSaveIp} disabled={!ipAddress}>
                <CheckCircle className="mr-2 h-4 w-4"/>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">The IP address will be saved in your browser for future use.</p>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className={`flex items-center justify-center gap-2 ${statusColor}`}>
              <StatusIcon className="h-5 w-5" />
              <p>{statusText}</p>
            </div>
             <div className="flex justify-center gap-4">
                 <Button onClick={handleSpray} disabled={isSpraying || !csvData}>
                    {isSpraying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <SprayCan className="mr-2 h-4 w-4" />}
                    {isSpraying ? 'Spraying...' : 'Spray Treatment'}
                </Button>
                <Button onClick={handleDownloadCsv} variant="secondary" disabled={!csvData}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
                <Button variant="outline" onClick={handleForgetIp}>
                    Change IP
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
