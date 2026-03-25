from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Cart, CartItem, Order, OrderItem
from products.models import Category, Product

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    change_list_template = "admin/orders/order/change_list.html"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_site.admin_view(self.dashboard_view), name='order-dashboard'),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        period = request.GET.get('period', '30')
        selected_category = request.GET.get('category')
        
        try:
            days = int(period)
        except ValueError:
            days = 30
            
        start_date = timezone.now() - timedelta(days=days)
        
        # Base queryset for order items in the period
        order_items = OrderItem.objects.filter(order__created_at__gte=start_date)
        
        if selected_category:
            order_items = order_items.filter(product__category_id=selected_category)
            
        # Sales by Product
        products_sold = order_items.values('product__name', 'product__category__name') \
            .annotate(total_sold=Sum('quantity')) \
            .order_by('-total_sold')[:20]
            
        max_sold = products_sold[0]['total_sold'] if products_sold else 1
        for item in products_sold:
            item['percentage'] = (item['total_sold'] / max_sold) * 100
            
        # Sales by Category (for the sidebar)
        categories_stats = Category.objects.annotate(
            total_sales=Sum('product__orderitem__quantity', filter=Q(product__orderitem__order__created_at__gte=start_date))
        ).order_by('-total_sales')

        context = {
            **self.admin_site.each_context(request),
            'title': 'Sales Analytics Dashboard',
            'period': period,
            'selected_category': selected_category,
            'products': products_sold,
            'categories': categories_stats,
            'cl': {'opts': self.model._meta}, # For breadcrumbs
        }
        return TemplateResponse(request, "admin/orders/dashboard.html", context)

# Register models
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order, OrderAdmin)
