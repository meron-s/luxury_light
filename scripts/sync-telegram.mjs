import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function syncTelegram() {
  console.log('Fetching https://t.me/s/luxuryelectrical ...');
  try {
    const res = await fetch('https://t.me/s/luxuryelectrical', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    const messageRegex = /<div class="tgme_widget_message\b[^>]*data-post="([^"]+)"[\s\S]*?(?=<div class="tgme_widget_message\b|$)/g;

    const posts = [];
    let match;
    while ((match = messageRegex.exec(html)) !== null) {
      const postBlock = match[0];
      const postId = match[1];

      const dateMatch = postBlock.match(/<time[^>]*datetime="([^"]+)"[^>]*>([^<]+)<\/time>/);
      const datetime = dateMatch ? dateMatch[1] : null;

      const photoMatches = [...postBlock.matchAll(/background-image:\s*url\('([^']+)'\)/gi)]
        .map(m => m[1])
        .filter(url => url.includes('telesco.pe') || url.includes('telegram.org/file'));

      const textMatch = postBlock.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      let text = '';
      if (textMatch) {
        text = textMatch[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim();
        // Convert keycap digits 0️⃣-9️⃣ -> 0-9
        text = text.replace(/([0-9])\uFE0F?\u20E3/g, '$1');
        // Strip Unicode fallback font blocks: 🔠 (ABCD), 🔡 (abcd), 🔤 (abc), 🔣 (symbols), 🔢 (1234)
        text = text.replace(/[\u{1F520}\u{1F521}\u{1F522}\u{1F523}\u{1F524}]/gu, '');
        // Strip noisy / unrendered decorative icons
        text = text.replace(/[⚡🫥👎😺🖤🛜🔌📥〰👈➡️🆕➕]/gu, '');
        // Normalize checkmarks to clean bullet points
        text = text.replace(/[✔️✅✓]/gu, '•');
      }

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

    posts.reverse();

    const outputData = {
      channel: 'luxuryelectrical',
      channelUrl: 'https://t.me/luxuryelectrical',
      syncedAt: new Date().toISOString(),
      count: posts.length,
      posts
    };

    const outPath = resolve(__dirname, '../src/data/telegram-products.json');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`Successfully synced ${posts.length} posts to ${outPath}`);
  } catch (err) {
    console.error('Failed to sync Telegram posts:', err);
    process.exit(1);
  }
}

syncTelegram();
