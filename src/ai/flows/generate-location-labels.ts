'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating concise and distinct labels for campus locations.
 *
 * generateLocationLabels - A function that generates location labels using a Genkit flow.
 * GenerateLocationLabelsInput - The input type for the generateLocationLabels function.
 * GenerateLocationLabelsOutput - The output type for the generateLocationLabels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationLabelsInputSchema = z.object({
  buildingName: z.string().describe('The name of the building.'),
  floorNumber: z.number().describe('The floor number.'),
  roomDescription: z.string().describe('A description of the room or location.'),
});
export type GenerateLocationLabelsInput = z.infer<typeof GenerateLocationLabelsInputSchema>;

const GenerateLocationLabelsOutputSchema = z.object({
  locationLabel: z.string().describe('A concise and distinct label for the location.'),
});
export type GenerateLocationLabelsOutput = z.infer<typeof GenerateLocationLabelsOutputSchema>;

export async function generateLocationLabels(input: GenerateLocationLabelsInput): Promise<GenerateLocationLabelsOutput> {
  return generateLocationLabelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocationLabelsPrompt',
  input: {schema: GenerateLocationLabelsInputSchema},
  output: {schema: GenerateLocationLabelsOutputSchema},
  prompt: `You are an expert in generating concise and distinct labels for locations within a campus environment.

  Given the following information, generate a short, clear, and unique label for the location:

  Building Name: {{{buildingName}}}
  Floor Number: {{{floorNumber}}}
  Room Description: {{{roomDescription}}}

  The label should be no more than 5 words and easily distinguishable from other labels in the same building.
  Output only the location label.`, // Corrected prompt here
});

const generateLocationLabelsFlow = ai.defineFlow(
  {
    name: 'generateLocationLabelsFlow',
    inputSchema: GenerateLocationLabelsInputSchema,
    outputSchema: GenerateLocationLabelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
