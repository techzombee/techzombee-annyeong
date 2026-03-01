// Transcript fetching is handled server-side (Firebase Cloud Function wrapping youtube-transcript-api).
// This module calls that endpoint.

const CLOUD_FUNCTION_URL = process.env.EXPO_PUBLIC_CLAUDE_FUNCTION_URL;

export interface TranscriptLine {
  text: string;
  start: number; // seconds
  duration: number;
}

export async function fetchTranscript(videoId: string, idToken: string): Promise<TranscriptLine[]> {
  const res = await fetch(`${CLOUD_FUNCTION_URL}/transcript?videoId=${videoId}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!res.ok) {
    throw new Error(`Transcript function error: ${res.status}`);
  }

  return res.json();
}
