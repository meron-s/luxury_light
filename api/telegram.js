export default async function handler(req, res) {
  // Set CORS headers so it can be called from client
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Edge cache on Vercel for 5 minutes, stale-while-revalidate for 10 minutes
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const tgRes = await fetch('https://t.me/s/luxuryelectrical', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!tgRes.ok) {
      throw new Error(`Telegram returned status ${tgRes.status}`);
    }

    const html = await tgRes.text();
    const messageRegex = /<div class="tgme_widget_message\b[^>]*data-post="([^"]+)"[\s\S]*?(?=<div class="tgme_widget_message\b|$)/g;

    const posts = [];
    let match;
    while ((match = messageRegex.exec(html)) !== null) {
      const postBlock = match[0];
      const postId = match[1];

      // Date
      const dateMatch = postBlock.match(/<time[^>]*datetime="([^"]+)"[^>]*>([^<]+)<\/time>/);
      const datetime = dateMatch ? dateMatch[1] : null;

      // Photos: extract telesco.pe or telegram CDN urls
      const photoMatches = [...postBlock.matchAll(/background-image:\s*url\('([^']+)'\)/gi)]
        .map(m => m[1])
        .filter(url => url.includes('telesco.pe') || url.includes('telegram.org/file'));

      // Text clean-up
      const textMatch = postBlock.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      let text = '';
      if (textMatch) {
        text = textMatch[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim();
      }

      // Filter to keep meaningful posts
      if (photoMatches.length > 0 || (text.length > 10 && !text.includes('Channel created'))) {
        posts.push({
          id: postId.split('/')[1] || postId,
          postId,
          url: `https://t.me/${postId}`,
          datetime,
          photos: [...new Set(photoMatches)],
          text: text.slice(0, 600)
        });
      }
    }

    // Newest first
    posts.reverse();

    return res.status(200).json({
      ok: true,
      channel: 'luxuryelectrical',
      channelUrl: 'https://t.me/luxuryelectrical',
      updatedAt: new Date().toISOString(),
      count: posts.length,
      posts
    });
  } catch (err) {
    console.error('Error fetching Telegram feed:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch live feed from Telegram',
      message: err instanceof Error ? err.message : String(err)
    });
  }
}
