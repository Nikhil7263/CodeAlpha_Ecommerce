from django.db import models
from django.contrib.auth.models import AbstractUser


# ==============================
# Custom User
# ==============================
class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# ==============================
# Product
# ==============================
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    BADGE_CHOICES = [
        ('new', 'New'),
        ('sale', 'Sale'),
        ('hot', 'Hot'),
        ('', 'None'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField()
    details = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    badge = models.CharField(max_length=10, choices=BADGE_CHOICES, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.IntegerField(default=0)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def discount_percent(self):
        if self.original_price and self.original_price > self.price:
            return round((1 - float(self.price) / float(self.original_price)) * 100)
        return None


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} — image {self.order}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=20, blank=True)
    color = models.CharField(max_length=20, blank=True)        # hex
    color_name = models.CharField(max_length=50, blank=True)
    stock = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.product.name} — {self.size} {self.color_name}"


# ==============================
# Order
# ==============================
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    SHIPPING_CHOICES = [
        ('standard', 'Standard (Free, 5–7 days)'),
        ('express', 'Express ($12, 2–3 days)'),
        ('overnight', 'Overnight ($25, next day)'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Contact
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)

    # Shipping address
    ship_name = models.CharField(max_length=200)
    ship_address = models.CharField(max_length=300)
    ship_city = models.CharField(max_length=100)
    ship_state = models.CharField(max_length=100, blank=True)
    ship_zip = models.CharField(max_length=20)
    ship_country = models.CharField(max_length=100, default='US')
    ship_method = models.CharField(max_length=20, choices=SHIPPING_CHOICES, default='standard')

    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    # Payment (never store real card data!)
    payment_method = models.CharField(max_length=50, blank=True)   # e.g. "Visa ****4242"

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number} — {self.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)   # snapshot
    size = models.CharField(max_length=20, blank=True)
    color_name = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price at purchase
    quantity = models.IntegerField(default=1)

    @property
    def line_total(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity}× {self.product_name} in {self.order}"
