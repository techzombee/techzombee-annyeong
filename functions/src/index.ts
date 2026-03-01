import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

admin.initializeApp();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Auth middleware ──────────────────────────────────────────────────────────

async function verifyToken(req: functions.https.Request): Promise<admin.auth.DecodedIdToken> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new functions.https.HttpsError('unauthenticated', 'Missing auth token');
  return admin.auth().verifyIdToken(token);
}

// ─── /nuance ─────────────────────────────────────────────────────────────────
// POST { phrase: string, context: string }
// Returns { explanation: string }

export const nuance = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }

  try {
    await verifyToken(req);
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { phrase, context } = req.body as { phrase: string; context: string };
  if (!phrase) { res.status(400).json({ error: 'phrase is required' }); return; }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a Korean language teacher helping English speakers understand Korean nuances.

The student is watching a Korean video and tapped this phrase:
"${phrase}"

Surrounding context:
"${context}"

Explain in 2–4 sentences:
1. What this phrase means naturally (not just literal translation)
2. The cultural nuance or tone (formal, casual, sarcastic, affectionate, etc.)
3. When a Korean person would say this

Be concise and beginner-friendly.`,
      },
    ],
  });

  const explanation = (message.content[0] as { type: string; text: string }).text;
  res.json({ explanation });
});

// ─── /transcript ─────────────────────────────────────────────────────────────
// GET ?videoId=<id>
// Returns TranscriptLine[]
// NOTE: youtube-transcript-api is Python — this uses a lightweight JS alternative.

export const transcript = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') { res.status(405).send('Method Not Allowed'); return; }

  try {
    await verifyToken(req);
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const videoId = req.query['videoId'] as string;
  if (!videoId) { res.status(400).json({ error: 'videoId is required' }); return; }

  // Fetch transcript via YouTube's timedtext API (no API key needed)
  const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
  const listRes = await fetch(listUrl);
  const listText = await listRes.text();

  // Try Korean track first, fall back to first available
  const langMatch = listText.match(/lang_code="ko"/) ? 'ko' : (listText.match(/lang_code="([^"]+)"/) ?? [])[1] ?? 'en';
  const transcriptUrl = `https://www.youtube.com/api/timedtext?lang=${langMatch}&v=${videoId}&fmt=json3`;
  const transcriptRes = await fetch(transcriptUrl);

  if (!transcriptRes.ok) {
    res.status(502).json({ error: 'Could not fetch transcript' });
    return;
  }

  const data = await transcriptRes.json() as {
    events?: Array<{ tStartMs: number; dDurationMs: number; segs?: Array<{ utf8: string }> }>;
  };

  const lines = (data.events ?? [])
    .filter((e) => e.segs)
    .map((e) => ({
      text: (e.segs ?? []).map((s) => s.utf8).join('').replace(/\n/g, ' ').trim(),
      start: e.tStartMs / 1000,
      duration: e.dDurationMs / 1000,
    }))
    .filter((l) => l.text.length > 0);

  res.json(lines);
});
