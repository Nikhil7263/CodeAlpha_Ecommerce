// ==============================
// LUXE — Product Data Store
// ==============================

const PRODUCTS = [
  {
    id: 1,
    name: "Merino Wool Overcoat",
    category: "clothing",
    price: 389,
    originalPrice: 520,
    badge: "sale",
    rating: 4.8,
    reviews: 124,
    description: "A masterpiece of tailoring, this overcoat is crafted from pure Merino wool sourced from the finest farms in New Zealand. The relaxed silhouette and clean lines make it the definitive piece for the modern wardrobe.",
    details: "100% Merino Wool. Dry clean only. Imported. Model is 6'1\" wearing size M.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#2c2c2c", "#8b7355", "#1a3a2a", "#c2b280"],
    colorNames: ["Charcoal", "Camel", "Forest", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"
    ],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Silk Slip Dress",
    category: "clothing",
    price: 245,
    originalPrice: null,
    badge: "new",
    rating: 4.9,
    reviews: 87,
    description: "Effortlessly elegant, this bias-cut silk slip dress drapes beautifully over the body. A timeless silhouette that transitions seamlessly from day to evening.",
    details: "100% Pure Silk. Hand wash cold. Imported. Model is 5'9\" wearing size S.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#d4af8a", "#1a1a2e", "#8b0000", "#2d5a27"],
    colorNames: ["Champagne", "Midnight", "Burgundy", "Emerald"],
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
    ],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Leather Tote Bag",
    category: "accessories",
    price: 425,
    originalPrice: null,
    badge: "hot",
    rating: 4.7,
    reviews: 203,
    description: "Hand-stitched from full-grain vegetable-tanned leather, this tote only gets better with age. Spacious enough for everything you need, refined enough for any occasion.",
    details: "Full-grain vegetable-tanned leather. Brass hardware. Interior suede lining. Dimensions: 15\" x 12\" x 5\".",
    sizes: ["One Size"],
    colors: ["#4a2e19", "#1a1a1a", "#c2a47e", "#2d4a3e"],
    colorNames: ["Cognac", "Black", "Tan", "Forest"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80"
    ],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Cashmere Turtleneck",
    category: "clothing",
    price: 195,
    originalPrice: 260,
    badge: "sale",
    rating: 4.6,
    reviews: 156,
    description: "Woven from Grade-A Mongolian cashmere, this turtleneck is impossibly soft and featherlight. A wardrobe essential that elevates any outfit.",
    details: "100% Grade-A Mongolian Cashmere. Dry clean or hand wash cold. Imported.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#f5e6d3", "#3d3d3d", "#8b6f47", "#2c4a6e"],
    colorNames: ["Ivory", "Charcoal", "Camel", "Navy"],
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Leather Chelsea Boots",
    category: "footwear",
    price: 340,
    originalPrice: null,
    badge: "new",
    rating: 4.8,
    reviews: 91,
    description: "Crafted in a storied Portuguese atelier, these Chelsea boots combine classic silhouette with modern comfort. Goodyear-welted construction ensures decades of wear.",
    details: "Upper: Full-grain calf leather. Sole: Leather with rubber heel. Goodyear welt construction. Made in Portugal.",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["#1a1a1a", "#4a2e19", "#8b7355"],
    colorNames: ["Black", "Dark Brown", "Tan"],
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&q=80",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&q=80"
    ],
    inStock: true,
    featured: true
  },
  {
    id: 6,
    name: "Linen Blazer",
    category: "clothing",
    price: 285,
    originalPrice: null,
    badge: null,
    rating: 4.5,
    reviews: 67,
    description: "Tailored from premium Italian linen, this unstructured blazer is the perfect warm-weather layer. Slightly oversized fit for a relaxed, contemporary look.",
    details: "100% Italian Linen. Dry clean recommended. Unlined. Imported. Model is 6'0\" wearing size M.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#e8e0d0", "#3d4a3e", "#8b8b7a", "#1a1a1a"],
    colorNames: ["Oat", "Sage", "Stone", "Black"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4d7b?w=600&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 7,
    name: "Gold Chain Necklace",
    category: "accessories",
    price: 180,
    originalPrice: null,
    badge: "new",
    rating: 4.9,
    reviews: 312,
    description: "Handcrafted from 18k gold-plated sterling silver, this chain necklace is designed to be worn alone or layered. Hypoallergenic and tarnish-resistant.",
    details: "18k gold-plated 925 sterling silver. Length: 18\". Lobster claw clasp. Hypoallergenic.",
    sizes: ["16\"", "18\"", "20\"", "22\""],
    colors: ["#c9a96e", "#c0c0c0"],
    colorNames: ["Gold", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94815b2?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "Ceramic Vase Set",
    category: "home",
    price: 120,
    originalPrice: 160,
    badge: "sale",
    rating: 4.7,
    reviews: 48,
    description: "Hand-thrown by artisans in Kyoto, this set of three ceramic vases brings sculptural beauty to any space. Each piece is unique with subtle natural variations.",
    details: "Hand-thrown stoneware. Food safe glaze. Set of 3: Small (4\"), Medium (7\"), Large (10\"). Dishwasher safe.",
    sizes: ["Set of 3"],
    colors: ["#e8e0d0", "#6b7c7a", "#2c2c2c"],
    colorNames: ["Matte White", "Sage Green", "Charcoal"],
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80",
      "https://images.unsplash.com/photo-1490312278390-ab64016b5873?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 9,
    name: "Suede Loafers",
    category: "footwear",
    price: 265,
    originalPrice: null,
    badge: null,
    rating: 4.6,
    reviews: 73,
    description: "A contemporary take on the classic penny loafer, crafted from butter-soft suede. Comfortable from the first wear with a crepe sole for all-day support.",
    details: "Upper: Premium suede. Lining: Leather. Sole: Natural crepe. Made in Italy.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["#8b7355", "#1a1a1a", "#8b3a3a"],
    colorNames: ["Tan", "Black", "Burgundy"],
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
      "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=600&q=80",
      "https://images.unsplash.com/photo-1618898909019-010e4e234c55?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 10,
    name: "Linen Throw Blanket",
    category: "home",
    price: 95,
    originalPrice: null,
    badge: null,
    rating: 4.8,
    reviews: 139,
    description: "Stonewashed for extra softness, this oversized linen throw adds texture and warmth to any space. Gets softer with every wash.",
    details: "100% European flax linen. Pre-washed for softness. Dimensions: 55\" x 70\". Machine washable.",
    sizes: ["One Size"],
    colors: ["#e8e0d0", "#c2a47e", "#6b7c7a", "#3d3d3d"],
    colorNames: ["Natural", "Sand", "Sage", "Slate"],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    ],
    inStock: true,
    featured: false
  },
  {
    id: 11,
    name: "Structured Handbag",
    category: "accessories",
    price: 520,
    originalPrice: null,
    badge: "hot",
    rating: 4.9,
    reviews: 58,
    description: "Architectural and refined, this structured handbag is crafted from Saffiano leather with polished gold hardware. A statement piece that commands attention.",
    details: "Saffiano leather exterior. Suede interior. Gold-tone hardware. Dimensions: 10\" x 8\" x 4\". Includes dust bag.",
    sizes: ["One Size"],
    colors: ["#1a1a1a", "#c2a47e", "#8b0000"],
    colorNames: ["Black", "Camel", "Burgundy"],
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      "https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80"
    ],
    inStock: true,
    featured: true
  },
  {
    id: 12,
    name: "Tailored Trousers",
    category: "clothing",
    price: 175,
    originalPrice: null,
    badge: null,
    rating: 4.5,
    reviews: 94,
    description: "Cut from a wool-blend fabric with a perfect drape, these tailored trousers are the foundation of a polished wardrobe. A straight leg and high waist for a timeless silhouette.",
    details: "70% Wool, 25% Polyester, 5% Elastane. Dry clean recommended. Model is 5'9\" wearing size M.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#2c2c2c", "#8b8b7a", "#1a2e4a", "#1a1a1a"],
    colorNames: ["Charcoal", "Stone", "Navy", "Black"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4d7b?w=600&q=80",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80"
    ],
    inStock: true,
    featured: false
  }
];

// ==============================
// Helper functions
// ==============================

function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function getProductsByCategory(cat) {
  if (cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === cat);
}

function getRelatedProducts(id, count = 4) {
  const product = getProductById(id);
  if (!product) return [];
  return PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, count)
    .concat(PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

function formatPrice(price) {
  return '$' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) stars += '★';
    else if (i === full && half) stars += '½';
    else stars += '☆';
  }
  return stars;
}

function renderProductCard(product, delay = 0) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return `
    <div class="product-card" style="animation-delay:${delay}ms" data-id="${product.id}" data-cat="${product.category}">
      <div class="product-image-wrap" onclick="window.location.href='product.html?id=${product.id}'">
        <img class="product-img" src="${product.images[0]}" alt="${product.name}" loading="lazy"/>
        ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badge}</span>` : ''}
        <button class="product-wishlist" onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)" title="Wishlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="quick-add-btn" onclick="event.stopPropagation(); quickAdd(${product.id})">Quick Add</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name" onclick="window.location.href='product.html?id=${product.id}'">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount ? `<span class="price-save">-${discount}%</span>` : ''}
        </div>
      </div>
    </div>
  `;
}
