// ==============================
// LUXE — Product Detail Page
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = getProductById(id);

  if (!product) {
    document.getElementById('productDetail').innerHTML = `
      <div style="padding:4rem 0; text-align:center; color:var(--text-muted);">
        <p>Product not found.</p>
        <a href="index.html" class="btn-primary" style="margin-top:1rem; display:inline-block;">Back to Shop</a>
      </div>`;
    return;
  }

  // Breadcrumb
  document.getElementById('breadcrumbName').textContent = product.name;
  document.title = `${product.name} — LUXE`;

  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  let selectedColorName = product.colorNames?.[0] || '';
  let qty = 1;
  let activeImg = 0;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function renderDetail() {
    document.getElementById('productDetail').innerHTML = `
      <!-- Gallery -->
      <div class="product-gallery">
        <div class="main-image-wrap" id="mainImgWrap">
          <img id="mainImg" src="${product.images[0]}" alt="${product.name}"/>
        </div>
        <div class="gallery-thumbs">
          ${product.images.map((img, i) => `
            <div class="thumb-wrap ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="switchImage(${i})">
              <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy"/>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="detail-info">
        <div class="detail-category">${product.category}</div>
        <h1 class="detail-name">${product.name}</h1>

        <div class="detail-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-count">${product.rating} · <span class="review-count">${product.reviews} reviews</span></span>
        </div>

        <div class="detail-price">
          <span class="detail-price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="detail-price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount ? `<span class="price-save">Save ${discount}%</span>` : ''}
        </div>

        <!-- Color -->
        <div class="detail-option-label">Colour — <span id="colorLabel">${selectedColorName}</span></div>
        <div class="color-options">
          ${product.colors.map((c, i) => `
            <div class="color-swatch ${i === 0 ? 'selected' : ''}"
              style="background:${c}"
              title="${product.colorNames?.[i] || c}"
              onclick="selectColor('${c}', '${product.colorNames?.[i] || c}', this)">
            </div>
          `).join('')}
        </div>

        <!-- Size -->
        ${product.sizes[0] !== 'One Size' && product.sizes[0] !== 'Set of 3' ? `
        <div class="detail-option-label">Size — <span id="sizeLabel">${selectedSize}</span></div>
        <div class="size-options">
          ${product.sizes.map((s, i) => `
            <button class="size-btn ${i === 0 ? 'selected' : ''}" onclick="selectSize('${s}', this)">${s}</button>
          `).join('')}
        </div>
        ` : ''}

        <!-- Qty -->
        <div class="detail-option-label">Quantity</div>
        <div class="qty-selector">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-value" id="qtyDisplay">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>

        <!-- CTAs -->
        <button class="btn-primary add-to-cart-btn" onclick="addToCartDetail()">
          Add to Cart — ${formatPrice(product.price)}
        </button>
        <button class="wishlist-btn" id="wishlistBtn" onclick="toggleWishlistDetail()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Save to Wishlist
        </button>

        <!-- Features -->
        <div class="detail-features">
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Free shipping on orders over $100
          </div>
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Free returns within 30 days
          </div>
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure checkout with SSL encryption
          </div>
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Delivered in 5–7 business days
          </div>
        </div>

        <!-- Accordion -->
        <div class="detail-accordion">
          ${[
            ['Description', product.description],
            ['Product Details', product.details],
            ['Care Instructions', 'Please follow the care instructions on the label. When in doubt, dry clean for best results. Store folded or hung in a cool, dry place away from direct sunlight.'],
            ['Shipping & Returns', 'Free standard shipping on orders over $100. Express and overnight options available at checkout. Returns accepted within 30 days in original condition.']
          ].map(([title, body], i) => `
            <div class="accordion-item ${i === 0 ? 'open' : ''}">
              <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>${title}</span>
                <span class="accordion-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </div>
              <div class="accordion-body"><p>${body}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Check wishlist
    const wl = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    if (wl.includes(product.id)) {
      document.getElementById('wishlistBtn')?.classList.add('active');
    }
  }

  renderDetail();

  // Related products
  const related = getRelatedProducts(id, 4);
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid && related.length > 0) {
    relatedGrid.innerHTML = related.map((p, i) => renderProductCard(p, i * 80)).join('');
  }

  // Expose functions
  window.switchImage = (idx) => {
    activeImg = idx;
    document.getElementById('mainImg').src = product.images[idx];
    document.querySelectorAll('.thumb-wrap').forEach((t, i) => t.classList.toggle('active', i === idx));
  };

  window.selectSize = (size, btn) => {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('sizeLabel').textContent = size;
  };

  window.selectColor = (color, name, el) => {
    selectedColor = color;
    selectedColorName = name;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('colorLabel').textContent = name;
  };

  window.changeQty = (delta) => {
    qty = Math.max(1, Math.min(qty + delta, 10));
    document.getElementById('qtyDisplay').textContent = qty;
  };

  window.addToCartDetail = () => {
    Cart.addItem(product.id, selectedSize, selectedColor, qty);
    // Open cart
    document.getElementById('cartSidebar')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.toggleAccordion = (header) => {
    const item = header.parentElement;
    item.classList.toggle('open');
  };

  window.toggleWishlistDetail = () => {
    const wl = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    const btn = document.getElementById('wishlistBtn');
    if (wl.includes(product.id)) {
      const updated = wl.filter(x => x !== product.id);
      localStorage.setItem('luxe_wishlist', JSON.stringify(updated));
      btn?.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      wl.push(product.id);
      localStorage.setItem('luxe_wishlist', JSON.stringify(wl));
      btn?.classList.add('active');
      showToast('Saved to wishlist ♥', 'success');
    }
  };

  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });
});
