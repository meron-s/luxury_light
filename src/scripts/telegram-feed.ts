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

function cleanTelegramText(rawText: string | null | undefined): { title: string; bodyHtml: string } {
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
  const bodyLines = lines.length > 1 ? lines.slice(1) : lines;
  const bodyHtml = bodyLines.map(l => escapeHtml(l)).join('<br/>');
  return { title, bodyHtml };
}

function createPostCard(post: TelegramPost): string {
  const photo = post.photos && post.photos.length > 0 ? post.photos[0] : null;
  const hasMultiple = post.photos && post.photos.length > 1;
  const dateStr = formatDate(post.datetime);
  const { title: cleanTitle, bodyHtml } = cleanTelegramText(post.text);

  return `
    <article class="tg-product-card group relative flex flex-col rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-stone-800/80 hover:border-amber-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-amber-500/10">
      <!-- Media Header -->
      <div class="relative aspect-[4/3] w-full overflow-hidden bg-stone-900/60">
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
          <div class="hidden absolute inset-0 items-center justify-center bg-stone-900/80 p-4 text-center">
            <span class="text-xs text-stone-400">Image available on Telegram</span>
          </div>

          ${hasMultiple ? `
            <!-- Counter Badge -->
            <div class="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700/80 text-[11px] font-bold text-amber-400 pointer-events-none shadow-md">
              <span class="tg-photo-counter">1/${post.photos.length}</span>
            </div>

            <!-- Dots Indicator -->
            <div class="absolute bottom-3.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              ${post.photos.map((_, i) => `
                <span class="tg-dot h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50'}"></span>
              `).join('')}
            </div>
          ` : ''}
        ` : `
          <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-stone-900 p-6 text-center">
            <div class="flex flex-col items-center gap-2">
              <svg class="h-10 w-10 text-amber-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <span class="text-xs font-medium text-stone-400">Telegram Arrival</span>
            </div>
          </div>
        `}

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-stone-950/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
            <svg class="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            @luxuryelectrical
          </span>
          <span class="rounded-full bg-stone-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] text-stone-400 border border-stone-800">
            ${dateStr}
          </span>
        </div>
      </div>

      <!-- Thumbnail Selector Strip (when 2+ photos) -->
      ${hasMultiple ? `
        <div class="px-4 pt-3 pb-1 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span class="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">Photos:</span>
          ${post.photos.map((pUrl, pIdx) => `
            <button
              type="button"
              class="tg-thumb-btn shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                pIdx === 0
                  ? 'border-amber-400 ring-2 ring-amber-400/40 opacity-100 scale-105'
                  : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600'
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

      <!-- Card Body -->
      <div class="flex flex-1 flex-col p-4 sm:p-5">
        <h3 class="text-sm sm:text-base font-semibold text-stone-100 line-clamp-2 mb-2 leading-snug">
          ${escapeHtml(cleanTitle)}
        </h3>

        ${bodyHtml ? `
          <div class="text-xs sm:text-sm text-stone-400 line-clamp-3 mb-4 leading-relaxed font-normal">
            ${bodyHtml}
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="mt-auto pt-3 border-t border-stone-800/80 flex items-center gap-2">
          <a
            href="${escapeHtml(post.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 text-xs font-semibold transition-colors"
          >
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            Telegram Post
          </a>

          <button
            type="button"
            class="trigger-call-modal inline-flex items-center justify-center gap-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
            data-product-name="${escapeHtml(cleanTitle)}"
            title="Call to Order"
          >
            <svg class="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Order
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
      if (statusEl) {
        statusEl.innerHTML = `
          <span class="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
          <span class="text-stone-400">Official Telegram Channel: @luxuryelectrical</span>
        `;
      }
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
