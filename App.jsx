import { useState, useEffect, useRef, useMemo } from "react";
import { storage } from "./src/storage.js";
import { getMode, getTokens, getGradients } from "./src/design.js";
import {
  Sparkles, ScanLine, Palette, Package, Users, FileText,
  Calendar, CalendarClock, Smartphone, Plug, Lock,
  LogOut, Save, ChevronLeft, Plus, Zap, BarChart2,
  CheckCircle, Clock, AlertCircle, XCircle, Send,
  Image, Megaphone, Settings, Eye, EyeOff, Trash2,
  Edit3, Star, TrendingUp, Globe, MessageSquare, Shield
} from "lucide-react";
// inp is defined inside App() as a useMemo
const FONT_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=Anton&family=Abril+Fatface&family=Oswald:wght@600&family=Playfair+Display:ital,wght@0,700;1,400&family=Merriweather:wght@700&family=Montserrat:wght@700&family=Poppins:wght@400;600;700&family=Raleway:wght@700&family=Josefin+Sans:wght@700&family=Nunito:wght@800&family=DM+Sans:wght@700&family=Dancing+Script:wght@700&family=Pacifico&family=Lobster&family=Sacramento&family=Cormorant+Garamond:wght@700&family=Libre+Baskerville:wght@700&display=swap";

// ─── Digital Network Background ───────────────────────────────────────────────
function DigitalBg({ T, opacity = 1 }) {
  const nodes = useMemo(() => {
    const pts = [];
    for (let x = 0; x <= 12; x++)
      for (let y = 0; y <= 8; y++)
        pts.push({ x: x * 100 + (Math.sin(x * y) * 18), y: y * 100 + (Math.cos(x + y) * 18) });
    return pts;
  }, []);

  const lines = useMemo(() => {
    const ls = [];
    nodes.forEach((a, i) => {
      nodes.slice(i + 1, i + 4).forEach(b => {
        const d = Math.hypot(b.x - a.x, b.y - a.y);
        if (d < 130) ls.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, op: 1 - d / 130 });
      });
    });
    return ls;
  }, [nodes]);

  const col = T.primary;
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: opacity * 0.18, pointerEvents: "none" }}>
      <defs>
        <radialGradient id="nglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={col} stopOpacity="0.9" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </radialGradient>
      </defs>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={col} strokeWidth="0.6" strokeOpacity={l.op * 0.6} />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i % 7 === 0 ? 3 : 1.5}
          fill={col} fillOpacity={i % 7 === 0 ? 0.7 : 0.35} />
      ))}
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_COMPANIES = [
  { id:"dasg",    name:"Das G",                  niche:"Lifestyle / Entretenimento", color:"#FF6B35", emoji:"🔥" },
  { id:"chacara", name:"Chácara Recanto Sereno",  niche:"Eventos / Natureza",         color:"#22C55E", emoji:"🌿" },
  { id:"trato",   name:"Trato Terraplanagem",     niche:"Construção / Serviços",      color:"#D97706", emoji:"🏗️" },
  { id:"meta",    name:"Metamorfose",             niche:"Bem-estar / Transformação",  color:"#A855F7", emoji:"🦋" },
  { id:"astral",  name:"Conexão Astral",          niche:"Espiritualidade / Info",     color:"#4F8CF7", emoji:"✨" },
  { id:"virada",  name:"A Virada",                niche:"Infoproduto / Educação",     color:"#FF4566", emoji:"🚀" },
];
const CANVA_FONTS = [
  { cat:"Display",  fonts:[{n:"Bebas Neue",p:"IMPACTO VISUAL"},{n:"Anton",p:"FORÇA E PESO"},{n:"Abril Fatface",p:"Elegância Bold"},{n:"Oswald",p:"CONDENSADO"}]},
  { cat:"Serif",    fonts:[{n:"Playfair Display",p:"Elegância Clássica"},{n:"Merriweather",p:"Refinado e Sólido"},{n:"Cormorant Garamond",p:"Alta Costura"},{n:"Libre Baskerville",p:"Autoridade"}]},
  { cat:"Moderna",  fonts:[{n:"Montserrat",p:"Versátil e Moderno"},{n:"Poppins",p:"Clean e Amigável"},{n:"Raleway",p:"Elegante e Leve"},{n:"Josefin Sans",p:"Geométrico"},{n:"Nunito",p:"Arredondado"},{n:"DM Sans",p:"Neutro Perfeito"},{n:"Space Grotesk",p:"Tech Contemporâneo"}]},
  { cat:"Script",   fonts:[{n:"Dancing Script",p:"Fluido e Pessoal"},{n:"Pacifico",p:"Alegre e Livre"},{n:"Lobster",p:"Dinâmico"},{n:"Sacramento",p:"Refinado"}]},
];
const COLOR_PRESETS = [
  {n:"Natureza",p:"#2D5016",s:"#8BC34A",a:"#F9A825"},{n:"Luxo",p:"#1A1A2E",s:"#C9A84C",a:"#E8E8E8"},
  {n:"Energia",p:"#C62828",s:"#FF8F00",a:"#212121"},{n:"Serenidade",p:"#1565C0",s:"#26C6DA",a:"#E3F2FD"},
  {n:"Feminino",p:"#AD1457",s:"#F48FB1",a:"#FCE4EC"},{n:"Espiritual",p:"#4527A0",s:"#9C27B0",a:"#FFD54F"},
  {n:"Tech",p:"#0D47A1",s:"#00BCD4",a:"#76FF03"},{n:"Terra",p:"#4E342E",s:"#8D6E63",a:"#FFCC02"},
  {n:"Ocean",p:"#006064",s:"#00ACC1",a:"#FFF59D"},{n:"Agência",p:"#07090F",s:"#FF4566",a:"#00CCA8"},
  {n:"Rosé Gold",p:"#880E4F",s:"#E91E8C",a:"#C8956C"},{n:"Moderno",p:"#1E1B4B",s:"#6366F1",a:"#FFFFFF"},
];
const OS_TYPES = ["Promoção","Lançamento","Evento","Aniversário","Post especial","Patrocinado","Reel específico","Story campanha","Sorteio","Oferta relâmpago","Outro"];
const OS_STATUS = { "Rascunho":"#5A7A9A","Criando":"#42A5F5","Ag. aprovação":"#A0C4FF","Alteração":"#E8890C","Aprovado":"#64B5F6","Agendado":"#9575CD","Publicado":"#10B981" };
const EMPTY_DATA = {
  nomeFantasia:"",slogan:"",responsavel:"",cargo:"",responsavelBio:"",
  logob64:"",fotoResponsavelb64:"",fotoCapa64:"",logoUrl:"",
  corPrimaria:"#FF4566",corSecundaria:"#00CCA8",corAcento:"#F5A623",
  fonteTitulo:"Montserrat",fonteCorpo:"Poppins",emojisOficiais:"",sentimentoMarca:"",descricaoBiotipo:"",
  cnpj:"",site:"",emailComercial:"",telefone:"",descricao:"",servicos:"",faixaPreco:"",
  endereco:"",bairro:"",cidade:"",estado:"SP",cep:"",linkMaps:"",
  historia:"",historiaFundador:"",missao:"",visao:"",valores:"",diferenciais:"",concorrentes:"",premios:"",depoimentos:"",
  // WhatsApp ecosystem
  waNome:"",waNumero:"",waBaId:"",waPhoneId:"",waApiToken:"",
  waCanais:[],waListas:[],waGrupos:[],
  // Outras redes
  igHandle:"",igUrl:"",igSeg:"",igFreq:"",igAutoPost:false,
  fbUrl:"",fbPageId:"",fbSeg:"",fbAutoPost:false,
  ttHandle:"",ttSeg:"",ttAutoPost:false,
  ytUrl:"",ytSeg:"",
  hashtags:"",hashtagsNunca:"",melhorConteudo:"",metaRedes:"",
  // Integrações
  metaAppId:"",metaSecret:"",metaPageToken:"",metaIgId:"",
  mcApiKey:"",mcBotId:"",mcFlows:"",
  canvaKitId:"",canvaFolder:"",n8nWebhook:"",superAgentesId:"",driveFolder:"",
  // Arrays
  produtos:[],publicos:[],perfilConteudo:[],ordens:[],agenda:[],
  cofre:[
    {s:"Google Account",e:"",p:"",n:""},
    {s:"Instagram",e:"",p:"",n:""},
    {s:"Facebook",e:"",p:"",n:""},
    {s:"TikTok",e:"",p:"",n:""},
    {s:"ManyChat",e:"",p:"",n:""},
    {s:"Canva",e:"",p:"",n:""},
    {s:"WhatsApp Business",e:"",p:"",n:""},
    {s:"Hospedagem",e:"",p:"",n:""},
  ],
};
const TABS = [
  {id:"gerar",      Icon:Sparkles,      label:"Gerar"},
  {id:"scanner",    Icon:ScanLine,      label:"Scanner"},
  {id:"identidade", Icon:Palette,       label:"Identidade"},
  {id:"produtos",   Icon:Package,       label:"Produtos"},
  {id:"publicos",   Icon:Users,         label:"Públicos"},
  {id:"conteudo",   Icon:FileText,      label:"Conteúdo"},
  {id:"calendario", Icon:Calendar,      label:"Agenda"},
  {id:"os",         Icon:CalendarClock, label:"Programados"},
  {id:"redes",      Icon:Smartphone,    label:"Redes"},
  {id:"integracoes",Icon:Plug,          label:"Integrações"},
  {id:"cofre",      Icon:Lock,          label:"Cofre"},
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,      setView]     = useState("login");
  const [companies, setCompanies]= useState(DEFAULT_COMPANIES);
  const [co,        setCo]       = useState(null);
  const [tab,       setTab]      = useState("identidade");
  const [form,      setForm]     = useState(EMPTY_DATA);
  const [saved,     setSaved]    = useState({});
  const [saving,    setSaving]   = useState(false);
  const [toast,     setToast]    = useState(null);
  const [showPw,    setShowPw]   = useState({});
  const [newCoForm, setNewCoForm]= useState(false);
  const [newCo,     setNewCo]   = useState({name:"",niche:"",color:"#1565C0",emoji:"🏢"});
  const [loggedIn,  setLoggedIn] = useState(false);
  const [mode,      setMode]     = useState(getMode);

  // Tokens dinâmicos por modo
  const T = useMemo(() => getTokens(mode), [mode]);
  const G = useMemo(() => { const g = getGradients(T); return { ...g, amber: g.primary, glow: g.glass }; }, [T]);
  const C = { ...T, muted:T.textMuted, hint:T.textMuted, gold:T.primaryXL, blue:T.primaryXL, surf4:T.surf3 };

  // Input base style
  const inp = useMemo(() => ({
    width:"100%", background: T.surf3, border:`1px solid ${T.border2}`,
    color: T.text, padding:"10px 13px", borderRadius:10,
    fontSize:13, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',system-ui,sans-serif",
    transition:"border-color .15s",
  }), [T]);

  // Atualiza modo a cada minuto
  useEffect(() => {
    const id = setInterval(() => setMode(getMode()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const lnk = document.createElement("link"); lnk.rel="stylesheet"; lnk.href=FONT_URL; document.head.appendChild(lnk);
    document.body.style.background = T.bg;
    const session = storage.get("sociamind-session");
    if(session) { setLoggedIn(true); setView("home"); }
    loadAll();
  }, []);

  // Atualiza background quando modo muda
  useEffect(() => { document.body.style.background = T.bg; }, [T]);

  function loadAll() {
    const r = storage.get("smvp-companies");
    if(r) setCompanies(JSON.parse(r.value));
    const s={};
    const list = r ? JSON.parse(r.value) : DEFAULT_COMPANIES;
    for(const c of list){
      const rc = storage.get(`smvp-${c.id}`);
      if(rc) s[c.id] = JSON.parse(rc.value);
    }
    setSaved(s);
  }

  function openCo(c) {
    setCo(c); setTab("identidade");
    let base={...EMPTY_DATA,nomeFantasia:c.name,corPrimaria:c.color};
    const r = storage.get(`smvp-${c.id}`);
    if(r) base={...base,...JSON.parse(r.value)};
    setForm(base); setView("company");
  }

  function save() {
    setSaving(true);
    try{
      storage.set(`smvp-${co.id}`, JSON.stringify(form));
      setSaved(p=>({...p,[co.id]:form}));
      flash("✓ Salvo com sucesso!","teal");
    }catch{ flash("Erro ao salvar","coral"); }
    setSaving(false);
  }

  function addCompany() {
    if(!newCo.name.trim()) return;
    const id=`co-${Date.now()}`;
    const c={id,name:newCo.name,niche:newCo.niche||"Novo negócio",color:newCo.color,emoji:newCo.emoji||"🏢"};
    const next=[...companies,c];
    setCompanies(next);
    storage.set("smvp-companies", JSON.stringify(next));
    setNewCo({name:"",niche:"",color:"#1565C0",emoji:"🏢"});
    setNewCoForm(false);
    flash(`✓ ${c.name} adicionada!`,"teal");
  }

  function flash(msg,type="teal"){ setToast({msg,type}); setTimeout(()=>setToast(null),2800); }
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleArr=(k,v)=>setForm(p=>({...p,[k]:(p[k]||[]).includes(v)?p[k].filter(x=>x!==v):[...(p[k]||[]),v]}));
  async function handleImg(field,file){ const r=new FileReader(); r.onload=e=>upd(field,e.target.result); r.readAsDataURL(file); }

  // ── Primitives ──────────────────────────────────────────────────────────────
  function F({label,help,req,children}){ return <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:4,letterSpacing:.5,textTransform:"uppercase"}}>{label}{req&&<span style={{color:T.primaryXL}}> *</span>}</label>{help&&<p style={{margin:"0 0 5px",fontSize:11,color:C.hint,lineHeight:1.4}}>{help}</p>}{children}</div>; }
  function I({k,ph,type="text"}){ return <input type={type} value={form[k]||""} onChange={e=>upd(k,e.target.value)} placeholder={ph} style={{...inp,fontFamily:"inherit"}} />; }
  function TA({k,ph,rows=3}){ return <textarea value={form[k]||""} onChange={e=>upd(k,e.target.value)} placeholder={ph} rows={rows} style={{...inp,resize:"vertical",lineHeight:1.6}} />; }
  function Sel({k,opts}){ return <select value={form[k]||""} onChange={e=>upd(k,e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Selecionar…</option>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>; }
  function G2({ch}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{ch}</div>; }
  function G3({ch}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{ch}</div>; }
  function Sec({title,accent,children}){ const ac=accent||T.primaryXL; return <div style={{marginBottom:22}}><div style={{fontSize:9,fontWeight:900,letterSpacing:3,background:accent?`linear-gradient(90deg,${accent},${T.primaryXL},#FFFFFF)`:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:10,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}><div style={{height:1,width:16,background:ac,opacity:.6,flexShrink:0}} />{title}<div style={{height:1,flex:1,background:`linear-gradient(90deg,${ac},transparent)`,opacity:.25}} /></div><div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>{children}</div></div>; }
  function Badge({color,bg,children}){ return <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:bg||color+"20",color,border:`1px solid ${color}30`}}>{children}</span>; }
  function Toggle({val,onChange,label}){ return <div onClick={()=>onChange(!val)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",userSelect:"none"}}><div style={{width:38,height:20,borderRadius:10,background:val?`linear-gradient(90deg,${T.primary},${T.primaryL})`:C.border2,transition:"background .2s",position:"relative",boxShadow:val?T.glowBox:"none"}}><div style={{width:16,height:16,borderRadius:"50%",background:"#FFFFFF",position:"absolute",top:2,left:val?20:2,transition:"left .2s"}} /></div><span style={{fontSize:12,color:val?T.primaryXL:C.muted}}>{label}</span></div>; }
  function InfoBox({color,children}){ const c=color||T.primaryL; return <div style={{background:`radial-gradient(ellipse at 0% 50%,${c}08,transparent 70%)`,border:`1px solid ${c}20`,borderRadius:10,padding:"11px 15px",marginBottom:16,fontSize:12,color:C.muted,lineHeight:1.5}}>{children}</div>; }
  function ImgUpload({k,label,circle=false,size=88}){
    const ref=useRef();
    return <div><div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:circle?"50%":12,background:C.surf3,border:`2px dashed ${form[k]?co.color+"70":C.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",position:"relative"}}>
      {form[k]?<img src={form[k]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" />:<div style={{textAlign:"center",padding:8}}><div style={{fontSize:18}}>📷</div><div style={{fontSize:9,color:C.muted,marginTop:3,lineHeight:1.3}}>{label}</div></div>}
      {form[k]&&<div onClick={e=>{e.stopPropagation();upd(k,"");}} style={{position:"absolute",top:4,right:4,background:"#EF444490",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",cursor:"pointer"}}>✕</div>}
    </div><input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&handleImg(k,e.target.files[0])} /></div>;
  }
  function Chips({k,opts,accent}){
    const val=form[k]||[];
    return <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{opts.map(([v,l])=>{const on=val.includes(v);const ac=accent||co?.color||T.primaryXL;return <button key={v} onClick={()=>toggleArr(k,v)} style={{padding:"5px 14px",borderRadius:20,cursor:"pointer",fontSize:12,border:`1px solid ${on?ac+"80":C.border2}`,background:on?ac+"18":C.surf3,color:on?ac:C.muted,fontWeight:on?700:400,transition:"all .12s"}}>{l}</button>;})}</div>;
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if(view==="login") return <LoginScreen onLogin={()=>{ storage.set("sociamind-session","1"); setLoggedIn(true); setView("home"); }} />;

  // ─── HOME ─────────────────────────────────────────────────────────────────
  if(view==="home") return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",position:"relative",overflow:"hidden"}}>
      <DigitalBg T={T} opacity={mode==="dark"?1:0.45}/>
      {toast&&<div style={{position:"fixed",top:16,right:16,background:`linear-gradient(135deg,${T.accent},${T.primaryL})`,color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:`0 4px 20px ${T.primary}60`}}>{toast.msg}</div>}

      {/* Hero header */}
      <div style={{background:mode==="dark"?`${T.surf}EE`:`${T.surf}F8`,borderBottom:`1px solid ${T.border}`,padding:"18px 32px",position:"relative",overflow:"hidden",backdropFilter:"blur(12px)"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`radial-gradient(ellipse at 20% 50%,${T.primary}12 0%,transparent 60%)`,pointerEvents:"none"}} />
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:46,height:46,borderRadius:13,background:`linear-gradient(135deg,${T.accent},${T.primaryL})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 28px ${T.primary}50`}}>
              <Zap size={22} color="#fff" strokeWidth={2.5}/>
            </div>
            <div>
              <div style={{fontSize:9,letterSpacing:5,color:T.primaryXL,fontWeight:700,textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>Social Agent · MVP</div>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"'Space Grotesk',sans-serif",background:`linear-gradient(135deg,${T.primaryXL},${T.textSub})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Agency Hub</div>
            </div>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            {[
              {label:"Empresas",val:companies.length,Icon:Globe},
              {label:"Configuradas",val:Object.keys(saved).length,Icon:CheckCircle},
              {label:"Produtos",val:Object.values(saved).reduce((a,d)=>a+(d.produtos?.length||0),0),Icon:Package},
            ].map(m=><div key={m.label} style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <m.Icon size={14} color={T.primaryXL} strokeWidth={2}/>
              <div style={{fontSize:20,fontWeight:700,color:T.text,fontFamily:"'Space Grotesk',sans-serif"}}>{m.val}</div>
              <div style={{fontSize:10,color:T.textMuted,letterSpacing:.5}}>{m.label}</div>
            </div>)}
            <button onClick={()=>setNewCoForm(!newCoForm)} style={{background:`linear-gradient(135deg,${T.accent},${T.primaryL})`,color:"#fff",border:"none",padding:"9px 20px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:7,boxShadow:`0 4px 20px ${T.primary}45`,fontFamily:"'Inter',sans-serif"}}>
              <Plus size={15}/> Nova Empresa
            </button>
            <button onClick={()=>{ storage.remove("sociamind-session"); setView("login"); }} style={{background:"none",border:`1px solid ${T.border2}`,color:T.textMuted,padding:"9px 12px",borderRadius:10,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
              <LogOut size={14}/> Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"28px 20px",position:"relative",zIndex:1}}>

        {/* New company form */}
        {newCoForm&&<div style={{background:mode==="dark"?`${T.surf2}EE`:`${T.surf}F5`,border:`1px solid ${T.border2}`,borderRadius:18,padding:"24px",marginBottom:28,backdropFilter:"blur(10px)",boxShadow:T.shadow}}>
          <div style={{fontSize:11,fontWeight:700,color:T.primaryXL,letterSpacing:3,marginBottom:18,textTransform:"uppercase",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:8}}>
            <Plus size={14}/> Nova Empresa — Cadastro rápido
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr",gap:12,marginBottom:16}}>
            <F label="Nome da empresa"><input value={newCo.name} onChange={e=>setNewCo(p=>({...p,name:e.target.value}))} placeholder="Nome completo" style={{...inp,fontFamily:"inherit"}} /></F>
            <F label="Segmento / Nicho"><input value={newCo.niche} onChange={e=>setNewCo(p=>({...p,niche:e.target.value}))} placeholder="Ex: Moda / Alimentação / Serviços" style={{...inp,fontFamily:"inherit"}} /></F>
            <F label="Cor da marca"><input type="color" value={newCo.color} onChange={e=>setNewCo(p=>({...p,color:e.target.value}))} style={{width:"100%",height:42,border:`1px solid ${T.border2}`,borderRadius:9,cursor:"pointer",background:"none",padding:3}} /></F>
            <F label="Emoji / Ícone"><input value={newCo.emoji} onChange={e=>setNewCo(p=>({...p,emoji:e.target.value}))} placeholder="🏢" style={{...inp,fontFamily:"inherit",fontSize:18,textAlign:"center"}} /></F>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setNewCoForm(false)} style={{background:"none",border:`1px solid ${T.border2}`,color:T.textMuted,padding:"8px 18px",borderRadius:9,cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif"}}>Cancelar</button>
            <button onClick={addCompany} disabled={!newCo.name} style={{background:`linear-gradient(135deg,${T.accent},${T.primaryL})`,color:"#fff",border:"none",padding:"8px 24px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,opacity:newCo.name?1:.4,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <CheckCircle size={14}/> Criar empresa
            </button>
          </div>
        </div>}

        {/* Company grid */}
        {companies.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:T.textMuted}}>
            <Globe size={40} strokeWidth={1} style={{marginBottom:16,color:T.border2}}/>
            <div style={{fontSize:16,fontWeight:600,color:T.textSub,marginBottom:8,fontFamily:"'Space Grotesk',sans-serif"}}>Nenhuma empresa cadastrada</div>
            <div style={{fontSize:13}}>Clique em "Nova Empresa" para começar</div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {companies.map(c=>{
            const d=saved[c.id];
            const prods=d?.produtos?.length||0;
            const pubs=d?.publicos?.length||0;
            const pct=d?Math.round(([d.nomeFantasia,d.descricao,d.publicos?.length,d.igHandle,d.metaAppId||d.n8nWebhook,d.cofre?.[0]?.e].filter(Boolean).length/6)*100):0;
            return <div key={c.id} onClick={()=>openCo(c)} style={{background:mode==="dark"?`${T.surf}EE`:`${T.surf}F8`,border:`1px solid ${d?c.color+"35":T.border}`,borderRadius:18,padding:"20px",cursor:"pointer",transition:"all .18s",position:"relative",overflow:"hidden",backdropFilter:"blur(8px)",boxShadow:T.shadow}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"65";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c.color}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=d?c.color+"35":T.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${c.color},${c.color}50,transparent)`}} />
              {d&&<div style={{position:"absolute",top:14,right:14,fontSize:11,fontWeight:600,color:c.color,background:c.color+"18",padding:"2px 9px",borderRadius:20,border:`1px solid ${c.color}30`}}>{pct}%</div>}
              <div style={{display:"flex",gap:12,alignItems:"flex-start",marginTop:2,marginBottom:14}}>
                <div style={{width:46,height:46,borderRadius:12,background:c.color+"18",border:`1.5px solid ${c.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,overflow:"hidden",flexShrink:0}}>
                  {d?.logob64?<img src={d.logob64} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" />:c.emoji}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:"'Inter',sans-serif"}}>{c.name}</div>
                  <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{c.niche}</div>
                  {d?.slogan&&<div style={{fontSize:10,color:c.color,marginTop:3,fontStyle:"italic"}}>"{d.slogan}"</div>}
                </div>
              </div>
              {d&&<div style={{height:2,background:T.surf3,borderRadius:1,overflow:"hidden",marginBottom:12}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${c.color},${T.primaryL})`,transition:"width .5s"}} /></div>}
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {prods>0&&<Badge color={c.color}>{prods} produto{prods>1?"s":""}</Badge>}
                {pubs>0&&<Badge color={T.primaryXL}>{pubs} público{pubs>1?"s":""}</Badge>}
                {!d&&<span style={{fontSize:11,color:T.textMuted,display:"flex",alignItems:"center",gap:4}}>Iniciar <ChevronLeft size={11} style={{transform:"rotate(180deg)"}}/></span>}
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>
  );

  // ─── COMPANY VIEW ──────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Poppins',system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
      {toast&&<div style={{position:"fixed",top:14,right:14,background:G.primary,color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:`0 4px 24px ${T.primary}50`,fontFamily:"'Inter',sans-serif"}}>{toast.msg}</div>}

      {/* Topbar */}
      <div style={{background:T.surf,borderBottom:`1px solid ${T.border}`,padding:"10px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setView("home")} style={{background:"none",border:`1px solid ${T.border2}`,color:T.textMuted,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif"}}>
            <ChevronLeft size={14}/> Hub
          </button>
          <div style={{width:1,height:22,background:T.border}} />
          <div style={{width:34,height:34,borderRadius:9,background:co.color+"18",border:`1.5px solid ${co.color}40`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontSize:16}}>
            {form.logob64?<img src={form.logob64} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" />:co.emoji}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.text,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>{form.nomeFantasia||co.name}<span style={{fontSize:10,background:co.color+"18",color:co.color,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{co.niche}</span></div>
            {form.slogan&&<div style={{fontSize:10,color:T.textMuted,fontStyle:"italic"}}>"{form.slogan}"</div>}
          </div>
        </div>
        <button onClick={save} disabled={saving} style={{background:`linear-gradient(135deg,${T.accent},${T.primaryL})`,color:"#fff",border:"none",padding:"8px 22px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,opacity:saving?.7:1,boxShadow:`0 4px 18px ${T.primary}40`,display:"flex",alignItems:"center",gap:7,fontFamily:"'Inter',sans-serif"}}>
          <Save size={14}/> {saving?"Salvando…":"Salvar"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{background:T.surf,borderBottom:`1px solid ${T.border}`,padding:"0 16px",display:"flex",overflowX:"auto",flexShrink:0,gap:1,scrollbarWidth:"none"}}>
        {TABS.map(t=>{
          const active=t.id===tab;
          return <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:"none",border:"none",
            borderBottom:`2px solid ${active?T.primaryL:"transparent"}`,
            padding:"11px 14px",cursor:"pointer",whiteSpace:"nowrap",
            color:active?T.primaryXL:T.textMuted,
            fontWeight:active?600:400,fontSize:12,
            display:"flex",alignItems:"center",gap:6,
            transition:"color .15s",
            fontFamily:"'Inter',system-ui,sans-serif",
          }}><t.Icon size={14} strokeWidth={active?2.5:1.8}/>{t.label}</button>;
        })}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 22px"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          {tab==="gerar"       &&<TabGerar />}
          {tab==="scanner"     &&<TabScanner />}
          {tab==="identidade"  &&<TabIdentidade />}
          {tab==="produtos"    &&<TabProdutos />}
          {tab==="publicos"    &&<TabPublicos />}
          {tab==="conteudo"    &&<TabConteudo />}
          {tab==="os"          &&<TabOS />}
          {tab==="calendario"  &&<TabCalendario />}
          {tab==="redes"       &&<TabRedes />}
          {tab==="integracoes" &&<TabIntegracoes />}
          {tab==="cofre"       &&<TabCofre />}
        </div>
      </div>
    </div>
  );

  // ─── GERAR CONTEÚDO (M2) ──────────────────────────────────────────────────
  function TabGerar(){
    const N8N_WEBHOOK = "https://juinfo.app.n8n.cloud/webhook/social-agent-trigger";
    const [gForm, setGForm] = useState({
      plataforma:"Instagram",
      tom: form.sentimentoMarca || "empoderador e acolhedor",
      solicitacao:"",
      publico: (form.publicos||[])[0]?.nome || "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | done | error
    const [resultado, setResultado] = useState(null);
    const gUpd = (k,v) => setGForm(p=>({...p,[k]:v}));

    async function gerarConteudo(){
      if(!gForm.solicitacao.trim()) return;
      setStatus("loading"); setResultado(null);
      const payload = {
        empresa: form.nomeFantasia || co.name,
        nicho:   co.niche,
        plataforma: gForm.plataforma,
        publico: gForm.publico || co.niche,
        tom: gForm.tom,
        solicitacao: gForm.solicitacao,
      };
      try {
        const res = await fetch(N8N_WEBHOOK, {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setResultado(data);
        setStatus("done");
        flash("✨ Conteúdo gerado!","teal");
      } catch(e) {
        setStatus("error");
        flash("Erro ao gerar — verifique o n8n","coral");
      }
    }

    function salvarNoCalendario(opcao, idx){
      const item = {
        id: Date.now(),
        tipo:"Post Feed",
        titulo: `${gForm.plataforma} — ${new Date().toLocaleDateString("pt-BR")}`,
        legenda: opcao,
        publicoId: "",
        plataforma: gForm.plataforma,
        data: new Date().toISOString().split("T")[0],
        hora: "18:00",
        status:"Ag. aprovação",
      };
      upd("agenda", [...(form.agenda||[]), item]);
      save();
      flash(`✓ Opção ${idx+1} salva no calendário!`,"teal");
    }

    const plataformas = ["Instagram","Facebook","TikTok","WhatsApp","Stories","Reels","LinkedIn"];

    return <>
      {/* Header */}
      <div style={{marginBottom:24,padding:"20px 22px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${T.primary}18,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${T.primary}40`,flexShrink:0}}><Sparkles size={22} color="#fff" strokeWidth={2}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Gerar Conteúdo com IA</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Claude gera 3 opções de legenda · n8n processa · WhatsApp notifica para aprovação</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px",marginBottom:14}}>
        <div style={{fontSize:9,fontWeight:900,letterSpacing:3,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:16,textTransform:"uppercase"}}>Briefing do Conteúdo</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <F label="Plataforma">
            <select value={gForm.plataforma} onChange={e=>gUpd("plataforma",e.target.value)} style={{...inp,cursor:"pointer"}}>
              {plataformas.map(p=><option key={p}>{p}</option>)}
            </select>
          </F>
          <F label="Público-alvo">
            <select value={gForm.publico} onChange={e=>gUpd("publico",e.target.value)} style={{...inp,cursor:"pointer"}}>
              <option value={co.niche}>{co.niche}</option>
              {(form.publicos||[]).map(p=><option key={p.id} value={p.nome}>{p.nome}</option>)}
            </select>
          </F>
        </div>

        <F label="Tom de voz">
          <input value={gForm.tom} onChange={e=>gUpd("tom",e.target.value)} placeholder="empoderador e acolhedor" style={{...inp,fontFamily:"inherit"}} />
        </F>

        <F label="O que você quer postar?" req>
          <textarea value={gForm.solicitacao} onChange={e=>gUpd("solicitacao",e.target.value)}
            placeholder={`Ex: post sobre autoestima e ${co.niche}\nEx: promoção de 20% off no produto X\nEx: novidade — lançamento da coleção verão`}
            rows={4} style={{...inp,resize:"vertical",lineHeight:1.6,fontFamily:"inherit"}} />
        </F>

        <button onClick={gerarConteudo} disabled={status==="loading" || !gForm.solicitacao.trim()}
          style={{background:status==="loading"?C.surf3:G.primary,color:"#fff",border:"none",padding:"12px 32px",borderRadius:10,cursor:status==="loading"?"default":"pointer",fontWeight:700,fontSize:14,boxShadow:status==="loading"?"none":`0 4px 24px ${T.primary}40`,display:"flex",alignItems:"center",gap:8,opacity:gForm.solicitacao.trim()?1:.5}}>
          {status==="loading" ? <>⏳ Gerando com IA…</> : <>✨ Gerar 3 Opções</>}
        </button>
      </div>

      {/* Resultado */}
      {status==="error"&&<div style={{background:"#FF525210",border:"1px solid #FF525230",borderRadius:12,padding:"14px 16px",color:C.error,fontSize:13}}>❌ Erro ao conectar com o n8n. Verifique se o workflow está ativo em juinfo.app.n8n.cloud</div>}

      {status==="done"&&resultado&&<div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>3 Opções Geradas — {gForm.plataforma}</div>
          <div style={{fontSize:11,color:C.muted}}>Salve no calendário para aprovação via WhatsApp</div>
        </div>

        {/* Exibe as 3 opções — suporta array ou objeto com opcao1/2/3 */}
        {[
          resultado.opcao1 || resultado[0]?.legenda || resultado[0],
          resultado.opcao2 || resultado[1]?.legenda || resultado[1],
          resultado.opcao3 || resultado[2]?.legenda || resultado[2],
        ].filter(Boolean).map((opcao, idx)=>(
          <div key={idx} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px",marginBottom:12,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:G.primary,borderRadius:"14px 14px 0 0"}} />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:800,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:2}}>OPÇÃO {idx+1}</div>
              <button onClick={()=>salvarNoCalendario(typeof opcao==="string"?opcao:JSON.stringify(opcao), idx)}
                style={{background:G.primary,color:"#fff",border:"none",padding:"6px 16px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:11,boxShadow:`0 2px 12px ${T.primary}40`}}>
                + Calendário
              </button>
            </div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap"}}>
              {typeof opcao==="string" ? opcao : (opcao?.legenda || opcao?.texto || JSON.stringify(opcao))}
            </div>
          </div>
        ))}

        <div style={{background:`${T.primary}10`,border:`1px solid ${T.primary}20`,borderRadius:12,padding:"14px 16px",fontSize:12,color:C.muted}}>
          💡 Clique em <strong style={{color:C.text}}>+ Calendário</strong> para salvar a opção escolhida. Ela ficará com status <strong style={{color:C.text}}>Ag. aprovação</strong> — e o n8n enviará via WhatsApp automaticamente.
        </div>
      </div>}
    </>;
  }

  // ─── SCANNER IA ────────────────────────────────────────────────────────────
  function TabScanner(){
    const [urls, setUrls] = useState({
      instagram:"", facebook:"", tiktok:"", site:"",
      whatsapp:"", youtube:"", extra:""
    });
    const [manual, setManual] = useState("");
    const [phase, setPhase] = useState("idle"); // idle | scanning | done | error
    const [log, setLog] = useState([]);
    const [result, setResult] = useState(null);
    const [applying, setApplying] = useState(false);
    const logRef = useRef(null);

    const addLog = (msg, type="info") => setLog(p => [...p, {msg, type, t: Date.now()}]);

    async function runScan() {
      const hasInput = Object.values(urls).some(v=>v.trim()) || manual.trim();
      if (!hasInput) return;
      setPhase("scanning"); setLog([]); setResult(null);

      addLog("🔍 Iniciando análise estratégica da marca...", "start");
      addLog("📡 Coletando dados das redes sociais informadas...", "info");

      setTimeout(()=>addLog("🧠 Claude analisando posicionamento e identidade visual...", "info"), 800);
      setTimeout(()=>addLog("👥 Mapeando perfis de público e personas...", "info"), 1800);
      setTimeout(()=>addLog("📦 Identificando produtos e proposta de valor...", "info"), 2800);
      setTimeout(()=>addLog("🎯 Construindo estratégia de conteúdo personalizada...", "info"), 3800);
      setTimeout(()=>addLog("✍️ Gerando estratégia completa de marketing digital...", "info"), 4800);

      const prompt = `Você é um estrategista digital sênior especialista em marketing digital, branding e social media. 
Analise os dados desta marca e retorne uma análise estratégica COMPLETA em JSON.

EMPRESA: ${form.nomeFantasia || co.name}
NICHO: ${co.niche}

PERFIS E LINKS INFORMADOS:
${urls.instagram ? `Instagram: ${urls.instagram}` : ""}
${urls.facebook ? `Facebook: ${urls.facebook}` : ""}
${urls.tiktok ? `TikTok: ${urls.tiktok}` : ""}
${urls.site ? `Site: ${urls.site}` : ""}
${urls.youtube ? `YouTube: ${urls.youtube}` : ""}
${urls.whatsapp ? `WhatsApp: ${urls.whatsapp}` : ""}
${urls.extra ? `Outros: ${urls.extra}` : ""}

${manual ? `INFORMAÇÕES ADICIONAIS FORNECIDAS PELO USUÁRIO:\n${manual}` : ""}

DADOS JÁ PREENCHIDOS NO SISTEMA:
${form.descricao ? `Descrição atual: ${form.descricao}` : ""}
${form.servicos ? `Serviços: ${form.servicos}` : ""}
${form.responsavel ? `Responsável: ${form.responsavel}` : ""}

Com base em todo esse contexto e no nicho "${co.niche}", crie uma análise estratégica profunda como se você fosse um estrategista digital que acabou de fazer um diagnóstico completo desta marca.

RETORNE APENAS JSON válido, sem texto antes ou depois, sem markdown. Estrutura:
{
  "resumoMarca": "Resumo estratégico da marca em 2-3 frases",
  "diagnostico": "Diagnóstico do posicionamento atual e oportunidades",
  "slogan": "Slogan sugerido ou otimizado",
  "descricao": "Descrição completa e estratégica da empresa",
  "missao": "Missão clara e orientada ao cliente",
  "visao": "Visão de futuro inspiradora",
  "valores": "Valores separados por vírgula",
  "diferenciais": "Principais diferenciais competitivos",
  "sentimentoMarca": "profissional|descontraido|luxo|espiritual|tecnico|empoderador|acolhedor",
  "faixaPreco": "popular|medio|premium|ultra",
  "emojisOficiais": "3-5 emojis que representam a marca",
  "topicosSempre": "Pilares de conteúdo separados por vírgula",
  "topicosNunca": "Assuntos a evitar",
  "hashtags": "15-20 hashtags estratégicas separadas por espaço",
  "corPrimaria": "#HEXCODE - cor primária sugerida para a identidade",
  "corSecundaria": "#HEXCODE - cor secundária",
  "corAcento": "#HEXCODE - cor de acento",
  "fonteTitulo": "nome exato de uma dessas fontes: Bebas Neue, Anton, Abril Fatface, Oswald, Playfair Display, Merriweather, Cormorant Garamond, Libre Baskerville, Montserrat, Poppins, Raleway, Josefin Sans, Nunito, DM Sans, Space Grotesk, Dancing Script, Pacifico, Lobster, Sacramento",
  "fonteCorpo": "nome exato de uma das fontes acima",
  "personas": [
    {
      "nome": "Nome da persona",
      "apelido": "Como a equipe chama esta persona",
      "idade": "faixa etária",
      "genero": "ambos|fem|masc",
      "descricao": "Descrição vívida e detalhada desta persona",
      "profissao": "Profissão típica",
      "renda": "c|b|ab|a",
      "dores": "Principais dores e frustrações",
      "desejos": "O que sonha e deseja alcançar",
      "comportamentoOnline": "Como se comporta nas redes sociais",
      "plataformasFavoritas": "Instagram,TikTok,WhatsApp",
      "comoChegar": "Como esta marca deve se comunicar com ela",
      "ctaPref": "whatsapp|dm|site|telefone|bio"
    }
  ],
  "produtos": [
    {
      "nome": "Nome do produto/serviço",
      "subtitulo": "Tagline do produto",
      "descricao": "Descrição estratégica",
      "publicoAlvo": "Para quem é",
      "preco": "Faixa de preço estimada",
      "emoji": "emoji representativo"
    }
  ],
  "estrategiaConteudo": {
    "pilaresEditoriais": ["Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4"],
    "freqFeed": "recomendação de frequência posts feed",
    "freqReel": "frequência reels",
    "freqStory": "frequência stories",
    "freqWa": "frequência WhatsApp",
    "tomVoz": "Descrição detalhada do tom de voz ideal",
    "hooksIdeal": "3 exemplos de hooks que funcionam para este nicho",
    "formatosMaisEficazes": "Formatos de conteúdo mais eficazes para este nicho",
    "melhorHorario": "Melhor horário para postar baseado no público",
    "ctaPrincipal": "whatsapp|dm|site|telefone|bio"
  },
  "estrategiaGeral": "Estratégia digital completa em 5-7 linhas como um estrategista sênior escreveria",
  "oportunidades": ["Oportunidade 1", "Oportunidade 2", "Oportunidade 3"],
  "alertas": ["Alerta ou ponto de atenção 1", "Alerta 2"],
  "proximosPassos": ["Ação prioritária 1", "Ação 2", "Ação 3", "Ação 4", "Ação 5"]
}`;

      try {
        // Se a empresa tem tokens configurados, buscar dados reais da Graph API primeiro
        let graphData = "";
        if (form.metaIgId && form.metaPageToken) {
          addLog("📊 Buscando dados reais via Graph API...", "info");
          try {
            const scanRes = await fetch("/api/scanner", {
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({
                igUserId: form.metaIgId,
                pageId: form.fbPageId,
                accessToken: form.metaPageToken,
              })
            });
            const scanData = await scanRes.json();
            if (!scanData.error && scanData.instagram) {
              const p = scanData.instagram.profile;
              graphData = `\nDADOS REAIS DO INSTAGRAM (Graph API):\nSeguidores: ${p.followers_count}\nPosts: ${p.media_count}\nBio: ${p.biography || ""}\nSite: ${p.website || ""}`;
              if (scanData.instagram.media?.length) {
                const likes = scanData.instagram.media.reduce((a,m)=>a+(m.like_count||0),0);
                const comments = scanData.instagram.media.reduce((a,m)=>a+(m.comments_count||0),0);
                const avg = Math.round(likes / scanData.instagram.media.length);
                graphData += `\nEngajamento médio (últimos 12 posts): ${avg} curtidas, ${Math.round(comments/scanData.instagram.media.length)} comentários`;
              }
              addLog(`✅ Graph API: ${p.followers_count} seguidores, ${p.media_count} posts`, "success");
            } else {
              addLog(`⚠️ Graph API: ${scanData.error || "sem dados"} — usando análise por URL`, "info");
            }
          } catch { addLog("⚠️ Graph API indisponível — usando análise por URL", "info"); }
        }

        const res = await fetch("/api/claude", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-6",
            max_tokens:8000,
            messages:[{role:"user", content: prompt + graphData}]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(JSON.stringify(data.error));
        const raw = data.content?.find(b=>b.type==="text")?.text || "";
        const clean = raw.replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(clean);
        setResult(parsed);
        setPhase("done");
        addLog("✅ Análise concluída com sucesso!", "success");
        addLog(`🎯 ${parsed.personas?.length||0} persona(s) identificada(s)`, "success");
        addLog(`📦 ${parsed.produtos?.length||0} produto(s) mapeado(s)`, "success");
        addLog("👆 Revise a análise e clique em Aplicar ao Cadastro", "cta");
      } catch(e) {
        setPhase("error");
        const msg = e.message || "";
        if (msg.includes("API key") || msg.includes("api_key")) {
          addLog("❌ ANTHROPIC_API_KEY não configurada no Vercel — vá em Settings → Environment Variables", "error");
        } else if (msg.includes("model")) {
          addLog("❌ Modelo inválido — verifique as configurações da API", "error");
        } else {
          addLog(`❌ Erro: ${msg || "verifique sua conexão e tente novamente"}`, "error");
        }
      }
    }

    async function applyToForm() {
      if (!result) return;
      setApplying(true);
      addLog("📝 Aplicando dados ao cadastro...", "info");

      const updates = {};
      if (result.slogan)        updates.slogan        = result.slogan;
      if (result.descricao)     updates.descricao     = result.descricao;
      if (result.missao)        updates.missao        = result.missao;
      if (result.visao)         updates.visao         = result.visao;
      if (result.valores)       updates.valores       = result.valores;
      if (result.diferenciais)  updates.diferenciais  = result.diferenciais;
      if (result.sentimentoMarca) updates.sentimentoMarca = result.sentimentoMarca;
      if (result.faixaPreco)    updates.faixaPreco    = result.faixaPreco;
      if (result.emojisOficiais) updates.emojisOficiais = result.emojisOficiais;
      if (result.topicosSempre) updates.topicosSempre = result.topicosSempre;
      if (result.topicosNunca)  updates.topicosNunca  = result.topicosNunca;
      if (result.hashtags)      updates.hashtags      = result.hashtags;
      if (result.corPrimaria)   updates.corPrimaria   = result.corPrimaria;
      if (result.corSecundaria) updates.corSecundaria = result.corSecundaria;
      if (result.corAcento)     updates.corAcento     = result.corAcento;
      if (result.fonteTitulo)   updates.fonteTitulo   = result.fonteTitulo;
      if (result.fonteCorpo)    updates.fonteCorpo    = result.fonteCorpo;

      // Apply personas as publicos
      if (result.personas?.length) {
        updates.publicos = result.personas.map((p,i) => ({
          id: Date.now()+i,
          nome: p.nome||p.apelido||`Persona ${i+1}`,
          produto: "",
          descricao: p.descricao||"",
          idadeMin: p.idade?.split("-")[0]?.replace(/\D/g,"")||"",
          idadeMax: p.idade?.split("-")[1]?.replace(/\D/g,"")||"",
          genero: p.genero||"ambos",
          localPublico: "nacional",
          renda: p.renda||"b",
          dores: p.dores||"",
          desejos: p.desejos||"",
          comoResolve: p.comoChegar||"",
          ctaPref: p.ctaPref||"whatsapp",
        }));
      }

      // Apply products
      if (result.produtos?.length) {
        updates.produtos = result.produtos.map((p,i) => ({
          id: Date.now()+100+i,
          nome: p.nome||"",
          subtitulo: p.subtitulo||"",
          descricao: p.descricao||"",
          publicoAlvo: p.publicoAlvo||"",
          preco: p.preco||"",
          link: "",
          ativo: true,
          emoji: p.emoji||"📦",
        }));
      }

      // Apply content strategy
      if (result.estrategiaConteudo) {
        const ec = result.estrategiaConteudo;
        if (result.personas?.length) {
          updates.perfilConteudo = result.personas.map((p,i) => ({
            publicoId: (Date.now()+i).toString(),
            topicosSempre: result.topicosSempre||"",
            topicosNunca: result.topicosNunca||"",
            freqFeed: ec.freqFeed||"",
            freqStory: ec.freqStory||"",
            freqReel: ec.freqReel||"",
            freqWa: ec.freqWa||"",
            tom: ec.tomVoz||"",
            hooks: ec.hooksIdeal||"",
            hashtags: result.hashtags||"",
          }));
        }
      }

      setForm(prev => ({ ...prev, ...updates }));
      setTimeout(() => {
        save();
        setApplying(false);
        addLog("✅ Todos os campos preenchidos! Confira nas outras abas.", "success");
        flash("✅ Análise aplicada ao cadastro!", "teal");
      }, 800);
    }

    const logColors = { start:"#F5A623", info:"#FFD580", success:"#A8E6A3", error:"#FF7070", cta:"#FFFFFF" };

    const temTokens = !!(form.metaIgId && form.metaPageToken);

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"20px 22px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${T.primary}18,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${T.primary}40`,flexShrink:0}}><ScanLine size={22} color="#fff" strokeWidth={2}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Scanner IA — Estrategista Digital</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Informe os perfis da marca. A IA analisa tudo, cria personas, mapeia produtos e gera uma estratégia completa — preenchendo todos os campos automaticamente.</div>
          </div>
        </div>
      </div>

      {/* Status Graph API */}
      {temTokens
        ? <div style={{background:"#00E67610",border:"1px solid #00E67630",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.success,display:"flex",alignItems:"center",gap:8}}>
            ✅ <strong>Graph API conectada</strong> — O scanner vai buscar dados reais do Instagram (@{form.igHandle||form.metaIgId}) antes de analisar com IA.
          </div>
        : <div style={{background:`${T.primary}10`,border:`1px solid ${T.primary}20`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:8}}>
            💡 Configure o <strong style={{color:C.text}}>Page Access Token</strong> e o <strong style={{color:C.text}}>Instagram Business ID</strong> na aba <strong style={{color:C.text}}>Integrações</strong> para buscar dados reais via Graph API.
          </div>
      }

      {/* URL Inputs */}
      <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
        <div style={{fontSize:9,fontWeight:900,letterSpacing:3,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:14,textTransform:"uppercase"}}>Perfis & Links da Marca</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[
            ["🟣","Instagram","instagram","@usuario ou link completo"],
            ["🔵","Facebook","facebook","Link da página ou @"],
            ["⚫","TikTok","tiktok","@usuario"],
            ["🌐","Site / Blog","site","https://seusite.com.br"],
            ["🔴","YouTube","youtube","Link do canal"],
            ["🟢","WhatsApp Business","whatsapp","Número ou link wa.me/…"],
          ].map(([icon,label,key,ph])=>(
            <div key={key}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{icon} {label}</label>
              <input value={urls[key]} onChange={e=>setUrls(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                style={{...inp,fontFamily:"inherit",borderColor:urls[key]?"#F5A62340":C.border2}} />
            </div>
          ))}
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>💬 Informações adicionais (cole bio, descrição, produtos, sobre nós…)</label>
          <textarea value={manual} onChange={e=>setManual(e.target.value)} rows={4}
            placeholder={`Cole aqui qualquer informação útil sobre a marca:\n— Bio do Instagram\n— Texto do site\n— Lista de produtos e preços\n— Descrição dos serviços\n— Público-alvo que você conhece\n— Qualquer texto que ajude a IA a entender a marca`}
            style={{...inp,resize:"vertical",lineHeight:1.6,fontFamily:"inherit"}} />
        </div>
        <div style={{marginTop:14,display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={runScan} disabled={phase==="scanning"} style={{background:phase==="scanning"?C.surf3:G.primary,color:phase==="scanning"?C.muted:"#fff",border:"none",padding:"11px 28px",borderRadius:10,cursor:phase==="scanning"?"default":"pointer",fontWeight:700,fontSize:14,boxShadow:phase==="scanning"?"none":`0 4px 24px ${T.primary}45`,display:"flex",alignItems:"center",gap:8}}>
            {phase==="scanning" ? <>⏳ Analisando…</> : <>🚀 Analisar com IA</>}
          </button>
          {phase==="done"&&<span style={{fontSize:12,color:"#A8E6A3",fontWeight:600}}>✓ Análise pronta — revise abaixo</span>}
          {phase==="error"&&<span style={{fontSize:12,color:"#FF7070"}}>✕ Erro — tente novamente</span>}
        </div>
      </div>

      {/* Live Log */}
      {log.length>0&&(
        <div ref={logRef} style={{background:"#03040A",border:`1px solid #F5A62315`,borderRadius:12,padding:"14px 16px",marginBottom:14,fontFamily:"monospace",maxHeight:160,overflowY:"auto"}}>
          {log.map((l,i)=>(
            <div key={i} style={{fontSize:11,color:logColors[l.type]||C.muted,marginBottom:3,display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{color:"#F5A62340",flexShrink:0}}>{new Date(l.t).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
              {l.msg}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result&&<>
        {/* Apply button */}
        <div style={{background:"linear-gradient(135deg,#F5A62315,#FFD58008)",border:"1px solid #F5A62330",borderRadius:14,padding:"16px 20px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Análise concluída — {result.personas?.length||0} personas · {result.produtos?.length||0} produtos</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Revise os resultados abaixo e clique para aplicar tudo ao cadastro desta empresa</div>
          </div>
          <button onClick={applyToForm} disabled={applying} style={{background:G.primary,color:"#fff",border:"none",padding:"11px 26px",borderRadius:10,cursor:applying?"default":"pointer",fontWeight:700,fontSize:13,flexShrink:0,boxShadow:`0 4px 24px ${T.primary}45`,opacity:applying?.7:1}}>
            {applying?"Aplicando…":"✅ Aplicar ao Cadastro"}
          </button>
        </div>

        {/* Strategy overview */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Diagnóstico da Marca</div>
            <p style={{fontSize:12,color:C.muted,margin:0,lineHeight:1.7}}>{result.resumoMarca}</p>
            {result.diagnostico&&<p style={{fontSize:12,color:C.hint,margin:"8px 0 0",lineHeight:1.6}}>{result.diagnostico}</p>}
          </div>
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#FFD580",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Estratégia Sugerida</div>
            <p style={{fontSize:12,color:C.muted,margin:0,lineHeight:1.7}}>{result.estrategiaGeral}</p>
          </div>
        </div>

        {/* Identity preview */}
        <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Identidade Visual Sugerida</div>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",gap:6}}>
              {[result.corPrimaria,result.corSecundaria,result.corAcento].filter(Boolean).map((c,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{width:44,height:44,borderRadius:10,background:c,border:`1px solid ${C.border2}`}} />
                  <div style={{fontSize:9,color:C.muted,marginTop:3}}>{c}</div>
                </div>
              ))}
            </div>
            {result.corPrimaria&&<div style={{padding:"10px 20px",borderRadius:10,background:result.corPrimaria,color:"#fff",fontFamily:result.fonteTitulo?`'${result.fonteTitulo}',sans-serif`:"inherit",fontSize:16,fontWeight:700}}>{form.nomeFantasia||co.name}</div>}
            <div>
              {result.slogan&&<div style={{fontSize:13,color:C.text,fontStyle:"italic",marginBottom:4}}>"{result.slogan}"</div>}
              {result.emojisOficiais&&<div style={{fontSize:20}}>{result.emojisOficiais}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1,background:C.surf3,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.muted,marginBottom:3,letterSpacing:1,textTransform:"uppercase"}}>Fonte Título</div>
              <div style={{fontFamily:result.fonteTitulo?`'${result.fonteTitulo}',sans-serif`:"inherit",fontSize:17,color:C.text}}>{result.fonteTitulo||"—"}</div>
            </div>
            <div style={{flex:1,background:C.surf3,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.muted,marginBottom:3,letterSpacing:1,textTransform:"uppercase"}}>Fonte Corpo</div>
              <div style={{fontFamily:result.fonteCorpo?`'${result.fonteCorpo}',sans-serif`:"inherit",fontSize:13,color:C.muted}}>{result.fonteCorpo||"—"} — texto de exemplo aqui</div>
            </div>
          </div>
        </div>

        {/* Personas */}
        {result.personas?.length>0&&(
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:14,textTransform:"uppercase"}}>👥 Personas Mapeadas ({result.personas.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {result.personas.map((p,i)=>(
                <div key={i} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:12,padding:"14px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:G.primaryH}} />
                  <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{p.nome}</div>
                  {p.apelido&&p.apelido!==p.nome&&<div style={{fontSize:10,color:"#F5A623",marginBottom:6}}>"{p.apelido}"</div>}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                    {p.idade&&<span style={{fontSize:10,background:"#F5A62315",color:"#F5A623",padding:"2px 8px",borderRadius:20}}>{p.idade}</span>}
                    {p.profissao&&<span style={{fontSize:10,background:C.surf2,color:C.muted,padding:"2px 8px",borderRadius:20}}>{p.profissao}</span>}
                    {p.renda&&<span style={{fontSize:10,background:C.surf2,color:C.muted,padding:"2px 8px",borderRadius:20}}>Classe {p.renda.toUpperCase()}</span>}
                  </div>
                  <p style={{fontSize:11,color:C.muted,margin:"0 0 8px",lineHeight:1.5}}>{p.descricao?.slice(0,120)}{p.descricao?.length>120?"…":""}</p>
                  <div style={{fontSize:10,background:"#EF444415",color:"#FF9090",padding:"4px 9px",borderRadius:7,marginBottom:4}}><strong>Dor:</strong> {p.dores?.slice(0,80)}</div>
                  <div style={{fontSize:10,background:"#F5A62315",color:"#F5A623",padding:"4px 9px",borderRadius:7}}><strong>Desejo:</strong> {p.desejos?.slice(0,80)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {result.produtos?.length>0&&(
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:14,textTransform:"uppercase"}}>📦 Produtos & Serviços Identificados ({result.produtos.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {result.produtos.map((p,i)=>(
                <div key={i} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"13px"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{p.emoji||"📦"}</div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{p.nome}</div>
                  {p.subtitulo&&<div style={{fontSize:10,color:"#F5A623",marginBottom:6}}>{p.subtitulo}</div>}
                  <p style={{fontSize:11,color:C.muted,margin:"0 0 8px",lineHeight:1.4}}>{p.descricao?.slice(0,80)}</p>
                  {p.preco&&<span style={{fontSize:10,background:"#F5A62315",color:"#F5A623",padding:"2px 8px",borderRadius:20}}>{p.preco}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content strategy */}
        {result.estrategiaConteudo&&(
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:14,textTransform:"uppercase"}}>🎯 Estratégia de Conteúdo</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {result.estrategiaConteudo.pilaresEditoriais?.map((p,i)=>(
                <div key={i} style={{background:C.surf3,borderRadius:9,padding:"10px 13px",display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#F5A623",flexShrink:0,marginTop:5}} />
                  <div style={{fontSize:12,color:C.text,fontWeight:600}}>{p}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {[["Feed",result.estrategiaConteudo.freqFeed],["Reels",result.estrategiaConteudo.freqReel],["Stories",result.estrategiaConteudo.freqStory],["WhatsApp",result.estrategiaConteudo.freqWa]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{background:"#F5A62315",border:"1px solid #F5A62325",borderRadius:8,padding:"6px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#F5A623",fontWeight:700}}>{l}</div>
                  <div style={{fontSize:11,color:C.text}}>{v}</div>
                </div>
              ))}
            </div>
            {result.estrategiaConteudo.tomVoz&&<div style={{background:C.surf3,borderRadius:9,padding:"10px 13px",marginBottom:8}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Tom de Voz</div>
              <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{result.estrategiaConteudo.tomVoz}</div>
            </div>}
            {result.estrategiaConteudo.hooksIdeal&&<div style={{background:C.surf3,borderRadius:9,padding:"10px 13px"}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Hooks que funcionam</div>
              <div style={{fontSize:12,color:"#FFD580",fontStyle:"italic",lineHeight:1.6}}>{result.estrategiaConteudo.hooksIdeal}</div>
            </div>}
          </div>
        )}

        {/* Opportunities + Next steps */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {result.oportunidades?.length>0&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#A8E6A3",letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>🚀 Oportunidades</div>
            {result.oportunidades.map((o,i)=><div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:7}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#A8E6A3",flexShrink:0,marginTop:5}} />
              <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{o}</div>
            </div>)}
          </div>}
          {result.proximosPassos?.length>0&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>✅ Próximos Passos</div>
            {result.proximosPassos.map((p,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#F5A62318",border:"1px solid #F5A62340",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#F5A623",flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.4,paddingTop:1}}>{p}</div>
            </div>)}
          </div>}
        </div>

        {/* Alerts */}
        {result.alertas?.length>0&&<div style={{background:"#EF444408",border:"1px solid #EF444425",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#FF9090",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>⚠️ Pontos de Atenção</div>
          {result.alertas.map((a,i)=><div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:5}}>
            <span style={{color:"#FF9090",flexShrink:0}}>→</span>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{a}</div>
          </div>)}
        </div>}

        {/* Hashtags */}
        {result.hashtags&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}># Hashtags Estratégicas</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {result.hashtags.split(" ").filter(Boolean).map((h,i)=>(
              <span key={i} style={{fontSize:11,background:"#F5A62315",color:"#F5A623",padding:"3px 10px",borderRadius:20,border:"1px solid #F5A62325"}}>{h}</span>
            ))}
          </div>
        </div>}

        {/* Final apply */}
        <div style={{textAlign:"center",padding:"8px 0 4px"}}>
          <button onClick={applyToForm} disabled={applying} style={{background:G.primary,color:"#fff",border:"none",padding:"13px 40px",borderRadius:12,cursor:applying?"default":"pointer",fontWeight:700,fontSize:15,boxShadow:`0 4px 30px ${T.primary}50`,opacity:applying?.7:1}}>
            {applying?"Aplicando ao cadastro…":"✅ Aplicar tudo ao Cadastro"}
          </button>
          <div style={{fontSize:11,color:C.muted,marginTop:8}}>Preenche automaticamente: Identidade, Fontes, Cores, Públicos, Produtos, Conteúdo</div>
        </div>
      </>}
    </>;
  }

  // ─── IDENTIDADE ────────────────────────────────────────────────────────────
  function TabIdentidade(){
    return <>
      <Sec title="Identificação" accent={co.color}>
        <G2 ch={[<F label="Nome Fantasia" req><I k="nomeFantasia" ph="Como o mundo conhece" /></F>,<F label="Slogan / Tagline"><I k="slogan" ph="Frase da essência" /></F>]} />
        <G2 ch={[<F label="Responsável" req><I k="responsavel" ph="Nome completo" /></F>,<F label="Cargo"><I k="cargo" ph="CEO, Fundador(a), Gestor…" /></F>]} />
        <F label="Emojis oficiais"><I k="emojisOficiais" ph="🌿✨💚 — os emojis da marca" /></F>
      </Sec>

      <Sec title="Fotos" accent={co.color}>
        <InfoBox color={co.color}>A foto do responsável deve ser <strong style={{color:C.text}}>retrato de corpo inteiro</strong> — captura biotipo, estilo e postura para criar designs personalizados e coerentes com a pessoa real.</InfoBox>
        <div style={{display:"flex",gap:24,marginBottom:16}}>
          {[["logob64","Logo","Logo da marca",false],["fotoResponsavelb64","Corpo inteiro","Retrato corpo completo",false],["fotoCapa64","Empresa","Fachada / ambiente",false]].map(([k,lb,lbl,circ])=>(
            <div key={k} style={{textAlign:"center"}}><ImgUpload k={k} label={lbl} circle={circ} size={90} /><div style={{fontSize:10,marginTop:5,color:k==="fotoResponsavelb64"?co.color:C.muted,fontWeight:k==="fotoResponsavelb64"?700:400}}>{lb}</div></div>
          ))}
        </div>
        <F label="Biotipo / estilo visual do responsável" help="A IA usa para criar designs coerentes com a pessoa real"><TA k="descricaoBiotipo" ph="Ex: Mulher, 35 anos, cabelo castanho longo, estilo casual elegante, tons terrosos, sempre usa salto..." rows={2} /></F>
        <F label="URL alternativa do logo"><I k="logoUrl" ph="https://…/logo.png" /></F>
      </Sec>

      <Sec title="Fontes — Catálogo Canva" accent={co.color}>
        <InfoBox>Fontes exibidas no próprio estilo. Escolha uma para <strong style={{color:C.text}}>Título</strong> e outra para <strong style={{color:C.text}}>Corpo</strong>.</InfoBox>
        {CANVA_FONTS.map(cat=>(
          <div key={cat.cat} style={{marginBottom:20}}>
            <div style={{fontSize:9,fontWeight:700,color:C.muted,letterSpacing:2,marginBottom:9,textTransform:"uppercase"}}>{cat.cat}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {cat.fonts.map(f=>{
                const sT=form.fonteTitulo===f.n; const sC=form.fonteCorpo===f.n;
                return <div key={f.n} style={{background:C.surf3,border:`1px solid ${sT||sC?co.color+"80":C.border2}`,borderRadius:11,padding:"12px 14px",transition:"border-color .15s"}}>
                  <div style={{fontFamily:`'${f.n}',sans-serif`,fontSize:19,color:C.text,marginBottom:3,lineHeight:1.2}}>{f.p}</div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:8}}>{f.n}</div>
                  <div style={{display:"flex",gap:6}}>
                    {[["fonteTitulo","T","Título"],["fonteCorpo","C","Corpo"]].map(([k,short,full])=>{
                      const sel=form[k]===f.n;
                      return <button key={k} onClick={()=>upd(k,f.n)} style={{fontSize:10,padding:"3px 10px",borderRadius:20,cursor:"pointer",border:`1px solid ${sel?co.color+"80":C.border2}`,background:sel?co.color+"18":C.surf,color:sel?co.color:C.hint,fontWeight:sel?700:400}}>{sel?`✓ ${full}`:`+ ${full}`}</button>;
                    })}
                  </div>
                </div>;
              })}
            </div>
          </div>
        ))}
        {(form.fonteTitulo||form.fonteCorpo)&&<div style={{background:C.surf3,border:`1px solid ${co.color}30`,borderRadius:11,padding:"14px"}}>
          <div style={{fontSize:9,color:C.muted,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Preview da combinação</div>
          {form.fonteTitulo&&<div style={{fontFamily:`'${form.fonteTitulo}',sans-serif`,fontSize:24,color:C.text,marginBottom:4}}>{form.nomeFantasia||"Nome da Marca"}</div>}
          {form.fonteCorpo&&<div style={{fontFamily:`'${form.fonteCorpo}',sans-serif`,fontSize:13,color:C.muted}}>{form.slogan||"Texto de corpo — legenda e descrições usam esta fonte"}</div>}
        </div>}
      </Sec>

      <Sec title="Paleta de Cores" accent={co.color}>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:9}}>Paletas prontas — clique para aplicar as 3 cores:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {COLOR_PRESETS.map(cp=>(
              <div key={cp.n} onClick={()=>{upd("corPrimaria",cp.p);upd("corSecundaria",cp.s);upd("corAcento",cp.a);}} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:`1px solid ${C.border2}`,minWidth:68,transition:"transform .12s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{display:"flex",height:26}}><div style={{flex:1,background:cp.p}} /><div style={{flex:1,background:cp.s}} /><div style={{flex:1,background:cp.a}} /></div>
                <div style={{fontSize:9,color:C.muted,padding:"3px 6px",background:C.surf2,textAlign:"center"}}>{cp.n}</div>
              </div>
            ))}
          </div>
        </div>
        <G3 ch={[["corPrimaria","Primária"],["corSecundaria","Secundária"],["corAcento","Acento"]].map(([k,l])=>(
          <F key={k} label={l}><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={form[k]||"#000"} onChange={e=>upd(k,e.target.value)} style={{width:42,height:38,border:`1px solid ${C.border2}`,borderRadius:8,cursor:"pointer",background:"none",padding:2}} /><input type="text" value={form[k]||""} onChange={e=>upd(k,e.target.value)} placeholder="#RRGGBB" style={{...inp,width:100}} /></div></F>
        ))} />
        {form.corPrimaria&&<div style={{display:"flex",gap:10,alignItems:"center",marginTop:8,padding:"12px",background:C.surf3,borderRadius:10}}>
          {[form.corPrimaria,form.corSecundaria,form.corAcento].map((c,i)=><div key={i} style={{width:36,height:36,borderRadius:8,background:c,border:`1px solid ${C.border}`}} />)}
          <div style={{marginLeft:8,padding:"8px 18px",borderRadius:9,background:form.corPrimaria,color:"#fff",fontSize:13,fontWeight:700}}>{form.nomeFantasia||"Preview"}</div>
          <div style={{padding:"8px 14px",borderRadius:9,background:"transparent",border:`2px solid ${form.corSecundaria}`,color:form.corSecundaria,fontSize:12,fontWeight:700}}>Secundário</div>
        </div>}
      </Sec>

      <Sec title="Personalidade" accent={co.color}>
        <G2 ch={[
          <F label="Sentimento da marca"><Sel k="sentimentoMarca" opts={[["profissional","Profissional"],["descontraido","Descontraído"],["luxo","Luxo"],["espiritual","Espiritual"],["tecnico","Técnico"],["empoderador","Empoderador"],["acolhedor","Acolhedor"]]} /></F>,
          <F label="Faixa de preço"><Sel k="faixaPreco" opts={[["popular","Popular"],["medio","Médio"],["premium","Premium"],["ultra","Ultra Premium"]]} /></F>,
        ]} />
      </Sec>
    </>;
  }

  // ─── PRODUTOS ──────────────────────────────────────────────────────────────
  function TabProdutos(){
    const prods=form.produtos||[];
    const [editing,setEditing]=useState(null);
    const [draft,setDraft]=useState(null);
    const pu=(k,v)=>setDraft(p=>({...p,[k]:v}));

    function newProd(){ setDraft({id:Date.now(),nome:"",subtitulo:"",descricao:"",publicoAlvo:"",preco:"",link:"",ativo:true,emoji:"📦"}); setEditing("new"); }
    function editProd(p){ setDraft({...p}); setEditing(p.id); }
    function saveProd(){ const next=editing==="new"?[...prods,draft]:prods.map(p=>p.id===editing?draft:p); upd("produtos",next); setEditing(null); setDraft(null); }
    function delProd(id){ upd("produtos",prods.filter(p=>p.id!==id)); }

    if(editing&&draft) return <>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <button onClick={()=>{setEditing(null);setDraft(null);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>← Voltar</button>
        <h2 style={{margin:0,fontSize:16,fontWeight:700}}>{editing==="new"?"Novo Produto":"Editar Produto"}</h2>
      </div>
      <Sec title="Dados do Produto" accent={co.color}>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <F label="Emoji"><input value={draft.emoji||""} onChange={e=>pu("emoji",e.target.value)} placeholder="📦" style={{...inp,width:60,fontSize:20,textAlign:"center",fontFamily:"inherit"}} /></F>
          <div style={{flex:1}}><F label="Nome do produto / serviço" req><input value={draft.nome} onChange={e=>pu("nome",e.target.value)} placeholder="Nome completo" style={{...inp,fontFamily:"inherit"}} /></F></div>
          <div style={{flex:1}}><F label="Subtítulo / tagline"><input value={draft.subtitulo||""} onChange={e=>pu("subtitulo",e.target.value)} placeholder="Breve descrição" style={{...inp,fontFamily:"inherit"}} /></F></div>
        </div>
        <F label="Descrição completa"><textarea value={draft.descricao||""} onChange={e=>pu("descricao",e.target.value)} placeholder="O que é, o que entrega, diferenciais..." rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
        <G3 ch={[
          <F label="Público-alvo"><input value={draft.publicoAlvo||""} onChange={e=>pu("publicoAlvo",e.target.value)} placeholder="Para quem é" style={{...inp,fontFamily:"inherit"}} /></F>,
          <F label="Preço / Faixa"><input value={draft.preco||""} onChange={e=>pu("preco",e.target.value)} placeholder="R$ ou faixa" style={{...inp,fontFamily:"inherit"}} /></F>,
          <F label="Link de venda / info"><input value={draft.link||""} onChange={e=>pu("link",e.target.value)} placeholder="https://…" style={{...inp,fontFamily:"inherit"}} /></F>,
        ]} />
        <Toggle val={draft.ativo!==false} onChange={v=>pu("ativo",v)} label="Produto ativo — aparece no planejamento de conteúdo" />
      </Sec>
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={()=>{setEditing(null);setDraft(null);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:13}}>Cancelar</button>
        <button onClick={saveProd} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 26px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>✓ Salvar produto</button>
      </div>
    </>;

    return <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:18,fontWeight:700}}>📦 Produtos & Serviços</h2><p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Cada produto pode ter seu próprio conteúdo e público</p></div>
        <button onClick={newProd} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 20px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>+ Novo produto</button>
      </div>

      {/* Example hint for Das G */}
      {co.id==="dasg"&&prods.length===0&&<InfoBox color={co.color}>💡 <strong style={{color:C.text}}>Das G</strong> tem produtos como o <strong style={{color:C.text}}>Ateliê</strong> e o <strong style={{color:C.text}}>Estilista Express</strong>. Cada um pode ter seu próprio conteúdo, público e campanha.</InfoBox>}

      {prods.length===0&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>📦</div><div style={{color:C.muted,fontSize:13}}>Nenhum produto cadastrado</div></div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {prods.map(p=>(
          <div key={p.id} style={{background:C.surf,border:`1px solid ${p.ativo?co.color+"25":C.border}`,borderRadius:14,padding:"16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:p.ativo?co.color:C.hint}} />
            <div style={{paddingLeft:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><div style={{fontWeight:700,fontSize:15}}>{p.emoji} {p.nome}</div>{p.subtitulo&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{p.subtitulo}</div>}</div>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>editProd(p)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Editar</button>
                  <button onClick={()=>delProd(p.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              </div>
              {p.descricao&&<p style={{fontSize:12,color:C.muted,margin:"0 0 8px",lineHeight:1.4}}>{p.descricao.slice(0,100)}{p.descricao.length>100?"…":""}</p>}
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.publicoAlvo&&<Badge color={co.color}>👥 {p.publicoAlvo}</Badge>}
                {p.preco&&<Badge color={C.gold}>{p.preco}</Badge>}
                {!p.ativo&&<Badge color={C.muted}>Inativo</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>;
  }

  // ─── PÚBLICOS ──────────────────────────────────────────────────────────────
  function TabPublicos(){
    const pubs=form.publicos||[];
    const prods=form.produtos||[];
    const [editing,setEditing]=useState(null);
    const [draft,setDraft]=useState(null);
    const pu=(k,v)=>setDraft(p=>({...p,[k]:v}));

    function newPub(){ setDraft({id:Date.now(),nome:"",produto:"",descricao:"",idadeMin:"",idadeMax:"",genero:"ambos",localPublico:"",renda:"",dores:"",desejos:"",comoResolve:"",ctaPref:"whatsapp"}); setEditing("new"); }
    function editPub(p){ setDraft({...p}); setEditing(p.id); }
    function savePub(){ const next=editing==="new"?[...pubs,draft]:pubs.map(p=>p.id===editing?draft:p); upd("publicos",next); setEditing(null); setDraft(null); }
    function delPub(id){ upd("publicos",pubs.filter(p=>p.id!==id)); }

    if(editing&&draft) return <>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <button onClick={()=>{setEditing(null);setDraft(null);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>← Voltar</button>
        <h2 style={{margin:0,fontSize:16,fontWeight:700}}>{editing==="new"?"Novo Público":"Editar Público"}</h2>
      </div>
      <Sec title="Identificação" accent={co.color}>
        <G2 ch={[
          <F label="Nome do segmento" req><input value={draft.nome} onChange={e=>pu("nome",e.target.value)} placeholder="Ex: Noivas em planejamento" style={{...inp,fontFamily:"inherit"}} /></F>,
          <F label="Produto vinculado"><select value={draft.produto||""} onChange={e=>pu("produto",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Todos os produtos</option>{prods.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.nome}</option>)}</select></F>,
        ]} />
        <F label="Descrição do cliente ideal"><textarea value={draft.descricao||""} onChange={e=>pu("descricao",e.target.value)} placeholder="Quem é, como vive, o que busca, estilo de vida..." rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
        <G3 ch={[
          <F label="Idade mín."><input type="number" value={draft.idadeMin||""} onChange={e=>pu("idadeMin",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>,
          <F label="Idade máx."><input type="number" value={draft.idadeMax||""} onChange={e=>pu("idadeMax",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>,
          <F label="Gênero"><select value={draft.genero} onChange={e=>pu("genero",e.target.value)} style={{...inp,cursor:"pointer"}}>{[["ambos","Ambos"],["fem","Feminino"],["masc","Masculino"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>,
        ]} />
        <G2 ch={[
          <F label="Localização"><select value={draft.localPublico||""} onChange={e=>pu("localPublico",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Selecionar…</option>{[["nacional","Nacional"],["regional","Regional"],["estadual","Estadual"],["municipal","Municipal"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>,
          <F label="Renda estimada"><select value={draft.renda||""} onChange={e=>pu("renda",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Selecionar…</option>{[["c","Classe C"],["b","Classe B"],["ab","Classes A/B"],["a","Classe A"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>,
        ]} />
      </Sec>
      <Sec title="Dores, Desejos e Solução" accent={co.color}>
        <F label="Principais dores"><textarea value={draft.dores||""} onChange={e=>pu("dores",e.target.value)} placeholder="O que tira o sono deste público..." rows={2} style={{...inp,resize:"vertical"}} /></F>
        <F label="O que desejam alcançar"><textarea value={draft.desejos||""} onChange={e=>pu("desejos",e.target.value)} placeholder="Sonhos, objetivos e transformação que buscam..." rows={2} style={{...inp,resize:"vertical"}} /></F>
        <F label="Como a marca resolve"><textarea value={draft.comoResolve||""} onChange={e=>pu("comoResolve",e.target.value)} placeholder="Solução específica que entregamos para este segmento..." rows={2} style={{...inp,resize:"vertical"}} /></F>
        <F label="CTA preferido"><select value={draft.ctaPref||""} onChange={e=>pu("ctaPref",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Selecionar…</option>{[["whatsapp","WhatsApp"],["dm","DM Instagram"],["site","Site"],["telefone","Ligar"],["bio","Link na bio"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></F>
      </Sec>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>{setEditing(null);setDraft(null);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:13}}>Cancelar</button>
        <button onClick={savePub} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 26px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>✓ Salvar público</button>
      </div>
    </>;

    return <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:18,fontWeight:700}}>👥 Perfis de Público</h2><p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Segmente seus públicos por produto</p></div>
        <button onClick={newPub} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 20px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>+ Novo público</button>
      </div>
      {pubs.length===0&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>👥</div><div style={{color:C.muted}}>Nenhum público cadastrado</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {pubs.map(p=>{const prod=form.produtos?.find(x=>x.id==p.produto); return <div key={p.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div><div style={{fontWeight:700,fontSize:14}}>{p.nome}</div>{prod&&<div style={{fontSize:11,color:co.color,marginTop:2}}>{prod.emoji} {prod.nome}</div>}</div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>editPub(p)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Editar</button>
              <button onClick={()=>delPub(p.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button>
            </div>
          </div>
          <p style={{fontSize:12,color:C.muted,margin:"0 0 8px",lineHeight:1.4}}>{p.descricao?.slice(0,90)||"Sem descrição"}{p.descricao?.length>90?"…":""}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {p.idadeMin&&p.idadeMax&&<Badge color={co.color}>{p.idadeMin}–{p.idadeMax} anos</Badge>}
            {p.genero&&p.genero!=="ambos"&&<Badge color={C.muted}>{p.genero==="fem"?"Feminino":"Masculino"}</Badge>}
            {p.renda&&<Badge color={C.gold}>Classe {p.renda.toUpperCase()}</Badge>}
          </div>
        </div>;})}
      </div>
    </>;
  }

  // ─── REDES SOCIAIS + WHATSAPP ECOSYSTEM ───────────────────────────────────
  function TabRedes(){
    const waCanais=form.waCanais||[];
    const waListas=form.waListas||[];
    const waGrupos=form.waGrupos||[];

    function addCanal(){ upd("waCanais",[...waCanais,{id:Date.now(),nome:"",link:"",inscritos:"",autoPost:false}]); }
    function updCanal(id,k,v){ upd("waCanais",waCanais.map(x=>x.id===id?{...x,[k]:v}:x)); }
    function delCanal(id){ upd("waCanais",waCanais.filter(x=>x.id!==id)); }

    function addLista(){ upd("waListas",[...waListas,{id:Date.now(),nome:"",contatos:"",autoPost:false,freq:""}]); }
    function updLista(id,k,v){ upd("waListas",waListas.map(x=>x.id===id?{...x,[k]:v}:x)); }
    function delLista(id){ upd("waListas",waListas.filter(x=>x.id!==id)); }

    function addGrupo(){ upd("waGrupos",[...waGrupos,{id:Date.now(),nome:"",admin:false,membros:"",autoPost:false,freq:""}]); }
    function updGrupo(id,k,v){ upd("waGrupos",waGrupos.map(x=>x.id===id?{...x,[k]:v}:x)); }
    function delGrupo(id){ upd("waGrupos",waGrupos.filter(x=>x.id!==id)); }

    return <>
      {/* Instagram */}
      <Sec title="Instagram" accent="#E1306C">
        <G2 ch={[<F label="@ do perfil"><I k="igHandle" ph="@suamarca" /></F>,<F label="URL do perfil"><I k="igUrl" ph="https://instagram.com/…" /></F>]} />
        <G3 ch={[<F label="Seguidores"><I k="igSeg" ph="1500" type="number" /></F>,<F label="Posts/semana"><I k="igFreq" ph="5" type="number" /></F>,<F label="Publicação automática"><div style={{marginTop:6}}><Toggle val={form.igAutoPost} onChange={v=>upd("igAutoPost",v)} label={form.igAutoPost?"Ativada":"Desativada"} /></div></F>]} />
      </Sec>

      {/* Facebook */}
      <Sec title="Facebook" accent="#1877F2">
        <G2 ch={[<F label="URL da página"><I k="fbUrl" ph="https://facebook.com/…" /></F>,<F label="Page ID"><I k="fbPageId" ph="000000000000" /></F>]} />
        <G2 ch={[<F label="Seguidores"><I k="fbSeg" ph="850" type="number" /></F>,<F label="Publicação automática"><div style={{marginTop:6}}><Toggle val={form.fbAutoPost} onChange={v=>upd("fbAutoPost",v)} label={form.fbAutoPost?"Ativada":"Desativada"} /></div></F>]} />
      </Sec>

      {/* TikTok */}
      <Sec title="TikTok" accent="#FF0050">
        <G3 ch={[<F label="@ do perfil"><I k="ttHandle" ph="@suamarca" /></F>,<F label="Seguidores"><I k="ttSeg" ph="500" type="number" /></F>,<F label="Publicação automática"><div style={{marginTop:6}}><Toggle val={form.ttAutoPost} onChange={v=>upd("ttAutoPost",v)} label={form.ttAutoPost?"Ativada":"Desativada"} /></div></F>]} />
      </Sec>

      {/* WhatsApp Business */}
      <Sec title="WhatsApp Business" accent="#25D366">
        <G2 ch={[<F label="Nome no WA Business"><I k="waNome" ph="Nome exibido no contato" /></F>,<F label="Número (DDI+DDD)"><I k="waNumero" ph="+55 14 9 9999-9999" /></F>]} />
      </Sec>

      {/* Canal do WhatsApp */}
      <Sec title="Canal do WhatsApp" accent="#25D366">
        <InfoBox color="#25D366">Canais do WhatsApp são o broadcast oficial da marca — seguidores recebem como newsletter. Ideal para conteúdo regular e promoções.</InfoBox>
        {waCanais.map((canal,i)=>(
          <div key={canal.id} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:C.text}}>📢 Canal {i+1}</span>
              <button onClick={()=>delCanal(canal.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 9px",borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr",gap:10,marginBottom:10}}>
              <F label="Nome do canal"><input value={canal.nome} onChange={e=>updCanal(canal.id,"nome",e.target.value)} placeholder="@Canal da marca" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Link do canal"><input value={canal.link} onChange={e=>updCanal(canal.id,"link",e.target.value)} placeholder="https://whatsapp.com/channel/…" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Inscritos"><input value={canal.inscritos} onChange={e=>updCanal(canal.id,"inscritos",e.target.value)} type="number" placeholder="0" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
            </div>
            <Toggle val={canal.autoPost} onChange={v=>updCanal(canal.id,"autoPost",v)} label="Postagem automática no canal" />
          </div>
        ))}
        <button onClick={addCanal} style={{width:"100%",background:"none",border:`1.5px dashed #25D36640`,color:"#25D366",padding:"10px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700}}>+ Adicionar canal do WhatsApp</button>
      </Sec>

      {/* Listas de Transmissão */}
      <Sec title="Listas de Transmissão" accent="#25D366">
        <InfoBox color="#25D366">Listas de transmissão enviam mensagens individualmente para cada contato — parece mensagem direta. Excelente para ofertas personalizadas e comunicados VIP.</InfoBox>
        {waListas.map((lista,i)=>(
          <div key={lista.id} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:C.text}}>📩 Lista {i+1}</span>
              <button onClick={()=>delLista(lista.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 9px",borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10}}>
              <F label="Nome da lista"><input value={lista.nome} onChange={e=>updLista(lista.id,"nome",e.target.value)} placeholder="Ex: Clientes VIP, Leads quentes" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Contatos"><input value={lista.contatos} onChange={e=>updLista(lista.id,"contatos",e.target.value)} type="number" placeholder="0" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Frequência"><input value={lista.freq} onChange={e=>updLista(lista.id,"freq",e.target.value)} placeholder="Semanal" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
            </div>
            <Toggle val={lista.autoPost} onChange={v=>updLista(lista.id,"autoPost",v)} label="Envio automático nesta lista" />
          </div>
        ))}
        <button onClick={addLista} style={{width:"100%",background:"none",border:`1.5px dashed #25D36640`,color:"#25D366",padding:"10px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700}}>+ Adicionar lista de transmissão</button>
      </Sec>

      {/* Grupos do WhatsApp */}
      <Sec title="Grupos do WhatsApp" accent="#25D366">
        <InfoBox color="#25D366">Grupos permitem interação entre membros — ótimo para comunidade, suporte e engajamento. Configure postagens automáticas nos grupos onde você é admin.</InfoBox>
        {waGrupos.map((grupo,i)=>(
          <div key={grupo.id} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:C.text}}>💬 Grupo {i+1}</span>
              <button onClick={()=>delGrupo(grupo.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 9px",borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10}}>
              <F label="Nome do grupo"><input value={grupo.nome} onChange={e=>updGrupo(grupo.id,"nome",e.target.value)} placeholder="Nome do grupo WA" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Membros"><input value={grupo.membros} onChange={e=>updGrupo(grupo.id,"membros",e.target.value)} type="number" placeholder="0" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
              <F label="Frequência post"><input value={grupo.freq} onChange={e=>updGrupo(grupo.id,"freq",e.target.value)} placeholder="3x/semana" style={{...inp,fontSize:12,fontFamily:"inherit"}} /></F>
            </div>
            <div style={{display:"flex",gap:20}}>
              <Toggle val={grupo.admin} onChange={v=>updGrupo(grupo.id,"admin",v)} label="Sou administrador" />
              <Toggle val={grupo.autoPost} onChange={v=>updGrupo(grupo.id,"autoPost",v)} label={grupo.admin?"Postagem automática":"Auto post (somente admin)"} />
            </div>
          </div>
        ))}
        <button onClick={addGrupo} style={{width:"100%",background:"none",border:`1.5px dashed #25D36640`,color:"#25D366",padding:"10px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700}}>+ Adicionar grupo do WhatsApp</button>
      </Sec>

      {/* YouTube */}
      <Sec title="YouTube (opcional)" accent="#FF0000">
        <G2 ch={[<F label="URL do canal"><I k="ytUrl" ph="https://youtube.com/@suamarca" /></F>,<F label="Inscritos"><I k="ytSeg" ph="0" type="number" /></F>]} />
      </Sec>

      {/* Hashtags */}
      <Sec title="Hashtags & Conteúdo" accent={co.color}>
        <F label="Hashtags padrão desta empresa"><TA k="hashtags" ph="#suamarca #nicho #cidade…" rows={2} /></F>
        <G2 ch={[<F label="Conteúdo que mais performa"><TA k="melhorConteudo" ph="Reels de resultado, antes/depois…" rows={2} /></F>,<F label="Metas 90 dias"><TA k="metaRedes" ph="X seguidores, Y leads/mês…" rows={2} /></F>]} />
      </Sec>
    </>;
  }

  // ─── CONTEÚDO ─────────────────────────────────────────────────────────────
  function TabConteudo(){
    const pubs=form.publicos||[];
    const pcList=form.perfilConteudo||[];
    const [sel,setSel]=useState(pubs[0]?.id||null);
    const pc=pcList.find(p=>p.publicoId===sel)||{};
    const updPC=(k,v)=>{ const next=pcList.find(p=>p.publicoId===sel)?pcList.map(p=>p.publicoId===sel?{...p,[k]:v}:p):[...pcList,{publicoId:sel,[k]:v}]; upd("perfilConteudo",next); };
    if(!pubs.length) return <div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>📋</div><div style={{color:C.muted}}>Crie públicos primeiro na aba Públicos</div></div>;
    return <>
      <h2 style={{margin:"0 0 6px",fontSize:18,fontWeight:700}}>📋 Perfil de Conteúdo por Público</h2>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.muted}}>Estratégia específica de conteúdo por segmento</p>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {pubs.map(p=><button key={p.id} onClick={()=>setSel(p.id)} style={{padding:"6px 16px",borderRadius:20,cursor:"pointer",fontSize:12,border:`1px solid ${sel===p.id?co.color+"80":C.border2}`,background:sel===p.id?co.color+"18":C.surf,color:sel===p.id?co.color:C.muted,fontWeight:sel===p.id?700:400}}>{p.nome}</button>)}
      </div>
      {sel&&<>
        <Sec title="Pilares de Conteúdo" accent={co.color}>
          <F label="Tópicos frequentes"><textarea value={pc.topicosSempre||""} onChange={e=>updPC("topicosSempre",e.target.value)} placeholder="Transformações, dicas, bastidores, depoimentos..." rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
          <F label="Tópicos proibidos"><input value={pc.topicosNunca||""} onChange={e=>updPC("topicosNunca",e.target.value)} placeholder="Assuntos a evitar..." style={{...inp,fontFamily:"inherit"}} /></F>
        </Sec>
        <Sec title="Frequência por Tipo" accent={co.color}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Posts feed","freqFeed","5x/sem"],["Stories","freqStory","Diário"],["Reels","freqReel","3x/sem"],["WhatsApp","freqWa","Diário"],["TikTok","freqTt","3x/sem"],["Carrossel","freqCar","2x/sem"]].map(([l,k,ph])=>(
              <F key={k} label={l}><input value={pc[k]||""} onChange={e=>updPC(k,e.target.value)} placeholder={ph} style={{...inp,fontFamily:"inherit"}} /></F>
            ))}
          </div>
        </Sec>
        <Sec title="Tom e Abordagem" accent={co.color}>
          <F label="Tom de voz para este segmento"><textarea value={pc.tom||""} onChange={e=>updPC("tom",e.target.value)} placeholder="Como a marca fala com este público..." rows={2} style={{...inp,resize:"vertical"}} /></F>
          <G2 ch={[<F label="Hashtags do segmento"><textarea value={pc.hashtags||""} onChange={e=>updPC("hashtags",e.target.value)} placeholder="#segmento…" rows={2} style={{...inp,resize:"vertical"}} /></F>,<F label="Hooks que funcionam"><textarea value={pc.hooks||""} onChange={e=>updPC("hooks",e.target.value)} placeholder='"Você sabia…" / "Em 30 dias…"' rows={2} style={{...inp,resize:"vertical"}} /></F>]} />
        </Sec>
      </>}
    </>;
  }

  // ─── OS ───────────────────────────────────────────────────────────────────
  function TabOS(){
    const ordens=form.ordens||[];
    const pubs=form.publicos||[];
    const [nova,setNova]=useState(false);
    const [os,setOs]=useState({tipo:"Promoção",titulo:"",briefing:"",publicoId:"",plataformas:[],prazo:"",urgente:false});
    const togP=p=>setOs(o=>({...o,plataformas:o.plataformas.includes(p)?o.plataformas.filter(x=>x!==p):[...o.plataformas,p]}));
    function addOS(){ upd("ordens",[...ordens,{...os,id:Date.now(),status:"Rascunho",em:new Date().toLocaleDateString("pt-BR")}]); setNova(false); setOs({tipo:"Promoção",titulo:"",briefing:"",publicoId:"",plataformas:[],prazo:"",urgente:false}); flash("✓ OS criada!","teal"); }
    function updS(id,s){ upd("ordens",ordens.map(o=>o.id===id?{...o,status:s}:o)); }
    function delOS(id){ upd("ordens",ordens.filter(o=>o.id!==id)); }
    return <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:18,fontWeight:700}}>🎫 Ordens de Serviço</h2><p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Conteúdos extras fora do calendário regular</p></div>
        <button onClick={()=>setNova(!nova)} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 18px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>+ Nova OS</button>
      </div>
      {nova&&<div style={{background:G.glow,border:`1px solid #F5A62325`,borderRadius:14,padding:"20px",marginBottom:18}}>
        <G2 ch={[<F label="Tipo"><select value={os.tipo} onChange={e=>setOs(o=>({...o,tipo:e.target.value}))} style={{...inp,cursor:"pointer"}}>{OS_TYPES.map(t=><option key={t}>{t}</option>)}</select></F>,<F label="Título da peça"><input value={os.titulo} onChange={e=>setOs(o=>({...o,titulo:e.target.value}))} placeholder="Nome interno" style={{...inp,fontFamily:"inherit"}} /></F>]} />
        <F label="Briefing detalhado" help="Texto, oferta, produto, imagem desejada — quanto mais detalhe, melhor o resultado"><textarea value={os.briefing} onChange={e=>setOs(o=>({...o,briefing:e.target.value}))} rows={4} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
        <G2 ch={[<F label="Público"><select value={os.publicoId} onChange={e=>setOs(o=>({...o,publicoId:e.target.value}))} style={{...inp,cursor:"pointer"}}><option value="">Todos</option>{pubs.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></F>,<F label="Prazo"><input type="date" value={os.prazo} onChange={e=>setOs(o=>({...o,prazo:e.target.value}))} style={{...inp,fontFamily:"inherit"}} /></F>]} />
        <F label="Plataformas"><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{"Instagram,Facebook,TikTok,WhatsApp,Canal WA,Grupos WA,Stories,Reels".split(",").map(p=>{const on=os.plataformas.includes(p);return<button key={p} onClick={()=>togP(p)} style={{padding:"5px 13px",borderRadius:20,cursor:"pointer",fontSize:12,border:`1px solid ${on?"#F5A62380":C.border2}`,background:on?"#F5A62318":C.surf3,color:on?"#F5A623":C.muted,fontWeight:on?700:400}}>{p}</button>;})}</div></F>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:C.text,marginBottom:16}}><input type="checkbox" checked={os.urgente} onChange={e=>setOs(o=>({...o,urgente:e.target.checked}))} />🚨 Urgente — prioridade máxima</label>
        <div style={{display:"flex",gap:10}}><button onClick={()=>setNova(false)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:13}}>Cancelar</button><button onClick={addOS} disabled={!os.titulo} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 24px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,opacity:os.titulo?1:.4,boxShadow:`0 4px 18px ${T.primary}35`}}>✓ Criar OS</button></div>
      </div>}
      {ordens.length===0&&!nova&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>🎫</div><div style={{color:C.muted}}>Nenhuma OS criada</div></div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[...ordens].reverse().map(o=>{const pub=pubs.find(p=>p.id==o.publicoId);const sc=OS_STATUS[o.status]||C.muted;return<div key={o.id} style={{background:C.surf,border:`1px solid ${o.urgente?"#FF456620":C.border}`,borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:6}}>{o.urgente&&<Badge color="#E8890C">🚨 URGENTE</Badge>}<Badge color={co.color}>{o.tipo}</Badge><Badge color={sc}>{o.status}</Badge>{pub&&<span style={{fontSize:10,color:C.hint}}>👥 {pub.nome}</span>}</div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{o.titulo}</div>
              <div style={{fontSize:12,color:C.muted}}>{o.briefing?.slice(0,100)}{o.briefing?.length>100?"…":""}</div>
              {o.prazo&&<div style={{fontSize:11,color:C.hint,marginTop:4}}>📅 {o.prazo}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <select value={o.status} onChange={e=>updS(o.id,e.target.value)} style={{background:C.surf3,border:`1px solid ${C.border2}`,color:C.text,padding:"5px 8px",borderRadius:7,fontSize:11,cursor:"pointer"}}>
                {Object.keys(OS_STATUS).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={()=>delOS(o.id)} style={{background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>Excluir</button>
            </div>
          </div>
        </div>;})}
      </div>
    </>;
  }

  // ─── CALENDÁRIO ───────────────────────────────────────────────────────────
  function TabCalendario(){
    const agenda=form.agenda||[];
    const pubs=form.publicos||[];
    const [novo,setNovo]=useState(false);
    const [item,setItem]=useState({tipo:"Post Feed",titulo:"",legenda:"",publicoId:"",plataforma:"Instagram",data:"",hora:"09:00",status:"Rascunho"});
    const [waP,setWaP]=useState(null);
    const [altMsg,setAltMsg]=useState("");
    const iu=(k,v)=>setItem(p=>({...p,[k]:v}));
    function addItem(){ upd("agenda",[...agenda,{...item,id:Date.now()}]); setNovo(false); flash("✓ Adicionado ao calendário","teal"); }
    function updS(id,s,extra={}){ upd("agenda",agenda.map(a=>a.id===id?{...a,status:s,...extra}:a)); }
    function sendApproval(it){ updS(it.id,"Ag. aprovação"); setWaP(it); flash("📱 Enviado para WhatsApp!","teal"); }
    function approve(it){ updS(it.id,"Aprovado"); setWaP(null); flash("✅ Aprovado — será agendado!","teal"); }
    function reqChange(it){ if(!altMsg.trim()) return; updS(it.id,"Alteração",{alteracaoMsg:altMsg}); setAltMsg(""); setWaP(null); flash("✏️ Alteração registrada","gold"); }
    const SC={"Rascunho":C.muted,"Ag. aprovação":"#A0C4FF","Alteração":"#E8890C","Aprovado":"#FFD580","Agendado":"#DDD6FE","Publicado":"#10B981"};
    const plats=["Instagram","Facebook","TikTok","WhatsApp","Canal WA","Lista WA","Grupo WA","Stories","Reels","YouTube","Todas"];
    return <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:18,fontWeight:700}}>📅 Calendário Editorial</h2><p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Planeje, aprove via WhatsApp e agende automaticamente</p></div>
        <button onClick={()=>setNovo(!novo)} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 18px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>+ Adicionar</button>
      </div>

      {/* WA Approval */}
      {waP&&<div style={{background:"#25D36608",border:"1px solid #25D36635",borderRadius:14,padding:"18px",marginBottom:18}}>
        <div style={{fontSize:11,fontWeight:700,color:"#25D366",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>📱 Preview — Mensagem enviada ao WhatsApp</div>
        <div style={{background:"#0d1f0d",borderRadius:12,padding:"16px",maxWidth:380,marginBottom:14}}>
          <div style={{fontSize:10,color:"#25D36680",marginBottom:8}}>📲 {form.waNome||form.responsavel||"Responsável"}</div>
          <div style={{background:"#25D36618",borderRadius:"12px 12px 12px 2px",padding:"12px"}}>
            <div style={{fontSize:13,color:C.text,fontWeight:700,marginBottom:6}}>🤖 Social Agent — Aprovação</div>
            <div style={{fontSize:12,color:"#A0C0A0",lineHeight:1.6}}>
              <div style={{marginBottom:3}}>📋 <strong style={{color:C.text}}>{waP.tipo}</strong> — {waP.plataforma}</div>
              <div style={{marginBottom:3}}>📅 {waP.data} às {waP.hora}</div>
              <div style={{marginBottom:8}}>{waP.legenda?.slice(0,100)||waP.titulo}…</div>
              <div style={{borderTop:"1px solid #ffffff15",paddingTop:8,fontSize:11}}>Responda:<br/><strong style={{color:"#25D366"}}>✅ APROVAR</strong> ou <strong style={{color:"#F5A623"}}>✏️ sua alteração</strong></div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:1}}><label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>Simular resposta:</label><input value={altMsg} onChange={e=>setAltMsg(e.target.value)} placeholder="Alteração ou deixe vazio para aprovar…" style={{...inp,fontFamily:"inherit"}} /></div>
          <button onClick={()=>approve(waP)} style={{background:"#25D366",color:"#fff",border:"none",padding:"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,flexShrink:0}}>✅ Aprovar</button>
          <button onClick={()=>reqChange(waP)} disabled={!altMsg} style={{background:altMsg?G.primary:"none",color:altMsg?"#fff":T.primaryXL,border:`1px solid ${T.border2}`,padding:"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,flexShrink:0,display:"flex",alignItems:"center",gap:6}}><Edit3 size={13}/> Solicitar alteração</button>
        </div>
        <button onClick={()=>setWaP(null)} style={{marginTop:8,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11}}>Fechar</button>
      </div>}

      {novo&&<div style={{background:C.surf,border:`1px solid #F5A62325`,borderRadius:14,padding:"20px",marginBottom:18}}>
        <G3 ch={[<F label="Tipo"><select value={item.tipo} onChange={e=>iu("tipo",e.target.value)} style={{...inp,cursor:"pointer"}}>{["Post Feed","Reel","Story","Carrossel","WhatsApp","Canal WA","Lista WA","Grupo WA","TikTok"].map(t=><option key={t}>{t}</option>)}</select></F>,<F label="Plataforma"><select value={item.plataforma} onChange={e=>iu("plataforma",e.target.value)} style={{...inp,cursor:"pointer"}}>{plats.map(t=><option key={t}>{t}</option>)}</select></F>,<F label="Público"><select value={item.publicoId} onChange={e=>iu("publicoId",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Geral</option>{pubs.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></F>]} />
        <F label="Título"><input value={item.titulo} onChange={e=>iu("titulo",e.target.value)} placeholder="Nome interno" style={{...inp,fontFamily:"inherit"}} /></F>
        <F label="Legenda / Texto" help="Pode ser gerado pela IA"><textarea value={item.legenda} onChange={e=>iu("legenda",e.target.value)} rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
        <G2 ch={[<F label="Data"><input type="date" value={item.data} onChange={e=>iu("data",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>,<F label="Horário"><input type="time" value={item.hora} onChange={e=>iu("hora",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>]} />
        <div style={{display:"flex",gap:10,marginTop:8}}><button onClick={()=>setNovo(false)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:13}}>Cancelar</button><button onClick={addItem} disabled={!item.titulo||!item.data} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 24px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${T.primary}35`}}>✓ Adicionar</button></div>
      </div>}

      {/* Stats */}
      {agenda.length>0&&<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {Object.entries(SC).map(([s,c])=>{const n=agenda.filter(a=>a.status===s).length;return n>0&&<Badge key={s} color={c}>{n} {s}</Badge>;})}
        {agenda.some(a=>a.status==="Rascunho"||a.status==="Alteração")&&<button onClick={()=>{const p=agenda.find(a=>a.status==="Rascunho"||a.status==="Alteração");if(p)sendApproval(p);}} style={{marginLeft:"auto",background:G.primary,color:"#fff",border:"none",padding:"7px 16px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}><Send size={12}/> Enviar para aprovação</button>}
      </div>}

      {agenda.length===0&&!novo&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>📅</div><div style={{color:C.muted}}>Calendário vazio</div></div>}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...agenda].sort((a,b)=>a.data>b.data?1:-1).map(a=>{
          const pub=pubs.find(p=>p.id==a.publicoId);const sc=SC[a.status]||C.muted;
          return <div key={a.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 16px",display:"flex",gap:12}}>
            <div style={{width:3,background:sc,borderRadius:2,flexShrink:0}} />
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}><Badge color={co.color}>{a.tipo}</Badge><Badge color={C.blue}>{a.plataforma}</Badge><Badge color={sc}>{a.status}</Badge>{pub&&<span style={{fontSize:10,color:C.hint}}>👥 {pub.nome}</span>}</div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{a.titulo}</div>
              {a.legenda&&<div style={{fontSize:12,color:C.muted}}>{a.legenda.slice(0,80)}{a.legenda.length>80?"…":""}</div>}
              {a.alteracaoMsg&&<div style={{fontSize:11,background:"#FF456615",border:"1px solid #FF456630",borderRadius:6,padding:"5px 9px",color:"#F5A623",marginTop:4}}>✏️ {a.alteracaoMsg}</div>}
              <div style={{fontSize:11,color:C.hint,marginTop:4}}>📅 {a.data} {a.hora}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
              {(a.status==="Rascunho"||a.status==="Alteração")&&<button onClick={()=>sendApproval(a)} style={{fontSize:11,background:"#25D36618",border:"1px solid #25D36640",color:"#25D366",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontWeight:700}}>📱 WA</button>}
              {a.status==="Aprovado"&&<button onClick={()=>updS(a.id,"Agendado")} style={{fontSize:11,background:C.purple+"18",border:`1px solid ${C.purple}40`,color:C.purple,padding:"4px 10px",borderRadius:7,cursor:"pointer",fontWeight:700}}>📅 Agendar</button>}
              {a.status==="Agendado"&&<button onClick={()=>updS(a.id,"Publicado")} style={{fontSize:11,background:"#10B98118",border:"1px solid #10B98140",color:"#10B981",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontWeight:700}}>✅ Pub</button>}
              <button onClick={()=>upd("agenda",agenda.filter(x=>x.id!==a.id))} style={{fontSize:10,background:"none",border:"1px solid #F5A62335",color:"#F5A623",padding:"3px 8px",borderRadius:6,cursor:"pointer"}}>✕</button>
            </div>
          </div>;
        })}
      </div>
    </>;
  }

  // ─── INTEGRAÇÕES ──────────────────────────────────────────────────────────
  function TabIntegracoes(){
    return <>
      <InfoBox color="#F5A623">🔒 Tokens armazenados apenas neste dispositivo.</InfoBox>
      <Sec title="Meta Business — Instagram + Facebook" accent={C.blue}><G2 ch={[<F label="App ID"><I k="metaAppId" ph="000000000000" /></F>,<F label="App Secret"><I k="metaSecret" type="password" ph="••••••••" /></F>]} /><F label="Page Access Token"><TA k="metaPageToken" ph="EAAxxxx…" rows={2} /></F><F label="Instagram Business Account ID"><I k="metaIgId" ph="17841400000" /></F></Sec>
      <Sec title="WhatsApp Business API" accent="#25D366"><G2 ch={[<F label="WABA ID"><I k="waBaId" ph="000000000000" /></F>,<F label="Phone Number ID"><I k="waPhoneId" ph="000000000000" /></F>]} /><F label="Access Token"><TA k="waApiToken" ph="EAAxxxx…" rows={2} /></F></Sec>
      <Sec title="ManyChat" accent={C.purple}><G2 ch={[<F label="API Key"><I k="mcApiKey" type="password" ph="••••••" /></F>,<F label="Bot ID"><I k="mcBotId" ph="0000000" /></F>]} /><F label="Fluxos ativos"><TA k="mcFlows" ph="Boas-vindas, nutrição, respostas…" rows={2} /></F></Sec>
      <Sec title="Canva + N8n + Super Agentes" accent={C.gold}><G2 ch={[<F label="Brand Kit ID"><I k="canvaKitId" ph="DAFxxxx" /></F>,<F label="Pasta templates"><I k="canvaFolder" ph="https://canva.com/folder/…" /></F>]} /><G2 ch={[<F label="N8n Webhook"><I k="n8nWebhook" ph="https://…/webhook/…" /></F>,<F label="Super Agentes ID"><I k="superAgentesId" ph="agent-xxxx" /></F>]} /><F label="Google Drive"><I k="driveFolder" ph="https://drive.google.com/…" /></F></Sec>
    </>;
  }

  // ─── COFRE ────────────────────────────────────────────────────────────────
  function TabCofre(){
    const cofre=form.cofre||EMPTY_DATA.cofre;
    return <>
      <InfoBox color="#F5A623">🔐 Senhas armazenadas <strong style={{color:C.text}}>apenas neste dispositivo</strong>. Ative 2FA em todos os serviços.</InfoBox>
      {cofre.map((item,i)=>(
        <Sec key={i} title={item.s} accent={C.muted}>
          <G3 ch={[
            <F label="Email / Usuário"><input value={item.e||""} onChange={e=>{const c=[...cofre];c[i]={...c[i],e:e.target.value};upd("cofre",c);}} placeholder="usuario@email.com" style={{...inp,fontSize:12}} /></F>,
            <F label="Senha"><div style={{position:"relative"}}><input type={showPw[i]?"text":"password"} value={item.p||""} onChange={e=>{const c=[...cofre];c[i]={...c[i],p:e.target.value};upd("cofre",c);}} placeholder="••••••••" style={{...inp,fontSize:12,paddingRight:34}} /><button onClick={()=>setShowPw(p=>({...p,[i]:!p[i]}))} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13}}>{showPw[i]?"🙈":"👁️"}</button></div></F>,
            <F label="Observações"><input value={item.n||""} onChange={e=>{const c=[...cofre];c[i]={...c[i],n:e.target.value};upd("cofre",c);}} placeholder="2FA, conta vinculada…" style={{...inp,fontSize:12}} /></F>,
          ]} />
        </Sec>
      ))}
      <button onClick={()=>upd("cofre",[...cofre,{s:"Novo serviço",e:"",p:"",n:""}])} style={{width:"100%",background:"none",border:`1.5px dashed ${C.border2}`,color:C.muted,padding:"12px",borderRadius:11,cursor:"pointer",fontSize:13}}>+ Adicionar serviço</button>
    </>;
  }
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro,  setErro]  = useState("");
  const [show,  setShow]  = useState(false);
  const mode = getMode();
  const T = getTokens(mode);

  const USERS = [
    { email:"admin@metamorfose.com.br",      senha:"meta2026" },
    { email:"juliana@metamorfose.com.br",    senha:"meta2026" },
    { email:"julianapereira33@gmail.com",    senha:"meta2026" },
  ];

  function handleLogin(e){
    e.preventDefault();
    const ok = USERS.find(u => u.email===email.trim().toLowerCase() && u.senha===senha);
    if(ok) onLogin(); else setErro("Email ou senha incorretos.");
  }

  const inpStyle = {
    width:"100%", background:T.surf3, border:`1px solid ${T.border}`,
    color:T.text, padding:"12px 14px", borderRadius:10, fontSize:13,
    boxSizing:"border-box", outline:"none", fontFamily:"'Inter',system-ui,sans-serif",
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:"20px",position:"relative",overflow:"hidden"}}>
      <DigitalBg T={T} opacity={mode==="dark"?1:0.5} />

      {/* Glow orbs */}
      <div style={{position:"fixed",top:"20%",left:"15%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle, ${T.primary}18, transparent 70%)`,pointerEvents:"none"}} />
      <div style={{position:"fixed",bottom:"20%",right:"15%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle, ${T.primaryXL}12, transparent 70%)`,pointerEvents:"none"}} />

      <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{
            width:72,height:72,borderRadius:20,
            background:`linear-gradient(135deg, ${T.accent}, ${T.primaryL})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 18px",boxShadow:`0 0 48px ${T.primary}50`,
          }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path d="M19 4C19 4 8 10 8 19C8 25 13 30 19 30C25 30 30 25 30 19C30 10 19 4 19 4Z" fill="white" fillOpacity="0.9"/>
              <path d="M19 30C19 30 12 32 10 28C8 24 12 20 19 20C26 20 30 24 28 28C26 32 19 30 19 30Z" fill="white" fillOpacity="0.5"/>
              <circle cx="15" cy="16" r="2.5" fill={T.primary}/>
              <circle cx="23" cy="16" r="2.5" fill={T.primary}/>
            </svg>
          </div>
          <div style={{
            fontSize:32,fontWeight:800,letterSpacing:-1,
            fontFamily:"'Space Grotesk',sans-serif",
            background:`linear-gradient(135deg, ${T.primaryXL}, ${T.textSub})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>SociaMind</div>
          <div style={{fontSize:11,color:T.textMuted,marginTop:5,letterSpacing:3,textTransform:"uppercase",fontWeight:500}}>by Metamorfose</div>
        </div>

        {/* Card */}
        <div style={{
          background:mode==="dark"?`${T.surf}EE`:`${T.surf}F5`,
          border:`1px solid ${T.border}`,borderRadius:24,padding:"36px",
          backdropFilter:"blur(20px)",boxShadow:T.shadow,
        }}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,color:T.text,marginBottom:4}}>Bem-vinda de volta</div>
          <div style={{fontSize:13,color:T.textMuted,marginBottom:28}}>Do físico ao digital — sua gestão começa aqui</div>

          <form onSubmit={handleLogin}>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:7,letterSpacing:.8,textTransform:"uppercase"}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com.br" autoComplete="email" style={inpStyle} />
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:7,letterSpacing:.8,textTransform:"uppercase"}}>Senha</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={senha} onChange={e=>setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                  style={{...inpStyle,paddingRight:44}} />
                <button type="button" onClick={()=>setShow(!show)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.textMuted,cursor:"pointer",display:"flex",alignItems:"center"}}>
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            {erro && (
              <div style={{background:`${T.error}15`,border:`1px solid ${T.error}30`,borderRadius:10,padding:"10px 14px",color:T.error,fontSize:12,marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
                <AlertCircle size={14}/> {erro}
              </div>
            )}
            <button type="submit" disabled={!email||!senha} style={{
              width:"100%",background:`linear-gradient(135deg, ${T.accent}, ${T.primaryL})`,
              color:"#fff",border:"none",padding:"14px",borderRadius:12,
              cursor:email&&senha?"pointer":"default",fontWeight:700,fontSize:14,
              fontFamily:"'Inter',sans-serif",letterSpacing:.3,
              boxShadow:`0 6px 28px ${T.primary}45`,opacity:email&&senha?1:.5,transition:"all .2s",
            }}>
              Entrar na plataforma
            </button>
          </form>
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:T.textMuted,opacity:.5}}>
          SociaMind v2.0 · Metamorfose · 2026 · {mode==="dark"?"Modo Noturno":"Modo Diurno"}
        </div>
      </div>
    </div>
  );
}
