import { assertGeminiEnv, env } from '@/lib/env';
import type { PlantCareFacts } from '@/types/database';

export type PlantHealthAnalysis = {
  health_score: number;
  health_status: string;
  species_name: string | null;
  species_common_name: string | null;
  care: PlantCareFacts;
  observations: string | null;
};

const GEMINI_MODEL = 'gemini-2.5-flash';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

function clampScore(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function parseCare(value: unknown): PlantCareFacts {
  if (!value || typeof value !== 'object') return {};
  const care = value as Record<string, unknown>;
  const fields = ['light', 'water', 'soil', 'potting', 'feeding', 'temperature'] as const;
  const result: PlantCareFacts = {};

  for (const field of fields) {
    const entry = care[field];
    if (typeof entry === 'string' && entry.trim()) {
      result[field] = entry.trim();
    }
  }

  return result;
}

function parseAnalysisPayload(raw: unknown): PlantHealthAnalysis {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  return {
    health_score: clampScore(data.health_score),
    health_status:
      typeof data.health_status === 'string' && data.health_status.trim()
        ? data.health_status.trim()
        : 'Health check complete',
    species_name:
      typeof data.species_name === 'string' && data.species_name.trim()
        ? data.species_name.trim()
        : null,
    species_common_name:
      typeof data.species_common_name === 'string' && data.species_common_name.trim()
        ? data.species_common_name.trim()
        : null,
    care: parseCare(data.care),
    observations:
      typeof data.observations === 'string' && data.observations.trim()
        ? data.observations.trim()
        : null,
  };
}

export async function analyzePlantHealth(params: {
  imageUri: string;
  plantNickname: string;
  speciesName?: string | null;
}): Promise<{ analysis: PlantHealthAnalysis; rawResponse: unknown }> {
  assertGeminiEnv();

  const response = await fetch(params.imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const extension = params.imageUri.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'jpg';
  const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
  const base64 = arrayBufferToBase64(arrayBuffer);

  const plantContext = [
    `Plant nickname: ${params.plantNickname}`,
    params.speciesName ? `Known species: ${params.speciesName}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `You are a plant health expert. Analyze this plant photo and return ONLY valid JSON matching the schema.

${plantContext}

Evaluate visible health indicators (leaf color, wilting, pests, rot, growth). Score health from 0-100 where 100 is perfect health.
Generate practical care instructions tailored to what you see and the identified species.

Return JSON with:
- health_score: integer 0-100
- health_status: short friendly status (e.g. "Looking good", "Needs water", "Signs of stress")
- species_name: scientific name if identifiable, else null
- species_common_name: common name if identifiable, else null
- care: object with light, water, soil, potting, feeding, temperature (each a concise instruction string)
- observations: one sentence summary of what you observed`;

  const apiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      }),
    },
  );

  const rawResponse = await apiResponse.json();

  if (!apiResponse.ok) {
    const message =
      typeof rawResponse?.error?.message === 'string'
        ? rawResponse.error.message
        : 'Gemini analysis failed';
    throw new Error(message);
  }

  const text =
    rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text ??
    rawResponse?.candidates?.[0]?.content?.parts?.find(
      (part: { text?: string }) => typeof part.text === 'string',
    )?.text;

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Could not parse AI health analysis');
  }

  return {
    analysis: parseAnalysisPayload(parsed),
    rawResponse,
  };
}
