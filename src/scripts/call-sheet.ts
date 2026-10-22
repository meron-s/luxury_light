// Call Now & Request Price Sheet Modal Controller

declare global {
  interface Window {
    __openCallModal?: (productName?: string | null) => void;
    __closeCallModal?: () => void;
    __canCloseModalBackdrop?: () => boolean;
  }
}

export function openCallSheet(productName?: string | null): void {
  if (typeof window.__openCallModal === 'function') {
    window.__openCallModal(productName);
  }
}

export function closeCallSheet(): void {
  if (typeof window.__closeCallModal === 'function') {
    window.__closeCallModal();
  }
}

export function setupCallSheet(): void {
  // Direct listeners on all trigger elements
  const triggers = document.querySelectorAll<HTMLElement>('.trigger-call-modal');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const product = trigger.getAttribute('data-product-name');
      openCallSheet(product);
    });
  });

  const closeBtns = document.querySelectorAll<HTMLElement>('.call-sheet-close');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCallSheet();
    });
  });

  const backdrop = document.getElementById('call-sheet-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (typeof window.__canCloseModalBackdrop === 'function' && !window.__canCloseModalBackdrop()) {
        return;
      }
      e.preventDefault();
      closeCallSheet();
    });
  }

  // Global delegation fallback (click only - no touchend to eliminate ghost-click bugs)
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
      if (typeof window.__canCloseModalBackdrop === 'function' && !window.__canCloseModalBackdrop()) {
        return;
      }
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

