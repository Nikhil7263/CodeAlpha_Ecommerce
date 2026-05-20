// ==============================
// LUXE — Homepage Logic
// ==============================

let currentCategory = 'all';
let currentSort = 'default';
let searchQuery = '';

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  let products = getProductsByCategory(currentCategory);

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (currentSort) {
    case 'price-asc':  products = [...products].sort((a, b) => a.price - b.price); break;
    case 'price-desc': products = [...products].sort((a, b) => b.price - a.price); break;
    case 'name':       products = [...products].sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  if (countEl) {
    countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:4rem 0; color:var(--text-muted);">
        <p style="font-size:1.2rem; margin-bottom:0.5rem;">No products found</p>
        <p style="font-size:0.85rem;">Try a different category or search term</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => renderProductCard(p, i * 60)).join('');
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {

  // Render grid
  renderProducts();

  // Filter pills
  document.getElementById('filterPills')?.addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCategory = pill.dataset.cat;
    renderProducts();
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Search open/close
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const closeSearch = document.getElementById('closeSearch');

  searchBtn?.addEventListener('click', () => {
    searchOverlay?.classList.add('open');
    setTimeout(() => searchInput?.focus(), 100);
  });

  closeSearch?.addEventListener('click', () => {
    searchOverlay?.classList.remove('open');
    searchQuery = '';
    searchInput.value = '';
    renderProducts();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchOverlay?.classList.remove('open');
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderProducts();
    }
  });

  searchInput?.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderProducts();
    // Scroll to products
    if (searchQuery.length > 0) {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Shipping option selection
  document.querySelectorAll('.shipping-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Wishlist sync
  const wl = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
  document.querySelectorAll('[data-id]').forEach(card => {
    const id = parseInt(card.dataset.id);
    if (wl.includes(id)) {
      card.querySelector('.product-wishlist')?.classList.add('active');
    }
  });
});
