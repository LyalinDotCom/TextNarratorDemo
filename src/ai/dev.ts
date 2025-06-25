import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-text-flow.ts';
import '@/ai/flows/generate-narration-flow.ts';
import '@/ai/flows/translate-text-flow.ts';
