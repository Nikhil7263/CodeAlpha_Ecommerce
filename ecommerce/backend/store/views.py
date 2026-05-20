import uuid
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Product, Category, Order, OrderItem, User


# ==============================
# Helpers
# ==============================
def json_response(data, status=200):
    return JsonResponse(data, status=status, safe=False)

def error(msg, status=400):
    return JsonResponse({"error": msg}, status=status)

def product_to_dict(p, detail=False):
    images = [img.url for img in p.images.all()]
    base = {
        "id": p.id,
        "name": p.name,
        "slug": p.slug,
        "category": p.category.slug if p.category else None,
        "price": str(p.price),
        "originalPrice": str(p.original_price) if p.original_price else None,
        "badge": p.badge,
        "rating": float(p.rating),
        "reviews": p.review_count,
        "inStock": p.in_stock,
        "featured": p.featured,
        "images": images,
    }
    if detail:
        variants = p.variants.all()
        base.update({
            "description": p.description,
            "details": p.details,
            "sizes": list(set(v.size for v in variants if v.size)),
            "colors": list(set(v.color for v in variants if v.color)),
            "colorNames": list({v.color_name for v in variants if v.color_name}),
        })
    return base


# ==============================
# Products
# ==============================
def product_list(request):
    """GET /api/products/?category=clothing&sort=price-asc&q=search"""
    qs = Product.objects.filter(in_stock=True).prefetch_related('images', 'variants').select_related('category')

    cat = request.GET.get('category')
    if cat and cat != 'all':
        qs = qs.filter(category__slug=cat)

    q = request.GET.get('q')
    if q:
        qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q) | Q(category__name__icontains=q))

    sort = request.GET.get('sort', 'default')
    sort_map = {
        'price-asc': 'price',
        'price-desc': '-price',
        'name': 'name',
        'default': '-featured',
    }
    qs = qs.order_by(sort_map.get(sort, '-featured'))

    return json_response([product_to_dict(p) for p in qs])


def product_detail(request, pk):
    """GET /api/products/<id>/"""
    try:
        p = Product.objects.prefetch_related('images', 'variants').select_related('category').get(pk=pk)
    except Product.DoesNotExist:
        return error("Product not found", 404)
    return json_response(product_to_dict(p, detail=True))


def related_products(request, pk):
    """GET /api/products/<id>/related/"""
    try:
        p = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return error("Product not found", 404)

    related = Product.objects.filter(category=p.category, in_stock=True).exclude(pk=pk)\
        .prefetch_related('images').select_related('category')[:4]
    return json_response([product_to_dict(r) for r in related])


def category_list(request):
    """GET /api/categories/"""
    cats = Category.objects.all()
    return json_response([{"id": c.id, "name": c.name, "slug": c.slug} for c in cats])


# ==============================
# Auth
# ==============================
@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    """POST /api/auth/register/"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return error("Invalid JSON")

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    first = data.get('firstName', '').strip()
    last = data.get('lastName', '').strip()

    if not email or not password or not first:
        return error("Email, password and first name are required")
    if len(password) < 8:
        return error("Password must be at least 8 characters")
    if User.objects.filter(email=email).exists():
        return error("An account with this email already exists")

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=first,
        last_name=last,
        phone=data.get('phone', '')
    )
    login(request, user)
    return json_response({
        "success": True,
        "user": {"id": user.id, "email": user.email, "name": user.get_full_name()}
    }, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """POST /api/auth/login/"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return error("Invalid JSON")

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = authenticate(request, username=email, password=password)
    if not user:
        return error("Invalid email or password", 401)

    login(request, user)
    return json_response({
        "success": True,
        "user": {"id": user.id, "email": user.email, "name": user.get_full_name()}
    })


@require_http_methods(["POST"])
def logout_view(request):
    """POST /api/auth/logout/"""
    logout(request)
    return json_response({"success": True})


def me_view(request):
    """GET /api/auth/me/"""
    if not request.user.is_authenticated:
        return error("Not authenticated", 401)
    u = request.user
    return json_response({"id": u.id, "email": u.email, "name": u.get_full_name()})


# ==============================
# Orders
# ==============================
@csrf_exempt
@require_http_methods(["POST"])
def create_order(request):
    """POST /api/orders/"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return error("Invalid JSON")

    # Validate
    required = ['email', 'shipName', 'shipAddress', 'shipCity', 'shipZip', 'items']
    for field in required:
        if not data.get(field):
            return error(f"Missing required field: {field}")

    items_data = data.get('items', [])
    if not items_data:
        return error("Order must have at least one item")

    # Calculate totals
    subtotal = 0
    order_items = []
    for item in items_data:
        try:
            product = Product.objects.get(pk=item['id'])
        except Product.DoesNotExist:
            return error(f"Product {item['id']} not found")

        qty = int(item.get('quantity', 1))
        line_price = float(product.price) * qty
        subtotal += line_price
        order_items.append({
            "product": product,
            "name": product.name,
            "size": item.get('size', ''),
            "color_name": item.get('colorName', ''),
            "price": float(product.price),
            "quantity": qty,
        })

    shipping_costs = {'standard': 0, 'express': 12, 'overnight': 25}
    ship_method = data.get('shipMethod', 'standard')
    shipping_cost = shipping_costs.get(ship_method, 0)

    discount_pct = 0
    promo = data.get('promoCode', '').upper()
    PROMO_CODES = {'LUXE10': 0.10, 'SAVE20': 0.20, 'WELCOME': 0.15}
    if promo in PROMO_CODES:
        discount_pct = PROMO_CODES[promo]
    discount_amount = subtotal * discount_pct
    total = subtotal + shipping_cost - discount_amount

    # Create order
    order_number = 'LX' + uuid.uuid4().hex[:8].upper()
    order = Order.objects.create(
        order_number=order_number,
        user=request.user if request.user.is_authenticated else None,
        email=data['email'],
        phone=data.get('phone', ''),
        ship_name=data['shipName'],
        ship_address=data['shipAddress'],
        ship_city=data['shipCity'],
        ship_state=data.get('shipState', ''),
        ship_zip=data['shipZip'],
        ship_country=data.get('shipCountry', 'US'),
        ship_method=ship_method,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        discount_amount=discount_amount,
        total=total,
        payment_method=data.get('paymentMethod', ''),
        status='confirmed',
    )

    for item in order_items:
        OrderItem.objects.create(
            order=order,
            product=item['product'],
            product_name=item['name'],
            size=item['size'],
            color_name=item['color_name'],
            price=item['price'],
            quantity=item['quantity'],
        )

    return json_response({
        "success": True,
        "orderNumber": order.order_number,
        "total": str(order.total),
        "email": order.email,
    }, status=201)


@login_required
def order_list(request):
    """GET /api/orders/ — user's orders"""
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    data = []
    for o in orders:
        data.append({
            "orderNumber": o.order_number,
            "status": o.status,
            "total": str(o.total),
            "date": o.created_at.isoformat(),
            "items": [
                {"name": i.product_name, "qty": i.quantity, "price": str(i.price)}
                for i in o.items.all()
            ]
        })
    return json_response(data)


def order_detail(request, order_number):
    """GET /api/orders/<order_number>/"""
    try:
        o = Order.objects.prefetch_related('items').get(order_number=order_number)
    except Order.DoesNotExist:
        return error("Order not found", 404)

    # Allow access if logged in as owner or if anonymous (link-based tracking)
    if request.user.is_authenticated and o.user and o.user != request.user:
        return error("Forbidden", 403)

    return json_response({
        "orderNumber": o.order_number,
        "status": o.status,
        "email": o.email,
        "shipName": o.ship_name,
        "shipAddress": f"{o.ship_address}, {o.ship_city}, {o.ship_state} {o.ship_zip}",
        "shipMethod": o.ship_method,
        "subtotal": str(o.subtotal),
        "shippingCost": str(o.shipping_cost),
        "discountAmount": str(o.discount_amount),
        "total": str(o.total),
        "date": o.created_at.isoformat(),
        "items": [
            {
                "name": i.product_name,
                "size": i.size,
                "colorName": i.color_name,
                "price": str(i.price),
                "quantity": i.quantity,
                "lineTotal": str(i.line_total),
            }
            for i in o.items.all()
        ]
    })
