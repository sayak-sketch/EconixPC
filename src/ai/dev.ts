import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-plant-image-and-recommend-treatment.ts';
import '@/ai/flows/suggest-treatment-from-symptoms.ts';