// Client-side category filtering and search
function setupProductFilter(): void {
  const searchInput = document.getElementById('product-search-input') as HTMLInputElement | null;
  const filterChips = document.querySelectorAll<HTMLButtonElement>('.filter-chip');
  const productCards = document.querySelectorAll<HTMLElement>('.product-card');
  const countDisplay = document.getElementById('product-count');
  const emptyState = document.getElementById('no-products-found');

  if (!productCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  // Support direct linking via ?category=slug or #slug
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || window.location.hash.replace('#', '');
  if (initialCategory) {
    const targetChip = Array.from(filterChips).find(c => c.dataset.category === initialCategory);
    if (targetChip) {
      activeCategory = initialCategory;
      filterChips.forEach(c => c.classList.remove('active'));
      targetChip.classList.add('active');
    }
  }

  function applyFilters(): void {
    let visibleCount = 0;
    const term = searchTerm.toLowerCase().trim();

    productCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = (card.dataset.name || '').toLowerCase();
      const cardDesc = (card.dataset.desc || '').toLowerCase();

      const matchesCat = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !term || cardTitle.includes(term) || cardDesc.includes(term);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${productCards.length} products`;
    }

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  // Apply initial filters if preset from URL
  if (activeCategory !== 'all') {
    applyFilters();
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      activeCategory = chip.dataset.category || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value;
      applyFilters();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupProductFilter);
} else {
  setupProductFilter();
}
