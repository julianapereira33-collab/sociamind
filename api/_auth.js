// api/_auth.js — valida o usuário logado antes de endpoints que gastam
// crédito de API (Anthropic, OpenAI, Zapi). Sem isso, qualquer pessoa com
// a URL do endpoint podia chamar direto (CORS estava '*', sem checagem
// nenhuma) e gerar custo em nome da conta, mesmo sem estar logada no app.
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Retorna o usuário autenticado, ou null se o token for ausente/inválido.
export async function getAuthedUser(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

// Uso: `const user = await requireAuth(req, res); if (!user) return;`
// Já escreve a resposta 401 e retorna null se não autenticado.
export async function requireAuth(req, res) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Sem Supabase configurado no ambiente, não dá pra validar — falha
    // fechada (nega acesso) em vez de aberta, mesmo que isso quebre o
    // endpoint até a env var ser configurada. Preferível a deixar aberto.
    res.status(500).json({ error: 'Autenticação não configurada no servidor (SUPABASE_URL/SUPABASE_SERVICE_KEY ausentes)' });
    return null;
  }
  const user = await getAuthedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Não autenticado — faça login novamente' });
    return null;
  }
  return user;
}
