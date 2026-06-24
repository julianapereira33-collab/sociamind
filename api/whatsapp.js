// api/whatsapp.js — Envio via Zapi (WhatsApp)

const INSTANCE_ID  = process.env.ZAPI_INSTANCE_ID  || "3F41BD43559D418792AB0E6CB8567DC3";
const TOKEN        = process.env.ZAPI_TOKEN         || "E46271A589D038023754FAAE";
const CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN  || "";
const DEFAULT_PHONE = "5514996795653"; // número aprovação padrão

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Campo message obrigatório' });
  }

  const phoneClean = (phone || DEFAULT_PHONE).replace(/\D/g, '');

  const zapiUrl = `https://api.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`;

  const headers = { 'Content-Type': 'application/json' };
  if (CLIENT_TOKEN) headers['Client-Token'] = CLIENT_TOKEN;

  try {
    const zapiRes = await fetch(zapiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: phoneClean, message }),
    });

    const data = await zapiRes.json();

    if (!zapiRes.ok || data.error) {
      return res.status(400).json({ error: data.error || 'Erro Zapi', details: data });
    }

    return res.status(200).json({ success: true, messageId: data.zaapId || data.id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
