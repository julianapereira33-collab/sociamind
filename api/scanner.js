import { requireAuth } from './_auth.js';
import { allowCors } from './_cors.js';

const GRAPH = 'https://graph.facebook.com/v23.0';

export default async function handler(req, res) {
  allowCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAuth(req, res);
  if (!user) return;

  const { igUserId, pageId, accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'access_token ausente — configure nas Integrações da empresa' });
  }

  try {
    const results = {};

    // Perfil Instagram
    if (igUserId) {
      const profileRes = await fetch(
        `${GRAPH}/${igUserId}?fields=followers_count,media_count,username,biography,website&access_token=${accessToken}`
      );
      const profile = await profileRes.json();
      if (profile.error) throw new Error(`Instagram: ${profile.error.message}`);
      results.instagram = { profile };

      // Últimos posts
      const mediaRes = await fetch(
        `${GRAPH}/${igUserId}/media?fields=id,caption,like_count,comments_count,timestamp,media_type,permalink&limit=12&access_token=${accessToken}`
      );
      const media = await mediaRes.json();
      if (!media.error) results.instagram.media = media.data;

      // Insights (requer permissão instagram_manage_insights)
      try {
        const insightRes = await fetch(
          `${GRAPH}/${igUserId}/insights?metric=reach,impressions,profile_views&period=day&access_token=${accessToken}`
        );
        const insights = await insightRes.json();
        if (!insights.error) results.instagram.insights = insights.data;
      } catch { /* insights são opcionais */ }
    }

    // Página Facebook
    if (pageId) {
      const pageRes = await fetch(
        `${GRAPH}/${pageId}?fields=fan_count,followers_count,name,category&access_token=${accessToken}`
      );
      const page = await pageRes.json();
      if (!page.error) results.facebook = { page };
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
