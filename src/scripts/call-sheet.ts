// Call Now & Request Price Sheet Modal Controller

declare global {
  interface Window {
    __openCallModal?: (productName?: string | null) => void;
    __closeCallModal?: () => void;
  }
}

export function openCallSheet(productName?: string | null): void {
  const modal = document.getElementById('call-sheet-modal');
  const title = document.getElementById('call-sheet-title');
  const subtitle = document.getElementById('call-sheet-subtitle');

  if (!modal) return;

  if (productName && typeof productName === 'string' && productName.trim().length > 0) {
    if (title) title.textContent = 'Request Price & Order';
    if (subtitle) subtitle.textContent = `Inquiring for: ${productName}`;
  } else {
    if (title) title.textContent = 'Choose a Showroom Line to Call';
    if (subtitle) subtitle.textContent = 'Connect directly with our team at Sosa Merkato Building';
  }

  modal.classList.add('is-open');
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

export function closeCallSheet(): void {
  const modal = document.getElementById('call-sheet-modal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    if (!modal.classList.contains('is-open')) {
      modal.style.display = 'none';
    }
  }, 250);
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
}

// Global window registration for zero-latency inline calls
if (typeof window !== 'undefined') {
  window.__openCallModal = openCallSheet;
  window.__closeCallModal = closeCallSheet;
}

export function setupCallSheet(): void {
  // Direct listeners on all trigger elements
  const triggers = document.querySelectorAll<HTMLElement>('.trigger-call-modal');
  triggers.forEach((trigger) => {
    const handleTrigger = (e: Event) => {
      e.preventDefault();
      const product = trigger.getAttribute('data-product-name');
      openCallSheet(product);
    };
    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('touchend', handleTrigger, { passive: false });
  });

  // Close buttons and backdrop
  const closeBtns = document.querySelectorAll('.call-sheet-close');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCallSheet();
    });
  });

  const backdrop = document.getElementById('call-sheet-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeCallSheet();
    });
  }

  // Global delegation fallback so any dynamically added or late-bound buttons work
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const trigger = target.closest<HTMLElement>('.trigger-call-modal');
    if (trigger) {
      e.preventDefault();
      const product = trigger.getAttribute('data-product-name');
      openCallSheet(product);
      return;
    }
    if (target.closest('.call-sheet-close') || target.closest('#call-sheet-backdrop')) {
      e.preventDefault();
      closeCallSheet();
    }
  });

  // Global touchend delegation for mobile responsiveness
  document.addEventListener('touchend', (e: TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const trigger = target.closest<HTMLElement>('.trigger-call-modal');
    if (trigger) {
      e.preventDefault();
      const product = trigger.getAttribute('data-product-name');
      openCallSheet(product);
      return;
    }
    if (target.closest('.call-sheet-close') || target.closest('#call-sheet-backdrop')) {
      e.preventDefault();
      closeCallSheet();
    }
  }, { passive: false });

  // Keyboard escape
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('call-sheet-modal');
      if (modal && modal.classList.contains('is-open')) {
        closeCallSheet();
      }
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCallSheet);
  } else {
    setupCallSheet();
  }
}
