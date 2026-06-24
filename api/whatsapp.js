// api/whatsapp.js — Envio de mensagens via Zapi (WhatsApp)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    instanceId,   // ID da instância Zapi
    token,        // Token da instância Zapi
    clientToken,  // Client-Token (Security Token)
    phone,        // Número do destinatário (ex: 5514999999999)
    message,      // Texto da mensagem
    type = 'text' // text | image | document
  } = req.body;

  if (!instanceId || !token || !clientToken || !phone || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios: instanceId, token, clientToken, phone, message' });
  }

  // Remove tudo que não é número
  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) {
    return res.status(400).json({ error: 'Número de telefone inválido' });
  }

  const zapiUrl = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;

  try {
    const zapiRes = await fetch(zapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': clientToken,
      },
      body: JSON.stringify({
        phone: phoneClean,
        message,
      }),
    });

    const data = await zapiRes.json();

    if (!zapiRes.ok || data.error) {
      return res.status(400).json({ error: data.error || 'Erro ao enviar pelo Zapi', details: data });
    }

    return res.status(200).json({ success: true, messageId: data.zaapId || data.id, data });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
