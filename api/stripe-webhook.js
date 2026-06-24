// api/stripe-webhook.js — processa eventos do Stripe e atualiza Supabase
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabase = createClient(
  process.env.SUPABASE_URL       || '',
  process.env.SUPABASE_SERVICE_KEY || ''  // service role — bypass RLS
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function updateOrg(orgId, patch) {
  await supabase.from('organizations').update(patch).eq('id', orgId);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const raw = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const obj = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      const orgId  = obj.metadata?.orgId;
      const planId = obj.metadata?.planId;
      if (orgId && planId) {
        await updateOrg(orgId, {
          plan_id: planId,
          stripe_customer_id: obj.customer,
          stripe_subscription_id: obj.subscription,
          subscription_status: 'active',
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const status = obj.status; // active | trialing | past_due | canceled | unpaid
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('stripe_subscription_id', obj.id)
        .single();

      if (org) {
        await updateOrg(org.id, {
          subscription_status: status,
          plan_id: status === 'canceled' || status === 'unpaid' ? 'free' : undefined,
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('stripe_customer_id', obj.customer)
        .single();
      if (org) await updateOrg(org.id, { subscription_status: 'past_due' });
      break;
    }
  }

  return res.status(200).json({ received: true });
}
