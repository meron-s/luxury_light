// Mobile hamburger navigation drawer controller
function setupMobileMenu(): void {
  const openBtn = document.getElementById('menu-open-btn');
  const closeBtn = document.getElementById('menu-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('menu-backdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!openBtn || !drawer) return;

  function openMenu(): void {
    drawer?.classList.remove('translate-x-full');
    drawer?.classList.add('translate-x-0');
    backdrop?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    closeBtn?.focus();
  }

  function closeMenu(): void {
    drawer?.classList.add('translate-x-full');
    drawer?.classList.remove('translate-x-0');
    backdrop?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    openBtn?.focus();
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
  setupMobileMenu();
}
