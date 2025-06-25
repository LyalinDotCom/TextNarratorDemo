'use server';

/**
 * @fileOverview Generates initial text for the Text Narrator app.
 *
 * - generateInitialText - A function that generates the initial text.
 * - GenerateInitialTextInput - The input type for the generateInitialText function.
 * - GenerateInitialTextOutput - The return type for the generateInitialText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialTextInputSchema = z.object({
  topic: z.string().default('a peaceful meadow').describe('The topic to generate text about.'),
});
export type GenerateInitialTextInput = z.infer<typeof GenerateInitialTextInputSchema>;

const GenerateInitialTextOutputSchema = z.object({
  text: z.string().describe('The generated text.'),
});
export type GenerateInitialTextOutput = z.infer<typeof GenerateInitialTextOutputSchema>;

export async function generateInitialText(input: GenerateInitialTextInput): Promise<GenerateInitialTextOutput> {
  return generateInitialTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialTextPrompt',
  input: {schema: GenerateInitialTextInputSchema},
  output: {schema: GenerateInitialTextOutputSchema},
  prompt: `You are a helpful assistant that generates a short paragraph about the following topic:

Topic: {{{topic}}}

Paragraph:`,
});

const generateInitialTextFlow = ai.defineFlow(
  {
    name: 'generateInitialTextFlow',
    inputSchema: GenerateInitialTextInputSchema,
    outputSchema: GenerateInitialTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
