// Call Now & Request Price Sheet Modal Controller (CSP-compliant, external module)

let modalOpenTime = 0;

export function openCallSheet(productName?: string | null): void {
  modalOpenTime = Date.now();
  const modal = document.getElementById('call-sheet-modal');
  if (!modal) return;

  const title = document.getElementById('call-sheet-title');
  const subtitle = document.getElementById('call-sheet-subtitle');

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

  const content = document.getElementById('call-sheet-content');
  if (content) {
    content.style.transform = 'translateY(0)';
  }
}

export function closeCallSheet(): void {
  const modal = document.getElementById('call-sheet-modal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  const content = document.getElementById('call-sheet-content');
  if (content) {
    content.style.transform = 'translateY(100%)';
  }

  setTimeout(() => {
    if (!modal.classList.contains('is-open')) {
      modal.style.display = 'none';
    }
  }, 250);

  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
}

export function setupCallSheet(): void {
  // Delegate clicks on document (CSP safe, works for static and dynamic buttons)
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

    if (target.closest('.call-sheet-close')) {
      e.preventDefault();
      closeCallSheet();
      return;
    }

    if (target.closest('#call-sheet-backdrop')) {
      if (Date.now() - modalOpenTime < 400) return;
      e.preventDefault();
      closeCallSheet();
    }
  });

  // Keyboard escape
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('call-sheet-modal');
      if (modal && (modal.classList.contains('is-open') || modal.style.display !== 'none')) {
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


