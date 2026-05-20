// ==============================
// LUXE — Cart Management
// ==============================

const Cart = (() => {
  const STORAGE_KEY = 'luxe_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function addItem(productId, size, color, quantity = 1) {
    const cart = getCart();
    const product = getProductById(productId);
    if (!product) return;

    const key = `${productId}-${size}-${color}`;
    const existing = cart.find(i => i.key === key);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 10);
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color,
        colorName: product.colorNames?.[product.colors?.indexOf(color)] || '',
        quantity
      });
    }

    saveCart(cart);
    showToast(`"${product.name}" added to cart`, 'success');
  }

  function removeItem(key) {
    const cart = getCart().filter(i => i.key !== key);
    saveCart(cart);
  }

  function updateQty(key, delta) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(item.quantity + delta, 10));
    saveCart(cart);
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartUI();
  }

  function getTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  function getCount() {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  function updateCartUI() {
    const cart = getCart();
    const count = getCount();

    // Badge
    const badge = document.getElementById('cartCount');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    }

    // Items
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="empty-cart">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <p>Your cart is empty</p>
        </div>`;
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy"/>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">
            ${item.size !== 'One Size' ? `Size: ${item.size}` : ''}
            ${item.colorName ? ` · ${item.colorName}` : ''}
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.updateQty('${item.key}', -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.key}', 1)">+</button>
            <button class="remove-item" onclick="Cart.removeItem('${item.key}')">Remove</button>
          </div>
        </div>
        <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');

    const total = getTotal();
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(total);
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (footerEl) footerEl.style.display = 'block';
  }

  return { getCart, addItem, removeItem, updateQty, clearCart, getTotal, getCount, updateCartUI };
})();

// ==============================
// Cart Sidebar Controls
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const continueShopping = document.getElementById('continueShopping');

  function openCart() {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartFn() {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartBtn?.addEventListener('click', openCart);
  closeCart?.addEventListener('click', closeCartFn);
  cartOverlay?.addEventListener('click', closeCartFn);
  continueShopping?.addEventListener('click', closeCartFn);

  // Init UI
  Cart.updateCartUI();
});

// ==============================
// Toast Notification
// ==============================
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==============================
// Wishlist (localStorage)
// ==============================
function toggleWishlist(id, btn) {
  let wl = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
  if (wl.includes(id)) {
    wl = wl.filter(x => x !== id);
    btn?.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wl.push(id);
    btn?.classList.add('active');
    showToast('Added to wishlist ♥', 'success');
  }
  localStorage.setItem('luxe_wishlist', JSON.stringify(wl));
}

// ==============================
// Quick Add (picks first size/color)
// ==============================
function quickAdd(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const size = product.sizes[0];
  const color = product.colors[0];
  Cart.addItem(productId, size, color, 1);
}
