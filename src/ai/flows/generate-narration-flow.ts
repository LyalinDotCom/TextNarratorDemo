'use server';

/**
 * @fileOverview A text narration AI agent.
 *
 * - generateGeminiNarration - A function that handles the generation of text narration using Gemini.
 * - GenerateGeminiNarrationInput - The input type for the generateGeminiNarration function.
 * - GenerateGeminiNarrationOutput - The return type for the generateGeminiNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateGeminiNarrationInputSchema = z.object({
  text: z.string().describe('The text to be narrated.'),
  voice: z.string().describe('The voice to use for narration.'),
});
export type GenerateGeminiNarrationInput = z.infer<typeof GenerateGeminiNarrationInputSchema>;

const GenerateGeminiNarrationOutputSchema = z.object({
  media: z.string().describe('The audio narration of the input text as a data URI.'),
});
export type GenerateGeminiNarrationOutput = z.infer<typeof GenerateGeminiNarrationOutputSchema>;

export async function generateGeminiNarration(input: GenerateGeminiNarrationInput): Promise<GenerateGeminiNarrationOutput> {
  return generateGeminiNarrationFlow(input);
}

const generateGeminiNarrationFlow = ai.defineFlow(
  {
    name: 'generateGeminiNarrationFlow',
    inputSchema: GenerateGeminiNarrationInputSchema,
    outputSchema: GenerateGeminiNarrationOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
