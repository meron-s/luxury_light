// Bulletproof Mobile Hamburger Navigation Controller (CSP-compliant, external module)

let menuOpenTime = 0;

export function openMenu(): void {
  menuOpenTime = Date.now();
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');

  if (drawer) {
    drawer.classList.add('is-open');
    drawer.style.display = 'flex';
    drawer.style.transform = 'translateX(0)';
    drawer.setAttribute('aria-hidden', 'false');
  }

  if (backdrop) {
    backdrop.classList.add('is-open');
    backdrop.style.display = 'block';
    backdrop.style.opacity = '1';
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
    drawer.style.transform = 'translateX(100%)';
    drawer.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!drawer.classList.contains('is-open')) {
        drawer.style.display = 'none';
      }
    }, 300);
  }

  if (backdrop) {
    backdrop.classList.remove('is-open');
    backdrop.style.opacity = '0';
    setTimeout(() => {
      if (!backdrop.classList.contains('is-open')) {
        backdrop.style.display = 'none';
      }
    }, 300);
  }

  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';

  const openBtn = document.getElementById('menu-open-btn');
  openBtn?.focus();
}

export function setupMobileMenu(): void {
  // Delegate clicks on document (CSP safe)
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

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
      if (Date.now() - menuOpenTime < 400) return;
      closeMenu();
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


