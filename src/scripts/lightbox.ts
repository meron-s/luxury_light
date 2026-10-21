// Accessible lightbox for photo gallery
function setupLightbox(): void {
  const modal = document.getElementById('gallery-lightbox');
  const imgEl = document.getElementById('lightbox-image') as HTMLImageElement | null;
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const triggers = document.querySelectorAll<HTMLElement>('.gallery-trigger');

  if (!modal || !imgEl || !triggers.length) return;

  const items: Array<{ src: string; title: string; desc: string; alt: string }> = [];
  triggers.forEach((trig, idx) => {
    items.push({
      src: trig.dataset.fullSrc || '',
      title: trig.dataset.title || '',
      desc: trig.dataset.desc || '',
      alt: trig.dataset.alt || ''
    });

    trig.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  let currentIndex = 0;

  function updateLightbox(): void {
    const item = items[currentIndex];
    if (!item || !imgEl) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
  }

  function openLightbox(index: number): void {
    currentIndex = index;
    updateLightbox();
    modal?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    closeBtn?.focus();
  }

  function closeLightbox(): void {
    modal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function showNext(): void {
    currentIndex = (currentIndex + 1) % items.length;
    updateLightbox();
  }

  function showPrev(): void {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox();
  }

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal || (e.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) showNext();
    if (touchEndX > touchStartX + 50) showPrev();
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLightbox);
} else {
  setupLightbox();
}
