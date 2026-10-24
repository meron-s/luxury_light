import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postOverrides = {
  '1167': 'Micro breaker 25w\n• Micro breaker 25w\n\n@Luxuryelectrical',
  '1166': 'AuraLight 0.7 Recessed Downlight\n• Ultra-slim recessed ceiling downlight\n• Available in Round & Square profiles\n\n@Luxuryelectrical',
  '1159': 'Street light 150w\n• High-power outdoor LED street luminaire\n• IP66 weatherproof die-cast housing\n\n@Luxuryelectrical',
  '1182': 'HAWUD Plastic Distribution Box with Kalki Breakers\n• Available in 8-Way, 12-Way, and 24-Way\n• Flame-retardant distribution enclosure\n• Equipped with smoked cover & DIN-rail\n\n@Luxuryelectrical',
  '1179': 'KK Electric 220V LED Strip Power Connectors & Plugs\n• Heavy-duty pre-wired power lead connectors\n• Dual-prong pin connector with secure housing\n\n@Luxuryelectrical',
  '1177': 'Tisesoi® 6W Vintage Edison ST64 Filament Bulb\n• Classic antique teardrop amber glass\n• Energy-saving 6W LED vintage filament\n\n@Luxuryelectrical',
  '1170': 'H.S Power Multi-Core Copper Electrical Cables\n• 100% pure copper conductors with PVC insulation\n• Sizes: 2x1.5, 2x2.5, 2x4, 2x6, 3x4, 3x6 mm²\n\n@Luxuryelectrical',
  '1169': 'High-Density 220V Commercial LED Strip Reel (100m)\n• Continuous 100-meter commercial spool\n• Direct 220V input with IP65 silicone jacket\n\n@Luxuryelectrical',
  '1164': 'KK Electric 2.5W Mini Recessed Spot Light\n• High-lumen COB LED mini spotlight\n• Includes isolated LED driver AC 85-265V\n\n@Luxuryelectrical',
  '1163': 'Luxury Slim Circular LED Ceiling Panel Light\n• High-lumen circular ceiling panel\n• 24W & 36W wattage options\n\n@Luxuryelectrical',
  '1161': 'SAGE Luxury Matte Black Switch & Socket Collection\n• Premium switch & socket collection in matte black\n\n@LuxuryElectrical',
  '1156': 'KK Electric Recessed LED Downlight (ጎርግዋዳ)\n• Deep-recessed anti-glare downlight\n• Available in Clean White & Matte Black trims\n\n@Luxuryelectrical'
};

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

      const rawId = postId.split('/')[1] || postId;
      if (postOverrides[rawId]) {
        text = postOverrides[rawId];
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
