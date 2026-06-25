import { useState } from "react";
import { supabase } from "./supabase.js";
import { getMode, getTokens, getGradients } from "./design.js";

const h = new Date().getHours();
const mode = h >= 6 && h < 18 ? "light" : "dark";
const T = getTokens(mode);
const G = getGradients(T);
const C = { ...T, muted: T.textMuted, border2: T.border };

const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
  background: C.surf, color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none",
  boxSizing: "border-box",
};

const PLANS = [
  {
    id: "solo", name: "Solo", cor: "#10b981",
    preco: { mensal: "R$ 197", semestral: "R$ 177" },
    semestralTotal: "R$ 1.064",
    limits: "Para empreendedores solo",
    features: [
      "1 marca / empresa",
      "3 redes sociais",
      "3 posts por semana (IA)",
      "1 scanner por mês",
      "Estratégia mensal",
      "Aprovações pelo app",
      "Alertas WhatsApp",
      "Relatório básico",
    ],
    cta: "Começar 7 dias grátis",
  },
  {
    id: "negocio", name: "Negócio", cor: T.primaryL, destaque: true,
    preco: { mensal: "R$ 497", semestral: "R$ 447" },
    semestralTotal: "R$ 2.684",
    limits: "Para negócios em crescimento",
    features: [
      "1 marca / empresa",
      "5 redes (incl. LinkedIn e TikTok)",
      "7 posts por semana (IA)",
      "3 scanners por mês / rede",
      "Estratégia semanal + quinzenal",
      "Briefing de marca ✓",
      "Campanhas WhatsApp (c/ limite)",
      "Aprovação app + WhatsApp",
      "Painel de respostas nas redes",
      "Relatório avançado",
      "2 usuários",
    ],
    cta: "Começar 7 dias grátis",
  },
  {
    id: "agencia", name: "Agência", cor: "#f59e0b",
    preco: { mensal: "R$ 997", semestral: "R$ 897" },
    semestralTotal: "R$ 5.384",
    limits: "Para agências digitais",
    features: [
      "1 cliente (recursos ilimitados)",
      "Redes sociais ilimitadas",
      "Posts ilimitados",
      "5 scanners / mês por rede",
      "Estratégia semanal/quinzenal/mensal",
      "Briefing de marca ✓",
      "Campanhas email + WhatsApp",
      "Aprovação automática ✓",
      "Automação de respostas nas redes",
      "White-label (cores + logo do cliente)",
      "Relatório executivo com estratégia",
      "3 usuários · Suporte prioritário",
    ],
    cta: "Começar 7 dias grátis",
  },
  {
    id: "agent_secret", name: "Agent Secret", cor: "#8b5cf6",
    preco: { mensal: "R$ 3.597", semestral: "R$ 3.237" },
    semestralTotal: "R$ 19.424",
    limits: "Operação full-auto com agente IA",
    features: [
      "1 empresa principal · tudo ilimitado",
      "Todas as redes sociais",
      "Posts e scanners ilimitados",
      "Estratégia automática (IA)",
      "Agente IA responde clientes no WhatsApp",
      "Secretaria IA para pedidos urgentes",
      "Campanhas email + WhatsApp ilimitadas",
      "Automação completa de respostas",
      "White-label completo",
      "Usuários ilimitados",
      "Onboarding dedicado · SLA garantido",
    ],
    cta: "Falar com a equipe",
  },
];

export default function Auth({ onAuth }) {
  const [view, setView] = useState("landing"); // landing | login | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [billing, setBilling] = useState("mensal");

  async function signIn(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    else onAuth?.();
    setLoading(false);
  }

  async function signUp(e) {
    e.preventDefault();
    if (!name || !company || !email || !password) { setError("Preencha todos os campos"); return; }
    if (password.length < 6) { setError("Senha mínimo 6 caracteres"); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, company_name: company } },
    });
    if (err) setError(err.message);
    else { setMsg("✅ Verifique seu e-mail para confirmar o cadastro!"); setView("login"); }
    setLoading(false);
  }

  async function forgotPassword(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?reset=1`,
    });
    if (err) setError(err.message);
    else setMsg("📧 Link de redefinição enviado para seu e-mail!");
    setLoading(false);
  }

  // ── LANDING ─────────────────────────────────────────────────
  if (view === "landing") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* HERO */}
      <div style={{ background: G.glow, borderBottom: `1px solid ${T.primary}20`, padding: "0 24px" }}>
        {/* Nav */}
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-metamorfose.png" alt="" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 18, background: G.hero, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Social Mid IA</span>
            <span style={{ fontSize: 10, background: `${T.primary}20`, color: T.primaryL, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>by Metamorfose</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setView("login")} style={{ background: "none", border: `1px solid ${C.border}`, color: C.text, padding: "8px 18px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Entrar</button>
            <button onClick={() => setView("signup")} style={{ background: G.primary, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: `0 4px 18px ${T.primary}40` }}>Criar conta grátis</button>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "70px 0 80px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: T.primaryL, textTransform: "uppercase", marginBottom: 16 }}>Gestão de Redes Sociais com IA</div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: G.hero, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Sua agência de<br />social media no piloto automático
          </h1>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 620, margin: "0 auto 36px" }}>
            Scanner estratégico, criação de conteúdo, aprovação via WhatsApp, agendamento e campanhas — tudo em um SaaS movido por inteligência artificial.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: G.primary, color: "#fff", border: "none", padding: "14px 32px", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, boxShadow: `0 6px 30px ${T.primary}50` }}>
              ✨ Ver planos — 7 dias grátis
            </button>
            <button onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: C.surf, color: C.text, border: `1px solid ${C.border}`, padding: "14px 28px", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
              Ver planos
            </button>
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: C.muted }}>7 dias grátis com cartão • Cancele antes sem cobrança • Planos a partir de R$ 197/mês</div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: T.primaryL, textTransform: "uppercase", marginBottom: 10 }}>O que você ganha</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text }}>Tudo que uma agência precisaria — por uma fração do custo</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🔍", title: "Scanner IA", desc: "Analisa qualquer perfil e gera diagnóstico completo de posicionamento, personas, produtos e estratégia." },
            { icon: "✍️", title: "Criação de Conteúdo", desc: "Descreva o briefing. A IA gera roteiro → você aprova → post completo com legenda, hook e hashtags." },
            { icon: "📱", title: "Aprovação via WhatsApp", desc: "Envie o conteúdo para aprovação do cliente diretamente no WhatsApp, sem sair do sistema." },
            { icon: "📅", title: "Calendário Editorial", desc: "Geração de programação semanal completa com IA baseada na estratégia e nos públicos cadastrados." },
            { icon: "📢", title: "Campanhas de Marketing", desc: "Disparos em massa via WhatsApp, e-mail e LinkedIn com textos gerados por IA." },
            { icon: "📊", title: "Dashboard de Resultados", desc: "Acompanhe seguidores, alcance, engajamento e performance das campanhas em um painel unificado." },
          ].map(f => (
            <div key={f.title} style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ background: C.surf, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: T.primaryL, textTransform: "uppercase", marginBottom: 10 }}>Planos e Preços</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 8 }}>Simples, transparente e sem surpresas</h2>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>Todos os planos incluem 7 dias de trial gratuito — cartão necessário para garantir o acesso</div>
            {/* Toggle mensal/semestral */}
            <div style={{ display: "inline-flex", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 30, padding: 4, gap: 4 }}>
              {["mensal", "semestral"].map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 22px", borderRadius: 26, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: billing === b ? G.primary : "transparent", color: billing === b ? "#fff" : C.muted, transition: "all .2s" }}>
                  {b === "mensal" ? "Mensal" : "Semestral"}{b === "semestral" && <span style={{ fontSize: 10, marginLeft: 6, background: "#10b98120", color: "#10b981", padding: "2px 6px", borderRadius: 10, fontWeight: 800 }}>-10%</span>}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ background: p.destaque ? `${T.primary}08` : C.bg, border: `2px solid ${p.destaque ? T.primary : C.border}`, borderRadius: 20, padding: "28px 22px", position: "relative", display: "flex", flexDirection: "column" }}>
                {p.destaque && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: G.primary, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 18px", borderRadius: 20, whiteSpace: "nowrap" }}>✦ MAIS POPULAR</div>}
                <div style={{ fontSize: 12, fontWeight: 800, color: p.cor, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: C.text }}>{p.preco[billing]}</span>
                  <span style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>/mês</span>
                </div>
                {billing === "semestral" && (
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Total: {p.semestralTotal} · cobrado semestralmente</div>
                )}
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>{p.limits}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: 12, color: C.text, display: "flex", gap: 7, alignItems: "flex-start", lineHeight: 1.5 }}>
                      <span style={{ color: p.cor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setView("signup")} style={{ width: "100%", background: p.destaque ? G.primary : C.surf, color: p.destaque ? "#fff" : C.text, border: p.destaque ? "none" : `1px solid ${C.border}`, padding: "12px", borderRadius: 11, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: p.destaque ? `0 4px 20px ${T.primary}40` : "none" }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.muted }}>
            💳 Cartão necessário para o trial · Cancele antes dos 7 dias sem cobrança · Sem taxas ocultas
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo-metamorfose.png" alt="" style={{ width: 24, height: 24, borderRadius: 4 }} />
          <span style={{ fontSize: 13, color: C.muted }}>Social Mid IA © 2025 — by Metamorfose</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.muted }}>
          <span style={{ cursor: "pointer" }}>Termos de Uso</span>
          <span style={{ cursor: "pointer" }}>Privacidade</span>
          <span style={{ cursor: "pointer" }}>Suporte</span>
        </div>
      </div>
    </div>
  );

  // ── FORM (Login / Signup / Forgot) ──────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo-metamorfose.png" alt="" style={{ width: 52, height: 52, borderRadius: 12, marginBottom: 12 }} />
          <div style={{ fontWeight: 800, fontSize: 22, background: G.hero, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Social Mid IA</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            {view === "login" ? "Entre na sua conta" : view === "signup" ? "Crie sua conta gratuita" : "Redefinir senha"}
          </div>
        </div>

        <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 18, padding: "28px 28px" }}>
          {msg && <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#10b981", marginBottom: 18 }}>{msg}</div>}
          {error && <div style={{ background: "#FF444415", border: "1px solid #FF444430", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#FF7070", marginBottom: 18 }}>{error}</div>}

          {/* SIGNUP */}
          {view === "signup" && <form onSubmit={signUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Seu nome</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="João Silva" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Nome da empresa / marca</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Minha Empresa LTDA" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@empresa.com" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} required />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Mínimo 6 caracteres</div>
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? C.surf : G.primary, color: loading ? C.muted : "#fff", border: "none", padding: "13px", borderRadius: 11, cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 14, marginTop: 4, boxShadow: `0 4px 20px ${T.primary}40` }}>
              {loading ? "Criando conta…" : "Criar conta gratuita →"}
            </button>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>Ao criar conta você concorda com os Termos de Uso e Política de Privacidade</div>
          </form>}

          {/* LOGIN */}
          {view === "login" && <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@empresa.com" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} required />
            </div>
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <span onClick={() => setView("forgot")} style={{ fontSize: 12, color: T.primaryL, cursor: "pointer" }}>Esqueci minha senha</span>
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? C.surf : G.primary, color: loading ? C.muted : "#fff", border: "none", padding: "13px", borderRadius: 11, cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 14, boxShadow: `0 4px 20px ${T.primary}40` }}>
              {loading ? "Entrando…" : "Entrar →"}
            </button>
          </form>}

          {/* FORGOT */}
          {view === "forgot" && <form onSubmit={forgotPassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>Seu e-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@empresa.com" style={inp} required />
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? C.surf : G.primary, color: loading ? C.muted : "#fff", border: "none", padding: "13px", borderRadius: 11, cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 14 }}>
              {loading ? "Enviando…" : "Enviar link de redefinição"}
            </button>
          </form>}

          {/* Switch */}
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: C.muted }}>
            {view === "login" && <>Não tem conta? <span onClick={() => { setView("signup"); setError(""); setMsg(""); }} style={{ color: T.primaryL, cursor: "pointer", fontWeight: 600 }}>Criar conta grátis</span></>}
            {view === "signup" && <>Já tem conta? <span onClick={() => { setView("login"); setError(""); setMsg(""); }} style={{ color: T.primaryL, cursor: "pointer", fontWeight: 600 }}>Entrar</span></>}
            {view === "forgot" && <span onClick={() => { setView("login"); setError(""); setMsg(""); }} style={{ color: T.primaryL, cursor: "pointer" }}>← Voltar ao login</span>}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span onClick={() => setView("landing")} style={{ fontSize: 12, color: C.muted, cursor: "pointer" }}>← Ver a landing page</span>
        </div>
      </div>
    </div>
  );
}
