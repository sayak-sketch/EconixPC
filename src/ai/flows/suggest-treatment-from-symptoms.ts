'use server';
/**
 * @fileOverview An AI agent that suggests a treatment plan based on plant symptoms.
 *
 * - suggestTreatmentFromSymptoms - A function that suggests a treatment plan.
 * - SuggestTreatmentFromSymptomsInput - The input type for the suggestTreatmentFromSymptoms function.
 * - SuggestTreatmentFromSymptomsOutput - The return type for the suggestTreatmentFromSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTreatmentFromSymptomsInputSchema = z.object({
  symptoms: z.string().describe('The symptoms that the plant is exhibiting.'),
});
export type SuggestTreatmentFromSymptomsInput = z.infer<typeof SuggestTreatmentFromSymptomsInputSchema>;

const SuggestTreatmentFromSymptomsOutputSchema = z.object({
  treatmentPlan: z.string().describe('A detailed treatment plan for the plant.'),
});
export type SuggestTreatmentFromSymptomsOutput = z.infer<typeof SuggestTreatmentFromSymptomsOutputSchema>;

export async function suggestTreatmentFromSymptoms(input: SuggestTreatmentFromSymptomsInput): Promise<SuggestTreatmentFromSymptomsOutput> {
  return suggestTreatmentFromSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTreatmentFromSymptomsPrompt',
  input: {schema: SuggestTreatmentFromSymptomsInputSchema},
  output: {schema: SuggestTreatmentFromSymptomsOutputSchema},
  prompt: `You are an expert botanist specializing in plant illnesses and treatments.

You will use the provided symptoms to create a treatment plan for the plant.

Symptoms: {{{symptoms}}}

Treatment Plan:
`,
});

const suggestTreatmentFromSymptomsFlow = ai.defineFlow(
  {
    name: 'suggestTreatmentFromSymptomsFlow',
    inputSchema: SuggestTreatmentFromSymptomsInputSchema,
    outputSchema: SuggestTreatmentFromSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
