from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.CartView.as_view(), name='cart-add'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('payment-intent/', views.CreatePaymentIntentView.as_view(), name='payment-intent'),
    path('uzum/initialize/', views.UzumInitializePaymentView.as_view(), name='uzum-initialize'),
    path('uzum/verify/', views.UzumVerifyPaymentView.as_view(), name='uzum-verify'),
    path('stats/', views.SalesStatsView.as_view(), name='sales-stats'),
]
