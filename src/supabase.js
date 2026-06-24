import { createClient } from '@supabase/supabase-js';

const URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const ANON = import.meta.env.VITE_SUPABASE_ANON || '';

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: true, autoRefreshToken: true },
});

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
