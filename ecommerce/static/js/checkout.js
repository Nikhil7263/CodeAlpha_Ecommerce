// ==============================
// LUXE — Checkout Logic
// ==============================

let currentStep = 1;
let shippingCost = 0;
let discountPct = 0;
let orderData = {};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutCart();
  updateSummary();
  bindShippingOptions();
  bindCardFormatting();

  // Restore session data
  const session = JSON.parse(localStorage.getItem('luxe_session') || 'null');
  if (session?.email) {
    const shipEmail = document.getElementById('shipEmail');
    if (shipEmail) shipEmail.value = session.email;
    const shipFirst = document.getElementById('shipFirst');
    if (shipFirst && session.name) {
      const parts = session.name.split(' ');
      shipFirst.value = parts[0] || '';
      const shipLast = document.getElementById('shipLast');
      if (shipLast) shipLast.value = parts.slice(1).join(' ') || '';
    }
  }

  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });
});

// ===== RENDER CART ITEMS =====
function renderCheckoutCart() {
  const cart = Cart.getCart();
  const el = document.getElementById('checkoutCartItems');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;">Your cart is empty. <a href="index.html" style="color:var(--accent);">Shop now</a></p>`;
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}" loading="lazy"/>
      <div class="checkout-item-info">
        <div class="name">${item.name}</div>
        <div class="meta">
          ${item.size !== 'One Size' ? `${item.size}` : ''}${item.colorName ? ` · ${item.colorName}` : ''} × ${item.quantity}
        </div>
      </div>
      <span class="checkout-item-price">${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');
}

// ===== UPDATE TOTALS =====
function updateSummary() {
  const subtotal = Cart.getTotal();
  const discountAmt = subtotal * discountPct;
  const total = subtotal + shippingCost - discountAmt;

  const sub = document.getElementById('summarySubtotal');
  const ship = document.getElementById('summaryShipping');
  const tot = document.getElementById('summaryTotal');
  const discRow = document.getElementById('discountRow');
  const disc = document.getElementById('summaryDiscount');

  if (sub) sub.textContent = formatPrice(subtotal);
  if (ship) ship.textContent = shippingCost === 0 ? 'Free' : formatPrice(shippingCost);
  if (tot) tot.textContent = formatPrice(total);

  if (discRow && disc) {
    if (discountPct > 0) {
      discRow.classList.remove('hidden');
      disc.textContent = `-${formatPrice(discountAmt)}`;
    } else {
      discRow.classList.add('hidden');
    }
  }
}

// ===== SHIPPING OPTIONS =====
function bindShippingOptions() {
  document.querySelectorAll('.shipping-option').forEach(opt => {
    opt.querySelector('input')?.addEventListener('change', () => {
      document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const val = opt.querySelector('input').value;
      shippingCost = val === 'express' ? 12 : val === 'overnight' ? 25 : 0;
      updateSummary();
    });
    opt.addEventListener('click', () => {
      opt.querySelector('input').checked = true;
      opt.dispatchEvent(new Event('change'));
    });
  });
}

// ===== CARD FORMATTING =====
function bindCardFormatting() {
  const cardNum = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCVV = document.getElementById('cardCVV');

  cardNum?.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = val.replace(/(.{4})/g, '$1 ').trim();

    // Detect card type
    const isVisa = /^4/.test(val);
    const isMC = /^5[1-5]/.test(val);
    document.getElementById('cardVisa')?.classList.toggle('active', isVisa);
    document.getElementById('cardMC')?.classList.toggle('active', isMC);
  });

  cardExpiry?.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) val = val.slice(0, 2) + ' / ' + val.slice(2);
    e.target.value = val;
  });

  cardCVV?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
  document.querySelectorAll('.checkout-step').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step${step}`)?.classList.remove('hidden');

  document.querySelectorAll('.checkout-steps .step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.toggle('active', n === step);
    s.classList.toggle('done', n < step);
  });

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== STEP 1: VALIDATE SHIPPING =====
document.getElementById('toStep2')?.addEventListener('click', () => {
  const first = document.getElementById('shipFirst')?.value.trim();
  const last = document.getElementById('shipLast')?.value.trim();
  const email = document.getElementById('shipEmail')?.value.trim();
  const addr = document.getElementById('shipAddr')?.value.trim();
  const city = document.getElementById('shipCity')?.value.trim();
  const zip = document.getElementById('shipZip')?.value.trim();

  if (!first || !last || !email || !addr || !city || !zip) {
    showCheckoutError('Please fill in all required fields.');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showCheckoutError('Please enter a valid email address.');
    return;
  }

  orderData.shipping = {
    name: `${first} ${last}`,
    email,
    phone: document.getElementById('shipPhone')?.value.trim(),
    address: addr,
    city,
    state: document.getElementById('shipState')?.value.trim(),
    zip,
    country: document.getElementById('shipCountry')?.value,
    method: document.querySelector('input[name="shipping"]:checked')?.value || 'standard'
  };

  goToStep(2);
});

// ===== STEP 2: VALIDATE PAYMENT =====
document.getElementById('toStep3')?.addEventListener('click', () => {
  const name = document.getElementById('cardName')?.value.trim();
  const num = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
  const expiry = document.getElementById('cardExpiry')?.value.trim();
  const cvv = document.getElementById('cardCVV')?.value.trim();

  if (!name || num.length < 16 || expiry.length < 4 || cvv.length < 3) {
    showCheckoutError('Please fill in all payment details correctly.');
    return;
  }

  orderData.payment = {
    name,
    last4: num.slice(-4),
    expiry,
    type: /^4/.test(num) ? 'Visa' : /^5[1-5]/.test(num) ? 'Mastercard' : 'Card'
  };

  renderReview();
  goToStep(3);
});

// ===== PROMO CODE =====
document.getElementById('applyPromo')?.addEventListener('click', () => {
  const code = document.getElementById('promoCode')?.value.trim().toUpperCase();
  const msg = document.getElementById('promoMsg');
  const CODES = { 'LUXE10': 0.10, 'SAVE20': 0.20, 'WELCOME': 0.15 };

  if (CODES[code]) {
    discountPct = CODES[code];
    msg.textContent = `✓ Code applied! ${Math.round(discountPct * 100)}% off`;
    msg.className = 'promo-msg success';
    updateSummary();
  } else {
    discountPct = 0;
    msg.textContent = 'Invalid promo code.';
    msg.className = 'promo-msg error';
    updateSummary();
  }
});

// ===== BACK BUTTONS =====
document.getElementById('backToStep1')?.addEventListener('click', () => goToStep(1));
document.getElementById('backToStep2')?.addEventListener('click', () => goToStep(2));

// ===== RENDER REVIEW =====
function renderReview() {
  const cart = Cart.getCart();
  const subtotal = Cart.getTotal();
  const discountAmt = subtotal * discountPct;
  const total = subtotal + shippingCost - discountAmt;
  const s = orderData.shipping;
  const p = orderData.payment;

  document.getElementById('reviewContent').innerHTML = `
    <div class="review-section">
      <h4>Shipping to</h4>
      <div class="review-row"><span>${s.name}</span></div>
      <div class="review-row"><span>${s.address}, ${s.city}${s.state ? ', ' + s.state : ''} ${s.zip}</span></div>
      <div class="review-row"><span>${s.email}</span></div>
      <div class="review-row"><span style="color:var(--accent); text-transform:capitalize;">${s.method} shipping — ${shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
    </div>

    <div class="review-section">
      <h4>Payment Method</h4>
      <div class="review-row"><span>${p.type} ending in ${p.last4}</span></div>
      <div class="review-row"><span>Expires ${p.expiry}</span></div>
    </div>

    <div class="review-section">
      <h4>Items (${cart.length})</h4>
      ${cart.map(item => `
        <div class="review-row">
          <span>${item.name} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>

    <div class="review-section">
      <h4>Order Total</h4>
      <div class="review-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="review-row"><span>Shipping</span><span>${shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
      ${discountPct > 0 ? `<div class="review-row" style="color:var(--green)"><span>Discount</span><span>-${formatPrice(discountAmt)}</span></div>` : ''}
      <div class="review-row" style="font-weight:600; font-size:1.05rem; margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border);">
        <span>Total</span><span>${formatPrice(total)}</span>
      </div>
    </div>
  `;
}

// ===== PLACE ORDER =====
document.getElementById('placeOrder')?.addEventListener('click', () => {
  const btn = document.getElementById('placeOrder');
  btn.textContent = 'Processing…';
  btn.disabled = true;

  // Simulate order processing
  setTimeout(() => {
    const orderId = 'LX' + Date.now().toString().slice(-8).toUpperCase();
    document.getElementById('orderNumber').textContent = `#${orderId}`;
    document.getElementById('orderEmail').textContent = orderData.shipping?.email || '';

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    orders.push({
      id: orderId,
      date: new Date().toISOString(),
      items: Cart.getCart(),
      total: Cart.getTotal() + shippingCost - (Cart.getTotal() * discountPct),
      shipping: orderData.shipping,
      status: 'confirmed'
    });
    localStorage.setItem('luxe_orders', JSON.stringify(orders));

    Cart.clearCart();

    document.querySelectorAll('.checkout-step').forEach(s => s.classList.add('hidden'));
    document.getElementById('stepSuccess')?.classList.remove('hidden');

    document.querySelectorAll('.checkout-steps .step').forEach(s => {
      s.classList.remove('active');
      s.classList.add('done');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1800);
});

// ===== ERROR HELPER =====
function showCheckoutError(msg) {
  const existing = document.querySelector('.checkout-error-msg');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'field-group error checkout-error-msg';
  div.textContent = msg;
  div.style.marginBottom = '1rem';

  const step = document.getElementById(`step${currentStep}`);
  const btn = step?.querySelector('button[id^="toStep"]');
  if (btn) btn.parentNode.insertBefore(div, btn);

  setTimeout(() => div.remove(), 4000);
}
