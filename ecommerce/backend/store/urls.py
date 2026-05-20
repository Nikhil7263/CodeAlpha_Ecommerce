from django.urls import path
from . import views

urlpatterns = [
    # Products
    path('products/',                     views.product_list,      name='product-list'),
    path('products/<int:pk>/',            views.product_detail,    name='product-detail'),
    path('products/<int:pk>/related/',    views.related_products,  name='product-related'),
    path('categories/',                   views.category_list,     name='category-list'),

    # Auth
    path('auth/register/',  views.register_view,  name='auth-register'),
    path('auth/login/',     views.login_view,      name='auth-login'),
    path('auth/logout/',    views.logout_view,     name='auth-logout'),
    path('auth/me/',        views.me_view,         name='auth-me'),

    # Orders
    path('orders/',                      views.create_order,   name='order-create'),
    path('orders/my/',                   views.order_list,     name='order-list'),
    path('orders/<str:order_number>/',   views.order_detail,   name='order-detail'),
]
