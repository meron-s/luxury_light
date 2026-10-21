// Call Now sheet modal controller
function setupCallSheet(): void {
  const modal = document.getElementById('call-sheet-modal');
  const backdrop = document.getElementById('call-sheet-backdrop');
  const sheet = document.getElementById('call-sheet-content');
  const closeBtns = document.querySelectorAll('.call-sheet-close');
  const triggers = document.querySelectorAll<HTMLElement>('.trigger-call-modal');

  if (!modal || !backdrop || !sheet) return;

  function openSheet(): void {
    modal?.classList.remove('hidden');
    // slight delay for animation
    requestAnimationFrame(() => {
      backdrop?.classList.remove('opacity-0');
      backdrop?.classList.add('opacity-100');
      sheet?.classList.remove('translate-y-full');
      sheet?.classList.add('translate-y-0');
    });
    document.body.classList.add('overflow-hidden');
  }

  function closeSheet(): void {
    backdrop?.classList.remove('opacity-100');
    backdrop?.classList.add('opacity-0');
    sheet?.classList.remove('translate-y-0');
    sheet?.classList.add('translate-y-full');

    setTimeout(() => {
      modal?.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e: MouseEvent) => {
      // If desktop, check if contact section is on page
      if (window.innerWidth >= 1024) {
        const contactBar = document.getElementById('contact-bar') || document.getElementById('contact-section');
        if (contactBar) {
          e.preventDefault();
          contactBar.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      e.preventDefault();
      openSheet();
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeSheet));
  backdrop.addEventListener('click', closeSheet);

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeSheet();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCallSheet);
} else {
  setupCallSheet();
}
