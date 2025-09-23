
'use server';

import {
  analyzePlantImageAndRecommendTreatment,
  type AnalyzePlantImageAndRecommendTreatmentInput,
  type AnalyzePlantImageAndRecommendTreatmentOutput,
} from '@/ai/flows/analyze-plant-image-and-recommend-treatment';

export type AnalysisResult = AnalyzePlantImageAndRecommendTreatmentOutput;

export async function analyzePlantImageAction(
  input: AnalyzePlantImageAndRecommendTreatmentInput
): Promise<AnalysisResult> {
  try {
    const result = await analyzePlantImageAndRecommendTreatment(input);
    return result;
  } catch (e) {
    console.error('Error during AI analysis:', e);
    if (e instanceof Error) {
        throw new Error(`AI analysis failed: ${e.message}`);
    }
    throw new Error('An unknown error occurred during AI analysis. Please try again.');
  }
}

export async function sendDataToDeviceAction(ipAddress: string, csvData: string): Promise<{success: boolean, message: string}> {
  try {
    const response = await fetch(`http://${ipAddress}/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: csvData,
    });

    if (response.ok) {
        const responseText = await response.text();
        return { success: true, message: `Command sent successfully: ${responseText}` };
    } else {
        return { success: false, message: `Failed to send command. Status: ${response.status}` };
    }
  } catch (error: any) {
      console.error('Error sending data to device:', error);
      return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}
