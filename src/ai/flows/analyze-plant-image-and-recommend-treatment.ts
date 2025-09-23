
// src/ai/flows/analyze-plant-image-and-recommend-treatment.ts
'use server';

/**
 * @fileOverview Analyzes a plant image to identify species and diseases, then recommends treatment.
 *
 * - analyzePlantImageAndRecommendTreatment - A function that handles the plant image analysis and treatment recommendation process.
 * - AnalyzePlantImageAndRecommendTreatmentInput - The input type for the analyzePlantImageAndRecommendTreatment function.
 * - AnalyzePlantImageAndRecommendTreatmentOutput - The return type for the analyzePlantImageAndRecommendTreatment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlantImageAndRecommendTreatmentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePlantImageAndRecommendTreatmentInput = z.infer<typeof AnalyzePlantImageAndRecommendTreatmentInputSchema>;

const AnalyzePlantImageAndRecommendTreatmentOutputSchema = z.object({
  plantSpecies: z.string().describe('The identified plant species.'),
  disease: z.string().describe('Any detected diseases or issues.'),
  treatment: z.string().describe('The recommended treatment. Must be one of: "Pesticide", "Herbicide", or "Insecticide".'),
  dosage: z.string().describe('The dosage recommendation for the treatment (e.g., "10ml").'),
});
export type AnalyzePlantImageAndRecommendTreatmentOutput = z.infer<typeof AnalyzePlantImageAndRecommendTreatmentOutputSchema>;

export async function analyzePlantImageAndRecommendTreatment(
  input: AnalyzePlantImageAndRecommendTreatmentInput
): Promise<AnalyzePlantImageAndRecommendTreatmentOutput> {
  return analyzePlantImageAndRecommendTreatmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlantImageAndRecommendTreatmentPrompt',
  input: {schema: AnalyzePlantImageAndRecommendTreatmentInputSchema},
  output: {schema: AnalyzePlantImageAndRecommendTreatmentOutputSchema},
  prompt: `You are an expert in plant care. Analyze the provided image of a plant leaf to identify the plant species and any potential diseases. Based on your analysis, recommend a suitable treatment. The treatment MUST be one of "Pesticide", "Herbicide", or "Insecticide". Also provide a total dosage recommendation in milliliters (e.g., "10ml"). The pesticides are pre-mixed with water.

Image: {{media url=photoDataUri}}

Respond with the plant species, any detected diseases, the recommended treatment, and the dosage. Enclose the response in a JSON format.`,
});

const analyzePlantImageAndRecommendTreatmentFlow = ai.defineFlow(
  {
    name: 'analyzePlantImageAndRecommendTreatmentFlow',
    inputSchema: AnalyzePlantImageAndRecommendTreatmentInputSchema,
    outputSchema: AnalyzePlantImageAndRecommendTreatmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
