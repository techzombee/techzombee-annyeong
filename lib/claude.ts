// Claude API calls must go through a Firebase Cloud Function — never call directly from client.
// This module calls the deployed Cloud Function endpoint.

const CLOUD_FUNCTION_URL = process.env.EXPO_PUBLIC_CLAUDE_FUNCTION_URL;

export interface NuanceRequest {
  phrase: string;
  context: string; // surrounding transcript text
}

export interface NuanceResponse {
  explanation: string;
}

export async function fetchNuance(req: NuanceRequest, idToken: string): Promise<NuanceResponse> {
  const res = await fetch(`${CLOUD_FUNCTION_URL}/nuance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`Claude function error: ${res.status}`);
  }

  return res.json();
}
