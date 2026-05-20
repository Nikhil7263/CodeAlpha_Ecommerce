from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Product, ProductImage, ProductVariant, Order, OrderItem


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 2


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'original_price', 'badge', 'rating', 'in_stock', 'featured')
    list_filter = ('category', 'badge', 'in_stock', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVariantInline]
    list_editable = ('in_stock', 'featured', 'price')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'size', 'color_name', 'price', 'quantity')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'email', 'ship_name', 'total', 'status', 'created_at')
    list_filter = ('status', 'ship_method', 'created_at')
    search_fields = ('order_number', 'email', 'ship_name')
    readonly_fields = ('order_number', 'subtotal', 'shipping_cost', 'discount_amount', 'total', 'created_at')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    ordering = ('-created_at',)
