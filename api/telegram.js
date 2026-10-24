const postOverrides = {
  '1182': 'HAWUD Plastic Distribution Box with Kalki Breakers\n• Available in 8-Way, 12-Way, and 24-Way module capacity\n• Flame-retardant surface & flush mount electrical enclosure\n• Equipped with smoked transparent protective cover & DIN-rail mounting\n• Includes heavy-duty Kalki miniature circuit breakers\n\n@Luxuryelectrical',
  '1179': 'KK Electric 220V LED Strip Power Connectors & Plugs\n• Heavy-duty pre-wired power lead connectors for 220V continuous LED strips\n• Dual-prong pin connector with secure snap-in insulation housing\n• Compatible with single-color and multi-channel strip installations\n\n@Luxuryelectrical',
  '1177': 'Tisesoi® 6W Vintage Edison ST64 Filament Bulb\n• Classic antique ST64 teardrop design with amber-tinted glass\n• Energy-saving 6W LED filament replacing 60W traditional incandescent bulbs\n• Standard E27 screw base delivering 2200K warm vintage ambient illumination\n\n@Luxuryelectrical',
  '1170': 'H.S Power Multi-Core Copper Electrical Cables\n• Premium 100% electrolytic pure copper conductors with tough PVC insulation\n• Available sizes: 2x1.5, 2x2.5, 2x4, 2x6, 3x4, 3x6 mm²\n• Supplied in factory-sealed 100-meter rolls with certified standard gauge\n\n@Luxuryelectrical',
  '1169': 'High-Density 220V Commercial LED Strip Reel (100m)\n• Continuous 100-meter commercial spool with high diode density SMD LEDs\n• Direct 220V mains input without bulky external desktop transformers\n• Weatherproof IP65 clear silicone jacket for indoor & outdoor architectural use\n\n@Luxuryelectrical',
  '1167': 'Micro breaker 25w\n• Micro breaker 25w rated current for residential & motor branch protection\n• 400V~ 50Hz with 6000A short-circuit breaking capacity (IEC standard)\n• Compact single-pole DIN-rail standard 35mm clip-on mounting with contact status window\n\n@Luxuryelectrical',
  '1166': 'AuraLight 0.7 Recessed Slim Downlight (6W)\n• Ultra-slim 6W recessed ceiling downlight available in Round & Square profiles\n• Anti-glare frosted optical diffuser producing soft, uniform illumination\n• Clean matte white bezel seamlessly blending with modern ceilings\n\n@Luxuryelectrical',
  '1164': 'KK Electric 2.5W Mini Recessed Spot Light\n• High-lumen COB LED mini spotlight with deep-set anti-glare reflector\n• Included isolated constant-current LED driver (Input: AC 85-265V 50/60Hz)\n• Available in sleek Matte Black and Clean White finish bezels\n\n@Luxuryelectrical',
  '1163': 'Luxury Slim Circular LED Ceiling Panel Light\n• High-lumen circular ceiling panel with 85% energy conservation\n• Available wattage options: 24W and 36W high-performance SMD arrays\n• Long 30,000-hour rated operating lifespan with high color rendering (CRI > 80)\n• External constant-current driver ensuring flicker-free stable illumination\n• Certified for retail showrooms, commercial offices & modern homes\n\n@Luxuryelectrical',
  '1161': 'SAGE Luxury Matte Black Switch & Socket Collection\n• Premium architectural switch & socket collection in velvety matte black finish\n• Comprehensive range: Single Switch, Double Switch, Triple Switch, Sockets\n• Multi-gang combo units: Combined Socket + Switch, and TV + Power Socket\n• High-grade fire-resistant polycarbonate plate with smooth tactile actuation\n\n@LuxuryElectrical',
  '1159': 'Heavy-Duty 150W Commercial Outdoor LED Street Light\n• High-power 150W luminaire with 3 high-intensity COB LED optical lenses\n• Rugged aerodynamic die-cast aluminum housing with ribbed cooling heatsink\n• IP66 weatherproof rating engineered to withstand rain, dust & harsh conditions\n• Standard pole-mount collar with dual set-screws for compound security\n\n@Luxuryelectrical',
  '1156': 'KK Electric Recessed LED Downlight (ጎርግዋዳ)\n• Deep-recessed (ጎርግዋዳ) anti-glare downlight for comfortable ambient lighting\n• Available in timeless Clean White (ነጭ) and Matte Black (ጥቁር) trims\n• 220-240V 50-60Hz direct mains input with sturdy ceiling mounting springs\n• Chrome accent inner ring delivering a high-end luxury aesthetic\n\n@Luxuryelectrical'
};

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

      // Filter to keep meaningful posts
      if (photoMatches.length > 0 || (text.length > 10 && !text.includes('Channel created'))) {
        posts.push({
          id: rawId,
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
