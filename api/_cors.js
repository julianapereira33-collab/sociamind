// api/_cors.js — CORS restrito, em vez do '*' que estava antes (qualquer
// site podia chamar nossas functions a partir do navegador de um usuário).
// ALLOWED_ORIGINS: lista separada por vírgula, configurável por env var.
const DEFAULT_ORIGINS = [
  'https://sociamind.vercel.app',
  'http://localhost:5173', // vite dev
];

export function allowCors(req, res) {
  const configured = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = configured.length > 0 ? configured : DEFAULT_ORIGINS;

  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
