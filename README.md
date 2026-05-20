# LUXE E-Commerce Store

A professional, full-stack e-commerce application built for the CodeAlpha internship project.

---

## Project Structure

```
ecommerce/
├── index.html          # Homepage — product listings with filter & search
├── product.html        # Product detail page
├── login.html          # Login & Registration
├── checkout.html       # Multi-step checkout
├── static/
│   ├── css/
│   │   └── main.css    # Full design system (dark luxury theme)
│   └── js/
│       ├── data.js     # Product data + helper functions
│       ├── cart.js     # Cart management (localStorage)
│       ├── main.js     # Homepage: filter, sort, search
│       ├── product.js  # Product detail: gallery, variants, add to cart
│       ├── auth.js     # Login/Register with validation
│       └── checkout.js # 3-step checkout + order processing
└── backend/            # Django REST API
    ├── requirements.txt
    ├── manage.py
    ├── luxe/
    │   ├── settings.py
    │   └── urls.py
    └── store/
        ├── models.py   # User, Product, Category, Order, OrderItem
        ├── views.py    # REST API views
        ├── urls.py     # API routes
        └── admin.py    # Django admin
```

---

## Features

### Frontend
- **Product Listings** — 12 products with category filter, sort, and live search
- **Product Detail** — Image gallery, size/colour selector, qty picker, accordion info
- **Shopping Cart** — Persistent sidebar cart with qty controls (localStorage)
- **User Auth** — Registration + login with validation and password strength meter
- **Checkout** — 3-step flow: Shipping → Payment → Review → Confirmation
- **Promo Codes** — `LUXE10`, `SAVE20`, `WELCOME`
- **Wishlist** — Save products (localStorage)
- **Quick Add** — One-click add from product grid
- **Toast Notifications** — Success/error feedback

### Backend (Django REST API)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products (filter, sort, search) |
| GET | `/api/products/<id>/` | Product detail |
| GET | `/api/products/<id>/related/` | Related products |
| GET | `/api/categories/` | All categories |
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Sign in |
| POST | `/api/auth/logout/` | Sign out |
| GET | `/api/auth/me/` | Current user |
| POST | `/api/orders/` | Place order |
| GET | `/api/orders/my/` | User's order history |
| GET | `/api/orders/<number>/` | Order detail |

### Database Models
- **User** — Extended Django user with phone field
- **Category** — Product categories with slugs
- **Product** — Full product with badge, rating, discount
- **ProductImage** — Multiple images per product
- **ProductVariant** — Size + colour variants with stock
- **Order** — Full order with shipping + payment snapshot
- **OrderItem** — Line items with price snapshot

---

## Quick Start

### Frontend Only (No backend needed)

Simply open `index.html` in a browser or serve with any static file server:

```bash
# Python
python -m http.server 5500

# Node.js
npx serve .

# VS Code
# Install "Live Server" extension, right-click index.html → "Open with Live Server"
```

### Demo Credentials
- **Email:** demo@luxe.com
- **Password:** demo1234

---

### Django Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create superuser (for admin panel)
python manage.py createsuperuser

# 6. Start development server
python manage.py runserver

# API is now available at http://localhost:8000/api/
# Admin panel at http://localhost:8000/admin/
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0d0d0d` |
| Accent (Gold) | `#c9a96e` |
| Text | `#f5f0e8` |
| Display Font | Cormorant Garamond |
| Body Font | DM Sans |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python 3.11+, Django 4.2 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | Django sessions + custom User model |
| Styling | Custom CSS with CSS variables |

---

## Production Checklist

- [ ] Set `DEBUG = False` in settings.py
- [ ] Change `SECRET_KEY` to a random value (use environment variables)
- [ ] Switch to PostgreSQL database
- [ ] Set up HTTPS/SSL
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set up proper media file hosting (AWS S3, Cloudflare R2)
- [ ] Use real payment gateway (Stripe, Razorpay, PayPal)
- [ ] Configure email backend for order confirmations

---
## Author
Nikhil

