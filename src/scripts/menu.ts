// Bulletproof Mobile Hamburger Navigation Controller

declare global {
  interface Window {
    __openMobileMenu?: () => void;
    __closeMobileMenu?: () => void;
    __canCloseMenuBackdrop?: () => boolean;
  }
}

export function openMenu(): void {
  if (typeof window.__openMobileMenu === 'function') {
    window.__openMobileMenu();
  }
}

export function closeMenu(): void {
  if (typeof window.__closeMobileMenu === 'function') {
    window.__closeMobileMenu();
  }
}

export function setupMobileMenu(): void {
  const openBtn = document.getElementById('menu-open-btn');
  const closeBtn = document.getElementById('menu-close-btn');
  const backdrop = document.getElementById('menu-backdrop');

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (typeof window.__canCloseMenuBackdrop === 'function' && !window.__canCloseMenuBackdrop()) {
        return;
      }
      e.preventDefault();
      closeMenu();
    });
  }

  // Close when tapping any navigation link inside the drawer
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Global event delegation as secondary fallback (click only - no touchend to eliminate ghost-click bugs)
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (typeof target.closest === 'function') {
      if (target.closest('#menu-open-btn')) {
        e.preventDefault();
        openMenu();
        return;
      }
      if (target.closest('#menu-close-btn') || target.closest('.mobile-nav-link')) {
        closeMenu();
        return;
      }
      if (target.closest('#menu-backdrop')) {
        if (typeof window.__canCloseMenuBackdrop === 'function' && !window.__canCloseMenuBackdrop()) {
          return;
        }
        closeMenu();
      }
    }
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
  } else {
    setupMobileMenu();
  }
}

