// Bulletproof Mobile Hamburger Navigation Controller
export function openMenu(): void {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) {
    drawer.style.transform = 'translateX(0)';
    drawer.setAttribute('aria-hidden', 'false');
  }
  if (backdrop) {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
      backdrop.style.pointerEvents = 'auto';
    });
  }
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('menu-close-btn');
  closeBtn?.focus();
}

export function closeMenu(): void {
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');
  if (drawer) {
    drawer.style.transform = 'translateX(100%)';
    drawer.setAttribute('aria-hidden', 'true');
  }
  if (backdrop) {
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }
  document.body.style.overflow = '';
  const openBtn = document.getElementById('menu-open-btn');
  openBtn?.focus();
}

export function setupMobileMenu(): void {
  // Global event delegation for open button
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('#menu-open-btn')) {
      e.preventDefault();
      openMenu();
    } else if (target.closest('#menu-close-btn') || target.closest('#menu-backdrop') || target.closest('.mobile-nav-link')) {
      closeMenu();
    }
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
  setupMobileMenu();
}
