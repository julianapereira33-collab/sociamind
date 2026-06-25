// api/stripe-checkout.js — cria sessão de checkout Stripe
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const PRICES = {
  solo_mensal:          process.env.STRIPE_PRICE_SOLO_M      || '',
  negocio_mensal:       process.env.STRIPE_PRICE_NEGOCIO_M   || '',
  agencia_mensal:       process.env.STRIPE_PRICE_AGENCIA_M   || '',
  agent_secret_mensal:  process.env.STRIPE_PRICE_SECRET_M    || '',
  solo_semestral:       process.env.STRIPE_PRICE_SOLO_S      || '',
  negocio_semestral:    process.env.STRIPE_PRICE_NEGOCIO_S   || '',
  agencia_semestral:    process.env.STRIPE_PRICE_AGENCIA_S   || '',
  agent_secret_semestral: process.env.STRIPE_PRICE_SECRET_S  || '',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe não configurado' });
  }

  const { planId, billing = 'mensal', orgId, userId, email, successUrl, cancelUrl } = req.body;

  const priceKey = `${planId}_${billing}`;
  const priceId  = PRICES[priceKey];
  if (!priceId) return res.status(400).json({ error: `Preço não encontrado: ${priceKey}` });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: orgId,
      metadata: { orgId, userId, planId, billing },
      success_url: successUrl || `${req.headers.origin}/?checkout=success&plan=${planId}`,
      cancel_url:  cancelUrl  || `${req.headers.origin}/?checkout=cancel`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { orgId, planId },
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
