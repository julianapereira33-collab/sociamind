#!/bin/bash
# ─── Social Agent MVP — Deploy Automático ────────────────────────────────────
# Execute este script uma única vez. Após isso, edite o App.jsx e rode
# apenas: vercel --prod
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo ""
echo "🤖 Social Agent MVP — Deploy Automático"
echo "═══════════════════════════════════════"
echo ""

# ── Passo 1: GitHub ──────────────────────────────────────────────────────────
read -p "📌 Seu usuário do GitHub: " GH_USER
read -p "🔑 GitHub Personal Access Token (github.com/settings/tokens → New → repo): " GH_TOKEN
read -p "📦 Nome do repositório (ex: social-agent-mvp): " REPO_NAME

echo ""
echo "⏳ Criando repositório privado no GitHub..."

curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":true,\"description\":\"Social Agent MVP — Agency Hub\"}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('✅ Repo criado:', d.get('html_url','Erro: '+str(d)))"

git remote add origin "https://$GH_USER:$GH_TOKEN@github.com/$GH_USER/$REPO_NAME.git"
git push -u origin main

echo "✅ Código no GitHub!"
echo ""

# ── Passo 2: Vercel ──────────────────────────────────────────────────────────
read -p "🔑 Vercel Token (vercel.com/account/tokens → Create): " VERCEL_TOKEN

echo ""
echo "⏳ Fazendo deploy na Vercel..."

VERCEL_TOKEN=$VERCEL_TOKEN vercel --prod --yes \
  --name "$REPO_NAME" \
  --token "$VERCEL_TOKEN"

echo ""
echo "🎉 PRONTO! Seu Social Agent está no ar."
echo "   Acesse a URL acima para usar o dashboard."
