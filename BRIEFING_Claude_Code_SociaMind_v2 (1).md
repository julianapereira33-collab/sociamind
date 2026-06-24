# BRIEFING COMPLETO — SOCIALMIND v2
## Para: Claude Code
## Data: 22/06/2026 | Responsável: Juliana Pereira — Metamorfose
## ⚠️ Não parar até concluir a Etapa 1 completa

---

## 1. REPOSITÓRIO E ACESSOS

```
GitHub:    https://github.com/julianapereira33-collab/sociamind
App prod:  https://sociamind.vercel.app
n8n:       https://juinfo.app.n8n.cloud
```

---

## 2. STACK REAL DO PROJETO

```
Frontend:   React + Vite (NÃO é Next.js)
Deploy:     Vercel
Banco:      Supabase (PostgreSQL + Auth + Storage)
Automação:  n8n (juinfo.app.n8n.cloud)
IA texto:   Claude API — Anthropic (✅ configurada no n8n)
IA imagem:  OpenAI gpt-image-1 (verificar credencial no n8n)
WhatsApp:   Zapi (já conectado ao n8n)
Publicação: Facebook Graph API v23.0
```

### Estrutura atual do repositório:
```
sociamind/
├── api/           # funções backend Vercel Serverless
├── App.jsx        # componente principal React
├── main.jsx       # entrada do app
├── index.html     # HTML base
├── vite.config.js
├── vercel.json
├── package.json
└── .gitignore
```

---

## 3. WEBHOOKS E ENDPOINTS — TODOS OS CAMINHOS

### n8n — SociaMind:
```
Geração conteúdo (prod):  POST https://juinfo.app.n8n.cloud/webhook/social-agent-trigger
Geração conteúdo (teste): POST https://juinfo.app.n8n.cloud/webhook-test/social-agent-trigger
Aprovação (prod):         POST https://juinfo.app.n8n.cloud/webhook/social-agent-approval
```

### n8n — Zapi WhatsApp (JÁ EXISTENTE):
```
Roteador Zapi (prod):  POST https://juinfo.app.n8n.cloud/webhook/whatsapp-julia
Roteador Zapi (teste): POST https://juinfo.app.n8n.cloud/webhook-test/whatsapp-julia
Julia IA interno:      POST https://juinfo.app.n8n.cloud/webhook/whatsapp-julia-interno
Das G cadastro:        POST https://juinfo.app.n8n.cloud/webhook/dasg-cadastro
```

### Workflow IDs no n8n:
```
SociaMind Agente:     wTJ3oSlxZPqssndC
Roteador Zapi+Julia:  aW7wZSqbqRmHBtds
Julia IA de Vendas:   yMI6cgq4iuMx5n59
```

### Payload webhook de geração:
```json
{
  "empresa": "DAS G Plus",
  "nicho": "moda plus size",
  "plataforma": "Instagram",
  "publico": "mulheres plus size",
  "tom": "empoderador e acolhedor",
  "solicitacao": "post sobre autoestima e moda plus size"
}
```

### Payload webhook de aprovação:
```json
{
  "resposta": "APROVAR 1",
  "empresa": "DAS G Plus",
  "plataforma": "Instagram"
}
```

---

## 4. PALETA DE CORES — IDENTIDADE METAMORFOSE

```css
--color-primary:       #1565C0   /* Azul royal */
--color-primary-light: #42A5F5   /* Azul vibrante */
--color-accent:        #64B5F6   /* Azul claro */
--color-glow:          #90CAF9   /* Azul glacial */
--color-dark:          #0A0A1A   /* Fundo preto azulado */
--color-dark-card:     #0D1B2A   /* Cards */
--color-dark-border:   #1A2744   /* Bordas */
--color-text:          #E3F2FD   /* Texto principal */
--color-text-muted:    #90CAF9   /* Texto secundário */
--color-success:       #00E676   /* Verde neon */
--color-warning:       #FFD740   /* Amarelo */
--color-error:         #FF5252   /* Vermelho */
```

**Gradiente:** `linear-gradient(135deg, #1565C0, #42A5F5)`
**Glow:** `box-shadow: 0 0 20px rgba(66,165,245,0.3)`
**Fontes:** Inter ou Poppins
**Estética:** dark mode, azul digital, efeito borboleta — "Do físico ao digital"

---

## 5. FLUXO COMPLETO DE APROVAÇÃO VIA WHATSAPP

### Como funciona:
```
1. Conteúdo gerado pelo Claude no n8n
        ↓
2. n8n envia WhatsApp via Zapi para:
   - Responsável da empresa cliente
   - CÓPIA para Metamorfose (número da Júlia)
        ↓
3. Mensagem contém:
   - Nome da empresa e plataforma
   - Imagem gerada (se disponível) ou link
   - 3 opções de legenda numeradas
   - Instruções de resposta
        ↓
4. Responsável responde no WhatsApp:
   APROVAR 1 / APROVAR 2 / APROVAR 3
   ALTERAR + instrução de ajuste
   REPROVAR
        ↓
5. Roteador Zapi recebe a resposta
   - Detecta se é resposta de aprovação SociaMind
   - Chama webhook de aprovação do SociaMind
        ↓
6. n8n processa aprovação:
   - Se APROVADO: agenda publicação
   - Se ALTERAR: regenera com instrução
   - Se REPROVAR: descarta e notifica
```

### Mensagem WhatsApp modelo:
```
🤖 *SociaMind — Aprovação de Conteúdo*

🏢 Empresa: DAS G Plus
📱 Plataforma: Instagram
📅 Agendado para: Hoje 18h

━━━━━━━━━━━━━━━
*OPÇÃO 1:*
[legenda gerada pelo Claude]

*OPÇÃO 2:*
[legenda gerada pelo Claude]

*OPÇÃO 3:*
[legenda gerada pelo Claude]
━━━━━━━━━━━━━━━

✅ Responda: *APROVAR 1*, *APROVAR 2* ou *APROVAR 3*
✏️ Ou: *ALTERAR* + sua instrução
❌ Ou: *REPROVAR*
```

### Integração com Roteador Zapi existente:
O roteador atual detecta a palavra "cadastro" para Das G.
Adicionar nova condição: detectar palavras APROVAR/ALTERAR/REPROVAR
e redirecionar para webhook de aprovação do SociaMind.

### Novo nó a adicionar no Roteador Zapi:
```
Condição: mensagem contém "APROVAR" ou "ALTERAR" ou "REPROVAR"
  → Chama: https://juinfo.app.n8n.cloud/webhook/social-agent-approval
```

---

## 6. MÓDULOS — ORDEM DE DESENVOLVIMENTO

### 🔴 CRÍTICO — Etapa 1 (esta sessão):

**M1 — Autenticação multi-empresa**
- Login com Supabase Auth
- Cada empresa = workspace separado
- RLS para isolar dados

**M2 — Geração de conteúdo**
- Formulário no app
- Chama webhook n8n
- Recebe 3 opções

**M3 — Geração de imagem**
- Após texto gerado, OpenAI gera imagem
- Salva no Supabase Storage
- Inclui imagem na mensagem WhatsApp

**M4 — Aprovação via WhatsApp**
- n8n dispara via Zapi após gerar conteúdo
- Para responsável da empresa + cópia Metamorfose
- Roteador Zapi detecta resposta e processa

**M5 — Publicação automática**
- Após aprovação: publicar via Graph API
- Instagram + Facebook por empresa

**M6 — Calendário de conteúdo**
- Visão diária/semanal/mensal
- Status de cada post

### 🟡 ALTO — Logo após:

**M7 — Scanner de redes sociais**
- ESTÁ COM ERRO — investigar e corrigir
- Diagnóstico de perfil via Graph API

**M8 — Dashboard de métricas**
- Crescimento, engajamento, alcance

### 🟢 ETAPA 2:

**M9 — Inbox automático**
**M10 — Análise de concorrentes**
**M11 — Aba de Tráfego Pago**

---

## 7. BANCO DE DADOS — SUPABASE

```sql
-- Empresas
CREATE TABLE empresas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome varchar(100) NOT NULL,
  nicho varchar(100),
  tom_de_voz varchar(100),
  whatsapp_responsavel varchar(20),
  criado_em timestamp DEFAULT now()
);

-- Usuários
CREATE TABLE usuarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid REFERENCES empresas(id),
  email varchar(200),
  papel varchar(50),
  criado_em timestamp DEFAULT now()
);

-- Conteúdos gerados
CREATE TABLE conteudos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid REFERENCES empresas(id),
  plataforma varchar(50),
  opcoes jsonb,
  opcao_aprovada integer,
  legenda_final text,
  url_imagem text,
  status varchar(50) DEFAULT 'pendente',
  agendado_para timestamp,
  publicado_em timestamp,
  ig_post_id varchar(100),
  fb_post_id varchar(100),
  criado_em timestamp DEFAULT now()
);

-- Tokens OAuth por empresa
CREATE TABLE redes_sociais (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid REFERENCES empresas(id),
  rede varchar(50),
  page_id varchar(100),
  ig_user_id varchar(100),
  access_token text,
  token_expira_em timestamp
);

-- Scanner
CREATE TABLE scanner_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid REFERENCES empresas(id),
  rede varchar(50),
  seguidores integer,
  engajamento_medio decimal,
  melhor_horario varchar(20),
  dados_raw jsonb,
  criado_em timestamp DEFAULT now()
);
```

---

## 8. VARIÁVEIS DE AMBIENTE (.env)

```env
# ⚠️ SUPABASE AINDA NÃO CRIADO — Claude Code deve criar novo projeto
# Nome do projeto: socialmind-metamorfose
# Após criar, preencher:
VITE_SUPABASE_URL=PREENCHER_APÓS_CRIAR
VITE_SUPABASE_ANON_KEY=PREENCHER_APÓS_CRIAR

VITE_N8N_WEBHOOK_GERACAO=https://juinfo.app.n8n.cloud/webhook/social-agent-trigger
VITE_N8N_WEBHOOK_APROVACAO=https://juinfo.app.n8n.cloud/webhook/social-agent-approval

VITE_WHATSAPP_METAMORFOSE=5514996795653
VITE_WHATSAPP_RESPONSAVEL_TESTE=5514997763166

VITE_FB_APP_ID=seu_app_id
VITE_FB_APP_SECRET=seu_app_secret
```

---

## 9. SCANNER — CORRIGIR

1. Localizar código do scanner em `api/` e `App.jsx`
2. Verificar token OAuth do Instagram
3. Endpoints corretos:
```
Perfil:   GET /{ig-user-id}?fields=followers_count,media_count
Posts:    GET /{ig-user-id}/media?fields=like_count,comments_count,timestamp,media_type
Insights: GET /{ig-user-id}/insights?metric=reach,impressions&period=day
```
4. Corrigir e testar

---

## 10. REDESIGN DO LAYOUT

1. Criar `src/styles/tokens.css` com paleta Metamorfose
2. Dark mode azul em todo o app
3. Componentes:
   - Header + logo SociaMind
   - Sidebar de navegação
   - Cards com glow azul
   - Botões gradiente
   - Tela de aprovação mobile-first
4. Mobile-first obrigatório — aprovação é no celular

---

## 11. TESTE PONTA A PONTA

```
✅ Login no app
✅ Selecionar empresa "DAS G Plus"
✅ Preencher formulário de geração
✅ n8n recebe → Claude gera 3 opções
✅ OpenAI gera imagem
✅ WhatsApp disparado via Zapi para responsável + Metamorfose
✅ Responder APROVAR 1 no WhatsApp
✅ Roteador Zapi detecta e processa aprovação
✅ Post salvo no calendário
⚠️ Publicação Instagram (usar sandbox se sem OAuth)
```

---

## 12. REGRAS

1. NUNCA publicar nas redes reais durante testes
2. Aprovação SEMPRE obrigatória antes de publicar
3. RLS no Supabase — dados isolados por empresa
4. Commitar no GitHub ao final de cada módulo
5. Mobile-first — aprovação é feita no celular
6. Não adivinhar — se travar, documentar e avisar

---

**App:** sociamind.vercel.app
**GitHub:** github.com/julianapereira33-collab/sociamind
**n8n:** juinfo.app.n8n.cloud
**Responsável:** Juliana Pereira — Metamorfose | "Do físico ao digital"
