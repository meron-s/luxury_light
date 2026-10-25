interface TelegramPost {
  id: string;
  postId: string;
  url: string;
  datetime: string | null;
  photos: string[];
  text: string;
}

interface TelegramResponse {
  ok: boolean;
  channel?: string;
  channelUrl?: string;
  updatedAt?: string;
  count?: number;
  posts?: TelegramPost[];
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Recent';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recent';
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const VERIFIED_PRODUCTS: Record<string, { title: string; bodyHtml: string }> = {
  '1182': {
    title: 'HAWUD Plastic Distribution Box with Kalki Breakers',
    bodyHtml: '• Available in 8-Way, 12-Way, and 24-Way module capacity<br/>• Flame-retardant surface & flush mount electrical distribution enclosure<br/>• Equipped with smoked transparent protective cover & DIN-rail mounting<br/>• Includes heavy-duty Kalki miniature circuit breakers'
  },
  '1179': {
    title: 'KK Electric 220V LED Strip Power Connectors & Plugs',
    bodyHtml: '• Heavy-duty pre-wired power lead connectors for 220V continuous LED strips<br/>• Dual-prong pin connector with secure snap-in insulation housing<br/>• Flexible high-conductivity copper lead wires for clean power connections<br/>• Compatible with single-color and multi-channel strip installations'
  },
  '1177': {
    title: 'Tisesoi® 6W Vintage Edison ST64 Filament Bulb',
    bodyHtml: '• Classic antique ST64 teardrop design with amber-tinted glass<br/>• Energy-saving 6W LED filament replacing 60W traditional incandescent bulbs<br/>• Standard E27 screw base compatible with pendants, chandeliers & sconces<br/>• 360° beam angle delivering 2200K warm vintage ambient illumination'
  },
  '1170': {
    title: 'H.S Power Multi-Core Copper Electrical Cables',
    bodyHtml: '• Premium 100% electrolytic pure copper conductors with tough PVC insulation<br/>• Available sizes: 2x1.5, 2x2.5, 2x4, 2x6, 3x4, 3x6 mm²<br/>• Supplied in factory-sealed 100-meter rolls with certified standard gauge<br/>• High thermal endurance, flame-retardant sheath & low voltage drop'
  },
  '1169': {
    title: 'High-Density 220V Commercial LED Strip Reel (100m)',
    bodyHtml: '• Continuous 100-meter commercial spool with high diode density SMD LEDs<br/>• Direct 220V mains input without bulky external desktop transformers<br/>• Weatherproof IP65 clear silicone jacket for indoor & outdoor architectural use<br/>• Uniform, dot-free linear illumination for gypsum ceilings, coves & facades'
  },
  '1167': {
    title: 'Micro breaker 25w',
    bodyHtml: '• Micro breaker 25w rated current for residential & motor branch protection<br/>• 400V~ 50Hz with 6000A short-circuit breaking capacity (IEC standard)<br/>• Compact single-pole DIN-rail standard 35mm clip-on mounting with contact status window'
  },
  '1166': {
    title: 'AuraLight 0.7 Recessed Slim Downlight (6W)',
    bodyHtml: '• Ultra-slim 6W recessed ceiling downlight available in Round & Square profiles<br/>• Anti-glare frosted optical diffuser producing soft, uniform illumination<br/>• High-efficiency A+ energy rating with integrated spring clips for gypsum<br/>• Clean matte white bezel seamlessly blending with modern ceilings'
  },
  '1164': {
    title: 'KK Electric 2.5W Mini Recessed Spot Light',
    bodyHtml: '• High-lumen COB LED mini spotlight with deep-set anti-glare reflector<br/>• Included isolated constant-current LED driver (Input: AC 85-265V 50/60Hz)<br/>• Available in sleek Matte Black and Clean White finish bezels<br/>• 3000K Warm White concentrated accent beam for niches, cabinets & artwork'
  },
  '1163': {
    title: 'Luxury Slim Circular LED Ceiling Panel Light',
    bodyHtml: '• High-lumen circular ceiling panel with 85% energy conservation<br/>• Available wattage options: 24W and 36W high-performance SMD arrays<br/>• Long 30,000-hour rated operating lifespan with high color rendering (CRI > 80)<br/>• External constant-current driver ensuring flicker-free stable illumination<br/>• Certified for retail showrooms, commercial offices & modern homes'
  },
  '1161': {
    title: 'SAGE Luxury Matte Black Switch & Socket Collection',
    bodyHtml: '• Premium architectural switch & socket collection in velvety matte black finish<br/>• Comprehensive range: Single Switch, Double Switch, Triple Switch, Sockets<br/>• Multi-gang combo units: Combined Socket + Switch, and TV + Power Socket<br/>• High-grade fire-resistant polycarbonate plate with smooth tactile actuation'
  },
  '1159': {
    title: 'Heavy-Duty 150W Commercial Outdoor LED Street Light',
    bodyHtml: '• High-power 150W luminaire with 3 high-intensity COB LED optical lenses<br/>• Rugged aerodynamic die-cast aluminum housing with ribbed cooling heatsink<br/>• IP66 weatherproof rating engineered to withstand rain, dust & harsh conditions<br/>• Standard pole-mount collar with dual set-screws for compound security'
  },
  '1156': {
    title: 'KK Electric Recessed LED Downlight (ጎርግዋዳ)',
    bodyHtml: '• Deep-recessed (ጎርግዋዳ) anti-glare downlight for comfortable ambient lighting<br/>• Available in timeless Clean White (ነጭ) and Matte Black (ጥቁር) trims<br/>• 220-240V 50-60Hz direct mains input with sturdy ceiling mounting springs<br/>• Chrome accent inner ring delivering a high-end luxury aesthetic'
  }
};

function cleanTelegramText(rawText: string | null | undefined, postId?: string): { title: string; bodyHtml: string } {
  const rawId = (postId || '').split('/')[1] || postId || '';
  if (rawId && VERIFIED_PRODUCTS[rawId]) {
    return VERIFIED_PRODUCTS[rawId];
  }

  // Content hints fallback
  if (rawText) {
    const lower = rawText.toLowerCase();
    if (lower.includes('24w') || lower.includes('36w') || lower.includes('circular led')) return VERIFIED_PRODUCTS['1163'];
    if (lower.includes('black') || lower.includes('socket single') || lower.includes('sage')) return VERIFIED_PRODUCTS['1161'];
    if (rawText.trim() === '150' || lower.includes('street light') || lower.includes('150w')) return VERIFIED_PRODUCTS['1159'];
    if (lower.includes('ጎርግዋዳ') || lower.includes('spot kk')) return VERIFIED_PRODUCTS['1156'];
    if (lower.includes('micro breaker')) return VERIFIED_PRODUCTS['1167'];
    if (lower.includes('auralight') || rawText.trim() === '6') return VERIFIED_PRODUCTS['1166'];
    if (lower.includes('mini recessed') || lower.includes('2.5w')) return VERIFIED_PRODUCTS['1164'];
    if (lower.includes('distribution box') || lower.includes('hawud')) return VERIFIED_PRODUCTS['1182'];
    if (lower.includes('power connectors') || lower.includes('strip power')) return VERIFIED_PRODUCTS['1179'];
    if (lower.includes('edison') || lower.includes('st64') || lower.includes('filament')) return VERIFIED_PRODUCTS['1177'];
    if (lower.includes('copper electrical') || lower.includes('h.s power')) return VERIFIED_PRODUCTS['1170'];
    if (lower.includes('commercial led strip') || lower.includes('100m')) return VERIFIED_PRODUCTS['1169'];
  }

  if (!rawText) {
    return { title: 'Electrical & Lighting Arrival', bodyHtml: '' };
  }
  // Convert keycap digits 0️⃣-9️⃣ -> 0-9
  let text = rawText.replace(/([0-9])\uFE0F?\u20E3/g, '$1');
  // Strip Unicode fallback font blocks: 🔠 (ABCD), 🔡 (abcd), 🔤 (abc), 🔣 (symbols), 🔢 (1234)
  text = text.replace(/[\u{1F520}\u{1F521}\u{1F522}\u{1F523}\u{1F524}]/gu, '');
  // Strip noisy / unrendered decorative icons
  text = text.replace(/[⚡🫥👎😺🖤🛜🔌📥〰👈➡️🆕➕]/gu, '');
  // Normalize checkmarks to clean bullet points
  text = text.replace(/[✔️✅✓]/gu, '•');
  const lines = text
    .split('\n')
    .map(line => line.trim().replace(/^•\s*/, '• ').replace(/\s+/g, ' '))
    .filter(line => line.length > 0 && line !== '•');
  if (lines.length === 0) {
    return { title: 'Electrical & Lighting Arrival', bodyHtml: '' };
  }
  let title = lines[0].replace(/^•\s*/, '').trim();
  if (title.length < 3) {
    title = 'Electrical & Lighting Arrival';
  } else if (title.length > 70) {
    title = title.slice(0, 70);
  }
  const bodyLines = (lines.length > 1 ? lines.slice(1) : lines)
    .filter(line => !line.startsWith('@') && line !== '6' && line !== '• 6' && line !== '150' && line !== '• 150');
  const bodyHtml = bodyLines.map(l => escapeHtml(l)).join('<br/>');
  return { title, bodyHtml };
}

interface ProductSpecItem {
  label: string;
  value: string;
}

const VERIFIED_SPECS: Record<string, ProductSpecItem[]> = {
  '1182': [
    { label: 'Module Capacity', value: '8-Way, 12-Way, 24-Way' },
    { label: 'Protection', value: 'Flame-Retardant Smoked Cover' },
    { label: 'Included Breakers', value: 'Kalki MCB Modules' }
  ],
  '1179': [
    { label: 'Compatibility', value: '220V High-Density Strips' },
    { label: 'Terminal / Lead', value: 'Dual-Prong Pre-Wired Copper' },
    { label: 'Safety / Housing', value: 'Snap-In Insulated Housing' }
  ],
  '1177': [
    { label: 'Power / Base', value: '6W Vintage LED / E27 Base' },
    { label: 'Glass Profile', value: 'ST64 Teardrop Amber Glass' },
    { label: 'Optics / Glow', value: '2200K Warm Ambient Vintage' }
  ],
  '1170': [
    { label: 'Conductor', value: '100% Pure Electrolytic Copper' },
    { label: 'Sizes Available', value: '2x1.5 up to 3x6 mm²' },
    { label: 'Insulation', value: 'Flame-Retardant PVC Sheath' }
  ],
  '1169': [
    { label: 'Length / Voltage', value: '100m Reel / 220V Direct' },
    { label: 'Protection', value: 'IP65 Clear Silicone Jacket' },
    { label: 'Optics', value: 'Dot-Free Linear Illumination' }
  ],
  '1167': [
    { label: 'Current Rating', value: '25A C-Curve (400V~ 50Hz)' },
    { label: 'Protection', value: '6000A Breaking Capacity' },
    { label: 'Mounting', value: '35mm DIN-Rail Clip-On' }
  ],
  '1166': [
    { label: 'Power / Profile', value: '6W Round & Square Profiles' },
    { label: 'Diffuser', value: 'Anti-Glare Frosted Lens' },
    { label: 'Optics / Finish', value: 'Clean Matte White Bezel' }
  ],
  '1164': [
    { label: 'Power / Driver', value: '2.5W COB / AC 85-265V' },
    { label: 'Beam Angle', value: '3000K Warm Accent Beam' },
    { label: 'Optics / Finish', value: 'Matte Black & Clean White' }
  ],
  '1163': [
    { label: 'Wattage Options', value: '24W & 36W High-Lumen' },
    { label: 'Efficiency', value: '85% Energy Saving / CRI > 80' },
    { label: 'Optics / Driver', value: 'Flicker-Free Constant Current' }
  ],
  '1161': [
    { label: 'Power / Profile', value: '16A Heavy-Duty Terminal' },
    { label: 'Protection', value: 'Flame-Retardant PC' },
    { label: 'Optics / Finish', value: 'Metallic Silver Finish' }
  ],
  '1159': [
    { label: 'Power / Profile', value: '150W Multi-Module' },
    { label: 'Protection', value: 'IP65 Weather-Sealed' },
    { label: 'Optics / Finish', value: 'Pole Mount Collar' }
  ],
  '1156': [
    { label: 'Power / Profile', value: 'Precision LED Driver' },
    { label: 'Protection', value: 'Deep-Recessed Lens' },
    { label: 'Optics / Finish', value: 'Warm / Neutral White' }
  ]
};

function getProductSpecs(postId?: string, bodyHtml?: string): ProductSpecItem[] {
  const rawId = (postId || '').split('/')[1] || postId || '';
  if (rawId && VERIFIED_SPECS[rawId]) {
    return VERIFIED_SPECS[rawId];
  }
  if (!bodyHtml) {
    return [
      { label: 'Availability', value: 'Showroom Stock Addis Ababa' },
      { label: 'Order Inquiry', value: 'Call / Telegram Concierge' },
      { label: 'Quality Guarantee', value: 'Original Certified Product' }
    ];
  }
  const lines = bodyHtml.split('<br/>').map(l => l.replace(/^[•\s-]+/, '').trim()).filter(Boolean);
  const items: ProductSpecItem[] = [];
  for (const line of lines.slice(0, 3)) {
    if (line.includes(':')) {
      const [k, ...v] = line.split(':');
      items.push({ label: k.trim(), value: v.join(':').trim() });
    } else {
      items.push({ label: 'Feature', value: line });
    }
  }
  while (items.length < 3) {
    items.push({ label: 'Showroom Stock', value: 'Merkato Sosa Building' });
  }
  return items;
}

function createPostCard(post: TelegramPost): string {
  const photo = post.photos && post.photos.length > 0 ? post.photos[0] : null;
  const hasMultiple = post.photos && post.photos.length > 1;
  const dateStr = formatDate(post.datetime);
  const { title: cleanTitle, bodyHtml } = cleanTelegramText(post.text, post.id);
  const specs = getProductSpecs(post.id, bodyHtml);

  return `
    <article class="tg-product-card group relative flex flex-col rounded-3xl bg-white border border-slate-200/80 hover:border-[#2FD468]/60 transition-all duration-300 overflow-hidden shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-emerald-950/10">
      <!-- Media Header -->
      <div class="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        ${photo ? `
          <img
            src="${escapeHtml(photo)}"
            alt="${escapeHtml(cleanTitle)}"
            loading="lazy"
            decoding="async"
            class="tg-main-photo h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${hasMultiple ? 'cursor-pointer' : ''}"
            data-photos='${JSON.stringify(post.photos)}'
            data-current-index="0"
            title="${hasMultiple ? 'Click to view next photo' : escapeHtml(cleanTitle)}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="hidden absolute inset-0 items-center justify-center bg-slate-100 p-4 text-center">
            <span class="text-xs text-slate-500">Image available on Telegram</span>
          </div>

          ${hasMultiple ? `
            <!-- Counter Badge -->
            <div class="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-[#2FD468] pointer-events-none shadow-md">
              <span class="tg-photo-counter">1/${post.photos.length}</span>
            </div>

            <!-- Dots Indicator -->
            <div class="absolute bottom-3.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              ${post.photos.map((_, i) => `
                <span class="tg-dot h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-4 bg-[#2FD468]' : 'w-1.5 bg-white/70'}"></span>
              `).join('')}
            </div>
          ` : ''}
        ` : `
          <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E5F7ED] to-slate-100 p-6 text-center">
            <div class="flex flex-col items-center gap-2">
              <svg class="h-10 w-10 text-emerald-600/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <span class="text-xs font-semibold text-slate-500">Telegram Arrival</span>
            </div>
          </div>
        `}

        <!-- Badges matching mockup -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span class="inline-flex items-center rounded-full bg-[#2FD468] px-3 py-1 text-[10px] font-black tracking-wider uppercase text-[#052011] shadow-xs">
            FEATURED
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-xs">
            <svg class="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${escapeHtml(dateStr)}
          </span>
        </div>
      </div>

      <!-- Thumbnail Selector Strip (when 2+ photos) -->
      ${hasMultiple ? `
        <div class="px-4 pt-3 pb-1 flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-50/70 border-b border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Photos:</span>
          ${post.photos.map((pUrl, pIdx) => `
            <button
              type="button"
              class="tg-thumb-btn shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                pIdx === 0
                  ? 'border-[#2FD468] ring-2 ring-[#2FD468]/30 opacity-100 scale-105'
                  : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
              }"
              data-photo-url="${escapeHtml(pUrl)}"
              data-index="${pIdx}"
              aria-label="View photo ${pIdx + 1}"
            >
              <img src="${escapeHtml(pUrl)}" alt="" class="w-full h-full object-cover pointer-events-none" loading="lazy" />
            </button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Card Body matching mockup -->
      <div class="flex flex-1 flex-col p-5">
        <h3 class="text-base sm:text-lg font-bold text-[#0D221A] line-clamp-2 leading-snug mb-3 min-h-[3rem]">
          ${escapeHtml(cleanTitle)}
        </h3>

        <!-- Structured Specs Table matching mockup -->
        <div class="space-y-2 border-t border-b border-slate-100 py-3 mb-5">
          ${specs.map(s => `
            <div class="flex items-center justify-between text-xs gap-2">
              <span class="text-[#64748B] font-normal shrink-0">${escapeHtml(s.label)}:</span>
              <span class="text-[#0D221A] font-semibold text-right truncate">${escapeHtml(s.value)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Actions matching mockup -->
        <div class="mt-auto pt-1 flex items-center gap-2.5">
          <a
            href="${escapeHtml(post.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2FD468] hover:bg-[#28C560] text-[#062413] px-3.5 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            <span>Telegram Post</span>
          </a>

          <button
            type="button"
            class="trigger-call-modal inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#132A22] hover:bg-[#0B1A14] text-white px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            data-product-name="${escapeHtml(cleanTitle)}"
            title="Call to Order"
          >
            <svg class="h-3.5 w-3.5 text-[#2FD468]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Order</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function selectPhoto(card: HTMLElement, index: number, photoUrl: string) {
  const mainImg = card.querySelector('.tg-main-photo') as HTMLImageElement;
  if (mainImg) {
    mainImg.src = photoUrl;
    mainImg.setAttribute('data-current-index', String(index));
  }

  // Update thumbnail buttons
  const thumbs = card.querySelectorAll('.tg-thumb-btn');
  thumbs.forEach((t, i) => {
    if (i === index) {
      t.className = 'tg-thumb-btn shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-105';
    } else {
      t.className = 'tg-thumb-btn shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600';
    }
  });

  // Update counter badge
  const counter = card.querySelector('.tg-photo-counter');
  if (counter) {
    counter.textContent = `${index + 1}/${thumbs.length}`;
  }

  // Update dots
  const dots = card.querySelectorAll('.tg-dot');
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.className = 'tg-dot h-1.5 rounded-full transition-all duration-300 w-4 bg-amber-400';
    } else {
      dot.className = 'tg-dot h-1.5 rounded-full transition-all duration-300 w-1.5 bg-white/50';
    }
  });
}

function setupMultiPhotoInteractions() {
  document.addEventListener('click', (e) => {
    // 1. Check if a thumbnail button was clicked
    const thumbBtn = (e.target as HTMLElement).closest('.tg-thumb-btn') as HTMLElement;
    if (thumbBtn) {
      const card = thumbBtn.closest('.tg-product-card') as HTMLElement;
      if (!card) return;

      const photoUrl = thumbBtn.getAttribute('data-photo-url');
      const index = parseInt(thumbBtn.getAttribute('data-index') || '0', 10);
      if (photoUrl) {
        selectPhoto(card, index, photoUrl);
      }
      return;
    }

    // 2. Check if main photo was clicked (cycle to next photo)
    const mainImg = (e.target as HTMLElement).closest('.tg-main-photo') as HTMLImageElement;
    if (mainImg) {
      const card = mainImg.closest('.tg-product-card') as HTMLElement;
      if (!card) return;

      const thumbs = card.querySelectorAll('.tg-thumb-btn');
      if (thumbs.length <= 1) return;

      const currentIndex = parseInt(mainImg.getAttribute('data-current-index') || '0', 10);
      const nextIndex = (currentIndex + 1) % thumbs.length;
      const nextThumb = thumbs[nextIndex] as HTMLElement;
      const nextUrl = nextThumb?.getAttribute('data-photo-url');

      if (nextUrl) {
        selectPhoto(card, nextIndex, nextUrl);
      }
    }
  });
}

export function initTelegramFeed() {
  const container = document.getElementById('telegram-posts-container');
  const statusEl = document.getElementById('telegram-live-status');
  if (!container) return;

  // Setup interactions once
  setupMultiPhotoInteractions();

  // Fetch live posts from our serverless route
  fetch('/api/telegram')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<TelegramResponse>;
    })
    .then(data => {
      if (data && data.ok && Array.isArray(data.posts) && data.posts.length > 0) {
        // Re-render container with the latest live posts
        container.innerHTML = data.posts.slice(0, 12).map(createPostCard).join('');

        if (statusEl) {
          statusEl.innerHTML = `
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-emerald-400 font-medium">Live synced with @luxuryelectrical</span>
          `;
        }
      }
    })
    .catch(err => {
      console.debug('Telegram live check completed (using preloaded static feed):', err.message);
    });
}

// Auto-run on client
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramFeed);
  } else {
    initTelegramFeed();
  }
}
