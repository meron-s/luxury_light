// Bulletproof Mobile Hamburger Navigation Controller

declare global {
  interface Window {
    __openMobileMenu?: () => void;
    __closeMobileMenu?: () => void;
  }
}

export function openMenu(): void {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  if (backdrop) {
    backdrop.classList.add('is-open');
  }
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('menu-close-btn');
  closeBtn?.focus();
}

export function closeMenu(): void {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }
  if (backdrop) {
    backdrop.classList.remove('is-open');
  }
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  const openBtn = document.getElementById('menu-open-btn');
  openBtn?.focus();
}

// Expose handlers globally so inline HTML onclick works as zero-latency fallback
if (typeof window !== 'undefined') {
  window.__openMobileMenu = openMenu;
  window.__closeMobileMenu = closeMenu;
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
    openBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      openMenu();
    }, { passive: false });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
    closeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeMenu();
    }, { passive: false });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });
    backdrop.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeMenu();
    }, { passive: false });
  }

  // Close when tapping any navigation link inside the drawer
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Global event delegation as secondary fallback
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (typeof target.closest === 'function') {
      if (target.closest('#menu-open-btn')) {
        e.preventDefault();
        openMenu();
      } else if (
        target.closest('#menu-close-btn') ||
        target.closest('#menu-backdrop') ||
        target.closest('.mobile-nav-link')
      ) {
        closeMenu();
      }
    }
  });

  document.addEventListener('touchend', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (typeof target.closest === 'function') {
      if (target.closest('#menu-open-btn')) {
        e.preventDefault();
        openMenu();
      } else if (
        target.closest('#menu-close-btn') ||
        target.closest('#menu-backdrop') ||
        target.closest('.mobile-nav-link')
      ) {
        closeMenu();
      }
    }
  }, { passive: false });

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
