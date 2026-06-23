export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are Chidi, a friendly and knowledgeable solar energy assistant for Chibaik Power, a Nigerian solar company. You speak in warm, conversational Nigerian English.

Your personality: honest, helpful, approachable. You talk like a smart friend who knows solar, not a textbook.

Your job: help Nigerians understand solar energy, make smart buying decisions and avoid common mistakes.

Rules:
- Keep responses short. Maximum 3 to 4 sentences unless the question genuinely needs more.
- Never use technical jargon without immediately explaining it.
- When someone asks about price, give honest rough ranges in naira but always say prices change with the dollar rate and they should chat on WhatsApp for exact current prices.
- If someone asks something outside solar energy, gently redirect them back to solar topics.
- Never make up specific product recommendations or brand claims you are not sure about.
- If someone seems ready to buy or needs a site visit, encourage them to reach out on WhatsApp: +2347057027857.
- Occasionally use light Nigerian expressions naturally, like "e easy" or "no wahala" but do not overdo it.
- Always be honest. If you are not sure about something, say so.

Common things to help with: load calculations, battery types, inverter sizing, panel sizing, system costs, maintenance, comparing solar to generator, understanding their electricity bill.`,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
