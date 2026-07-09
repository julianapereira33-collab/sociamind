import { createClient } from '@supabase/supabase-js';

const URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const ANON = import.meta.env.VITE_SUPABASE_ANON || '';

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Wrapper de fetch pras nossas Vercel Functions (/api/*) — sempre anexa o
// access_token da sessão Supabase atual como Bearer. As functions do lado
// servidor validam esse token antes de gastar crédito de IA/WhatsApp/imagem
// (ver api/_auth.js) — sem isso, qualquer pessoa com a URL podia chamar
// esses endpoints direto e gerar custo sem estar logada.
export async function apiFetch(path, body) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

// ── Helpers de org data ──────────────────────────────────────

export async function getOrgData(orgId) {
  const { data } = await supabase
    .from('organizations')
    .select('data, plan_id, subscription_status, settings')
    .eq('id', orgId)
    .single();
  return data;
}

export async function saveOrgData(orgId, patch) {
  const { data: current } = await supabase
    .from('organizations')
    .select('data')
    .eq('id', orgId)
    .single();

  const merged = { ...(current?.data || {}), ...patch };
  await supabase
    .from('organizations')
    .update({ data: merged, updated_at: new Date().toISOString() })
    .eq('id', orgId);
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', userId)
    .single();
  return data;
}

// ── Planos ───────────────────────────────────────────────────

export async function getPlans() {
  const { data } = await supabase
    .from('plans')
    .select('*')
    .eq('active', true)
    .order('price_brl');
  return data || [];
}

// ── Integrações ──────────────────────────────────────────────

export async function getIntegrations(orgId) {
  const { data } = await supabase
    .from('integrations')
    .select('platform, credentials')
    .eq('organization_id', orgId);
  if (!data) return {};
  return data.reduce((acc, row) => ({ ...acc, [row.platform]: row.credentials }), {});
}

export async function saveIntegration(orgId, platform, credentials) {
  await supabase
    .from('integrations')
    .upsert(
      { organization_id: orgId, platform, credentials, updated_at: new Date().toISOString() },
      { onConflict: 'organization_id,platform' }
    );
}

// ── Uso / limites ────────────────────────────────────────────

export async function checkLimit(orgId, planLimits, resource) {
  const month = new Date().toISOString().slice(0, 7);
  const limit = planLimits?.[resource] ?? 0;
  if (limit === -1) return { allowed: true, used: 0, limit: -1 };

  const { data } = await supabase
    .from('usage')
    .select(`${resource}_count`)
    .eq('org_id', orgId)
    .eq('month', month)
    .single();

  const used = data?.[`${resource}_count`] || 0;
  return { allowed: used < limit, used, limit };
}

export async function incrementUsage(orgId, resource) {
  const month = new Date().toISOString().slice(0, 7);
  await supabase.rpc('increment_usage', { p_org_id: orgId, p_month: month, p_resource: resource });
}
