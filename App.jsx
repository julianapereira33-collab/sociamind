import { useState, useEffect, useRef, useMemo } from "react";
import { storage } from "./src/storage.js";
import { getMode, getTokens, getGradients } from "./src/design.js";
import { supabase, getOrgData, saveOrgData, getProfile } from "./src/supabase.js";
import {
  Sparkles, ScanLine, Palette, Package, Users, FileText,
  Calendar, CalendarClock, Smartphone, Plug, Lock,
  LogOut, Save, ChevronLeft, Plus, Zap, BarChart2,
  CheckCircle, Clock, AlertCircle, XCircle, Send,
  Image, Megaphone, Settings, Eye, EyeOff, Trash2,
  Edit3, Star, TrendingUp, Globe, MessageSquare, Shield,
  Mail, Radio, Check, X, RefreshCw, ChevronDown, ChevronUp, Upload, LogIn,
  ClipboardCheck, BellRing, LayoutDashboard, Bot, Crown, Activity, HelpCircle,
  Target, Inbox, BarChart, Layers
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

// ─── Demo Company ─────────────────────────────────────────────────────────────
const DEMO_ID = "socialmid-demo";
const DEMO_DATA = {
  nomeFantasia:"Social Mid-IA",slogan:"Sua gestão de redes no piloto automático — com IA",
  responsavel:"Juliana Pereira",cargo:"CEO & Fundadora",
  responsavelBio:"Especialista em marketing digital há 10 anos, fundou a Social Mid-IA para democratizar o acesso à gestão profissional de redes sociais com inteligência artificial. Antes gerenciava mais de 40 clientes manualmente — hoje a IA faz isso por ela.",
  logoUrl:"",logob64:"",fotoResponsavelb64:"",fotoCapa64:"",
  corPrimaria:"#FF4566",corSecundaria:"#00CCA8",corAcento:"#F5A623",
  fonteTitulo:"Space Grotesk",fonteCorpo:"Inter",
  emojisOficiais:"🤖✨📱🚀💡",sentimentoMarca:"empoderador",
  faixaPreco:"medio",
  cnpj:"45.678.901/0001-23",site:"https://sociamind.vercel.app",
  emailComercial:"contato@socialmid.com.br",telefone:"(11) 99999-0000",
  endereco:"100% digital — atendimento remoto",bairro:"",cidade:"São Paulo",estado:"SP",cep:"",linkMaps:"",
  descricao:"A Social Mid-IA é uma plataforma SaaS de gestão de redes sociais potencializada por inteligência artificial. Reunimos em um único painel tudo que um social media ou empresário precisa: estratégia gerada por IA, criação de conteúdo, agendamento, aprovações, campanhas de WhatsApp e e-mail, relatórios de crescimento e automação de respostas.",
  missao:"Democratizar a gestão profissional de redes sociais, permitindo que qualquer empresa — do MEI à agência — tenha acesso a uma estratégia de marketing digital de alto nível, com o poder da IA trabalhando 24h por dia.",
  visao:"Ser a plataforma número 1 de gestão de redes sociais com IA no Brasil até 2027, presente em mais de 10.000 empresas.",
  valores:"Inovação, Praticidade, Resultados reais, Transparência, Empoderamento do empreendedor",
  diferenciais:"Único sistema que combina IA generativa + fluxo de aprovação + WhatsApp nativo + white-label por cliente. Scanner que analisa a marca e preenche toda a estratégia automaticamente. Geração de semana completa de conteúdo em 1 clique.",
  historia:"Nasceu em 2024 da frustração de gerenciar 40 clientes com 12 ferramentas diferentes. A fundadora Juliana Pereira criou a Social Mid-IA para consolidar estratégia, criação, aprovação e disparo em um único lugar — com IA fazendo o trabalho pesado.",
  concorrentes:"Buffer, Hootsuite, Later, mLabs, Postgrain",
  premios:"Finalista Startup do Ano — Marketing Tech Brasil 2025",
  depoimentos:"\"Reduzi 6 horas de trabalho por cliente para 40 minutos. A IA entende a marca melhor que muita pessoa.\" — Carla M., Social Media\n\"Meu cliente aprova tudo pelo WhatsApp agora. Acabou a burocracia de e-mail.\" — Rafael T., Agência Digital",
  servicos:"Gestão de redes sociais com IA, Geração de conteúdo, Agendamento inteligente, Fluxo de aprovação, Campanhas WhatsApp e E-mail, Relatórios de crescimento, Automação de respostas, White-label para agências",
  descricaoBiotipo:"Social medias autônomos, donos de agências digitais e empreendedores que precisam de presença profissional nas redes sem contratar uma equipe grande. Valorizam praticidade, resultado e automação.",
  hashtags:"#socialmidIA #gestaoderedes #marketingdigital #inteligenciaartificial #socialmedia #automacaomarketing #conteudoIA #agenciadigital #empreendedorismo #marketingIA #redesociais #conteudoautomatico #SaaS #ferramentasdigitais #marketingbrasil #socialmediamanager #IAmarketing",
  topicosSempre:"Dicas de social media, Resultados de clientes, Automações que economizam tempo, Novidades da plataforma, Educação sobre marketing digital, Comparativos antes/depois da IA",
  topicosNunca:"Política, polêmicas de concorrentes, promessas irreais de resultado, conteúdo sem embasamento",
  melhorConteudo:"Carrosséis educativos, Reels mostrando a plataforma em uso, depoimentos de clientes, comparativos antes/depois",
  metaRedes:"10.000 seguidores no Instagram em 6 meses, 200 trials/mês via redes sociais, comunidade de 500 social medias no WhatsApp",
  igHandle:"socialmid.ia",igUrl:"https://instagram.com/socialmid.ia",igSeg:"1240",igFreq:"5",igAutoPost:false,
  fbUrl:"https://facebook.com/socialmidIA",fbPageId:"",fbSeg:"430",fbAutoPost:false,
  ttHandle:"socialmid.ia",ttSeg:"890",ttAutoPost:false,
  liUrl:"https://linkedin.com/company/socialmid-ia",liSeg:"560",liFreq:"3",liAutoPost:false,
  ytUrl:"https://youtube.com/@socialmidIA",ytSeg:"210",
  waNome:"Social Mid-IA",waNumero:"+5511999990000",
  waCanais:[{id:1,nome:"@SocialMidIA Oficial",link:"https://whatsapp.com/channel/socialmid",inscritos:"380",autoPost:false}],
  waListas:[{id:2,nome:"Leads em trial",contatos:"140",autoPost:false,freq:"Semanal"},{id:3,nome:"Clientes ativos",contatos:"87",autoPost:false,freq:"Quinzenal"}],
  waGrupos:[{id:4,nome:"Comunidade Social Midias BR",admin:true,membros:"320",autoPost:false,freq:"2x/semana"}],
  metaAppId:"",metaSecret:"",metaPageToken:"",metaIgId:"",n8nWebhook:"",mcApiKey:"",
  scannerManual:"Bio Instagram @socialmid.ia:\n🤖 Gestão de redes com Inteligência Artificial\n📱 Estratégia + Conteúdo + Aprovação + WhatsApp em 1 lugar\n🚀 Teste 7 dias grátis — link na bio\n✨ Sua gestão no piloto automático\n\nSite: sociamind.vercel.app\nPlanos a partir de R$197/mês\nSolo | Negócio | Agência | Agent Secret",
  produtos:[
    {id:"p1",nome:"Plano Solo",subtitulo:"Para quem gerencia a própria marca",descricao:"1 empresa, 3 redes sociais, 3 posts/semana gerados por IA, 1 scanner/mês, aprovações pelo app, alertas básicos no WhatsApp.",publicoAlvo:"Empreendedor solo, MEI, pequeno negócio",preco:"R$ 197/mês",emoji:"🌱"},
    {id:"p2",nome:"Plano Negócio",subtitulo:"Mais ferramentas, mais resultados",descricao:"1 empresa, 5 redes incluindo LinkedIn e TikTok, 7 posts/semana, 3 scanners/mês por rede, campanhas, painel de respostas, aprovações via WhatsApp.",publicoAlvo:"Negócio em crescimento, gestor de marketing",preco:"R$ 497/mês",emoji:"🚀"},
    {id:"p3",nome:"Plano Agência",subtitulo:"Gerencie clientes como um profissional",descricao:"1 cliente completo com tudo ilimitado: redes, posts, 5 scanners/rede, campanhas ilimitadas, automação de respostas, white-label, relatório executivo, suporte prioritário.",publicoAlvo:"Agência digital, social media profissional",preco:"R$ 997/mês",emoji:"🏢"},
    {id:"p4",nome:"Agent Secret",subtitulo:"Automação total com IA",descricao:"Tudo ilimitado + atendimento de clientes via WhatsApp pela IA, secretária digital, aprovações automáticas, onboarding dedicado e suporte com SLA.",publicoAlvo:"Empresa que quer operação 100% automatizada",preco:"R$ 3.597/mês",emoji:"🤖"},
    {id:"p5",nome:"Trial Gratuito 7 dias",subtitulo:"Teste sem compromisso",descricao:"Acesso completo ao plano escolhido por 7 dias. Cartão necessário — cobrança só após o período. Cancele quando quiser.",publicoAlvo:"Novos usuários que querem conhecer a plataforma",preco:"Grátis por 7 dias",emoji:"🎁"},
  ],
  publicos:[
    {id:"pb1",nome:"Social Media Autônoma",apelido:"Carol",idade:"24-35",genero:"fem",descricao:"Atende de 5 a 15 clientes sozinha. Passa horas criando conteúdo manualmente. Quer escalar sem contratar.",profissao:"Social Media Freelancer",renda:"b",dores:"Tempo perdido em tarefas repetitivas, clientes que somem para aprovar conteúdo",desejos:"Dobrar a carteira de clientes sem trabalhar o dobro",comportamentoOnline:"Ativa no Instagram e LinkedIn, consome muito conteúdo de produtividade e marketing",plataformasFavoritas:"Instagram,LinkedIn,WhatsApp",comoChegar:"Mostrar quanto tempo a IA economiza com cases reais e comparativos antes/depois",ctaPref:"site"},
    {id:"pb2",nome:"Dono de PME",apelido:"Ricardo",idade:"30-50",genero:"ambos",descricao:"Tem um negócio funcionando mas as redes sociais estão abandonadas. Sabe que precisa estar nas redes mas não tem tempo nem equipe.",profissao:"Empresário / Empreendedor",renda:"b",dores:"Não tem tempo para redes, conteúdo sem estratégia",desejos:"Ter presença profissional nas redes sem precisar entender de marketing",comportamentoOnline:"Consome LinkedIn e Instagram, pesquisa soluções para otimizar o negócio",plataformasFavoritas:"Instagram,WhatsApp,LinkedIn",comoChegar:"Mostrar simplicidade — a IA faz a estratégia, você só aprova",ctaPref:"whatsapp"},
    {id:"pb3",nome:"Dono de Agência",apelido:"Marcos",idade:"28-42",genero:"ambos",descricao:"Gerencia 20+ clientes com equipe pequena. Processos manuais limitam o crescimento. Quer padronizar e escalar com white-label.",profissao:"Diretor de Agência Digital",renda:"a",dores:"Processo de aprovação caótico, custo alto de ferramentas separadas",desejos:"Dobrar carteira sem aumentar equipe proporcionalmente",comportamentoOnline:"Muito ativo no LinkedIn, consome cases de automação",plataformasFavoritas:"LinkedIn,Instagram,WhatsApp",comoChegar:"White-label + demonstração de ROI + case de agência que escalou com a plataforma",ctaPref:"site"},
  ],
  agenda:[
    {id:"ag1",tipo:"Carrossel",titulo:"5 horas que a IA devolve para o social media",legenda:"Você sabia que um social media gasta em média 5h por cliente, por semana, só em tarefas que a IA pode fazer? 👇\n\nSlide 1: 5 horas que você nunca mais vai perder\nSlide 2: Pesquisa de pauta → IA faz em 2 min\nSlide 3: Redação de legendas → IA gera 7 opções por post\nSlide 4: Relatório → dashboard automático\nSlide 5: Aprovação → WhatsApp com 1 clique\nSlide 6: Resultado: você atende 2x mais no mesmo tempo\n\n🚀 Teste grátis 7 dias — link na bio\n\n#socialmedia #inteligenciaartificial #produtividade #socialmidIA",publicoId:"pb1",plataforma:"Instagram",data:"2025-07-02",hora:"09:00",status:"Ag. aprovação"},
    {id:"ag2",tipo:"Reel",titulo:"De 3h para 12min — criando conteúdo com IA",legenda:"Antes: 3 horas para criar o conteúdo de 1 semana de 1 cliente.\nAgora: 12 minutos. Com a Social Mid-IA. ⚡\n\nA IA lê a marca, cria a estratégia, escreve as legendas e agenda tudo.\n\nVocê só aprova. Ou nem isso — automatiza também 😏\n\nTeste 7 dias grátis → link na bio\n\n#automacaomarketing #socialmidIA #IAmarketing",publicoId:"pb1",plataforma:"Instagram",data:"2025-07-03",hora:"18:00",status:"Ag. aprovação"},
    {id:"ag3",tipo:"Post Feed",titulo:"O problema real das agências em 2025",legenda:"O problema real das agências em 2025 não é falta de cliente.\n\nÉ falta de processo. 👇\n\n❌ Aprovação por e-mail que some no spam\n❌ Conteúdo criado na última hora\n❌ Relatório montado na mão toda semana\n\nCom a Social Mid-IA:\n✅ Aprovação pelo WhatsApp em 1 toque\n✅ Semana de conteúdo em 1 clique\n✅ Relatório automático com antes e depois\n\n→ Teste grátis no link da bio\n\n#agenciadigital #gestaoderedes #socialmidIA",publicoId:"pb3",plataforma:"Instagram",data:"2025-07-05",hora:"11:00",status:"Rascunho"},
    {id:"ag4",tipo:"LinkedIn Post",titulo:"Construindo um SaaS de marketing com IA no Brasil",legenda:"Em 2024, eu ainda gerenciava 40 clientes com 12 ferramentas diferentes.\n\nCalendly para reuniões. Notion para pautas. Drive para aprovações. WhatsApp para tudo.\n\nEra caos organizado.\n\nAí eu perguntei: por que não existe uma ferramenta que faz tudo integrado, com IA?\n\nNão existia. Então construí.\n\nA Social Mid-IA nasceu da minha própria dor como social media.\n\n#saas #empreendedorismo #marketingdigital #inteligenciaartificial",publicoId:"pb3",plataforma:"LinkedIn",data:"2025-07-07",hora:"08:00",status:"Rascunho"},
    {id:"ag5",tipo:"Story",titulo:"Enquete — quanto tempo você perde?",legenda:"Sequência de stories:\n1. Quanto tempo você gasta criando conteúdo por semana?\n2. Enquete: menos de 5h / 5 a 10h / mais de 10h\n3. Se você disse mais de 5h... temos um problema pra resolver juntos\n4. A IA pode fazer isso em minutos. Quer ver? arrasta pra cima",publicoId:"pb1",plataforma:"Instagram",data:"2025-07-04",hora:"14:00",status:"Rascunho"},
    {id:"ag6",tipo:"TikTok",titulo:"POV: você descobriu a Social Mid-IA",legenda:"POV: você finalmente encontrou uma ferramenta que entende sua marca, cria os posts, manda pro cliente aprovar no WhatsApp e ainda gera o relatório sozinha\n\n#socialmedia #ferramentasdigitais #IAmarketing #socialmidIA",publicoId:"pb1",plataforma:"TikTok",data:"2025-07-06",hora:"19:00",status:"Rascunho"},
  ],
  campanhas:[
    {id:"camp1",nome:"Lançamento — Trial 7 dias",tipo:"whatsapp",assunto:"",mensagem:"Oi [nome]! Aqui é a Juliana da Social Mid-IA.\n\nVocê pediu pra saber mais sobre a plataforma — tô animada pra te mostrar!\n\nO que você vai ter acesso no trial de 7 dias:\n✅ IA que analisa sua marca e cria a estratégia\n✅ Geração de 1 semana de posts em 1 clique\n✅ Aprovação de conteúdo pelo WhatsApp\n✅ Campanhas de disparo integradas\n✅ Relatório de crescimento automático\n\nTudo isso por R$0 nos primeiros 7 dias.\n\nQuer começar agora? Me responde QUERO que te mando o link",publico:"Leads em trial",agendada:false,data_envio:"",horario:"10:00",status:"rascunho",enviadas:0,abertas:0,cliques:0},
    {id:"camp2",nome:"Upgrade Solo → Negócio",tipo:"whatsapp",assunto:"",mensagem:"Oi [nome]! Aqui é a Social Mid-IA.\n\nVocê está no Plano Solo há 30 dias e seus resultados estão crescendo — parabéns!\n\nPlano Negócio — R$497/mês:\n📱 +2 redes sociais (LinkedIn e TikTok)\n📊 3x mais scanners por mês\n💬 Painel de respostas das redes\n📢 Campanhas de WhatsApp ilimitadas\n\nOu seja: você dobra a presença digital por menos de R$10/dia a mais.\n\nQuer saber mais?",publico:"Clientes ativos",agendada:false,data_envio:"",horario:"11:00",status:"rascunho",enviadas:0,abertas:0,cliques:0},
  ],
  cofre:[
    {s:"Google Account",e:"contato@socialmid.com.br",p:"",n:"Conta principal — GSuite"},
    {s:"Instagram",e:"@socialmid.ia",p:"",n:"Conta criada para a plataforma"},
    {s:"Facebook",e:"contato@socialmid.com.br",p:"",n:"Página vinculada ao IG"},
    {s:"TikTok",e:"@socialmid.ia",p:"",n:""},
    {s:"ManyChat",e:"",p:"",n:"Integração futura com DMs"},
    {s:"Canva",e:"design@socialmid.com.br",p:"",n:"Templates da marca"},
    {s:"WhatsApp Business",e:"+5511999990000",p:"",n:"Número de suporte e marketing"},
    {s:"Hospedagem",e:"",p:"",n:"Vercel — sociamind.vercel.app"},
  ],
  perfilConteudo:[],ordens:[],msgRegras:[],semanaGerada:null,
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_COMPANIES = [
  { id:DEMO_ID, name:"Social Mid-IA", niche:"SaaS · Gestão de Redes com IA", color:"#FF4566", emoji:"🤖", demo:true },
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
  zapiInstanceId:"",zapiToken:"",zapiClientToken:"",zapiPhone:"",
  waCanais:[],waListas:[],waGrupos:[],
  // Outras redes
  igHandle:"",igUrl:"",igSeg:"",igFreq:"",igAutoPost:false,
  fbUrl:"",fbPageId:"",fbSeg:"",fbAutoPost:false,
  ttHandle:"",ttSeg:"",ttAutoPost:false,
  ytUrl:"",ytSeg:"",liUrl:"",liSeg:"",liFreq:"",liAutoPost:false,
  scannerManual:"",
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
  {id:"resultados",  Icon:LayoutDashboard, label:"Relatório"},
  {id:"scanner",     Icon:ScanLine,        label:"Scanner"},
  {id:"identidade",  Icon:Palette,         label:"Identidade"},
  {id:"produtos",    Icon:Package,         label:"Produtos"},
  {id:"publicos",    Icon:Users,           label:"Públicos"},
  {id:"redes",       Icon:Smartphone,      label:"Redes"},
  {id:"estrategia",  Icon:Target,          label:"Estratégia"},
  {id:"conteudo",    Icon:Sparkles,        label:"Conteúdo"},
  {id:"agenda",      Icon:CalendarClock,   label:"Agenda"},
  {id:"disparos",    Icon:Megaphone,       label:"Disparos"},
  {id:"mensagens",   Icon:Inbox,           label:"Mensagens"},
  {id:"integracoes", Icon:Plug,            label:"Integrações"},
  {id:"cofre",       Icon:Lock,            label:"Cofre"},
  {id:"ajuda",       Icon:HelpCircle,      label:"Ajuda"},
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App({ session, onSignOut }) {
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
  const [orgId,     setOrgId]    = useState(null);

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
    const localSession = storage.get("sociamind-session");
    if(session || localSession) { setLoggedIn(true); setView("home"); }
    loadAll();
    // Busca org_id do perfil Supabase
    if(session?.user?.id) {
      getProfile(session.user.id).then(profile => {
        if(profile?.org_id) setOrgId(profile.org_id);
      });
    }
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

  async function openCo(c) {
    setCo(c); setTab("identidade");
    // Demo: carrega dados pré-definidos, sem persistência
    if(c.id === DEMO_ID) {
      setForm({...EMPTY_DATA, ...DEMO_DATA});
      setView("company");
      return;
    }
    let base={...EMPTY_DATA,nomeFantasia:c.name,corPrimaria:c.color};
    // Carrega do localStorage primeiro (rápido)
    const r = storage.get(`smvp-${c.id}`);
    if(r) base={...base,...JSON.parse(r.value)};
    setForm(base); setView("company");
    // Carrega do Supabase em paralelo e mescla (fonte de verdade)
    if(orgId) {
      try {
        const remote = await getOrgData(orgId);
        if(remote?.data && Object.keys(remote.data).length > 0) {
          const merged = {...base, ...remote.data};
          setForm(merged);
          storage.set(`smvp-${c.id}`, JSON.stringify(merged));
        }
      } catch(e) { console.error("Erro ao carregar dados remotos:", e); }
    }
  }

  async function save() {
    setSaving(true);
    try{
      // Salva localmente (fallback offline)
      storage.set(`smvp-${co.id}`, JSON.stringify(form));
      setSaved(p=>({...p,[co.id]:form}));
      // Salva no Supabase se autenticado
      if(orgId) {
        await saveOrgData(orgId, form);
      }
      flash("✓ Salvo com sucesso!","teal");
    }catch(e){ flash("Erro ao salvar","coral"); console.error(e); }
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
            <button onClick={()=>{ storage.remove("sociamind-session"); if(onSignOut) onSignOut(); else setView("login"); }} style={{background:"none",border:`1px solid ${T.border2}`,color:T.textMuted,padding:"9px 12px",borderRadius:10,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
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
            const d=c.id===DEMO_ID ? DEMO_DATA : saved[c.id];
            const prods=d?.produtos?.length||0;
            const pubs=d?.publicos?.length||0;
            const pct=d?Math.round(([d.nomeFantasia,d.descricao,d.publicos?.length,d.igHandle,d.metaAppId||d.n8nWebhook,d.cofre?.[0]?.e].filter(Boolean).length/6)*100):0;
            return <div key={c.id} onClick={()=>openCo(c)} style={{background:mode==="dark"?`${T.surf}EE`:`${T.surf}F8`,border:`1px solid ${c.demo?c.color+"60":d?c.color+"35":T.border}`,borderRadius:18,padding:"20px",cursor:"pointer",transition:"all .18s",position:"relative",overflow:"hidden",backdropFilter:"blur(8px)",boxShadow:c.demo?`0 4px 24px ${c.color}25`:T.shadow}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"65";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c.color}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=c.demo?c.color+"60":d?c.color+"35":T.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=c.demo?`0 4px 24px ${c.color}25`:T.shadow;}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${c.color},${c.color}50,transparent)`}} />
              {c.demo&&<div style={{position:"absolute",top:14,right:14,fontSize:10,fontWeight:800,color:"#fff",background:`linear-gradient(135deg,${c.color},#8B5E3C)`,padding:"3px 10px",borderRadius:20,letterSpacing:1}}>✦ DEMO</div>}
              {!c.demo&&d&&<div style={{position:"absolute",top:14,right:14,fontSize:11,fontWeight:600,color:c.color,background:c.color+"18",padding:"2px 9px",borderRadius:20,border:`1px solid ${c.color}30`}}>{pct}%</div>}
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

      {/* Topbar white-label */}
      <div style={{background:T.surf,borderBottom:`1px solid ${T.border}`,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"relative",overflow:"hidden"}}>
        {/* Barra de cor da marca no topo */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${co.color},${co.color}80,transparent)`}} />
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0"}}>
          <button onClick={()=>setView("home")} style={{background:"none",border:`1px solid ${T.border2}`,color:T.textMuted,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif"}}>
            <ChevronLeft size={14}/> Hub
          </button>
          <div style={{width:1,height:22,background:T.border}} />
          <div style={{width:38,height:38,borderRadius:10,background:co.color+"18",border:`2px solid ${co.color}50`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontSize:18,boxShadow:`0 0 12px ${co.color}30`}}>
            {form.logob64?<img src={form.logob64} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="" />:co.emoji}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.text,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
              {form.nomeFantasia||co.name}
              <span style={{fontSize:10,background:co.color+"18",color:co.color,padding:"2px 8px",borderRadius:20,fontWeight:600,border:`1px solid ${co.color}30`}}>{co.niche}</span>
            </div>
            {form.slogan&&<div style={{fontSize:10,color:T.textMuted,fontStyle:"italic"}}>"{form.slogan}"</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Badge aprovações pendentes */}
          {(()=>{const pend=(form.agenda||[]).filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length;return pend>0&&<button onClick={()=>setTab("aprovacoes")} style={{background:"#FF4566"+"18",border:"1px solid #FF456640",color:"#FF4566",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><BellRing size={13}/>{pend} pendente{pend>1?"s":""}</button>;})()}
          {co?.id!==DEMO_ID&&<button onClick={save} disabled={saving} style={{background:`linear-gradient(135deg,${co.color},${co.color}CC)`,color:"#fff",border:"none",padding:"8px 22px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,opacity:saving?.7:1,boxShadow:`0 4px 18px ${co.color}40`,display:"flex",alignItems:"center",gap:7,fontFamily:"'Inter',sans-serif"}}>
            <Save size={14}/> {saving?"Salvando…":"Salvar"}
          </button>}
        </div>
      </div>

      {/* Banner demo */}
      {co?.id===DEMO_ID&&<div style={{background:`linear-gradient(90deg,#C8956C18,#8B5E3C18)`,borderBottom:`1px solid #C8956C35`,padding:"7px 22px",display:"flex",alignItems:"center",gap:10,fontSize:12}}>
        <span style={{fontWeight:800,color:"#C8956C",letterSpacing:1}}>✦ DEMO</span>
        <span style={{color:"#FF456699"}}>Ambiente de demonstração — Social Mid-IA. Explore todas as funcionalidades livremente. Alterações não são salvas.</span>
        <span style={{marginLeft:"auto",background:"#C8956C20",color:"#C8956C",border:"1px solid #C8956C40",borderRadius:6,padding:"2px 10px",fontWeight:700,fontSize:11}}>Modo simulação</span>
      </div>}

      {/* Tabs */}
      <div style={{background:T.surf,borderBottom:`1px solid ${T.border}`,padding:"0 16px",display:"flex",overflowX:"auto",flexShrink:0,gap:1,scrollbarWidth:"none"}}>
        {TABS.map(t=>{
          const active=t.id===tab;
          const pend=t.id==="aprovacoes"?(form.agenda||[]).filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length:0;
          return <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:"none",border:"none",
            borderBottom:`2px solid ${active?co.color:"transparent"}`,
            padding:"11px 14px",cursor:"pointer",whiteSpace:"nowrap",
            color:active?co.color:T.textMuted,
            fontWeight:active?600:400,fontSize:12,
            display:"flex",alignItems:"center",gap:6,
            transition:"color .15s",
            fontFamily:"'Inter',system-ui,sans-serif",
            position:"relative",
          }}>
            <t.Icon size={14} strokeWidth={active?2.5:1.8}/>{t.label}
            {pend>0&&<span style={{background:"#FF4566",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",top:6,right:2}}>{pend}</span>}
          </button>;
        })}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 22px"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          {tab==="scanner"     &&<TabScanner />}
          {tab==="resultados"  &&<TabResultados />}
          {tab==="identidade"  &&<TabIdentidade />}
          {tab==="produtos"    &&<TabProdutos />}
          {tab==="publicos"    &&<TabPublicos />}
          {tab==="redes"       &&<TabRedes />}
          {tab==="estrategia"  &&<TabEstrategia />}
          {tab==="conteudo"    &&<TabConteudo />}
          {tab==="agenda"      &&<TabAgendaHub />}
          {tab==="disparos"    &&<TabCampanhas />}
          {tab==="mensagens"   &&<TabMensagens />}
          {tab==="integracoes" &&<TabIntegracoes />}
          {tab==="cofre"       &&<TabCofre />}
          {tab==="ajuda"       &&<TabAjuda />}
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
    // Contas fixas — vêm da aba Redes, não podem ser alteradas aqui
    const urls = {
      instagram: form.igUrl || (form.igHandle ? `https://instagram.com/${form.igHandle}` : ""),
      facebook:  form.fbUrl  || "",
      tiktok:    form.ttHandle ? `https://tiktok.com/@${form.ttHandle}` : "",
      linkedin:  form.liUrl  || "",
      site:      form.site   || "",
      youtube:   form.ytUrl  || "",
      whatsapp:  form.waNumero || "",
      extra:     "",
    };
    // manual fica no form para sobreviver a trocas de aba
    const manual = form.scannerManual || "";
    const setManual = (v) => upd("scannerManual", typeof v === "function" ? v(manual) : v);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);
    const [phase, setPhase] = useState("idle"); // idle | scanning | done | error
    const [log, setLog] = useState([]);
    const [result, setResult] = useState(null);
    const [applying, setApplying] = useState(false);
    const logRef = useRef(null);

    const addLog = (msg, type="info") => setLog(p => [...p, {msg, type, t: Date.now()}]);

    function parseHandle(val, base) {
      if (!val) return null;
      const clean = val.trim()
        .replace(/^https?:\/\/(www\.)?(instagram|facebook|tiktok|youtube)\.com\//i,'')
        .replace(/\//g,'').replace(/^@/,'').split('?')[0];
      return clean || null;
    }

    const igHandle = parseHandle(urls.instagram, "instagram");
    const fbHandle = parseHandle(urls.facebook, "facebook");
    const ttHandle = parseHandle(urls.tiktok, "tiktok");
    const ytHandle = parseHandle(urls.youtube, "youtube");

    async function runScan() {
      const hasInput = Object.values(urls).some(v=>v.trim()) || manual.trim();
      if (!hasInput) return;
      setPhase("scanning"); setLog([]); setResult(null); setEditMode(false); setEditData(null);

      addLog("🔍 Iniciando análise estratégica da marca...", "start");
      addLog("📡 Coletando dados das redes sociais informadas...", "info");

      setTimeout(()=>addLog("🧠 Claude analisando posicionamento e identidade visual...", "info"), 800);
      setTimeout(()=>addLog("👥 Mapeando perfis de público e personas...", "info"), 1800);
      setTimeout(()=>addLog("📦 Identificando produtos e proposta de valor...", "info"), 2800);
      setTimeout(()=>addLog("🎯 Construindo estratégia de conteúdo personalizada...", "info"), 3800);
      setTimeout(()=>addLog("✍️ Gerando estratégia completa de marketing digital...", "info"), 4800);

      const temInfoManual = !!(manual.trim() || form.descricao || form.servicos);
      const prompt = `Você é um estrategista digital sênior especialista em marketing digital, branding e redes sociais.

ATENÇÃO IMPORTANTE: Você NÃO tem acesso à internet e NÃO consegue visitar perfis ou URLs. Analise APENAS com base nas informações fornecidas abaixo. Seja específico e realista — não invente dados que não foram fornecidos. Se não tiver informação suficiente sobre algo, diga o que seria ideal para o nicho informado.

EMPRESA: ${form.nomeFantasia || co.name}
NICHO/SEGMENTO: ${co.niche}

PERFIS INFORMADOS (referência de posicionamento digital):
${urls.instagram ? `• Instagram: ${urls.instagram}` : ""}
${urls.facebook ? `• Facebook: ${urls.facebook}` : ""}
${urls.tiktok ? `• TikTok: ${urls.tiktok}` : ""}
${urls.linkedin ? `• LinkedIn: ${urls.linkedin}` : ""}
${urls.site ? `• Site: ${urls.site}` : ""}
${urls.youtube ? `• YouTube: ${urls.youtube}` : ""}
${urls.whatsapp ? `• WhatsApp: ${urls.whatsapp}` : ""}
${urls.extra ? `• Outros: ${urls.extra}` : ""}

${manual ? `CONTEÚDO FORNECIDO PELO USUÁRIO (bio, textos, descrições — BASE PRINCIPAL DA ANÁLISE):\n${manual}` : "⚠️ Nenhum texto adicional fornecido. Baseie-se no nicho e nos handles para inferir o posicionamento."}

DADOS DO SISTEMA:
${form.descricao ? `Descrição cadastrada: ${form.descricao}` : ""}
${form.servicos ? `Serviços: ${form.servicos}` : ""}

Faça uma análise estratégica profunda e ESPECÍFICA para esta marca, considerando o nicho "${co.niche}". Se o usuário colou textos da bio ou site, use-os como base principal. Seja concreto e acionável.

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
        setEditData(JSON.parse(JSON.stringify(parsed)));
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

    async function applyToForm(dataOverride) {
      const src = dataOverride || editData || result;
      if (!src) return;
      if(editMode){ setResult(editData); setEditMode(false); }
      setApplying(true);
      addLog("📝 Aplicando dados ao cadastro...", "info");

      const updates = {};
      if (src.slogan)        updates.slogan        = src.slogan;
      if (src.descricao)     updates.descricao     = src.descricao;
      if (src.missao)        updates.missao        = src.missao;
      if (src.visao)         updates.visao         = src.visao;
      if (src.valores)       updates.valores       = src.valores;
      if (src.diferenciais)  updates.diferenciais  = src.diferenciais;
      if (src.sentimentoMarca) updates.sentimentoMarca = src.sentimentoMarca;
      if (src.faixaPreco)    updates.faixaPreco    = src.faixaPreco;
      if (src.emojisOficiais) updates.emojisOficiais = src.emojisOficiais;
      if (src.topicosSempre) updates.topicosSempre = src.topicosSempre;
      if (src.topicosNunca)  updates.topicosNunca  = src.topicosNunca;
      if (src.hashtags)      updates.hashtags      = src.hashtags;
      if (src.corPrimaria)   updates.corPrimaria   = src.corPrimaria;
      if (src.corSecundaria) updates.corSecundaria = src.corSecundaria;
      if (src.corAcento)     updates.corAcento     = src.corAcento;
      if (src.fonteTitulo)   updates.fonteTitulo   = src.fonteTitulo;
      if (src.fonteCorpo)    updates.fonteCorpo    = src.fonteCorpo;

      if (src.personas?.length) {
        updates.publicos = src.personas.map((p,i) => ({
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

      if (src.produtos?.length) {
        updates.produtos = src.produtos.map((p,i) => ({
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

      if (src.estrategiaConteudo) {
        const ec = src.estrategiaConteudo;
        if (src.personas?.length) {
          updates.perfilConteudo = src.personas.map((p,i) => ({
            publicoId: (Date.now()+i).toString(),
            topicosSempre: src.topicosSempre||"",
            topicosNunca: src.topicosNunca||"",
            freqFeed: ec.freqFeed||"",
            freqStory: ec.freqStory||"",
            freqReel: ec.freqReel||"",
            freqWa: ec.freqWa||"",
            tom: ec.tomVoz||"",
            hooks: ec.hooksIdeal||"",
            hashtags: src.hashtags||"",
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

      {/* Contas conectadas — somente leitura, vêm da aba Redes */}
      <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:3,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textTransform:"uppercase"}}>Contas Conectadas — serão analisadas</div>
          <button onClick={()=>setTab("redes")} style={{fontSize:11,background:"none",border:`1px solid ${T.primary}40`,color:T.primaryL,borderRadius:7,padding:"4px 12px",cursor:"pointer",fontWeight:600}}>⚙ Gerenciar na aba Redes</button>
        </div>
        {[
          ["🟣","Instagram","instagram","#E1306C"],
          ["🔵","Facebook","facebook","#1877F2"],
          ["⚫","TikTok","tiktok","#00F2EA"],
          ["🔷","LinkedIn","linkedin","#0A66C2"],
          ["🌐","Site","site",T.primary],
          ["🔴","YouTube","youtube","#FF0000"],
          ["🟢","WhatsApp","whatsapp","#25D366"],
        ].filter(([,,key])=>urls[key]).length === 0
          ? <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>
              Nenhuma conta cadastrada. <button onClick={()=>setTab("redes")} style={{background:"none",border:"none",color:T.primaryL,cursor:"pointer",fontWeight:700,fontSize:13}}>Configure na aba Redes →</button>
            </div>
          : <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {[
              ["🟣","Instagram","instagram","#E1306C"],
              ["🔵","Facebook","facebook","#1877F2"],
              ["⚫","TikTok","tiktok","#00F2EA"],
              ["🔷","LinkedIn","linkedin","#0A66C2"],
              ["🌐","Site","site",T.primary],
              ["🔴","YouTube","youtube","#FF0000"],
              ["🟢","WhatsApp","whatsapp","#25D366"],
            ].filter(([,,key])=>urls[key]).map(([icon,label,key,color])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:6,background:`${color}12`,border:`1px solid ${color}35`,borderRadius:9,padding:"8px 14px"}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:12,fontWeight:700,color}}>{label}</span>
                <span style={{fontSize:11,color:C.muted,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{urls[key]}</span>
                <span style={{fontSize:10,background:`${color}20`,color,borderRadius:4,padding:"1px 5px",fontWeight:700}}>✓ conectado</span>
              </div>
            ))}
          </div>
        }
        <div style={{marginTop:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#F5A623",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>⭐ Cole aqui o conteúdo real do perfil — Bio, posts, site, produtos (quanto mais info, melhor a análise)</label>
          <textarea value={manual} onChange={e=>setManual(e.target.value)} rows={5}
            placeholder={`Cole aqui o máximo de informação real da marca — a IA não acessa a internet:\n\n• Bio completa do Instagram\n• Texto do site (sobre, serviços, produtos)\n• Lista de produtos/serviços com preços\n• Descrição do público que já atende\n• Últimas legendas de posts\n• Qualquer texto que represente a marca`}
            style={{...inp,resize:"vertical",lineHeight:1.7,fontFamily:"inherit",fontSize:13}} />
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
        {/* Barra de ações */}
        <div style={{background:G.glow,border:`1px solid ${T.primary}25`,borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>Análise concluída — {(editData||result).personas?.length||0} personas · {(editData||result).produtos?.length||0} produtos</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>{editMode?"Edite os campos abaixo e clique em Salvar e Aplicar quando terminar":"Revise, edite se necessário e aplique ao cadastro"}</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            {!editMode
              ? <button onClick={()=>setEditMode(true)} style={{background:C.surf3,color:C.text,border:`1px solid ${C.border}`,padding:"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                  <Edit3 size={13}/> Editar
                </button>
              : <button onClick={()=>setEditMode(false)} style={{background:"#FF444415",color:"#FF7070",border:"1px solid #FF444430",padding:"9px 18px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                  <X size={13}/> Cancelar
                </button>
            }
            <button onClick={()=>applyToForm()} disabled={applying} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 22px",borderRadius:9,cursor:applying?"default":"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,opacity:applying?.7:1,boxShadow:`0 4px 20px ${T.primary}40`}}>
              <Check size={13}/>{applying?"Aplicando…":editMode?"Salvar e Aplicar":"Aplicar ao Cadastro"}
            </button>
          </div>
        </div>

        {/* Diagnóstico + Estratégia editáveis */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Diagnóstico da Marca</div>
            {editMode
              ? <>
                  <textarea value={editData?.resumoMarca||""} onChange={e=>setEditData(p=>({...p,resumoMarca:e.target.value}))} rows={3} style={{...inp,resize:"vertical",fontFamily:"inherit",fontSize:13,lineHeight:1.6,marginBottom:8}} />
                  <textarea value={editData?.diagnostico||""} onChange={e=>setEditData(p=>({...p,diagnostico:e.target.value}))} rows={4} style={{...inp,resize:"vertical",fontFamily:"inherit",fontSize:13,lineHeight:1.6}} />
                </>
              : <>
                  <p style={{fontSize:14,color:C.text,margin:0,lineHeight:1.7}}>{(editData||result).resumoMarca}</p>
                  {(editData||result).diagnostico&&<p style={{fontSize:13,color:C.muted,margin:"8px 0 0",lineHeight:1.6}}>{(editData||result).diagnostico}</p>}
                </>
            }
          </div>
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#FFD580",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Estratégia Geral</div>
            {editMode
              ? <textarea value={editData?.estrategiaGeral||""} onChange={e=>setEditData(p=>({...p,estrategiaGeral:e.target.value}))} rows={8} style={{...inp,resize:"vertical",fontFamily:"inherit",fontSize:13,lineHeight:1.6}} />
              : <p style={{fontSize:14,color:C.text,margin:0,lineHeight:1.7}}>{(editData||result).estrategiaGeral}</p>
            }
          </div>
        </div>

        {/* Identidade editável */}
        {editMode&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:14,textTransform:"uppercase"}}>Identidade — Editar</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            {[["Slogan","slogan"],["Missão","missao"],["Visão","visao"],["Valores","valores"],["Diferenciais","diferenciais"],["Hashtags","hashtags"]].map(([l,k])=>(
              <div key={k}>
                <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>{l}</label>
                <textarea value={editData?.[k]||""} onChange={e=>setEditData(p=>({...p,[k]:e.target.value}))} rows={2} style={{...inp,resize:"vertical",fontFamily:"inherit",fontSize:12,lineHeight:1.5}} />
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["Cor Primária","corPrimaria"],["Cor Secundária","corSecundaria"],["Cor Acento","corAcento"]].map(([l,k])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="color" value={editData?.[k]||"#1565C0"} onChange={e=>setEditData(p=>({...p,[k]:e.target.value}))} style={{width:36,height:36,border:"none",borderRadius:8,cursor:"pointer",background:"none"}} />
                <div>
                  <div style={{fontSize:10,color:C.muted,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:12,color:C.text}}>{editData?.[k]||"—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>}

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
                  <p style={{fontSize:13,color:C.muted,margin:"0 0 8px",lineHeight:1.5}}>{p.descricao?.slice(0,160)}{p.descricao?.length>160?"…":""}</p>
                  <div style={{fontSize:12,background:"#EF444415",color:"#FF9090",padding:"5px 10px",borderRadius:7,marginBottom:4}}><strong>Dor:</strong> {p.dores?.slice(0,100)}</div>
                  <div style={{fontSize:12,background:"#F5A62315",color:"#F5A623",padding:"5px 10px",borderRadius:7}}><strong>Desejo:</strong> {p.desejos?.slice(0,100)}</div>
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
                  <p style={{fontSize:13,color:C.muted,margin:"0 0 8px",lineHeight:1.4}}>{p.descricao?.slice(0,100)}</p>
                  {p.preco&&<span style={{fontSize:12,background:"#F5A62315",color:"#F5A623",padding:"3px 10px",borderRadius:20}}>{p.preco}</span>}
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
                  <div style={{fontSize:14,color:C.text,fontWeight:600}}>{p}</div>
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
              <div style={{fontSize:14,color:C.text,lineHeight:1.5}}>{result.estrategiaConteudo.tomVoz}</div>
            </div>}
            {result.estrategiaConteudo.hooksIdeal&&<div style={{background:C.surf3,borderRadius:9,padding:"10px 13px"}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Hooks que funcionam</div>
              <div style={{fontSize:14,color:"#FFD580",fontStyle:"italic",lineHeight:1.6}}>{result.estrategiaConteudo.hooksIdeal}</div>
            </div>}
          </div>
        )}

        {/* Opportunities + Next steps */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {result.oportunidades?.length>0&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#A8E6A3",letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>🚀 Oportunidades</div>
            {result.oportunidades.map((o,i)=><div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:7}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#A8E6A3",flexShrink:0,marginTop:5}} />
              <div style={{fontSize:13,color:C.muted,lineHeight:1.4}}>{o}</div>
            </div>)}
          </div>}
          {result.proximosPassos?.length>0&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#F5A623",letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>✅ Próximos Passos</div>
            {result.proximosPassos.map((p,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#F5A62318",border:"1px solid #F5A62340",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#F5A623",flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.4,paddingTop:1}}>{p}</div>
            </div>)}
          </div>}
        </div>

        {/* Alerts */}
        {result.alertas?.length>0&&<div style={{background:"#EF444408",border:"1px solid #EF444425",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#FF9090",letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>⚠️ Pontos de Atenção</div>
          {result.alertas.map((a,i)=><div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:5}}>
            <span style={{color:"#FF9090",flexShrink:0}}>→</span>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.4}}>{a}</div>
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

      {/* LinkedIn */}
      <Sec title="LinkedIn" accent="#0A66C2">
        <G2 ch={[<F label="URL da página/perfil"><I k="liUrl" ph="https://linkedin.com/company/suamarca" /></F>,<F label="Seguidores"><I k="liSeg" ph="0" type="number" /></F>]} />
        <G2 ch={[<F label="Posts/semana"><I k="liFreq" ph="2" type="number" /></F>,<F label="Publicação automática"><div style={{marginTop:6}}><Toggle val={form.liAutoPost} onChange={v=>upd("liAutoPost",v)} label={form.liAutoPost?"Ativada":"Desativada"} /></div></F>]} />
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

  // ─── ESTRATÉGIA ───────────────────────────────────────────────────────────
  function TabEstrategia(){
    const est = form.estrategia || {};
    const updE = (k,v) => upd("estrategia",{...est,[k]:v});
    const REDES = ["Instagram","Facebook","TikTok","LinkedIn","YouTube","Stories","Reels"];
    const TIPOS_POST = ["Post Feed","Story","Reel","Carrossel","LinkedIn Post","TikTok"];
    const HORARIOS = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
    const DIAS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];

    const freq = est.frequencia || {};
    const updFreq = (rede,tipo,val) => updE("frequencia",{...freq,[rede]:{...(freq[rede]||{}),[tipo]:Number(val)}});

    const horarios = est.horarios || {};
    const updHor = (tipo,campo,val) => updE("horarios",{...horarios,[tipo]:{...(horarios[tipo]||{}),[campo]:val}});

    const respostas = est.respostas || [];
    const [novaResp,setNovaResp]=useState({gatilho:"",resposta:"",acao:"responder",produto:""});
    const addResp=()=>{ if(!novaResp.gatilho||!novaResp.resposta) return; updE("respostas",[...respostas,{...novaResp,id:Date.now()}]); setNovaResp({gatilho:"",resposta:"",acao:"responder",produto:""}); flash("✓ Resposta adicionada","teal"); };
    const delResp=(id)=>updE("respostas",respostas.filter(r=>r.id!==id));

    const [abaEst,setAbaEst]=useState("frequencia");
    const ABAS_EST=[{id:"frequencia",label:"📅 Frequência & Horários"},{id:"respostas",label:"💬 Respostas Automáticas"},{id:"pilares",label:"🎯 Pilares & Tom"}];

    return <>
      <div style={{marginBottom:20,padding:"18px 20px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{width:44,height:44,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Target size={20} color="#fff"/></div>
          <div>
            <div style={{fontSize:17,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Estratégia de Conteúdo</div>
            <div style={{fontSize:12,color:C.muted}}>Define frequência, horários ideais e respostas automáticas — a IA usa isso para gerar a semana</div>
          </div>
        </div>
      </div>

      {/* Sub-abas */}
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto"}}>
        {ABAS_EST.map(a=><button key={a.id} onClick={()=>setAbaEst(a.id)}
          style={{background:abaEst===a.id?G.primary:"none",color:abaEst===a.id?"#fff":C.muted,border:`1px solid ${abaEst===a.id?T.primary:C.border}`,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>
          {a.label}
        </button>)}
      </div>

      {/* Frequência & Horários */}
      {abaEst==="frequencia"&&<>
        <Sec title="Posts por semana — por rede e tipo">
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>
                  <th style={{textAlign:"left",padding:"6px 10px",color:C.muted,fontWeight:600}}>Rede</th>
                  {TIPOS_POST.map(t=><th key={t} style={{textAlign:"center",padding:"6px 8px",color:C.muted,fontWeight:600,fontSize:11}}>{t}</th>)}
                </tr>
              </thead>
              <tbody>
                {REDES.map(r=>(
                  <tr key={r} style={{borderTop:`1px solid ${C.border}`}}>
                    <td style={{padding:"8px 10px",fontWeight:600,color:C.text,fontSize:12}}>{r}</td>
                    {TIPOS_POST.map(t=>(
                      <td key={t} style={{textAlign:"center",padding:"4px 6px"}}>
                        <input type="number" min={0} max={14} value={freq[r]?.[t]||0}
                          onChange={e=>updFreq(r,t,e.target.value)}
                          style={{...inp,width:48,textAlign:"center",padding:"4px 6px",fontSize:12}}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
        <Sec title="Melhores horários por tipo de conteúdo">
          {TIPOS_POST.map(t=>(
            <div key={t} style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:6}}>{t}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:C.muted}}>Dias:</span>
                  {DIAS.map(d=>(
                    <button key={d} onClick={()=>{
                      const cur=horarios[t]?.dias||[];
                      updHor(t,"dias",cur.includes(d)?cur.filter(x=>x!==d):[...cur,d]);
                    }} style={{background:(horarios[t]?.dias||[]).includes(d)?T.primary:"none",color:(horarios[t]?.dias||[]).includes(d)?"#fff":C.muted,border:`1px solid ${(horarios[t]?.dias||[]).includes(d)?T.primary:C.border}`,padding:"3px 8px",borderRadius:10,cursor:"pointer",fontSize:10}}>
                      {d.slice(0,3)}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:C.muted}}>Horário:</span>
                  <select value={horarios[t]?.hora||"09:00"} onChange={e=>updHor(t,"hora",e.target.value)} style={{...inp,width:90,fontSize:11,padding:"3px 6px"}}>
                    {HORARIOS.map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </Sec>
      </>}

      {/* Respostas Automáticas */}
      {abaEst==="respostas"&&<>
        <Sec title="Respostas automáticas por gatilho">
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>Configure o que a IA responde quando detectar cada situação nos comentários e DMs</div>
          {respostas.map(r=>(
            <div key={r.id} style={{background:C.surf2,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{background:`${T.primary}20`,color:T.primary,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>GATILHO: {r.gatilho}</span>
                  <span style={{background:`${T.secondary}20`,color:T.secondary,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>{r.acao}</span>
                  {r.produto&&<span style={{background:"#F5A62320",color:"#F5A623",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>Produto: {r.produto}</span>}
                </div>
                <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{r.resposta}</div>
              </div>
              <button onClick={()=>delResp(r.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4}}><Trash2 size={14}/></button>
            </div>
          ))}
          <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginTop:8}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:10}}>NOVA RESPOSTA AUTOMÁTICA</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <F label="Gatilho (o que detectar)">
                <input value={novaResp.gatilho} onChange={e=>setNovaResp(p=>({...p,gatilho:e.target.value}))}
                  placeholder="Ex: quanto custa?, preço, valor" style={{...inp,fontSize:12}}/>
              </F>
              <F label="Ação">
                <select value={novaResp.acao} onChange={e=>setNovaResp(p=>({...p,acao:e.target.value}))} style={{...inp,fontSize:12}}>
                  <option value="responder">Responder automaticamente</option>
                  <option value="encaminhar_whatsapp">Encaminhar para WhatsApp</option>
                  <option value="escalar_humano">Escalar para humano</option>
                  <option value="enviar_link">Enviar link</option>
                </select>
              </F>
            </div>
            <F label="Resposta / mensagem">
              <textarea value={novaResp.resposta} onChange={e=>setNovaResp(p=>({...p,resposta:e.target.value}))}
                placeholder="Ex: Oi! Nosso plano começa em R$197/mês. Quer saber mais? Me chama no WhatsApp 👇"
                rows={3} style={{...inp,resize:"vertical",fontSize:12,fontFamily:"inherit"}}/>
            </F>
            <F label="Produto relacionado (opcional)">
              <select value={novaResp.produto} onChange={e=>setNovaResp(p=>({...p,produto:e.target.value}))} style={{...inp,fontSize:12}}>
                <option value="">Todos os produtos</option>
                {(form.produtos||[]).map(p=><option key={p.id} value={p.nome}>{p.nome}</option>)}
              </select>
            </F>
            <button onClick={addResp} style={{background:G.primary,color:"#fff",border:"none",padding:"8px 20px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,marginTop:8}}>+ Adicionar Resposta</button>
          </div>
        </Sec>
      </>}

      {/* Pilares & Tom */}
      {abaEst==="pilares"&&<>
        <Sec title="Pilares de conteúdo">
          <F label="Tópicos que sempre abordamos"><textarea value={est.topicosSempre||form.topicosSempre||""} onChange={e=>updE("topicosSempre",e.target.value)} rows={3} style={{...inp,resize:"vertical",fontFamily:"inherit"}}/></F>
          <F label="Tópicos que nunca abordamos"><textarea value={est.topicosNunca||form.topicosNunca||""} onChange={e=>updE("topicosNunca",e.target.value)} rows={2} style={{...inp,resize:"vertical",fontFamily:"inherit"}}/></F>
        </Sec>
        <Sec title="Tom de voz & estilo">
          <G2 ch={[
            <F label="Sentimento da marca"><select value={est.sentimento||form.sentimentoMarca||""} onChange={e=>updE("sentimento",e.target.value)} style={{...inp}}>
              {["empoderador","acolhedor","divertido","sério","inspirador","educativo","premium","próximo"].map(s=><option key={s}>{s}</option>)}
            </select></F>,
            <F label="Melhor formato de conteúdo"><input value={est.melhorConteudo||form.melhorConteudo||""} onChange={e=>updE("melhorConteudo",e.target.value)} placeholder="Ex: Reels educativos, carrosséis" style={{...inp}}/></F>
          ]}/>
          <F label="Meta das redes sociais"><input value={est.metaRedes||form.metaRedes||""} onChange={e=>updE("metaRedes",e.target.value)} placeholder="Ex: 10k seguidores em 6 meses" style={{...inp}}/></F>
        </Sec>
        <button onClick={save} style={{background:G.primary,color:"#fff",border:"none",padding:"10px 28px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14,boxShadow:`0 4px 18px ${T.primary}30`}}>💾 Salvar Estratégia</button>
      </>}
    </>;
  }

  // ─── AGENDA HUB ───────────────────────────────────────────────────────────
  function TabAgendaHub(){
    const agenda=form.agenda||[];
    const [filtro,setFiltro]=useState("todos");
    const [expanded,setExpanded]=useState({});
    const STATUS_CORES={"Rascunho":C.muted,"Ag. aprovação":"#A0C4FF","Alteração":"#E8890C","Aprovado":"#4ADE80","Agendado":"#DDD6FE","Publicado":"#10B981"};
    const FILTROS=[{id:"todos",label:"Todos"},{id:"aprovacao",label:"Para aprovar"},{id:"agendados",label:"Agendados"},{id:"publicados",label:"Publicados"}];

    const filtrados = agenda.filter(a=>{
      if(filtro==="aprovacao") return ["Rascunho","Ag. aprovação","Alteração"].includes(a.status);
      if(filtro==="agendados") return ["Aprovado","Agendado"].includes(a.status);
      if(filtro==="publicados") return a.status==="Publicado";
      return true;
    }).sort((a,b)=>a.data>b.data?1:-1);

    const updS=(id,s)=>upd("agenda",agenda.map(a=>a.id===id?{...a,status:s}:a));
    const del=(id)=>upd("agenda",agenda.filter(a=>a.id!==id));

    async function sendApprovalWA(it){
      updS(it.id,"Ag. aprovação");
      const msg=`🎯 *Aprovação — ${co.name}*\n\n📌 *${it.titulo||"Post"}*\n📅 ${it.data} às ${it.hora||"--:--"}\n📲 ${it.plataforma}\n\n📝 *Legenda:*\n${(it.legenda||"").slice(0,500)}\n\n---\nResponda:\n✅ *APROVAR*\n✏️ *ALTERAR: [comentário]*`;
      try{
        const r=await fetch('/api/whatsapp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
        const d=await r.json();
        if(d.success) flash("✅ Enviado para WhatsApp!","teal");
        else flash(`⚠️ ${d.error}`,"coral");
      }catch{ flash("⚠️ Erro ao enviar","coral"); }
    }

    return <>
      <div style={{marginBottom:20,padding:"18px 20px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><CalendarClock size={20} color="#fff"/></div>
          <div>
            <div style={{fontSize:17,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Agenda</div>
            <div style={{fontSize:12,color:C.muted}}>Posts aprovados no fluxo de conteúdo — aguardando publicação ou já publicados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {FILTROS.map(f=>(
          <button key={f.id} onClick={()=>setFiltro(f.id)}
            style={{background:filtro===f.id?G.primary:"none",color:filtro===f.id?"#fff":C.muted,border:`1px solid ${filtro===f.id?T.primary:C.border}`,padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600}}>
            {f.label} {f.id!=="todos"&&<span style={{opacity:.7}}>({agenda.filter(a=>filtro==="aprovacao"?["Rascunho","Ag. aprovação","Alteração"].includes(a.status):filtro==="agendados"?["Aprovado","Agendado"].includes(a.status):a.status==="Publicado").length})</span>}
          </button>
        ))}
      </div>

      {filtrados.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.muted,fontSize:13}}>
        <div style={{fontSize:32,marginBottom:12}}>📅</div>
        Nenhum post aqui ainda.<br/>
        <span style={{fontSize:12}}>Crie conteúdo na aba <strong>Conteúdo</strong> para aparecer aqui após aprovação.</span>
      </div>}

      {filtrados.map(it=>(
        <div key={it.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10,position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:4,background:STATUS_CORES[it.status]||C.border,borderRadius:"14px 0 0 14px"}}/>
          <div style={{paddingLeft:12}}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.text}}>{it.titulo||"Post"}</span>
                  <span style={{background:`${STATUS_CORES[it.status]||C.border}30`,color:STATUS_CORES[it.status]||C.muted,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>{it.status}</span>
                  <span style={{fontSize:10,color:C.muted}}>{it.plataforma}</span>
                </div>
                <div style={{fontSize:11,color:C.muted}}>{it.data} {it.hora&&`às ${it.hora}`}</div>
              </div>
              {it.imagemFinal&&<img src={it.imagemFinal} alt="" style={{width:52,height:52,borderRadius:8,objectFit:"cover",flexShrink:0,marginLeft:10}}/>}
            </div>

            {/* Legenda colapsável */}
            {it.legenda&&<div style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:10,
              ...(expanded[it.id]?{}:{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"})}}>
              {it.legenda}
            </div>}
            {it.legenda?.length>120&&<button onClick={()=>setExpanded(p=>({...p,[it.id]:!p[it.id]}))}
              style={{background:"none",border:"none",color:T.primary,fontSize:11,cursor:"pointer",padding:"0 0 8px",fontWeight:600}}>
              {expanded[it.id]?"▲ Ver menos":"▼ Ver mais"}
            </button>}

            {/* Estratégia embutida */}
            {it.estrategia&&<div style={{background:`${T.primary}08`,border:`1px solid ${T.primary}15`,borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:11,color:C.muted}}>
              🎯 <strong style={{color:C.text}}>Estratégia:</strong> {it.estrategia}
            </div>}

            {/* Ações */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Rascunho","Alteração"].includes(it.status)&&<button onClick={()=>sendApprovalWA(it)}
                style={{background:"#25D366",color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                <Send size={11}/> Enviar WA
              </button>}
              {it.status==="Ag. aprovação"&&<button onClick={()=>updS(it.id,"Aprovado")}
                style={{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700}}>
                ✅ Aprovar
              </button>}
              {it.status==="Aprovado"&&<button onClick={()=>updS(it.id,"Agendado")}
                style={{background:G.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700}}>
                📅 Agendar
              </button>}
              {it.status==="Agendado"&&<button onClick={()=>updS(it.id,"Publicado")}
                style={{background:"#8B5CF6",color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700}}>
                🚀 Marcar Publicado
              </button>}
              <button onClick={()=>del(it.id)}
                style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:11,marginLeft:"auto"}}>
                <Trash2 size={12}/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </>;
  }

  // ─── CONTEÚDO HUB ─────────────────────────────────────────────────────────
  function TabConteudo(){
    const agenda=form.agenda||[];
    const ordens=form.ordens||[];
    const pubs=form.publicos||[];
    const pcList=form.perfilConteudo||[];
    const [fase,setFase]=useState("solicitar");
    const [waP,setWaP]=useState(null);
    const [altMsg,setAltMsg]=useState("");
    const [novaOS,setNovaOS]=useState(false);
    const [os,setOs]=useState({tipo:"Post Feed",titulo:"",briefing:"",publicoId:"",plataformas:[],prazo:"",urgente:false});
    const [novoItem,setNovoItem]=useState(false);
    const [item,setItem]=useState({tipo:"Post Feed",titulo:"",legenda:"",publicoId:"",plataforma:"Instagram",data:"",hora:"09:00",status:"Rascunho"});
    const [gerando,setGerando]=useState(false);
    const [semana,setSemana]=useState(form.semanaGerada||null);
    const [selPC,setSelPC]=useState(pubs[0]?.id||null);
    // fluxo solicitar
    const [abaOS,setAbaOS]=useState("briefing"); // briefing | imagens
    const [imagens,setImagens]=useState([]);
    const [imgInstrucao,setImgInstrucao]=useState("usar");
    const [roteiro,setRoteiro]=useState(null);
    const [gerandoRot,setGerandoRot]=useState(false);
    const [roteiroEdit,setRoteiroEdit]=useState("");
    const [roteiroAprov,setRoteiroAprov]=useState(false);
    const [conteudoFinal,setConteudoFinal]=useState(null);
    const [gerandoFinal,setGerandoFinal]=useState(false);
    const [conteudoEdit,setConteudoEdit]=useState({titulo:"",legenda:"",hook:"",hashtags:"",cta:""});
    const imgRef=useRef(null);
    const [expandedCards,setExpandedCards]=useState({});
    const toggleExpand=(id)=>setExpandedCards(p=>({...p,[id]:!p[id]}));

    // ── Fluxo de imagem ──────────────────────────────────────────────────────
    const [faseImg,setFaseImg]=useState("idle"); // idle | gerando | escolha | overlay | done
    const [opcoesImg,setOpcoesImg]=useState([]); // [{b64,preview}]
    const [imgEscolhida,setImgEscolhida]=useState(null); // b64 da escolhida
    const [imgPromptCustom,setImgPromptCustom]=useState("");
    const [imgUpload,setImgUpload]=useState(null); // {preview, b64}
    const imgUpRef=useRef(null);

    async function gerarImagens(promptExtra=""){
      if(!conteudoFinal) return;
      setFaseImg("gerando"); setOpcoesImg([]); setImgEscolhida(null);
      const basePrompt=`Hyperrealistic professional photo for social media post.
Brand: ${co.name} | Niche: ${co.niche}.
Visual concept: ${conteudoFinal.sugestao_visual||"professional lifestyle, clean modern setting"}.
${promptExtra?`Additional instruction: ${promptExtra}`:""}
Style: editorial photography, natural lighting, 4k quality, social media aesthetic.
Do NOT include text or logos in the image.`;
      try{
        const r=await fetch("/api/generate-image",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({prompt:basePrompt,n:3,size:"1024x1024",quality:"high"})});
        const d=await r.json();
        if(d.error) throw new Error(d.error);
        setOpcoesImg(d.images.map(img=>({b64:img.b64,preview:`data:image/png;base64,${img.b64}`})));
        setFaseImg("escolha");
      }catch(e){ flash(`❌ Erro ao gerar imagem: ${e.message}`,"coral"); setFaseImg("idle"); }
    }

    function uploadImagemFinal(e){
      const f=e.target.files[0]; if(!f) return;
      const reader=new FileReader();
      reader.onload=ev=>{
        const b64=ev.target.result.split(",")[1];
        setImgUpload({preview:ev.target.result,b64});
        setImgEscolhida(b64);
        setFaseImg("escolha");
      };
      reader.readAsDataURL(f);
      e.target.value="";
    }

    function escolherImagem(b64){ setImgEscolhida(b64); setFaseImg("overlay"); }

    const SC={"Rascunho":C.muted,"Ag. aprovação":"#A0C4FF","Alteração":"#E8890C","Aprovado":"#FFD580","Agendado":"#DDD6FE","Publicado":"#10B981"};
    const PLATS=["Instagram","Facebook","TikTok","LinkedIn","WhatsApp","Canal WA","YouTube","Stories","Reels","Todas"];
    const TIPOS_C=["Post Feed","Reel","Story","Carrossel","LinkedIn Post","TikTok","YouTube Short","WhatsApp","Email"];

    const updS=(id,s,extra={})=>upd("agenda",agenda.map(a=>a.id===id?{...a,status:s,...extra}:a));
    const iu=(k,v)=>setItem(p=>({...p,[k]:v}));
    const togP=p=>setOs(o=>({...o,plataformas:o.plataformas.includes(p)?o.plataformas.filter(x=>x!==p):[...o.plataformas,p]}));

    function addOS(){
      upd("ordens",[...ordens,{...os,id:Date.now(),status:"Pendente",em:new Date().toLocaleDateString("pt-BR")}]);
      setNovaOS(false);
      setOs({tipo:"Post Feed",titulo:"",briefing:"",publicoId:"",plataformas:[],prazo:"",urgente:false});
      setImagens([]); setRoteiro(null); setRoteiroAprov(false); setConteudoFinal(null);
      flash("✓ Solicitação salva na lista!","teal");
    }

    function uploadImagens(e){
      const files=Array.from(e.target.files);
      files.forEach(f=>{
        if(f.size>5*1024*1024){flash("⚠️ Imagem muito grande (máx 5MB)","coral");return;}
        const reader=new FileReader();
        reader.onload=ev=>{
          setImagens(p=>[...p,{name:f.name,type:f.type,data:ev.target.result.split(",")[1],preview:ev.target.result}]);
        };
        reader.readAsDataURL(f);
      });
      e.target.value="";
    }

    async function gerarRoteiro(){
      if(!os.briefing.trim()&&!os.titulo.trim()) return;
      setGerandoRot(true); setRoteiro(null); setRoteiroAprov(false); setConteudoFinal(null);
      const imgDesc=imagens.length>0?`\n\nIMENS ENVIADAS (${imagens.length}): O usuário enviou ${imagens.length} imagem(ns) com instrução: "${imgInstrucao==="usar"?"usar no post":imgInstrucao==="descrever"?"criar legenda descrevendo a imagem":"editar/recriar com base na imagem"}".`:"";
      const prompt=`Você é um estrategista de conteúdo digital. Com base nas informações abaixo, crie um ROTEIRO CRIATIVO (conceito do post) — não a legenda final ainda, apenas o conceito e abordagem.

EMPRESA: ${co.name} | NICHO: ${co.niche}
TIPO DE CONTEÚDO: ${os.tipo}
PLATAFORMAS: ${os.plataformas.join(", ")||"Instagram"}
BRIEFING DO CLIENTE: ${os.briefing||os.titulo}${imgDesc}

Retorne APENAS JSON:
{
  "conceito": "Conceito criativo do post em 2-3 frases",
  "abordagem": "Como abordar o tema (educativo|entretenimento|prova social|oferta|bastidores)",
  "hook": "Primeira frase/gancho que vai parar o scroll",
  "estrutura": "Estrutura sugerida: ex: Hook → Problema → Solução → CTA",
  "cta": "Call to action sugerido",
  "formato_visual": "Sugestão de como deve ser visualmente",
  "melhor_horario": "Melhor horário para publicar este tipo de post",
  "observacoes": "Dica extra do estrategista"
}`;
      try{
        const msgs=[{role:"user",content:imagens.length>0
          ?[...imagens.map(img=>({type:"image",source:{type:"base64",media_type:img.type,data:img.data}})),{type:"text",text:prompt}]
          :prompt}];
        const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,messages:msgs})});
        const d=await r.json();
        if(d.error) throw new Error(JSON.stringify(d.error));
        const raw=d.content?.find(b=>b.type==="text")?.text||"";
        const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
        setRoteiro(parsed); setRoteiroEdit(parsed.conceito);
      }catch(e){ flash(`❌ Erro: ${e.message}`,"coral"); }
      setGerandoRot(false);
    }

    async function gerarConteudoFinal(){
      if(!roteiro) return;
      setGerandoFinal(true); setConteudoFinal(null);
      const imgDesc=imagens.length>0?`\n\nO usuário enviou ${imagens.length} imagem(ns). Instrução: ${imgInstrucao==="usar"?"use a imagem como referência visual no post":imgInstrucao==="descrever"?"crie a legenda descrevendo o que está na imagem":"o usuário quer que a imagem seja editada/adaptada"}.`:"";
      const prompt=`Você é um copywriter especialista em redes sociais. Crie o conteúdo COMPLETO e PRONTO para publicar.

EMPRESA: ${co.name} | NICHO: ${co.niche}
TIPO: ${os.tipo} | PLATAFORMAS: ${os.plataformas.join(", ")||"Instagram"}
BRIEFING: ${os.briefing||os.titulo}
ROTEIRO APROVADO: ${roteiroEdit||roteiro.conceito}
HOOK: ${roteiro.hook}
ESTRUTURA: ${roteiro.estrutura}
CTA: ${roteiro.cta}${imgDesc}

Retorne APENAS JSON:
{
  "titulo": "título interno para identificação",
  "legenda": "legenda COMPLETA pronta para publicar, com emojis, quebras de linha, storytelling e call to action — mínimo 150 palavras",
  "hook": "primeira frase do post (já incluída na legenda mas destacada aqui)",
  "hashtags": "20 hashtags estratégicas separadas por espaço",
  "cta": "call to action claro",
  "texto_story": "versão curta para story (máx 3 linhas)",
  "sugestao_visual": "descrição detalhada do que deve aparecer na imagem/vídeo",
  "horario": "HH:MM",
  "data": "${os.prazo||new Date(Date.now()+86400000).toISOString().slice(0,10)}"
}`;
      try{
        const msgs=[{role:"user",content:imagens.length>0
          ?[...imagens.map(img=>({type:"image",source:{type:"base64",media_type:img.type,data:img.data}})),{type:"text",text:prompt}]
          :prompt}];
        const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:3000,messages:msgs})});
        const d=await r.json();
        if(d.error) throw new Error(JSON.stringify(d.error));
        const raw=d.content?.find(b=>b.type==="text")?.text||"";
        const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
        setConteudoFinal(parsed);
        setConteudoEdit({titulo:parsed.titulo,legenda:parsed.legenda,hook:parsed.hook,hashtags:parsed.hashtags,cta:parsed.cta});
      }catch(e){ flash(`❌ Erro: ${e.message}`,"coral"); }
      setGerandoFinal(false);
    }

    function aprovarEAgendar(){
      const imgFinal = imgEscolhida
        ? `data:image/png;base64,${imgEscolhida}`
        : (imagens[0]?.preview || null);
      const d={
        ...conteudoEdit,
        tipo:os.tipo,
        plataforma:os.plataformas[0]||"Instagram",
        publicoId:os.publicoId,
        data:conteudoFinal?.data||os.prazo||new Date().toISOString().slice(0,10),
        hora:conteudoFinal?.horario||"09:00",
        status:"Rascunho",
        id:Date.now(),
        imagens:imagens.map(i=>({name:i.name,preview:i.preview})),
        imagemFinal: imgFinal,
      };
      upd("agenda",[...agenda,d]);
      if(os.titulo) upd("ordens",ordens.map(o=>o.titulo===os.titulo?{...o,status:"Em produção"}:o));
      setNovaOS(false); setRoteiro(null); setRoteiroAprov(false); setConteudoFinal(null);
      setImagens([]); setFaseImg("idle"); setOpcoesImg([]); setImgEscolhida(null); setImgUpload(null);
      setFase("aprovacao");
      flash("✅ Conteúdo e arte enviados para Aprovação!","teal");
    }
    function addItem(){
      upd("agenda",[...agenda,{...item,id:Date.now()}]);
      setNovoItem(false); flash("✓ Adicionado ao calendário","teal");
    }
    function addToAgenda(d){
      const novo={...d,id:Date.now(),status:"Rascunho"};
      upd("agenda",[...agenda,novo]);
      flash("✓ Adicionado ao calendário para aprovação","teal");
    }

    async function sendApproval(it){
      updS(it.id,"Ag. aprovação"); setWaP(it);
      const msg=`🎯 *Aprovação de Conteúdo — ${co.name}*\n\n📌 *${it.titulo}*\n📅 ${it.data} às ${it.hora||"--:--"}\n📲 ${it.plataforma}\n\n📝 *Legenda:*\n${it.legenda}\n\n---\nResponda:\n✅ *APROVAR* — para publicar\n✏️ *ALTERAR: [comentário]* — para solicitar mudança`;
      try{
        const r=await fetch('/api/whatsapp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
        const d=await r.json();
        if(d.success) flash("✅ Enviado para WhatsApp!","teal");
        else flash(`⚠️ Erro: ${d.error}`,"coral");
      }catch{ flash("⚠️ Erro ao enviar","coral"); }
    }
    function approve(it){ updS(it.id,"Aprovado"); setWaP(null); flash("✅ Aprovado!","teal"); }
    function reqChange(it){ if(!altMsg.trim()) return; updS(it.id,"Alteração",{alteracaoMsg:altMsg}); setAltMsg(""); setWaP(null); flash("✏️ Alteração registrada","gold"); }

    async function gerarSemana(){
      setGerando(true);
      const hoje=new Date(); const dias=[];
      for(let i=0;i<7;i++){const d=new Date(hoje);d.setDate(hoje.getDate()+i);dias.push(d.toISOString().slice(0,10));}
      const pc=pcList[0]||{};
      const prompt=`Você é um estrategista de conteúdo digital sênior. Crie uma programação semanal de conteúdo para a marca abaixo.

EMPRESA: ${co.name}
NICHO: ${co.niche}
TOM DE VOZ: ${pc.tom||form.descricao||"profissional e próximo"}
PILARES: ${pc.topicosSempre||form.topicosSempre||"educação, entretenimento, prova social"}
HASHTAGS: ${pc.hashtags||form.hashtags||""}
ORDENS DE SERVIÇO PENDENTES: ${ordens.filter(o=>o.status==="Pendente").map(o=>`${o.tipo}: ${o.titulo} — ${o.briefing?.slice(0,80)}`).join("; ")||"nenhuma"}

Crie exatamente 7 posts, um por dia, para os dias: ${dias.join(", ")}.
Varie os tipos: Post Feed, Story, Reel, Carrossel — e as plataformas: Instagram, Facebook, LinkedIn.
Para cada post gere uma legenda COMPLETA e pronta para publicar.

RETORNE APENAS JSON válido, sem texto antes ou depois:
[
  {
    "data": "YYYY-MM-DD",
    "tipo": "Post Feed|Reel|Story|Carrossel|LinkedIn Post",
    "plataforma": "Instagram|Facebook|LinkedIn|TikTok",
    "titulo": "título interno do post",
    "legenda": "legenda completa pronta para publicar com emojis e call to action",
    "hora": "HH:MM",
    "pilar": "nome do pilar editorial",
    "hook": "primeira frase chamativa"
  }
]`;
      try{
        const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:6000,messages:[{role:"user",content:prompt}]})});
        const d=await r.json();
        if(d.error) throw new Error(JSON.stringify(d.error));
        const raw=d.content?.find(b=>b.type==="text")?.text||"";
        const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
        setSemana(parsed); upd("semanaGerada",parsed);
        flash("✅ Programação semanal gerada!","teal");
      }catch(e){ flash(`❌ Erro: ${e.message}`,"coral"); }
      setGerando(false);
    }

    const FASES=[
      {id:"solicitar",label:"Solicitar",icon:"🎫",count:ordens.filter(o=>o.status==="Pendente").length},
      {id:"semana",label:"Programação IA",icon:"🤖",count:semana?.length||0},
      {id:"aprovacao",label:"Aprovação",icon:"✅",count:agenda.filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length},
      {id:"agendados",label:"Agendados",icon:"📅",count:agenda.filter(a=>["Aprovado","Agendado"].includes(a.status)).length},
      {id:"publicados",label:"Publicados",icon:"🚀",count:agenda.filter(a=>a.status==="Publicado").length},
      {id:"estrategia",label:"Estratégia",icon:"📋",count:null},
    ];

    const pc=pcList.find(p=>p.publicoId===selPC)||{};
    const updPC=(k,v)=>{const next=pcList.find(p=>p.publicoId===selPC)?pcList.map(p=>p.publicoId===selPC?{...p,[k]:v}:p):[...pcList,{publicoId:selPC,[k]:v}];upd("perfilConteudo",next);};

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"18px 20px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:11,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FileText size={20} color="#fff"/></div>
          <div>
            <div style={{fontSize:17,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Central de Conteúdo</div>
            <div style={{fontSize:12,color:C.muted}}>Solicite → IA programa → Aprove via WhatsApp → Agende → Publique</div>
          </div>
        </div>
        {/* Sub-nav */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {FASES.map(f=>(
            <button key={f.id} onClick={()=>setFase(f.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:fase===f.id?700:500,border:`1px solid ${fase===f.id?T.primary:C.border2}`,background:fase===f.id?`${T.primary}20`:C.surf3,color:fase===f.id?T.primaryL:C.muted,transition:"all .15s"}}>
              <span>{f.icon}</span><span>{f.label}</span>
              {f.count>0&&<span style={{background:fase===f.id?T.primary:C.surf2,color:fase===f.id?"#fff":C.muted,fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10}}>{f.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── SOLICITAR (fluxo IA) ── */}
      {fase==="solicitar"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,color:C.muted}}>Descreva o conteúdo → IA gera roteiro → você aprova → IA cria o post completo</div>
          <button onClick={()=>{setNovaOS(!novaOS);if(novaOS){setRoteiro(null);setRoteiroAprov(false);setConteudoFinal(null);setImagens([]);}}} style={{background:G.primary,color:"#fff",border:"none",padding:"8px 18px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Plus size={13}/> {novaOS?"Fechar":"Nova Solicitação"}</button>
        </div>

        {novaOS&&<div style={{background:C.surf,border:`1px solid ${T.primary}30`,borderRadius:14,padding:"20px",marginBottom:18}}>
          {/* sub-abas: Briefing | Imagens */}
          <div style={{display:"flex",gap:0,marginBottom:18,background:C.bg,borderRadius:10,padding:3,border:`1px solid ${C.border2}`}}>
            {[["briefing","📝 Briefing"],["imagens",`🖼️ Imagens${imagens.length>0?" ("+imagens.length+")":""}`]].map(([k,l])=>(
              <button key={k} onClick={()=>setAbaOS(k)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:abaOS===k?700:400,fontSize:13,background:abaOS===k?G.primary:"none",color:abaOS===k?"#fff":C.muted,transition:"all .2s"}}>{l}</button>
            ))}
          </div>

          {/* ABA BRIEFING */}
          {abaOS==="briefing"&&<>
            <G2 ch={[
              <F label="Tipo de conteúdo"><select value={os.tipo} onChange={e=>setOs(o=>({...o,tipo:e.target.value}))} style={{...inp,cursor:"pointer"}}>{TIPOS_C.map(t=><option key={t}>{t}</option>)}</select></F>,
              <F label="Título / tema"><input value={os.titulo} onChange={e=>setOs(o=>({...o,titulo:e.target.value}))} placeholder="Ex: Promoção dia das mães" style={{...inp,fontFamily:"inherit"}} /></F>
            ]}/>
            <F label="Briefing detalhado" help="Quanto mais detalhe, melhor o resultado da IA"><textarea value={os.briefing} onChange={e=>setOs(o=>({...o,briefing:e.target.value}))} rows={4} placeholder="Descreva o objetivo, produto, oferta, mensagem, tom de voz, referências visuais..." style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
            <G2 ch={[
              <F label="Público-alvo"><select value={os.publicoId} onChange={e=>setOs(o=>({...o,publicoId:e.target.value}))} style={{...inp,cursor:"pointer"}}><option value="">Todos</option>{pubs.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></F>,
              <F label="Prazo desejado"><input type="date" value={os.prazo} onChange={e=>setOs(o=>({...o,prazo:e.target.value}))} style={{...inp,fontFamily:"inherit"}} /></F>
            ]}/>
            <F label="Plataformas"><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Instagram","Facebook","TikTok","LinkedIn","WhatsApp","Stories","Reels","YouTube"].map(p=>{const on=os.plataformas.includes(p);return<button key={p} onClick={()=>togP(p)} style={{padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:12,border:`1px solid ${on?T.primary+"80":C.border2}`,background:on?`${T.primary}18`:C.surf3,color:on?T.primaryL:C.muted,fontWeight:on?700:400}}>{p}</button>;})}
            </div></F>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:C.text,marginBottom:14}}><input type="checkbox" checked={os.urgente} onChange={e=>setOs(o=>({...o,urgente:e.target.checked}))} />🚨 Urgente</label>
          </>}

          {/* ABA IMAGENS */}
          {abaOS==="imagens"&&<>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Faça upload de 1 ou mais imagens e escolha o que a IA deve fazer com elas</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                {[["usar","Usar no post"],["descrever","Criar legenda descrevendo a imagem"],["editar","Recriar/editar imagem"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setImgInstrucao(k)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${imgInstrucao===k?T.primary+"80":C.border2}`,background:imgInstrucao===k?`${T.primary}18`:C.surf3,color:imgInstrucao===k?T.primaryL:C.muted,cursor:"pointer",fontSize:12,fontWeight:imgInstrucao===k?700:400}}>{l}</button>
                ))}
              </div>
              <input ref={imgRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={uploadImagens} />
              <button onClick={()=>imgRef.current?.click()} style={{background:`${T.primary}15`,border:`1px dashed ${T.primary}50`,color:T.primaryL,padding:"12px 20px",borderRadius:10,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:8,width:"100%",justifyContent:"center"}}><Upload size={16}/> Selecionar imagens (máx 5MB cada)</button>
            </div>
            {imagens.length>0&&<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {imagens.map((img,i)=>(
                <div key={i} style={{position:"relative",width:90,height:90,borderRadius:10,overflow:"hidden",border:`2px solid ${T.primary}40`}}>
                  <img src={img.preview} alt={img.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  <button onClick={()=>setImagens(p=>p.filter((_,j)=>j!==i))} style={{position:"absolute",top:2,right:2,background:"#00000080",border:"none",color:"#fff",borderRadius:50,width:20,height:20,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}><X size={10}/></button>
                </div>
              ))}
            </div>}
            {imagens.length===0&&<div style={{color:C.muted,fontSize:12,textAlign:"center",padding:"20px 0"}}>Nenhuma imagem carregada. Você pode gerar sem imagens.</div>}
          </>}

          {/* BOTÃO GERAR ROTEIRO */}
          {!roteiro&&!gerandoRot&&(
            <div style={{marginTop:16,display:"flex",gap:8}}>
              <button onClick={()=>setNovaOS(false)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Cancelar</button>
              <button onClick={gerarRoteiro} disabled={!os.briefing&&!os.titulo} style={{background:(os.briefing||os.titulo)?G.primary:C.surf3,color:(os.briefing||os.titulo)?"#fff":C.muted,border:"none",padding:"9px 22px",borderRadius:9,cursor:(os.briefing||os.titulo)?"pointer":"default",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center",boxShadow:`0 4px 18px ${T.primary}30`}}><Sparkles size={14}/> Gerar Roteiro com IA</button>
            </div>
          )}
          {gerandoRot&&<div style={{textAlign:"center",padding:"20px",color:C.muted,fontSize:13}}><RefreshCw size={16} style={{animation:"spin 1s linear infinite",verticalAlign:"middle",marginRight:8}}/>Criando conceito criativo...</div>}

          {/* CARD DO ROTEIRO */}
          {roteiro&&!roteiroAprov&&<div style={{marginTop:16,background:C.bg,border:`1px solid ${T.primary}40`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontWeight:700,fontSize:14,color:T.primaryL}}>✨ Roteiro gerado pela IA</span>
              <button onClick={gerarRoteiro} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"4px 10px",borderRadius:7,cursor:"pointer",fontSize:11}}><RefreshCw size={11}/> Regerar</button>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Conceito:</div>
            <textarea value={roteiroEdit} onChange={e=>setRoteiroEdit(e.target.value)} rows={3} style={{...inp,width:"100%",fontSize:13,lineHeight:1.6,marginBottom:10,resize:"vertical"}} />
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
              <div style={{flex:1,minWidth:160,background:C.surf,borderRadius:9,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>GANCHO</div>
                <div style={{fontSize:12,color:C.text,fontStyle:"italic"}}>"{roteiro.hook}"</div>
              </div>
              <div style={{flex:1,minWidth:160,background:C.surf,borderRadius:9,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>ABORDAGEM</div>
                <div style={{fontSize:12,color:T.primaryL}}>{roteiro.abordagem}</div>
              </div>
            </div>
            <div style={{background:C.surf,borderRadius:9,padding:"10px 12px",marginBottom:12}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>ESTRUTURA</div>
              <div style={{fontSize:12,color:C.text}}>{roteiro.estrutura}</div>
            </div>
            {roteiro.observacoes&&<div style={{fontSize:12,color:C.muted,fontStyle:"italic",marginBottom:12}}>💡 {roteiro.observacoes}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setRoteiro(null);setRoteiroAprov(false);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>← Voltar</button>
              <button onClick={()=>setRoteiroAprov(true)} style={{background:G.primary,color:"#fff",border:"none",padding:"9px 22px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Check size={14}/> Aprovei o Roteiro → Gerar Conteúdo</button>
            </div>
          </div>}

          {/* GERAR CONTEÚDO FINAL */}
          {roteiro&&roteiroAprov&&!conteudoFinal&&<div style={{marginTop:16}}>
            {gerandoFinal
              ?<div style={{textAlign:"center",padding:"24px",color:C.muted,fontSize:13}}><RefreshCw size={16} style={{animation:"spin 1s linear infinite",verticalAlign:"middle",marginRight:8}}/>Criando legenda, hashtags e CTA completos...</div>
              :<div style={{background:C.bg,border:`1px solid ${T.primary}30`,borderRadius:12,padding:"16px",textAlign:"center"}}>
                <div style={{color:T.primaryL,fontWeight:700,marginBottom:6}}>✅ Roteiro aprovado!</div>
                <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Agora a IA vai criar o post completo — legenda, hook, hashtags e CTA prontos para publicar.</div>
                <button onClick={gerarConteudoFinal} style={{background:G.primary,color:"#fff",border:"none",padding:"10px 28px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,boxShadow:`0 4px 20px ${T.primary}40`}}><Sparkles size={15}/> Gerar Conteúdo Agora</button>
              </div>
            }
          </div>}

          {/* CARD CONTEÚDO FINAL */}
          {conteudoFinal&&<div style={{marginTop:16,background:C.bg,border:`1px solid #10b98140`,borderRadius:12,padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontWeight:700,fontSize:14,color:"#10b981"}}>🎯 Conteúdo pronto!</span>
              <button onClick={()=>{setConteudoFinal(null);setRoteiroAprov(false);}} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"4px 10px",borderRadius:7,cursor:"pointer",fontSize:11}}><RefreshCw size={11}/> Regerar</button>
            </div>
            <F label="Título interno"><input value={conteudoEdit.titulo} onChange={e=>setConteudoEdit(p=>({...p,titulo:e.target.value}))} style={{...inp,fontFamily:"inherit"}} /></F>
            <F label="Legenda completa"><textarea value={conteudoEdit.legenda} onChange={e=>setConteudoEdit(p=>({...p,legenda:e.target.value}))} rows={7} style={{...inp,resize:"vertical",lineHeight:1.7,fontFamily:"inherit"}} /></F>
            <G2 ch={[
              <F label="Hook (1ª frase)"><input value={conteudoEdit.hook} onChange={e=>setConteudoEdit(p=>({...p,hook:e.target.value}))} style={{...inp,fontFamily:"inherit"}} /></F>,
              <F label="CTA"><input value={conteudoEdit.cta} onChange={e=>setConteudoEdit(p=>({...p,cta:e.target.value}))} style={{...inp,fontFamily:"inherit"}} /></F>
            ]}/>
            <F label="Hashtags"><textarea value={conteudoEdit.hashtags} onChange={e=>setConteudoEdit(p=>({...p,hashtags:e.target.value}))} rows={2} style={{...inp,fontSize:12,lineHeight:1.7,resize:"vertical",fontFamily:"inherit"}} /></F>
            {conteudoFinal.texto_story&&<div style={{background:C.surf,borderRadius:9,padding:"10px 12px",marginBottom:14}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>VERSÃO STORY</div>
              <div style={{fontSize:12,color:C.text}}>{conteudoFinal.texto_story}</div>
            </div>}
            {conteudoFinal.sugestao_visual&&<div style={{background:`${T.primary}10`,borderRadius:9,padding:"10px 12px",marginBottom:14}}>
              <div style={{fontSize:10,color:T.primaryL,fontWeight:700,marginBottom:4}}>💡 SUGESTÃO VISUAL</div>
              <div style={{fontSize:12,color:C.text}}>{conteudoFinal.sugestao_visual}</div>
            </div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={addOS} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>Salvar na lista</button>
              <button onClick={()=>{ setFaseImg("idle"); gerarImagens(); }}
                style={{background:G.primary,color:"#fff",border:"none",padding:"9px 22px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 18px ${T.primary}30`}}>
                <Image size={14}/> Aprovar Script → Gerar Imagem
              </button>
            </div>
          </div>}

          {/* ── FLUXO DE IMAGEM ─────────────────────────────────────────── */}
          {conteudoFinal && faseImg !== "idle" && <div style={{background:C.surf,border:`1px solid ${T.primary}30`,borderRadius:14,padding:20,marginTop:12}}>
            <div style={{fontSize:11,fontWeight:900,letterSpacing:3,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:16,textTransform:"uppercase"}}>
              {faseImg==="gerando"?"⏳ Gerando 3 opções de imagem com IA…":faseImg==="overlay"?"🎨 Arte Final — Revisão":"📸 Escolha a Imagem do Post"}
            </div>

            {/* Gerando */}
            {faseImg==="gerando"&&<div style={{textAlign:"center",padding:"32px 0",color:C.muted,fontSize:13}}>
              <div style={{fontSize:32,marginBottom:12}}>🤖</div>
              Gerando 3 fotos hiperrealistas baseadas no conceito do post…<br/>
              <span style={{fontSize:11}}>Pode levar 20-30 segundos</span>
            </div>}

            {/* Escolha */}
            {faseImg==="escolha"&&<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                {opcoesImg.map((img,i)=>(
                  <div key={i} onClick={()=>escolherImagem(img.b64)}
                    style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:`2px solid ${imgEscolhida===img.b64?T.primary:C.border}`,transition:"border .2s",position:"relative"}}>
                    <img src={img.preview} alt={`Opção ${i+1}`} style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",top:6,left:6,background:imgEscolhida===img.b64?T.primary:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>
                      {imgEscolhida===img.b64?"✓ Selecionada":`Opção ${i+1}`}
                    </div>
                  </div>
                ))}
                {imgUpload&&<div onClick={()=>escolherImagem(imgUpload.b64)}
                  style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:`2px solid ${imgEscolhida===imgUpload.b64?T.primary:C.border}`,position:"relative"}}>
                  <img src={imgUpload.preview} alt="Sua foto" style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",top:6,left:6,background:imgEscolhida===imgUpload.b64?T.primary:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>
                    {imgEscolhida===imgUpload.b64?"✓ Selecionada":"Sua foto"}
                  </div>
                </div>}
              </div>

              {/* Alteração / upload */}
              <div style={{background:C.surf2,borderRadius:10,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>PEDIR ALTERAÇÃO OU ENVIAR FOTO</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {["fundo branco","ao ar livre","escritório moderno","sem pessoas","mais colorido"].map(s=>(
                    <button key={s} onClick={()=>setImgPromptCustom(s)}
                      style={{background:imgPromptCustom===s?T.primary:"none",color:imgPromptCustom===s?"#fff":C.muted,border:`1px solid ${imgPromptCustom===s?T.primary:C.border}`,padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:11,whiteSpace:"nowrap"}}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input value={imgPromptCustom} onChange={e=>setImgPromptCustom(e.target.value)}
                    placeholder="Ou descreva o que quer na imagem…"
                    style={{...inp,flex:1,fontSize:12}}/>
                  <button onClick={()=>gerarImagens(imgPromptCustom)}
                    style={{background:G.primary,color:"#fff",border:"none",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>
                    🔄 Regerar
                  </button>
                  <button onClick={()=>imgUpRef.current?.click()}
                    style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>
                    📤 Upload
                  </button>
                  <input ref={imgUpRef} type="file" accept="image/*" style={{display:"none"}} onChange={uploadImagemFinal}/>
                </div>
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setFaseImg("idle")} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12}}>← Voltar</button>
                <button onClick={()=>imgEscolhida?setFaseImg("overlay"):flash("Escolha uma imagem primeiro","coral")}
                  disabled={!imgEscolhida}
                  style={{background:imgEscolhida?G.primary:"none",color:imgEscolhida?"#fff":C.muted,border:imgEscolhida?"none":`1px solid ${C.border}`,padding:"9px 22px",borderRadius:9,cursor:imgEscolhida?"pointer":"default",fontWeight:700,fontSize:13,flex:1,boxShadow:imgEscolhida?`0 4px 18px ${T.primary}30`:"none"}}>
                  Usar esta imagem → Ver Arte Final
                </button>
              </div>
            </div>}

            {/* Arte Final / Overlay */}
            {faseImg==="overlay"&&imgEscolhida&&<div>
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:14,maxWidth:400,margin:"0 auto 14px"}}>
                <img src={`data:image/png;base64,${imgEscolhida}`} alt="Arte final" style={{width:"100%",display:"block",borderRadius:12}}/>
                {/* Overlay de texto + marca */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.75))",padding:"32px 16px 16px",borderRadius:"0 0 12px 12px"}}>
                  <div style={{color:T.primary,fontSize:9,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{co.name}</div>
                  <div style={{color:"#fff",fontSize:13,fontWeight:700,lineHeight:1.3}}>{conteudoEdit.hook||conteudoEdit.titulo}</div>
                </div>
                {/* Logo / nome no canto */}
                <div style={{position:"absolute",top:10,right:10,background:T.primary,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:6,letterSpacing:1}}>
                  {co.name}
                </div>
              </div>
              <div style={{background:`${T.primary}10`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.muted,marginBottom:14}}>
                ✅ Imagem + texto da marca sobrepostos. Esta é a arte final que vai para o agendamento.
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setFaseImg("escolha")} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12}}>← Trocar imagem</button>
                <button onClick={aprovarEAgendar}
                  style={{background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",border:"none",padding:"9px 22px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 18px #10b98130"}}>
                  <Check size={14}/> Aprovar Arte e Agendar
                </button>
              </div>
            </div>}
          </div>}
        </div>}

        {/* LISTA DE ORDENS */}
        {ordens.length===0&&!novaOS&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center",color:C.muted}}>
          <FileText size={32} color={C.muted} style={{margin:"0 auto 12px"}} />
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Nenhuma solicitação ainda</div>
          <div style={{fontSize:12}}>Crie uma solicitação e a IA gerará o conteúdo completo</div>
        </div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...ordens].reverse().map(o=>{
            const pub=pubs.find(p=>p.id==o.publicoId);
            return <div key={o.id} style={{background:C.surf,border:`1px solid ${o.urgente?"#FF456620":C.border}`,borderRadius:11,padding:"13px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                    {o.urgente&&<Badge color="#E8890C">🚨 URGENTE</Badge>}
                    <Badge color={T.primaryL}>{o.tipo}</Badge>
                    <Badge color={o.status==="Pendente"?"#FFD580":o.status==="Em produção"?"#93C5FD":"#A8E6A3"}>{o.status}</Badge>
                    {pub&&<span style={{fontSize:10,color:C.muted}}>👥 {pub.nome}</span>}
                  </div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{o.titulo}</div>
                  <div style={{fontSize:12,color:C.muted}}>{o.briefing?.slice(0,120)}{o.briefing?.length>120?"…":""}</div>
                  {o.prazo&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>📅 Prazo: {o.prazo}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <select value={o.status} onChange={e=>upd("ordens",ordens.map(x=>x.id===o.id?{...x,status:e.target.value}:x))} style={{background:C.surf3,border:`1px solid ${C.border2}`,color:C.text,padding:"4px 8px",borderRadius:7,fontSize:11,cursor:"pointer"}}>
                    {["Pendente","Em produção","Concluída","Cancelada"].map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button onClick={()=>upd("ordens",ordens.filter(x=>x.id!==o.id))} style={{background:"#FF444415",border:"1px solid #FF444430",color:"#FF7070",padding:"4px 8px",borderRadius:7,cursor:"pointer"}}><Trash2 size={12}/></button>
                </div>
              </div>
            </div>;
          })}
        </div>
      </>}

      {/* ── PROGRAMAÇÃO IA ── */}
      {fase==="semana"&&<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:C.text}}>Programação gerada pela IA para os próximos 7 dias</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              {ordens.filter(o=>o.status==="Pendente").length>0
                ?`${ordens.filter(o=>o.status==="Pendente").length} solicitação(ões) pendente(s) serão incluídas`
                :"A IA usará a estratégia da empresa para montar a semana"}
            </div>
          </div>
          <button onClick={gerarSemana} disabled={gerando} style={{background:gerando?C.surf3:G.primary,color:gerando?C.muted:"#fff",border:"none",padding:"10px 22px",borderRadius:10,cursor:gerando?"default":"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,boxShadow:gerando?"none":`0 4px 20px ${T.primary}40`}}>
            {gerando?<><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> Gerando…</>:<><Sparkles size={14}/> Gerar Semana com IA</>}
          </button>
        </div>
        {!semana&&!gerando&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"50px",textAlign:"center",color:C.muted}}>
          <Sparkles size={32} color={C.muted} style={{margin:"0 auto 12px"}} />
          <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>Nenhuma programação gerada ainda</div>
          <div style={{fontSize:13}}>Clique em "Gerar Semana com IA" para criar 7 posts prontos para aprovação</div>
        </div>}
        {semana&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {semana.map((d,i)=>(
            <div key={i} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:13,padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,fontWeight:800,color:T.primaryL,background:`${T.primary}18`,padding:"3px 10px",borderRadius:20}}>{new Date(d.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short"})}</span>
                    <Badge color={T.primaryL}>{d.tipo}</Badge>
                    <Badge color={C.blue}>{d.plataforma}</Badge>
                    {d.hora&&<span style={{fontSize:10,color:C.muted}}>🕐 {d.hora}</span>}
                  </div>
                  <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{d.titulo}</div>
                  {d.hook&&<div style={{fontSize:13,color:T.primaryL,fontStyle:"italic",marginBottom:6}}>"{ d.hook}"</div>}
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{d.legenda?.slice(0,200)}{d.legenda?.length>200?"…":""}</div>
                  {d.pilar&&<div style={{fontSize:11,color:C.muted,marginTop:6}}>📌 Pilar: {d.pilar}</div>}
                </div>
                <button onClick={()=>addToAgenda(d)} style={{background:G.primary,color:"#fff",border:"none",padding:"8px 14px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:12,flexShrink:0,display:"flex",alignItems:"center",gap:6}}><Plus size={12}/> Adicionar</button>
              </div>
            </div>
          ))}
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <button onClick={()=>{semana.forEach(d=>addToAgenda(d));flash("✅ Toda a semana adicionada ao calendário!","teal");}} style={{background:`${T.primary}15`,color:T.primaryL,border:`1px solid ${T.primary}30`,padding:"10px 24px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13}}>✅ Adicionar Semana Inteira ao Calendário</button>
          </div>
        </div>}
      </>}

      {/* ── APROVAÇÃO ── */}
      {fase==="aprovacao"&&<>
        {/* WA Preview */}
        {waP&&<div style={{background:"#25D36608",border:"1px solid #25D36635",borderRadius:14,padding:"18px",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#25D366",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>📱 Enviado para aprovação via WhatsApp</div>
          <div style={{background:"#0d1f0d",borderRadius:12,padding:"14px",maxWidth:360,marginBottom:12}}>
            <div style={{background:"#25D36618",borderRadius:"12px 12px 12px 2px",padding:"12px"}}>
              <div style={{fontSize:12,color:"#A0C0A0",lineHeight:1.6}}>
                <div style={{marginBottom:3}}>📋 <strong style={{color:C.text}}>{waP.tipo}</strong> — {waP.plataforma}</div>
                <div style={{marginBottom:3}}>📅 {waP.data} às {waP.hora}</div>
                <div>{waP.legenda?.slice(0,100)}…</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <div style={{flex:1}}><input value={altMsg} onChange={e=>setAltMsg(e.target.value)} placeholder="Alteração solicitada..." style={{...inp,fontFamily:"inherit",fontSize:13}} /></div>
            <button onClick={()=>approve(waP)} style={{background:"#25D366",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,flexShrink:0}}>✅ Aprovar</button>
            <button onClick={()=>reqChange(waP)} disabled={!altMsg} style={{background:altMsg?G.primary:C.surf3,color:altMsg?"#fff":C.muted,border:"none",padding:"8px 16px",borderRadius:8,cursor:altMsg?"pointer":"default",fontWeight:600,fontSize:13,flexShrink:0}}>✏️ Solicitar</button>
            <button onClick={()=>setWaP(null)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>Fechar</button>
          </div>
        </div>}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:10,flexWrap:"wrap"}}>
          <div style={{fontSize:13,color:C.muted}}>{agenda.filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length} conteúdo(s) aguardando aprovação</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setNovoItem(!novoItem)} style={{background:C.surf3,color:C.text,border:`1px solid ${C.border}`,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Plus size={12}/> Adicionar manual</button>
            {agenda.some(a=>a.status==="Rascunho"||a.status==="Alteração")&&<button onClick={()=>{const p=agenda.find(a=>a.status==="Rascunho"||a.status==="Alteração");if(p)sendApproval(p);}} style={{background:"#25D36618",color:"#25D366",border:"1px solid #25D36635",padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}><Send size={12}/> Enviar WA</button>}
          </div>
        </div>

        {novoItem&&<div style={{background:C.surf,border:`1px solid ${T.primary}20`,borderRadius:13,padding:"18px",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
            <F label="Tipo"><select value={item.tipo} onChange={e=>iu("tipo",e.target.value)} style={{...inp,cursor:"pointer"}}>{TIPOS_C.map(t=><option key={t}>{t}</option>)}</select></F>
            <F label="Plataforma"><select value={item.plataforma} onChange={e=>iu("plataforma",e.target.value)} style={{...inp,cursor:"pointer"}}>{PLATS.map(t=><option key={t}>{t}</option>)}</select></F>
            <F label="Público"><select value={item.publicoId} onChange={e=>iu("publicoId",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Geral</option>{pubs.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></F>
          </div>
          <F label="Título"><input value={item.titulo} onChange={e=>iu("titulo",e.target.value)} placeholder="Nome interno" style={{...inp,fontFamily:"inherit"}} /></F>
          <F label="Legenda completa"><textarea value={item.legenda} onChange={e=>iu("legenda",e.target.value)} rows={4} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
          <G2 ch={[<F label="Data"><input type="date" value={item.data} onChange={e=>iu("data",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>,<F label="Horário"><input type="time" value={item.hora} onChange={e=>iu("hora",e.target.value)} style={{...inp,fontFamily:"inherit"}} /></F>]}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={()=>setNovoItem(false)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.text,padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}}>Cancelar</button>
            <button onClick={addItem} disabled={!item.titulo||!item.data} style={{background:item.titulo&&item.data?G.primary:C.surf3,color:item.titulo&&item.data?"#fff":C.muted,border:"none",padding:"8px 22px",borderRadius:8,cursor:item.titulo&&item.data?"pointer":"default",fontWeight:700,fontSize:13}}>✓ Adicionar</button>
          </div>
        </div>}

        {agenda.filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length===0&&!novoItem&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center",color:C.muted}}>Nenhum conteúdo aguardando aprovação</div>}

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...agenda].filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).sort((a,b)=>a.data>b.data?1:-1).map(a=>{
            const sc=SC[a.status]||C.muted;
            const expanded=!!expandedCards[a.id];
            return <div key={a.id} style={{background:C.surf,border:`1px solid ${a.status==="Alteração"?"#E8890C30":C.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10}}>
              <div style={{width:3,background:sc,borderRadius:2,flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}><Badge color={T.primaryL}>{a.tipo}</Badge><Badge color={C.blue}>{a.plataforma}</Badge><Badge color={sc}>{a.status}</Badge></div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{a.titulo}</div>
                {a.legenda&&<>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.6,whiteSpace:"pre-wrap",marginBottom:2}}>
                    {expanded?a.legenda:a.legenda.slice(0,120)+(a.legenda.length>120?"…":"")}
                  </div>
                  {a.legenda.length>120&&<div style={{display:"flex",gap:8,alignItems:"center",marginTop:2}}>
                    <button onClick={()=>toggleExpand(a.id)} style={{background:"none",border:"none",color:T.primaryL,cursor:"pointer",fontSize:11,padding:0,fontWeight:600}}>{expanded?"▲ Recolher":"▼ Ver legenda completa"}</button>
                    {expanded&&<button onClick={()=>navigator.clipboard?.writeText(a.legenda)} style={{background:"none",border:`1px solid ${C.border2}`,color:C.muted,cursor:"pointer",fontSize:10,padding:"2px 8px",borderRadius:5}}>📋 Copiar</button>}
                  </div>}
                </>}
                {a.hashtags&&expanded&&<div style={{fontSize:11,color:T.primaryL,marginTop:4,lineHeight:1.7,opacity:.7}}>{a.hashtags}</div>}
                {a.alteracaoMsg&&<div style={{fontSize:11,background:"#E8890C15",border:"1px solid #E8890C30",borderRadius:6,padding:"5px 9px",color:"#E8890C",marginTop:6}}>✏️ {a.alteracaoMsg}</div>}
                <div style={{fontSize:11,color:C.muted,marginTop:4}}>📅 {a.data} {a.hora&&`às ${a.hora}`}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                <button onClick={()=>sendApproval(a)} style={{fontSize:11,background:"#25D36618",border:"1px solid #25D36640",color:"#25D366",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontWeight:700}}>📱 WA</button>
                <button onClick={()=>approve(a)} style={{fontSize:11,background:"#FFD58018",border:"1px solid #FFD58040",color:"#D4A017",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontWeight:700}}>✅ OK</button>
                <button onClick={()=>upd("agenda",agenda.filter(x=>x.id!==a.id))} style={{fontSize:10,background:"#FF444415",border:"1px solid #FF444430",color:"#FF7070",padding:"3px 8px",borderRadius:6,cursor:"pointer"}}><Trash2 size={11}/></button>
              </div>
            </div>;
          })}
        </div>
      </>}

      {/* ── AGENDADOS ── */}
      {fase==="agendados"&&<>
        <div style={{fontSize:13,color:C.muted,marginBottom:14}}>{agenda.filter(a=>["Aprovado","Agendado"].includes(a.status)).length} conteúdo(s) aprovado(s) e agendado(s)</div>
        {agenda.filter(a=>["Aprovado","Agendado"].includes(a.status)).length===0&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center",color:C.muted}}>Nenhum conteúdo agendado ainda — aprove conteúdos na fase Aprovação</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...agenda].filter(a=>["Aprovado","Agendado"].includes(a.status)).sort((a,b)=>a.data>b.data?1:-1).map(a=>(
            <div key={a.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:3,background:SC[a.status],borderRadius:2,flexShrink:0,alignSelf:"stretch"}} />
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}><Badge color={T.primaryL}>{a.tipo}</Badge><Badge color={C.blue}>{a.plataforma}</Badge><Badge color={SC[a.status]}>{a.status}</Badge></div>
                <div style={{fontWeight:700,fontSize:13}}>{a.titulo}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:3}}>📅 {a.data} às {a.hora}</div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                {a.status==="Aprovado"&&<button onClick={()=>updS(a.id,"Agendado")} style={{fontSize:11,background:"#DDD6FE18",border:"1px solid #DDD6FE40",color:"#A78BFA",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:700}}>📅 Agendar</button>}
                {a.status==="Agendado"&&<button onClick={()=>updS(a.id,"Publicado")} style={{fontSize:11,background:"#10B98118",border:"1px solid #10B98140",color:"#10B981",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:700}}>✅ Publicado</button>}
                <button onClick={()=>upd("agenda",agenda.filter(x=>x.id!==a.id))} style={{background:"#FF444415",border:"1px solid #FF444430",color:"#FF7070",padding:"5px 8px",borderRadius:7,cursor:"pointer"}}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── PUBLICADOS ── */}
      {fase==="publicados"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,color:C.muted}}>{agenda.filter(a=>a.status==="Publicado").length} conteúdo(s) publicado(s)</div>
        </div>
        {agenda.filter(a=>a.status==="Publicado").length===0&&<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center",color:C.muted}}>Nenhum conteúdo publicado ainda</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...agenda].filter(a=>a.status==="Publicado").sort((a,b)=>a.data<b.data?1:-1).map(a=>(
            <div key={a.id} style={{background:C.surf,border:"1px solid #10B98125",borderRadius:11,padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:3,background:"#10B981",borderRadius:2,alignSelf:"stretch",flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:3,flexWrap:"wrap"}}><Badge color={T.primaryL}>{a.tipo}</Badge><Badge color={C.blue}>{a.plataforma}</Badge></div>
                <div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.titulo}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>✅ Publicado em {a.data}</div>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── ESTRATÉGIA ── */}
      {fase==="estrategia"&&<>
        <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Configure a estratégia de conteúdo por segmento de público</div>
        {pubs.length===0
          ?<div style={{background:C.surf,border:`1px dashed ${C.border2}`,borderRadius:14,padding:"40px",textAlign:"center",color:C.muted}}>Crie públicos na aba Públicos primeiro</div>
          :<>
            <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
              {pubs.map(p=><button key={p.id} onClick={()=>setSelPC(p.id)} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:12,border:`1px solid ${selPC===p.id?T.primary+"80":C.border2}`,background:selPC===p.id?`${T.primary}18`:C.surf,color:selPC===p.id?T.primaryL:C.muted,fontWeight:selPC===p.id?700:400}}>{p.nome}</button>)}
            </div>
            {selPC&&<>
              <Sec title="Pilares de Conteúdo" accent={co.color}>
                <F label="Tópicos frequentes"><textarea value={pc.topicosSempre||""} onChange={e=>updPC("topicosSempre",e.target.value)} placeholder="Transformações, dicas, bastidores, depoimentos..." rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}} /></F>
                <F label="Tópicos proibidos"><input value={pc.topicosNunca||""} onChange={e=>updPC("topicosNunca",e.target.value)} placeholder="Assuntos a evitar..." style={{...inp,fontFamily:"inherit"}} /></F>
              </Sec>
              <Sec title="Frequência por Tipo" accent={co.color}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[["Posts feed","freqFeed","5x/sem"],["Stories","freqStory","Diário"],["Reels","freqReel","3x/sem"],["WhatsApp","freqWa","Diário"],["TikTok","freqTt","3x/sem"],["LinkedIn","freqLi","2x/sem"]].map(([l,k,ph])=>(
                    <F key={k} label={l}><input value={pc[k]||""} onChange={e=>updPC(k,e.target.value)} placeholder={ph} style={{...inp,fontFamily:"inherit"}} /></F>
                  ))}
                </div>
              </Sec>
              <Sec title="Tom e Abordagem" accent={co.color}>
                <F label="Tom de voz"><textarea value={pc.tom||""} onChange={e=>updPC("tom",e.target.value)} placeholder="Como a marca fala com este público..." rows={2} style={{...inp,resize:"vertical"}} /></F>
                <G2 ch={[<F label="Hashtags"><textarea value={pc.hashtags||""} onChange={e=>updPC("hashtags",e.target.value)} placeholder="#hashtag1…" rows={2} style={{...inp,resize:"vertical"}} /></F>,<F label="Hooks"><textarea value={pc.hooks||""} onChange={e=>updPC("hooks",e.target.value)} placeholder='"Você sabia…"' rows={2} style={{...inp,resize:"vertical"}} /></F>]}/>
              </Sec>
            </>}
          </>}
      </>}
    </>;
  }

  // ─── INTEGRAÇÕES ──────────────────────────────────────────────────────────
  function TabIntegracoes(){
    return <>
      <InfoBox color="#F5A623">🔒 Tokens armazenados apenas neste dispositivo.</InfoBox>
      <Sec title="Meta Business — Instagram + Facebook" accent={C.blue}><G2 ch={[<F label="App ID"><I k="metaAppId" ph="000000000000" /></F>,<F label="App Secret"><I k="metaSecret" type="password" ph="••••••••" /></F>]} /><F label="Page Access Token"><TA k="metaPageToken" ph="EAAxxxx…" rows={2} /></F><F label="Instagram Business Account ID"><I k="metaIgId" ph="17841400000" /></F></Sec>
      <Sec title="Zapi — WhatsApp Automático" accent="#25D366">
        <InfoBox color="#25D366">O Zapi envia mensagens reais de aprovação de conteúdo via WhatsApp. Obtenha as credenciais em app.z-api.io</InfoBox>
        <G2 ch={[<F label="Instance ID" req><I k="zapiInstanceId" ph="Ex: 3A1B2C3D4E5F" /></F>,<F label="Token" req><I k="zapiToken" ph="Token da instância" /></F>]} />
        <G2 ch={[<F label="Client-Token (Security)" req><I k="zapiClientToken" ph="Security Token do painel" /></F>,<F label="Número para aprovação (com DDI)" req><I k="zapiPhone" ph="5514999999999" /></F>]} />
      </Sec>
      <Sec title="WhatsApp Business API (Meta)" accent="#25D366"><G2 ch={[<F label="WABA ID"><I k="waBaId" ph="000000000000" /></F>,<F label="Phone Number ID"><I k="waPhoneId" ph="000000000000" /></F>]} /><F label="Access Token"><TA k="waApiToken" ph="EAAxxxx…" rows={2} /></F></Sec>
      <Sec title="ManyChat" accent={C.purple}><G2 ch={[<F label="API Key"><I k="mcApiKey" type="password" ph="••••••" /></F>,<F label="Bot ID"><I k="mcBotId" ph="0000000" /></F>]} /><F label="Fluxos ativos"><TA k="mcFlows" ph="Boas-vindas, nutrição, respostas…" rows={2} /></F></Sec>
      <Sec title="Canva + N8n + Super Agentes" accent={C.gold}><G2 ch={[<F label="Brand Kit ID"><I k="canvaKitId" ph="DAFxxxx" /></F>,<F label="Pasta templates"><I k="canvaFolder" ph="https://canva.com/folder/…" /></F>]} /><G2 ch={[<F label="N8n Webhook"><I k="n8nWebhook" ph="https://…/webhook/…" /></F>,<F label="Super Agentes ID"><I k="superAgentesId" ph="agent-xxxx" /></F>]} /><F label="Google Drive"><I k="driveFolder" ph="https://drive.google.com/…" /></F></Sec>
    </>;
  }

  // ─── RESULTADOS ───────────────────────────────────────────────────────────
  function TabResultados(){
    const agenda=form.agenda||[];
    const campanhas=form.campanhas||[];
    const metricas=form.metricas||{};
    const [periodo,setPeriodo]=useState("30d");
    const [plat,setPlat]=useState("instagram");
    const [editMet,setEditMet]=useState(false);
    const [met,setMet]=useState(metricas[plat]||{});

    useEffect(()=>{ setMet(metricas[plat]||{}); },[plat,metricas]);

    function saveMet(){
      const upd2={...metricas,[plat]:met};
      upd("metricas",upd2); setEditMet(false); flash("✅ Métricas salvas","teal");
    }

    const totalPosts=agenda.filter(a=>a.status==="Publicado").length;
    const totalStories=agenda.filter(a=>a.status==="Publicado"&&(a.tipo==="Story"||a.tipo==="Stories")).length;
    const totalReels=agenda.filter(a=>a.status==="Publicado"&&a.tipo==="Reel").length;
    const totalCamp=campanhas.filter(c=>c.status==="enviada").length;
    const pendAprov=agenda.filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status)).length;
    const agendados=agenda.filter(a=>["Aprovado","Agendado"].includes(a.status)).length;

    const PLATS=[
      {id:"instagram",icon:"🟣",label:"Instagram"},
      {id:"facebook",icon:"🔵",label:"Facebook"},
      {id:"linkedin",icon:"🔷",label:"LinkedIn"},
      {id:"tiktok",icon:"⚫",label:"TikTok"},
      {id:"whatsapp",icon:"🟢",label:"WhatsApp"},
    ];
    const PERIODOS=[{id:"7d",label:"7 dias"},{id:"30d",label:"30 dias"},{id:"90d",label:"90 dias"},{id:"12m",label:"12 meses"}];

    const CAMPOS_MET={
      instagram:["seguidores_anterior","seguidores","alcance","impressoes","engajamento","curtidas","comentarios","compartilhamentos","salvamentos","visitas_perfil","cliques_bio"],
      facebook:["seguidores_anterior","seguidores","alcance","impressoes","engajamento","curtidas","comentarios","compartilhamentos","cliques_link"],
      linkedin:["seguidores_anterior","seguidores","alcance","impressoes","engajamento","curtidas","comentarios","cliques"],
      tiktok:["seguidores_anterior","seguidores","visualizacoes","curtidas","comentarios","compartilhamentos","alcance"],
      whatsapp:["contatos","mensagens_enviadas","mensagens_recebidas","taxa_abertura","conversoes"],
    };

    const campos=CAMPOS_MET[plat]||[];
    const labelCampo=(k)=>({seguidores_anterior:"Seguidores (antes)",seguidores:"Seguidores (atual)",alcance:"Alcance",impressoes:"Impressões",engajamento:"Engajamento %",curtidas:"Curtidas",comentarios:"Comentários",compartilhamentos:"Compartilhamentos",salvamentos:"Salvamentos",visitas_perfil:"Visitas ao Perfil",cliques_bio:"Cliques na Bio",cliques_link:"Cliques no Link",cliques:"Cliques",visualizacoes:"Visualizações",conversoes:"Conversões",taxa_abertura:"Taxa de Abertura %",contatos:"Contatos",mensagens_enviadas:"Mensagens Enviadas",mensagens_recebidas:"Recebidas"}[k]||k);
    const icone=(k)=>({seguidores:"👥",alcance:"📡",impressoes:"👁",engajamento:"💥",curtidas:"❤️",comentarios:"💬",compartilhamentos:"🔁",salvamentos:"🔖",visitas_perfil:"🏠",cliques_bio:"🔗",cliques_link:"🔗",cliques:"🖱",visualizacoes:"▶️",conversoes:"🎯",taxa_abertura:"📬",contatos:"📒",mensagens_enviadas:"📤",mensagens_recebidas:"📥"}[k]||"📊");

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"18px 20px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:11,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BarChart2 size={20} color="#fff"/></div>
            <div>
              <div style={{fontSize:17,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Dashboard de Resultados</div>
              <div style={{fontSize:12,color:C.muted}}>Mensure crescimento, engajamento e performance das campanhas</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {PERIODOS.map(p=><button key={p.id} onClick={()=>setPeriodo(p.id)} style={{padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:periodo===p.id?700:400,border:`1px solid ${periodo===p.id?T.primary:C.border2}`,background:periodo===p.id?`${T.primary}20`:C.surf3,color:periodo===p.id?T.primaryL:C.muted}}>{p.label}</button>)}
          </div>
        </div>
      </div>

      {/* KPIs do sistema */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[
          {icon:"📝",label:"Posts Publicados",val:totalPosts,sub:"total no sistema",cor:T.primaryL},
          {icon:"📖",label:"Stories",val:totalStories,sub:"publicados",cor:"#E1306C"},
          {icon:"🎬",label:"Reels",val:totalReels,sub:"publicados",cor:"#833AB4"},
          {icon:"📢",label:"Campanhas Enviadas",val:totalCamp,sub:"WhatsApp / E-mail",cor:"#25D366"},
          {icon:"⏳",label:"Aguardando Aprovação",val:pendAprov,sub:"conteúdos",cor:"#FFD580"},
          {icon:"📅",label:"Agendados",val:agendados,sub:"prontos para publicar",cor:"#A78BFA"},
        ].map((k,i)=>(
          <div key={i} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:13,padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:6}}>{k.icon}</div>
            <div style={{fontSize:28,fontWeight:800,color:k.cor,lineHeight:1}}>{k.val}</div>
            <div style={{fontSize:12,fontWeight:600,color:C.text,marginTop:4}}>{k.label}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Gráfico de Crescimento — Antes e Depois */}
      {(()=>{
        const m=form.metricas||{};
        const plats=["instagram","facebook","linkedin","tiktok"];
        const hasData=plats.some(p=>m[p]?.seguidores||m[p]?.seguidores_anterior);
        if(!hasData) return null;
        return <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <Activity size={16} color={co.color}/>Crescimento — Antes & Depois da Metamorfose
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
            {plats.map(p=>{
              const d=m[p]||{};
              const ant=Number(d.seguidores_anterior||0);
              const atual=Number(d.seguidores||0);
              if(!ant&&!atual) return null;
              const diff=atual-ant;
              const pct=ant>0?Math.round((diff/ant)*100):0;
              const icons={instagram:"🟣",facebook:"🔵",linkedin:"🔷",tiktok:"⚫"};
              return <div key={p} style={{background:T.surf3,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{icons[p]}</div>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{p}</div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div><div style={{fontSize:10,color:C.muted}}>Antes</div><div style={{fontSize:16,fontWeight:700,color:C.muted}}>{ant.toLocaleString()}</div></div>
                  <div style={{fontSize:20,color:diff>=0?"#22C55E":"#EF4444",alignSelf:"center"}}>{diff>=0?"↗":"↘"}</div>
                  <div><div style={{fontSize:10,color:C.muted}}>Atual</div><div style={{fontSize:16,fontWeight:700,color:co.color}}>{atual.toLocaleString()}</div></div>
                </div>
                <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,ant>0?(atual/Math.max(ant,atual))*100:100)}%`,background:`linear-gradient(90deg,${co.color},${co.color}80)`,borderRadius:2,transition:"width .8s"}}/>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:diff>=0?"#22C55E":"#EF4444",marginTop:6}}>
                  {diff>=0?"+":""}{diff.toLocaleString()} ({pct>=0?"+":""}{pct}%)
                </div>
              </div>;
            }).filter(Boolean)}
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:12,display:"flex",gap:4,alignItems:"center"}}>
            <AlertCircle size={11}/>Para ativar o gráfico, preencha "Seguidores Anterior" nas métricas de cada plataforma abaixo.
          </div>
        </div>;
      })()}

      {/* Métricas por plataforma */}
      <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:11,fontWeight:800,color:T.primaryL,letterSpacing:2,textTransform:"uppercase"}}>Métricas por Plataforma — {PERIODOS.find(p=>p.id===periodo)?.label}</div>
          <div style={{display:"flex",gap:6}}>
            {!editMet
              ?<button onClick={()=>setEditMet(true)} style={{background:C.surf3,color:C.text,border:`1px solid ${C.border}`,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Edit3 size={11}/> Editar</button>
              :<><button onClick={saveMet} style={{background:G.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}><Check size={11}/> Salvar</button>
              <button onClick={()=>{setMet(metricas[plat]||{});setEditMet(false);}} style={{background:"#FF444415",color:"#FF7070",border:"1px solid #FF444430",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}><X size={11}/></button></>
            }
          </div>
        </div>

        {/* Tabs de plataforma */}
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {PLATS.map(p=>(
            <button key={p.id} onClick={()=>setPlat(p.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:plat===p.id?700:400,border:`1px solid ${plat===p.id?T.primary:C.border2}`,background:plat===p.id?`${T.primary}20`:C.surf3,color:plat===p.id?T.primaryL:C.muted}}>
              <span>{p.icon}</span><span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Grid de métricas */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {campos.map(k=>(
            <div key={k} style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:editMet?8:6}}>
                <span style={{fontSize:18}}>{icone(k)}</span>
                <span style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{labelCampo(k)}</span>
              </div>
              {editMet
                ?<input type="number" value={met[k]||""} onChange={e=>setMet(p=>({...p,[k]:e.target.value}))} placeholder="0" style={{...inp,fontFamily:"inherit",fontSize:20,fontWeight:800,color:C.text,padding:"6px 10px"}} />
                :<div style={{fontSize:26,fontWeight:800,color:met[k]?T.primaryL:C.muted}}>{met[k]?Number(met[k]).toLocaleString("pt-BR"):"—"}</div>
              }
            </div>
          ))}
        </div>

        {!editMet&&campos.every(k=>!met[k])&&<div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>
          Clique em "Editar" para inserir as métricas do período selecionado
        </div>}
      </div>

      {/* Histórico de campanhas */}
      {campanhas.length>0&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{fontSize:11,fontWeight:800,color:T.primaryL,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Histórico de Campanhas</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...campanhas].reverse().slice(0,5).map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.surf3,borderRadius:9}}>
              <span style={{fontSize:18}}>{c.tipo==="whatsapp"?"🟢":c.tipo==="email"?"📧":"🔷"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:C.text}}>{c.nome}</div>
                <div style={{fontSize:11,color:C.muted}}>{new Date(c.criada).toLocaleDateString("pt-BR")} · {c.enviadas} enviadas</div>
              </div>
              <span style={{fontSize:11,background:c.status==="enviada"?"#A8E6A318":"#FFD58018",color:c.status==="enviada"?"#A8E6A3":"#D4A017",padding:"3px 10px",borderRadius:20,fontWeight:700}}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>}
    </>;
  }

  // ─── CAMPANHAS ────────────────────────────────────────────────────────────
  function TabCampanhas(){
    const [campanhas, setCampanhas] = useState(form.campanhas||[]);
    const [view, setView] = useState("lista"); // lista | nova
    const [tipo, setTipo] = useState("whatsapp"); // whatsapp | email | linkedin
    const [nova, setNova] = useState({nome:"",assunto:"",mensagem:"",publico:"todos",agendada:false,dataEnvio:"",horario:"",status:"rascunho"});
    const [sending, setSending] = useState(false);
    const [gerandoMsg, setGerandoMsg] = useState(false);

    async function gerarMensagemIA(){
      if(!nova.nome) return;
      setGerandoMsg(true);
      const prompts={
        whatsapp:`Você é um copywriter especialista em WhatsApp Marketing. Crie uma mensagem de campanha via WhatsApp que seja envolvente, use emojis estrategicamente, tenha um gancho forte e um CTA claro.

EMPRESA: ${co.name}
NICHO: ${co.niche}
CAMPANHA: ${nova.nome}
PÚBLICO: ${(form.publicos||[]).find(p=>p.id==nova.publico)?.nome||"Geral"}

Retorne APENAS o texto da mensagem WhatsApp pronto para enviar (sem JSON, sem markdown). Use *negrito* para ênfase, _itálico_ para destaques. Máximo 500 caracteres para não ser cortado. Inclua CTA com link, telefone ou convite para responder.`,

        email:`Você é um copywriter de e-mail marketing. Crie um e-mail persuasivo, com storytelling, urgência e CTA forte.

EMPRESA: ${co.name}
NICHO: ${co.niche}
CAMPANHA: ${nova.nome}
ASSUNTO: ${nova.assunto||"(não informado)"}
PÚBLICO: ${(form.publicos||[]).find(p=>p.id==nova.publico)?.nome||"Geral"}

Retorne APENAS o corpo do e-mail em texto simples, pronto para enviar. Use linhas em branco para separação. Inclua saudação personalizada, proposta de valor, prova social rápida e CTA.`,

        linkedin:`Você é especialista em LinkedIn Marketing. Crie um post profissional com autoridade, storytelling e valor para a rede.

EMPRESA: ${co.name}
NICHO: ${co.niche}
CAMPANHA: ${nova.nome}
PÚBLICO: ${(form.publicos||[]).find(p=>p.id==nova.publico)?.nome||"Profissionais"}

Retorne APENAS o texto do post LinkedIn pronto para publicar. Máximo 1.300 caracteres. Comece com uma frase de impacto, desenvolva com contexto/valor, termine com CTA e 3-5 hashtags relevantes.`
      };
      try{
        const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompts[tipo]}]})});
        const d=await r.json();
        if(d.error) throw new Error(JSON.stringify(d.error));
        const txt=d.content?.find(b=>b.type==="text")?.text||"";
        setNova(p=>({...p,mensagem:txt.trim()}));
        flash("✨ Mensagem gerada!","teal");
      }catch(e){flash(`❌ ${e.message}`,"coral");}
      setGerandoMsg(false);
    }

    function saveCampanha(status="rascunho"){
      const c = {...nova, id:Date.now(), tipo, status, criada:new Date().toISOString(), enviadas:0, abertas:0, cliques:0};
      const upd = [...campanhas, c];
      setCampanhas(upd); setForm(p=>({...p,campanhas:upd})); save();
      setView("lista"); setNova({nome:"",assunto:"",mensagem:"",publico:"todos",agendada:false,dataEnvio:"",horario:"",status:"rascunho"});
      flash(status==="enviando"?"🚀 Campanha enviada!":"💾 Rascunho salvo","teal");
    }

    async function enviarAgora(){
      if(!nova.nome||!nova.mensagem) return;
      setSending(true);
      if(tipo==="whatsapp"){
        try {
          await fetch("/api/whatsapp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`📢 *${nova.nome}*\n\n${nova.mensagem}`})});
        } catch {}
      }
      saveCampanha("enviada");
      setSending(false);
    }

    const ST = {
      rascunho:{label:"Rascunho",cor:"#888"},
      agendada:{label:"Agendada",cor:"#FFD580"},
      enviada:{label:"Enviada",cor:"#A8E6A3"},
      enviando:{label:"Enviando",cor:T.primaryL},
      pausada:{label:"Pausada",cor:"#FF9090"},
    };

    const TIPOS = [
      {id:"whatsapp",icon:"🟢",label:"WhatsApp",desc:"Disparo via Zapi"},
      {id:"email",icon:"📧",label:"E-mail",desc:"SMTP / SendGrid"},
      {id:"linkedin",icon:"🔷",label:"LinkedIn",desc:"Post + mensagem"},
    ];

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"20px 22px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${T.primary}18,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Megaphone size={22} color="#fff" strokeWidth={2}/></div>
            <div>
              <div style={{fontSize:18,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Central de Campanhas</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>Crie e gerencie disparos de WhatsApp, e-mail e LinkedIn em um só lugar.</div>
            </div>
          </div>
          {view==="lista"&&<button onClick={()=>setView("nova")} style={{background:G.primary,color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,flexShrink:0}}><Plus size={14}/> Nova Campanha</button>}
          {view==="nova"&&<button onClick={()=>setView("lista")} style={{background:C.surf3,color:C.text,border:`1px solid ${C.border}`,padding:"10px 20px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6,flexShrink:0}}><X size={14}/> Cancelar</button>}
        </div>
      </div>

      {/* Métricas rápidas */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[
          ["Total",campanhas.length,"📊"],
          ["Enviadas",campanhas.filter(c=>c.status==="enviada").length,"✅"],
          ["Agendadas",campanhas.filter(c=>c.status==="agendada").length,"📅"],
          ["Rascunhos",campanhas.filter(c=>c.status==="rascunho").length,"📝"],
        ].map(([l,v,i])=>(
          <div key={l} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{i}</div>
            <div style={{fontSize:22,fontWeight:800,color:C.text}}>{v}</div>
            <div style={{fontSize:11,color:C.muted}}>{l}</div>
          </div>
        ))}
      </div>

      {view==="lista"&&<>
        {campanhas.length===0
          ? <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
              <Megaphone size={40} color={C.muted} style={{margin:"0 auto 12px"}} />
              <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>Nenhuma campanha criada ainda</div>
              <div style={{fontSize:13}}>Clique em "Nova Campanha" para começar</div>
            </div>
          : campanhas.map(c=>(
            <div key={c.id} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:13,padding:"16px 18px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:16}}>{TIPOS.find(t=>t.id===c.tipo)?.icon||"📢"}</span>
                    <span style={{fontSize:15,fontWeight:700,color:C.text}}>{c.nome}</span>
                    <span style={{fontSize:10,background:`${ST[c.status]?.cor||"#888"}20`,color:ST[c.status]?.cor||"#888",padding:"2px 8px",borderRadius:20,fontWeight:700}}>{ST[c.status]?.label}</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.5,marginBottom:8}}>{c.mensagem?.slice(0,120)}{c.mensagem?.length>120?"…":""}</div>
                  <div style={{display:"flex",gap:16,fontSize:11,color:C.muted}}>
                    <span>📅 {c.agendada?`${c.dataEnvio} ${c.horario}`:new Date(c.criada).toLocaleDateString("pt-BR")}</span>
                    <span>📤 {c.enviadas} enviadas</span>
                    <span>👁 {c.abertas} abertas</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  {c.status==="rascunho"&&<button onClick={()=>{setNova(c);setTipo(c.tipo);setView("nova");}} style={{background:`${T.primary}15`,color:T.primaryL,border:"none",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Editar</button>}
                  <button onClick={()=>{const upd=campanhas.filter(x=>x.id!==c.id);setCampanhas(upd);setForm(p=>({...p,campanhas:upd}));save();}} style={{background:"#FF444415",color:"#FF7070",border:"none",padding:"6px 10px",borderRadius:7,cursor:"pointer"}}><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))
        }
      </>}

      {view==="nova"&&<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
        <div style={{fontSize:12,fontWeight:800,color:T.primaryL,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Nova Campanha</div>

        {/* Tipo de canal */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Canal de envio</label>
          <div style={{display:"flex",gap:8}}>
            {TIPOS.map(t=>(
              <button key={t.id} onClick={()=>setTipo(t.id)} style={{flex:1,background:tipo===t.id?`${T.primary}20`:C.surf3,border:`1px solid ${tipo===t.id?T.primary:C.border2}`,borderRadius:10,padding:"10px",cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{t.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:tipo===t.id?T.primaryL:C.text}}>{t.label}</div>
                <div style={{fontSize:10,color:C.muted}}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Nome da campanha *</label>
            <input value={nova.nome} onChange={e=>setNova(p=>({...p,nome:e.target.value}))} placeholder="Ex: Promoção de Junho" style={{...inp,fontFamily:"inherit",fontSize:13}} />
          </div>
          {tipo==="email"&&<div>
            <label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Assunto do e-mail *</label>
            <input value={nova.assunto} onChange={e=>setNova(p=>({...p,assunto:e.target.value}))} placeholder="Ex: 🎉 Oferta exclusiva para você!" style={{...inp,fontFamily:"inherit",fontSize:13}} />
          </div>}
          <div>
            <label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>Público-alvo</label>
            <select value={nova.publico} onChange={e=>setNova(p=>({...p,publico:e.target.value}))} style={{...inp,fontFamily:"inherit",fontSize:13}}>
              <option value="todos">Todos os contatos</option>
              {(form.publicos||[]).map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <label style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>
              {tipo==="whatsapp"?"Mensagem *":tipo==="linkedin"?"Texto do Post *":"Corpo do E-mail *"}
            </label>
            <button onClick={gerarMensagemIA} disabled={!nova.nome||gerandoMsg} style={{background:(!nova.nome||gerandoMsg)?C.surf3:G.primary,color:(!nova.nome||gerandoMsg)?C.muted:"#fff",border:"none",padding:"4px 12px",borderRadius:7,cursor:(!nova.nome||gerandoMsg)?"default":"pointer",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",gap:5}}>
              {gerandoMsg?<><RefreshCw size={11} style={{animation:"spin 1s linear infinite"}}/> Gerando…</>:<><Sparkles size={11}/> Gerar com IA</>}
            </button>
          </div>
          <textarea value={nova.mensagem} onChange={e=>setNova(p=>({...p,mensagem:e.target.value}))} rows={7}
            placeholder={tipo==="whatsapp"
              ?"Escreva a mensagem WhatsApp. Use *negrito*, _itálico_.\n\nEx:\n🎉 Olá! Temos uma novidade especial para você...\n\n👉 Acesse: seusite.com.br"
              :tipo==="linkedin"
              ?"Escreva o post do LinkedIn. Seja profissional e direto.\n\nEx:\n🚀 Estamos muito felizes em anunciar..."
              :"Escreva o corpo do e-mail em HTML ou texto simples."}
            style={{...inp,resize:"vertical",fontFamily:"inherit",fontSize:13,lineHeight:1.6}} />
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{nova.mensagem.length} caracteres{tipo==="whatsapp"&&nova.mensagem.length>1000&&<span style={{color:"#FF9090"}}> — mensagem longa, considere dividir</span>}</div>
        </div>

        {/* Agendamento */}
        <div style={{background:C.surf3,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:nova.agendada?10:0}}>
            <input type="checkbox" checked={nova.agendada} onChange={e=>setNova(p=>({...p,agendada:e.target.checked}))} />
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>Agendar envio</span>
            <span style={{fontSize:11,color:C.muted}}>— define data e hora para disparar automaticamente</span>
          </label>
          {nova.agendada&&<div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3}}>Data</label>
              <input type="date" value={nova.dataEnvio} onChange={e=>setNova(p=>({...p,dataEnvio:e.target.value}))} style={{...inp,fontFamily:"inherit",fontSize:13}} />
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:10,color:C.muted,display:"block",marginBottom:3}}>Horário</label>
              <input type="time" value={nova.horario} onChange={e=>setNova(p=>({...p,horario:e.target.value}))} style={{...inp,fontFamily:"inherit",fontSize:13}} />
            </div>
          </div>}
        </div>

        {/* Botões */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>saveCampanha("rascunho")} style={{background:C.surf3,color:C.text,border:`1px solid ${C.border}`,padding:"10px 20px",borderRadius:9,cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Save size={13}/> Salvar Rascunho</button>
          {nova.agendada&&<button onClick={()=>saveCampanha("agendada")} disabled={!nova.dataEnvio} style={{background:`${T.primary}20`,color:T.primaryL,border:`1px solid ${T.primary}40`,padding:"10px 20px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,opacity:nova.dataEnvio?1:.5}}><Calendar size={13}/> Agendar</button>}
          {!nova.agendada&&<button onClick={enviarAgora} disabled={!nova.nome||!nova.mensagem||sending} style={{background:(!nova.nome||!nova.mensagem)?C.surf3:G.primary,color:(!nova.nome||!nova.mensagem)?C.muted:"#fff",border:"none",padding:"10px 24px",borderRadius:9,cursor:(!nova.nome||!nova.mensagem)?"default":"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,boxShadow:(!nova.nome||!nova.mensagem)?"none":`0 4px 20px ${T.primary}40`}}>
            {sending?<><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Enviando…</>:<><Send size={13}/> Enviar Agora</>}
          </button>}
        </div>

        {tipo==="email"&&<div style={{marginTop:12,background:`${T.primary}08`,border:`1px solid ${T.primary}20`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.muted}}>
          📧 Para envio de e-mail configure o servidor SMTP ou integre com SendGrid / Mailgun na aba <strong style={{color:C.text}}>Integrações</strong>.
        </div>}
        {tipo==="linkedin"&&<div style={{marginTop:12,background:"#0A66C208",border:"1px solid #0A66C225",borderRadius:10,padding:"10px 14px",fontSize:12,color:C.muted}}>
          🔷 Para publicar no LinkedIn configure o token de acesso LinkedIn API na aba <strong style={{color:C.text}}>Integrações</strong>.
        </div>}
      </div>}
    </>;
  }

  // ─── CENTRAL DE MENSAGENS ─────────────────────────────────────────────────
  function TabMensagens(){
    const [canal, setCanal] = useState("whatsapp");
    const [regras, setRegras] = useState(form.msgRegras || []);
    const [novaChave, setNovaChave] = useState("");
    const [novaResp, setNovaResp] = useState("");

    const temZapi = !!(form.zapiInstanceId || form.zapiPhone);
    const temMeta = !!(form.metaPageToken);

    function addRegra(){
      if(!novaChave.trim()||!novaResp.trim()) return;
      const nova = [...regras, {id:Date.now(), chave:novaChave.trim(), resposta:novaResp.trim(), ativo:true}];
      setRegras(nova);
      setForm(p=>({...p, msgRegras:nova}));
      setNovaChave(""); setNovaResp("");
      save();
    }
    function toggleRegra(id){
      const upd = regras.map(r=>r.id===id?{...r,ativo:!r.ativo}:r);
      setRegras(upd); setForm(p=>({...p,msgRegras:upd})); save();
    }
    function delRegra(id){
      const upd = regras.filter(r=>r.id!==id);
      setRegras(upd); setForm(p=>({...p,msgRegras:upd})); save();
    }

    const CANAIS = [
      {id:"whatsapp", label:"WhatsApp", cor:"#25D366", icon:"🟢", ativo:temZapi, info:"via Zapi"},
      {id:"instagram", label:"Instagram DM", cor:"#E1306C", icon:"🟣", ativo:temMeta, info:"via Graph API"},
      {id:"facebook", label:"Facebook", cor:"#1877F2", icon:"🔵", ativo:temMeta, info:"via Graph API"},
    ];

    const DEMO_MSGS = [
      {id:1, canal:"whatsapp", de:"João Silva", msg:"Olá, quero saber mais sobre os serviços", tempo:"há 5min", lida:false, avatar:"JS"},
      {id:2, canal:"instagram", de:"@maria_cliente", msg:"Oi! Vi o post de vocês e me interessei", tempo:"há 12min", lida:false, avatar:"MC"},
      {id:3, canal:"whatsapp", de:"Pedro Santos", msg:"Qual o prazo de entrega?", tempo:"há 1h", lida:true, avatar:"PS"},
      {id:4, canal:"facebook", de:"Ana Lima", msg:"Vocês atendem na minha cidade?", tempo:"há 2h", lida:true, avatar:"AL"},
    ];

    const msgsFiltradas = DEMO_MSGS.filter(m => canal==="whatsapp" ? m.canal==="whatsapp" : canal==="instagram" ? m.canal==="instagram" : m.canal==="facebook");

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"20px 22px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${T.primary}18,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:6}}>
          <div style={{width:48,height:48,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${T.primary}40`,flexShrink:0}}><MessageSquare size={22} color="#fff" strokeWidth={2}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Central de Mensagens</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Centralize mensagens de todas as redes sociais. Configure respostas automáticas e acompanhe em tempo real.</div>
          </div>
        </div>
      </div>

      {/* Status dos canais */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {CANAIS.map(c=>(
          <div key={c.id} style={{background:C.surf,border:`1px solid ${c.ativo?c.cor+"40":C.border}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",opacity:c.ativo?1:.6}} onClick={()=>setCanal(c.id)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:20}}>{c.icon}</span>
              <span style={{fontSize:10,background:c.ativo?"#A8E6A318":"#FF707018",color:c.ativo?"#A8E6A3":"#FF7070",padding:"2px 8px",borderRadius:20,fontWeight:700}}>{c.ativo?"Conectado":"Desconectado"}</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:canal===c.id?c.cor:C.text}}>{c.label}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{c.ativo?c.info:"Configure nas Integrações"}</div>
            {canal===c.id&&<div style={{marginTop:8,height:2,borderRadius:2,background:c.cor}} />}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Inbox */}
        <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.primaryL,letterSpacing:2,textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Mensagens Recentes</span>
            <span style={{fontSize:10,background:`${T.primary}20`,color:T.primaryL,padding:"2px 8px",borderRadius:20}}>{msgsFiltradas.filter(m=>!m.lida).length} novas</span>
          </div>
          {msgsFiltradas.length===0
            ? <div style={{textAlign:"center",padding:"30px 0",color:C.muted,fontSize:13}}>Nenhuma mensagem neste canal ainda</div>
            : msgsFiltradas.map(m=>(
              <div key={m.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border2}`,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:m.lida?C.surf3:G.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                    <span style={{fontSize:13,fontWeight:m.lida?500:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.de}</span>
                    <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{m.tempo}</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.msg}</div>
                </div>
                {!m.lida&&<div style={{width:8,height:8,borderRadius:"50%",background:T.primaryL,flexShrink:0,marginTop:6}} />}
              </div>
            ))
          }
          <div style={{marginTop:12,padding:"10px 14px",background:`${T.primary}10`,border:`1px solid ${T.primary}20`,borderRadius:10,fontSize:12,color:C.muted,textAlign:"center"}}>
            {CANAIS.find(c=>c.id===canal)?.ativo
              ? "🔄 Mensagens em tempo real quando integração estiver ativa"
              : <>Configure a integração <strong style={{color:C.text}}>{CANAIS.find(c=>c.id===canal)?.label}</strong> na aba Integrações</>}
          </div>
        </div>

        {/* Auto-respostas */}
        <div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.primaryL,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Respostas Automáticas</div>

          {/* Nova regra */}
          <div style={{background:C.surf3,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:600}}>Nova regra — palavra-chave → resposta</div>
            <input value={novaChave} onChange={e=>setNovaChave(e.target.value)}
              placeholder="Palavra-chave (ex: preço, horário, endereço)"
              style={{...inp,marginBottom:8,fontFamily:"inherit",fontSize:13}} />
            <textarea value={novaResp} onChange={e=>setNovaResp(e.target.value)} rows={3}
              placeholder="Resposta automática quando detectar esta palavra..."
              style={{...inp,resize:"none",fontFamily:"inherit",fontSize:13,lineHeight:1.5,marginBottom:8}} />
            <button onClick={addRegra} disabled={!novaChave||!novaResp}
              style={{background:(!novaChave||!novaResp)?C.surf2:G.primary,color:(!novaChave||!novaResp)?C.muted:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:(!novaChave||!novaResp)?"default":"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
              <Plus size={14}/> Adicionar Regra
            </button>
          </div>

          {/* Lista de regras */}
          {regras.length===0
            ? <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>Nenhuma regra configurada ainda</div>
            : regras.map(r=>(
              <div key={r.id} style={{background:r.ativo?`${T.primary}08`:C.surf3,border:`1px solid ${r.ativo?T.primary+"25":C.border2}`,borderRadius:9,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:r.ativo?T.primaryL:C.muted,background:r.ativo?`${T.primary}15`:C.surf2,padding:"2px 10px",borderRadius:20}}>{r.chave}</span>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>toggleRegra(r.id)} style={{background:r.ativo?"#A8E6A315":"#FF707015",border:`1px solid ${r.ativo?"#A8E6A330":"#FF707030"}`,color:r.ativo?"#A8E6A3":"#FF7070",padding:"2px 8px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700}}>{r.ativo?"ON":"OFF"}</button>
                    <button onClick={()=>delRegra(r.id)} style={{background:"#FF444415",border:"1px solid #FF444430",color:"#FF7070",padding:"2px 8px",borderRadius:6,cursor:"pointer",fontSize:10}}><Trash2 size={10}/></button>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{r.resposta.slice(0,100)}{r.resposta.length>100?"…":""}</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Info sobre integração real */}
      <div style={{marginTop:14,background:`${T.primary}08`,border:`1px solid ${T.primary}20`,borderRadius:12,padding:"14px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.primaryL,marginBottom:6}}>Como funciona a Central de Mensagens</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            ["🟢 WhatsApp","Configure o Zapi na aba Integrações. As mensagens recebidas ficam centralizadas aqui e as respostas automáticas são disparadas via Zapi."],
            ["🟣 Instagram DM","Requer Page Access Token com permissão instagram_manage_messages configurada na aba Integrações."],
            ["🔵 Facebook","Requer Page Access Token com permissão pages_messaging configurada na aba Integrações."],
          ].map(([t,d])=>(
            <div key={t} style={{background:C.surf,borderRadius:9,padding:"10px 12px"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{t}</div>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </>;
  }

  // ─── COFRE ────────────────────────────────────────────────────────────────
  // ─── APROVAÇÕES ───────────────────────────────────────────────────────────────
  function TabAprovacoes(){
    const agenda=form.agenda||[];
    const [autoAprov,setAutoAprov]=useState(form.autoAprovacao||false);
    const [filtro,setFiltro]=useState("pendentes"); // pendentes | aprovados | todos
    const [expandedCards,setExpandedCards]=useState({});
    const toggleExp=(id)=>setExpandedCards(p=>({...p,[id]:!p[id]}));

    function toggleAutoAprov(){
      const novo=!autoAprov;
      setAutoAprov(novo);
      upd("autoAprovacao",novo);
      flash(novo?"✅ Modo automático ativado — conteúdos serão aprovados automaticamente":"⏸ Aprovação manual reativada","teal");
    }

    function aprovar(item){
      const upd2=agenda.map(a=>a.id===item.id?{...a,status:"Aprovado",aprovadoEm:new Date().toISOString()}:a);
      upd("agenda",upd2);
      flash("✅ Conteúdo aprovado!","teal");
      // Notificação WhatsApp
      enviarNotifWhats(`✅ Conteúdo aprovado: *${item.titulo||item.tipo}* agendado para ${item.data||"breve"}`);
    }

    function reprovar(item){
      const upd2=agenda.map(a=>a.id===item.id?{...a,status:"Alteração"}:a);
      upd("agenda",upd2);
      flash("🔄 Solicitada alteração","amber");
    }

    function aprovarTodos(){
      const upd2=agenda.map(a=>["Rascunho","Ag. aprovação"].includes(a.status)?{...a,status:"Aprovado",aprovadoEm:new Date().toISOString()}:a);
      upd("agenda",upd2);
      flash("✅ Todos aprovados!","teal");
    }

    async function enviarNotifWhats(msg){
      try{
        const instId=form.zapiInstanceId||"3F41BD43559D418792AB0E6CB8567DC3";
        const token=form.zapiToken||"E46271A589D038023754FAAE";
        const tel=form.telefoneResponsavel;
        if(!tel) return;
        await fetch(`https://api.z-api.io/instances/${instId}/token/${token}/send-text`,{
          method:"POST",headers:{"Content-Type":"application/json","Client-Token":form.zapiClientToken||""},
          body:JSON.stringify({phone:tel,message:msg})
        });
      }catch(e){}
    }

    const pendentes=agenda.filter(a=>["Rascunho","Ag. aprovação","Alteração"].includes(a.status));
    const aprovados=agenda.filter(a=>["Aprovado","Agendado","Publicado"].includes(a.status));
    const lista=filtro==="pendentes"?pendentes:filtro==="aprovados"?aprovados:agenda;

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"18px 20px",background:`${co.color}10`,border:`1px solid ${co.color}25`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:11,background:`linear-gradient(135deg,${co.color},${co.color}99)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ClipboardCheck size={20} color="#fff"/>
          </div>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:T.text}}>Central de Aprovações</div>
            <div style={{fontSize:12,color:C.muted}}>{pendentes.length} pendente{pendentes.length!==1?"s":""} · {aprovados.length} aprovado{aprovados.length!==1?"s":""}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {pendentes.length>0&&!autoAprov&&<button onClick={aprovarTodos} style={{background:`${co.color}15`,color:co.color,border:`1px solid ${co.color}30`,padding:"7px 16px",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><CheckCircle size={13}/>Aprovar todos</button>}
          {/* Toggle modo automático */}
          <div style={{display:"flex",alignItems:"center",gap:8,background:T.surf3,border:`1px solid ${T.border2}`,padding:"7px 14px",borderRadius:10}}>
            <Bot size={14} color={autoAprov?co.color:T.textMuted}/>
            <span style={{fontSize:12,color:autoAprov?co.color:T.textMuted,fontWeight:600}}>Auto-aprovação</span>
            <div onClick={toggleAutoAprov} style={{width:36,height:20,borderRadius:10,background:autoAprov?co.color:T.border2,cursor:"pointer",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:2,left:autoAprov?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px #0004"}}/>
            </div>
          </div>
        </div>
      </div>

      {/* Info auto-aprovação */}
      {autoAprov&&<div style={{background:"#22C55E18",border:"1px solid #22C55E30",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
        <Bot size={16} color="#22C55E"/>
        <span style={{fontSize:13,color:"#22C55E",fontWeight:600}}>Modo automático ativo</span>
        <span style={{fontSize:12,color:C.muted}}>— novos conteúdos são aprovados automaticamente sem revisão manual</span>
      </div>}

      {/* Filtros */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[{id:"pendentes",label:`Pendentes (${pendentes.length})`},{id:"aprovados",label:`Aprovados (${aprovados.length})`},{id:"todos",label:`Todos (${agenda.length})`}].map(f=>
          <button key={f.id} onClick={()=>setFiltro(f.id)} style={{padding:"5px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:filtro===f.id?700:400,border:`1px solid ${filtro===f.id?co.color:T.border2}`,background:filtro===f.id?`${co.color}18`:T.surf3,color:filtro===f.id?co.color:C.muted}}>{f.label}</button>
        )}
      </div>

      {/* Lista */}
      {lista.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
        <ClipboardCheck size={40} strokeWidth={1} style={{marginBottom:12,color:T.border2}}/>
        <div style={{fontSize:15,fontWeight:600,color:C.muted}}>{filtro==="pendentes"?"Nenhuma aprovação pendente 🎉":"Nenhum conteúdo aqui"}</div>
      </div>}

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {lista.map(item=>{
          const expanded=expandedCards[item.id];
          const isPend=["Rascunho","Ag. aprovação","Alteração"].includes(item.status);
          const statusCor={Aprovado:"#22C55E","Ag. aprovação":"#F59E0B",Rascunho:"#6B7280",Alteração:"#EF4444",Agendado:"#3B82F6",Publicado:"#8B5CF6"}[item.status]||T.textMuted;
          return <div key={item.id} style={{background:T.surf,border:`1px solid ${isPend?co.color+"35":T.border}`,borderRadius:14,padding:"16px",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:11,fontWeight:700,background:`${statusCor}18`,color:statusCor,padding:"2px 9px",borderRadius:20,border:`1px solid ${statusCor}30`}}>{item.status}</span>
                  <span style={{fontSize:11,color:C.muted}}>{item.tipo}</span>
                  {item.data&&<span style={{fontSize:11,color:C.muted}}>📅 {item.data} {item.hora||""}</span>}
                  {item.plataforma&&<span style={{fontSize:11,color:C.muted}}>📱 {item.plataforma}</span>}
                </div>
                {item.titulo&&<div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{item.titulo}</div>}
                <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>
                  {expanded?item.legenda:(item.legenda||"").slice(0,120)}{!expanded&&(item.legenda||"").length>120?"…":""}
                </div>
                {(item.legenda||"").length>120&&<button onClick={()=>toggleExp(item.id)} style={{background:"none",border:"none",color:co.color,fontSize:12,cursor:"pointer",padding:"4px 0",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                  {expanded?<><ChevronUp size={13}/>Ver menos</>:<><ChevronDown size={13}/>Ver mais</>}
                </button>}
                {item.hashtags&&<div style={{fontSize:11,color:co.color,marginTop:4}}>{item.hashtags}</div>}
              </div>
              {isPend&&!autoAprov&&<div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>reprovar(item)} style={{background:"#EF444418",color:"#EF4444",border:"1px solid #EF444430",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><X size={12}/>Alterar</button>
                <button onClick={()=>aprovar(item)} style={{background:`${co.color}18`,color:co.color,border:`1px solid ${co.color}30`,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Check size={12}/>Aprovar</button>
              </div>}
              {item.status==="Aprovado"&&<span style={{color:"#22C55E",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><CheckCircle size={14}/>Aprovado</span>}
            </div>
          </div>;
        })}
      </div>

      {/* Notificações WhatsApp */}
      <div style={{marginTop:24,padding:"16px 20px",background:T.surf,border:`1px solid ${T.border}`,borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><BellRing size={15} color="#25D366"/>Alertas automáticos via WhatsApp</div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>Telefone do responsável (com DDI)</label>
          <input value={form.telefoneResponsavel||""} onChange={e=>upd("telefoneResponsavel",e.target.value)} placeholder="5511999999999" style={{...inp,maxWidth:260}} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {label:"Aprovação pendente",desc:"Avisa quando há conteúdo para aprovar"},
            {label:"Sem conteúdo agendado",desc:"Alerta quando agenda está vazia"},
            {label:"Crescimento comprometido",desc:"Avisa queda de desempenho"},
            {label:"Resultado positivo",desc:"Comemora metas alcançadas"},
          ].map((a,i)=><div key={i} style={{background:T.surf3,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text}}>{a.label}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{a.desc}</div>
          </div>)}
        </div>
        <button onClick={()=>{
          const pend=(form.agenda||[]).filter(a=>["Rascunho","Ag. aprovação"].includes(a.status)).length;
          const msg=pend>0
            ?`📋 *${form.nomeFantasia||co.name}* — você tem ${pend} conteúdo${pend>1?"s":""} aguardando aprovação no SociaMinD!`
            :`✅ *${form.nomeFantasia||co.name}* — sua agenda está atualizada. Continue assim! 🚀`;
          enviarNotifWhats(msg);
          flash("📱 Notificação enviada!","teal");
        }} style={{marginTop:12,background:"#25D36618",color:"#25D366",border:"1px solid #25D36630",padding:"8px 18px",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
          <Send size={13}/> Testar notificação agora
        </button>
      </div>
    </>;

    function enviarNotifWhats(msg){
      const instId=form.zapiInstanceId||"3F41BD43559D418792AB0E6CB8567DC3";
      const token=form.zapiToken||"E46271A589D038023754FAAE";
      const tel=form.telefoneResponsavel;
      if(!tel) return;
      fetch(`https://api.z-api.io/instances/${instId}/token/${token}/send-text`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({phone:tel,message:msg})
      }).catch(()=>{});
    }
  }

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

  // ─── AJUDA ────────────────────────────────────────────────────────────────────
  function TabAjuda(){
    const [chatMsgs, setChatMsgs] = useState([
      {role:"assistant", text:"Olá! Sou a assistente especialista do SociaMinD. Estou aqui para te ajudar a tirar o máximo do sistema — tire suas dúvidas, peça dicas de uso, ou clique em um tópico abaixo para começar. 😊"}
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [secao, setSecao] = useState("chat"); // chat | tour | manual
    const chatRef = useRef(null);

    const SYSTEM_PROMPT = `Você é a assistente especialista do SociaMinD, um sistema de gestão de redes sociais com IA.
Você conhece cada aba e funcionalidade do sistema:
- Relatório: dashboard com métricas e gráfico de crescimento
- Scanner IA: analisa a marca com IA e preenche todos os campos automaticamente — usa as contas já cadastradas na aba Redes
- Identidade: informações da empresa, cores, fontes, personas, descrição da marca
- Produtos: catálogo de produtos e serviços com preços
- Públicos: perfis de público-alvo e personas
- Redes: cadastro das redes sociais conectadas (Instagram, Facebook, TikTok, LinkedIn, WhatsApp, YouTube)
- Conteúdos: hub de conteúdo com agendamento, ordens de serviço, geração de semana com IA, aprovações
- Campanha: criação de campanhas de WhatsApp, Email e LinkedIn com disparo e IA
- Aprovações: fluxo de aprovação de conteúdo — cliente aprova ou rejeita posts
- Gerar: geração rápida de posts com IA por plataforma
- Integrações: configuração de Meta Graph API, ManyChat, Canva, N8N, WhatsApp (Zapi)
- Cofre: senhas e credenciais de acesso
- Ajuda: você está aqui!

Planos disponíveis: Solo (1 marca, 3 redes, 1 scanner/mês), Negócio (1 marca, 5 redes, 3 scanners/mês), Agência (ilimitado, 5 scanners/rede), Agent Secret (tudo ilimitado + automação total).
Responda de forma clara, direta e amigável em português. Máximo 3 parágrafos por resposta.`;

    async function sendChat(){
      if(!input.trim()||loading) return;
      const userMsg = input.trim();
      setInput("");
      setChatMsgs(p=>[...p,{role:"user",text:userMsg}]);
      setLoading(true);
      try {
        const res = await fetch("/api/claude",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            messages:[
              ...chatMsgs.filter(m=>m.role!=="assistant"||chatMsgs.indexOf(m)>0).map(m=>({role:m.role,content:m.text})),
              {role:"user",content:userMsg}
            ],
            system: SYSTEM_PROMPT,
            max_tokens:600,
          })
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text || data.reply || "Não entendi. Pode reformular?";
        setChatMsgs(p=>[...p,{role:"assistant",text:reply}]);
      } catch {
        setChatMsgs(p=>[...p,{role:"assistant",text:"Ocorreu um erro. Tente novamente."}]);
      }
      setLoading(false);
      setTimeout(()=>chatRef.current?.scrollTo({top:99999,behavior:"smooth"}),100);
    }

    const TOUR_STEPS = [
      {icon:"🔍",tab:"scanner",title:"1. Comece pelo Scanner IA",desc:"O primeiro passo é rodar o Scanner. Cadastre as redes na aba Redes, depois venha aqui e clique em Analisar. A IA preenche tudo automaticamente — identidade, personas, produtos e estratégia."},
      {icon:"🎨",tab:"identidade",title:"2. Revise a Identidade",desc:"Após o scanner, verifique as cores, fontes, missão, visão e valores gerados. Ajuste o que quiser — tudo impacta os conteúdos gerados pela IA."},
      {icon:"👥",tab:"publicos",title:"3. Valide os Públicos",desc:"A IA cria personas automaticamente. Revise, ajuste os detalhes e adicione públicos específicos que o scanner pode ter perdido."},
      {icon:"📱",tab:"redes",title:"4. Configure as Redes",desc:"Cadastre todas as redes sociais do cliente — Instagram, Facebook, TikTok, LinkedIn, YouTube. Esses dados alimentam o scanner e o agendamento."},
      {icon:"📅",tab:"conteudo",title:"5. Gere Conteúdo",desc:"Na aba Conteúdos, use 'Gerar semana com IA' para criar uma agenda completa de posts. Revise cada legenda e envie para aprovação."},
      {icon:"✅",tab:"aprovacoes",title:"6. Fluxo de Aprovação",desc:"O cliente recebe notificação no WhatsApp e aprova ou rejeita cada post. Você acompanha tudo em tempo real na aba Aprovações."},
      {icon:"📢",tab:"campanhas",title:"7. Crie Campanhas",desc:"Lance campanhas de WhatsApp, E-mail ou LinkedIn. A IA gera o texto e você dispara para a lista configurada."},
      {icon:"📊",tab:"resultados",title:"8. Acompanhe Resultados",desc:"O Relatório mostra o crescimento antes e depois, métricas por rede e evolução mês a mês. Use para mostrar o valor do seu trabalho ao cliente."},
    ];

    const MANUAL_SECTIONS = [
      {title:"Scanner IA",icon:"🔍",content:"O Scanner analisa a marca com IA usando as contas cadastradas na aba Redes. Cole também textos da bio, site e posts para enriquecer a análise. Cada plano tem um limite de execuções por mês. O resultado preenche automaticamente: Identidade, Personas, Produtos e Estratégia de conteúdo."},
      {title:"Aba Redes",icon:"📱",content:"Cadastre aqui todas as redes sociais do cliente. Os dados são usados pelo Scanner (como contas fixas a analisar) e pelo sistema de publicação. Ative 'Publicação automática' em cada rede para liberar postagem direta via integração."},
      {title:"Geração de Conteúdo",icon:"✍️",content:"Em Conteúdos > Solicitar, crie uma Ordem de Serviço com briefing. A IA gera roteiro, legendas e sugestões de imagem. Você edita, aprova e agenda. Em Gerar (aba), você pode criar posts rápidos por plataforma sem abrir uma OS."},
      {title:"Aprovações",icon:"✅",content:"Todo conteúdo gerado pode ser enviado para aprovação do cliente. O cliente recebe notificação no WhatsApp, clica no link e aprova ou rejeita. Você vê o status em tempo real. Conteúdo aprovado pode ser agendado automaticamente."},
      {title:"Campanhas",icon:"📢",content:"Crie campanhas de disparo para WhatsApp (via Zapi), E-mail ou LinkedIn. A IA gera a mensagem com base na marca. Configure listas de destinatários na aba Redes (Listas de Transmissão). Cada plano tem limite de disparos mensais."},
      {title:"White-label",icon:"🎨",content:"O sistema adapta cores e identidade visual para cada cliente automaticamente. A cor primária cadastrada em Identidade define o tema visual do painel daquele cliente. Cada empresa tem seu ambiente isolado."},
      {title:"Integrações",icon:"🔌",content:"Configure Meta Graph API para buscar dados reais do Instagram. Configure Zapi para disparar WhatsApp. ManyChat para automações de DM. Canva para templates. N8N para workflows avançados. Todas as credenciais ficam salvas por empresa."},
      {title:"Planos e Limites",icon:"💳",content:"Solo: 1 marca, 3 redes, 1 scanner/mês. Negócio: 1 marca, 5 redes, 3 scanners/mês, campanhas. Agência: 1 cliente, redes e posts ilimitados, 5 scanners/rede, automação de respostas. Agent Secret: tudo ilimitado + atendimento IA via WhatsApp."},
    ];

    return <>
      {/* Header */}
      <div style={{marginBottom:16,padding:"20px 22px",background:G.glow,border:`1px solid ${T.primary}20`,borderRadius:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${T.primary}18,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${T.primary}40`,flexShrink:0}}><HelpCircle size={22} color="#fff" strokeWidth={2}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700,background:G.hero,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Central de Ajuda</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Assistente IA especialista no sistema, tour guiado e manual completo.</div>
          </div>
        </div>
        {/* Sub-abas */}
        <div style={{display:"flex",gap:6}}>
          {[["chat","💬 Assistente IA"],["tour","🗺️ Tour"],["manual","📖 Manual"]].map(([k,l])=>(
            <button key={k} onClick={()=>setSecao(k)} style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${secao===k?T.primary+"60":C.border2}`,background:secao===k?`${T.primary}18`:C.surf3,color:secao===k?T.primaryL:C.muted,fontSize:12,fontWeight:secao===k?700:400,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>

      {/* Chat */}
      {secao==="chat"&&<>
        <div ref={chatRef} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",marginBottom:12,height:380,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {chatMsgs.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:8,flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}>
              {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13}}>🤖</div>}
              <div style={{maxWidth:"75%",background:m.role==="user"?`${T.primary}20`:C.surf3,border:`1px solid ${m.role==="user"?T.primary+"30":C.border2}`,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",fontSize:13,color:C.text,lineHeight:1.6,whiteSpace:"pre-wrap"}}>
                {m.text}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13}}>🤖</div>
            <div style={{background:C.surf3,border:`1px solid ${C.border2}`,borderRadius:"14px 14px 14px 4px",padding:"10px 14px",fontSize:13,color:C.muted}}>Digitando…</div>
          </div>}
        </div>
        {/* Perguntas rápidas */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {["Como usar o Scanner?","Como aprovar conteúdo?","Como configurar o WhatsApp?","O que cada plano inclui?","Como gerar posts com IA?"].map(q=>(
            <button key={q} onClick={()=>{setInput(q);}} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${T.primary}40`,background:`${T.primary}10`,color:T.primaryL,fontSize:11,fontWeight:600,cursor:"pointer"}}>{q}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Digite sua dúvida..." style={{...inp,flex:1,fontFamily:"inherit"}} />
          <button onClick={sendChat} disabled={loading||!input.trim()} style={{background:G.primary,color:"#fff",border:"none",padding:"0 20px",borderRadius:10,cursor:"pointer",fontWeight:700,opacity:loading||!input.trim()?0.5:1}}>Enviar</button>
        </div>
      </>}

      {/* Tour */}
      {secao==="tour"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {TOUR_STEPS.map((s,i)=>(
          <div key={i} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:10,background:`${T.primary}15`,border:`1px solid ${T.primary}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>{s.title}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{s.desc}</div>
            </div>
            <button onClick={()=>setTab(s.tab)} style={{background:G.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>Ir →</button>
          </div>
        ))}
      </div>}

      {/* Manual */}
      {secao==="manual"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {MANUAL_SECTIONS.map((s,i)=>(
          <div key={i} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{s.title}</div>
            </div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{s.content}</div>
          </div>
        ))}
      </div>}
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
          <img src="/logo-metamorfose.png" alt="Metamorfose" style={{
            width:140,height:"auto",margin:"0 auto 10px",display:"block",
            filter:mode==="light"?"none":"drop-shadow(0 0 24px rgba(21,101,192,0.6))",
          }} onError={e=>{e.target.style.display="none";}}/>
          <div style={{
            fontSize:28,fontWeight:800,letterSpacing:-0.5,
            fontFamily:"'Space Grotesk',sans-serif",
            background:`linear-gradient(135deg, ${T.primaryXL}, ${T.textSub})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>Social Mid IA</div>
          <div style={{fontSize:11,color:T.textMuted,marginTop:4,letterSpacing:3,textTransform:"uppercase",fontWeight:500}}>Gestão de Redes Sociais</div>
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
          Social Mid IA v2.0 · Metamorfose · 2026 · {mode==="dark"?"Modo Noturno":"Modo Diurno"}
        </div>
      </div>
    </div>
  );
}
