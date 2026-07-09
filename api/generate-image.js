// api/generate-image.js — Geração de imagem via OpenAI GPT Image 1
import { requireAuth } from './_auth.js';
import { allowCors } from './_cors.js';

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export default async function handler(req, res) {
  allowCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { prompt, n = 3, size = "1024x1024", quality = "high" } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt obrigatório' });
  if (!OPENAI_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY não configurada' });

  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n,
        size,
        quality,
      }),
    });

    const data = await r.json();

    if (!r.ok || data.error) {
      return res.status(400).json({ error: data.error?.message || "Erro OpenAI", details: data });
    }

    const images = data.data.map(d => ({
      b64: d.b64_json,
      url: d.url || null,
    }));

    return res.status(200).json({ images });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
