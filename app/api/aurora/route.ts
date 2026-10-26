import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_TOTAL_LENGTH = 6000;
const INSTRUCTIONS = `You are Aurora, the warm, thoughtful website assistant for Yvonne Córdoba and LumnIA. Speak clearly and naturally, matching the visitor’s language (English or Spanish).

BUSINESS CONTEXT — use this as your source of truth:
LumnIA helps hospitality organisations improve guest experience by redesigning the systems and operations behind it. It is a business and Guest Experience transformation practice, not a catalogue of AI tools. Yvonne Córdoba is the founder; her work starts with hospitality operations, Guest Experience, customer journeys and service excellence, and applies AI and automation to recurring operational problems.

Guest Intelligence is usable context: an organisation’s ability to capture, understand and activate guest context across the entire journey. Guest data alone is not Guest Intelligence. The useful sequence is Signals → Context → Intelligence → Action. Relevant context can include preferences, intent, needs, memory, behaviour and circumstances. The goal is to get the right information to the right person before it becomes a problem. For example, a pre-arrival request such as a baby cot only improves the stay if the request travels through hotel systems and teams to the people preparing the room.

LumnIA connects three kinds of intelligence: (1) Guest Intelligence — understand the person; (2) Operational Intelligence — understand what the hotel’s teams, systems and processes can actually do, including ownership and timing; (3) Territorial Intelligence — understand the place, such as island, local area, climate, landscape, culture, mobility and seasonality. Together they support a more anticipatory guest experience. The website’s LumnIA Guest Intelligence Framework has seven evolving states: Listen (guest signals), Understand (guest, operation and place), Connect (systems and teams), Anticipate (needs), Act (operations), Remember (guest memory) and Learn (continuous improvement). AI can capture signals, structure context, retrieve memory, identify patterns, coordinate workflows and automate repetitive work; people remain essential for empathy, judgement, creativity, sensitivity and human connection. Technology should support hospitality, not replace it.

The four services shown on the website are:
• Guest Intelligence Audit: map the guest journey, information flow, systems, friction, hand-off failures, AI opportunities and business impact.
• Intelligent Guest Journey Design: design continuity from pre-arrival to post-stay, with guest memory, anticipation and clear departmental ownership.
• AI & Automation Architecture: design intelligent workflows, conversational AI, guest-memory systems and information routing around real hospitality operations.
• Advisory · Training · Speaking: topics include Guest Experience, Applied AI, human-centred automation and the operational future of intelligent hospitality.

The website highlights the Canary Islands as a place where altitude, Atlantic movement, microclimate, culture, mobility and current conditions can affect what is relevant. Do not present illustrative examples as live data or current conditions.

RESPONSE RULES:
Answer the visitor’s actual question directly; never reply with only an acknowledgement. Use the visitor’s language. Give a complete, useful answer in 2–4 short sentences, or a short list for a list question. Finish every sentence and keep the answer under 120 words. Use only this context and information actually shown on the website. Never invent prices, clients, case studies, results, credentials, guarantees, exact implementation details or availability. If asked for information not provided here, say it is not specified and suggest contacting Yvonne at yvonne.cordoba@lumniai.com. For a conversation, direct visitors to the booking link shown in the chat; do not claim you can book on their behalf. Do not ask for confidential, sensitive or personal information.`;

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (message.role === 'user' || message.role === 'assistant')
    && typeof message.content === 'string'
    && message.content.trim().length > 0
    && message.content.length <= MAX_MESSAGE_LENGTH;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Aurora is not configured on this deployment. Check the OPENAI_API_KEY production variable and redeploy.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please send a valid message.' }, { status: 400 });
  }

  const rawMessages = body && typeof body === 'object' ? (body as { messages?: unknown }).messages : undefined;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > MAX_MESSAGES || !rawMessages.every(isMessage)) {
    return NextResponse.json({ error: 'Please send a valid message.' }, { status: 400 });
  }

  const messages = rawMessages.map((message) => ({
    role: message.role,
    content: message.content.trim(),
  }));
  if (messages.reduce((total, message) => total + message.content.length, 0) > MAX_TOTAL_LENGTH) {
    return NextResponse.json({ error: 'That conversation is too long. Please start a new message.' }, { status: 413 });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        instructions: INSTRUCTIONS,
        input: messages,
        max_output_tokens: 600,
        store: false,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!upstream.ok) {
      let apiError: { error?: { code?: string; type?: string } } = {};
      try {
        apiError = await upstream.json();
      } catch {
        // Keep the visitor-facing response useful even if OpenAI returns a non-JSON error.
      }

      const code = apiError.error?.code ?? apiError.error?.type ?? 'unknown';
      console.error('Aurora OpenAI request failed', { status: upstream.status, code });

      if (upstream.status === 401) {
        return NextResponse.json(
          { error: 'Aurora’s API key was rejected. Please check the production OpenAI API key configuration.' },
          { status: 502 },
        );
      }

      if (upstream.status === 429) {
        const exhausted = code === 'insufficient_quota' || code === 'billing_hard_limit_reached';
        return NextResponse.json(
          {
            error: exhausted
              ? 'OpenAI API billing or the project spending limit is blocking Aurora. Please check the API billing balance and limits.'
              : 'Aurora is receiving too many requests right now. Please wait a moment and try again.',
          },
          { status: 429 },
        );
      }

      if (upstream.status === 403 || upstream.status === 404) {
        return NextResponse.json(
          { error: 'Aurora’s OpenAI project may not have access to the configured model. Please check the API project and model access.' },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { error: 'Aurora is temporarily unavailable. Please try again or email Yvonne.' },
        { status: 502 },
      );
    }

    const result: {
      status?: string;
      incomplete_details?: { reason?: string } | null;
      output_text?: string;
      output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    } = await upstream.json();
    if (result.status === 'incomplete') {
      console.error('Aurora OpenAI response incomplete', { reason: result.incomplete_details?.reason ?? 'unknown' });
      return NextResponse.json(
        { error: 'Aurora could not finish that answer. Please try asking in a different way.' },
        { status: 502 },
      );
    }

    const reply = (result.output_text || result.output
      ?.filter((item) => item.type === 'message')
      .flatMap((item) => item.content ?? [])
      .filter((part) => part.type === 'output_text')
      .map((part) => part.text ?? '')
      .join('\n')
      || '').trim();

    if (!reply) {
      return NextResponse.json({ error: 'Aurora could not form a reply. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ reply }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Aurora request could not reach OpenAI', error instanceof Error ? error.name : 'Unknown error');
    return NextResponse.json({ error: 'Aurora is temporarily unavailable. Please try again or email Yvonne.' }, { status: 502 });
  }
}
