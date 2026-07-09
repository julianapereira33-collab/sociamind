// api/whatsapp.js — Envio via Zapi (WhatsApp)
import { requireAuth } from './_auth.js';
import { allowCors } from './_cors.js';

// SEM fallback hardcoded de propósito: essas eram credenciais reais do Zapi
// commitadas no código (mesmo instance/token já flagado como exposto em
// outros lugares do ecossistema). Configure via env var no Vercel.
const INSTANCE_ID  = process.env.ZAPI_INSTANCE_ID  || "";
const TOKEN        = process.env.ZAPI_TOKEN         || "";
const CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN  || "";
const DEFAULT_PHONE = process.env.ZAPI_DEFAULT_PHONE || "";

export default async function handler(req, res) {
  allowCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  if (!INSTANCE_ID || !TOKEN) {
    return res.status(500).json({ error: 'ZAPI_INSTANCE_ID / ZAPI_TOKEN não configurados no Vercel' });
  }

  const { phone, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Campo message obrigatório' });
  }
  if (!phone && !DEFAULT_PHONE) {
    return res.status(400).json({ error: 'Campo phone obrigatório (ZAPI_DEFAULT_PHONE não configurado)' });
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
