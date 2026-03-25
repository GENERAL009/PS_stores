from rest_framework import views, response, status, permissions
from .models import Cart, CartItem, Order
from .serializers import CartSerializer, OrderSerializer
from products.models import Product, Category
import stripe
from django.conf import settings
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
import requests
from requests.auth import HTTPBasicAuth
import time

stripe.api_key = settings.STRIPE_SECRET_KEY

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return response.Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return response.Response({'error': 'product_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return response.Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        
        return response.Response({'message': 'Added to cart'})

class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.db import transaction
        from .models import OrderItem
        
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.cartitem_set.all()
        if not items:
            return response.Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for item in items:
                    if item.product.stock < item.quantity:
                        return response.Response({
                            'error': f'Not enough stock for {item.product.name}. Only {item.product.stock} left.'
                        }, status=status.HTTP_400_BAD_REQUEST)

                total = sum([item.product.price * item.quantity for item in items])
                order = Order.objects.create(user=request.user, total_price=total, status='completed')

                for item in items:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price=item.product.price
                    )
                    item.product.stock -= item.quantity
                    item.product.save()

                cart.cartitem_set.all().delete()
                
                return response.Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return response.Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreatePaymentIntentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.cartitem_set.all()
        if not items:
            return response.Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum([item.product.price * item.quantity for item in items])
        
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),
                currency='usd',
                metadata={'order_id': f'cart_{cart.id}'}
            )
            return response.Response({
                'clientSecret': intent.client_secret
            })
        except Exception as e:
            return response.Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UzumInitializePaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.cartitem_set.exists():
            return response.Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum([item.product.price * item.quantity for item in cart.cartitem_set.all()])
        
        payload = {
            "serviceId": settings.UZUM_SERVICE_ID,
            "amount": int(total_amount * 100),
            "timestamp": int(time.time() * 1000),
            "params": {
                "order_id": str(cart.id),
                "card_number": request.data.get('card_number'),
                "expiry": request.data.get('expiry')
            }
        }

        if settings.UZUM_LOGIN == 'mock_login':
            import uuid
            transaction_id = str(uuid.uuid4())
            request.session['uzum_transaction_id'] = transaction_id
            return response.Response({
                'status': 'success',
                'transaction_id': transaction_id,
                'message': 'MOCK: SMS code sent'
            })

        try:
            res = requests.post(
                f"{settings.UZUM_BASE_URL}/payment/initialize",
                json=payload,
                auth=HTTPBasicAuth(settings.UZUM_LOGIN, settings.UZUM_PASSWORD),
                timeout=10
            )
            data = res.json()
            if res.status_code == 200 and data.get('status') == 'success':
                transaction_id = data.get('paymentId') or data.get('transactionId')
                request.session['uzum_transaction_id'] = transaction_id
                return response.Response({
                    'status': 'success',
                    'transaction_id': transaction_id,
                    'message': 'SMS code sent successfully'
                })
            else:
                return response.Response({'error': data.get('message', 'Uzum API error')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response({'error': f'Connection error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UzumVerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        otp_code = request.data.get('otp_code')
        transaction_id = request.data.get('transaction_id')
        
        if not otp_code or not transaction_id:
            return response.Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)

        if settings.UZUM_LOGIN == 'mock_login':
            if len(otp_code) == 6:
                checkout_view = CheckoutView()
                return checkout_view.post(request)
            return response.Response({'error': 'Invalid mock OTP'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            "paymentId": transaction_id,
            "otp": otp_code
        }

        try:
            res = requests.post(
                f"{settings.UZUM_BASE_URL}/payment/confirm",
                json=payload,
                auth=HTTPBasicAuth(settings.UZUM_LOGIN, settings.UZUM_PASSWORD),
                timeout=10
            )
            data = res.json()
            if res.status_code == 200 and data.get('status') == 'success':
                checkout_view = CheckoutView()
                return checkout_view.post(request)
            else:
                return response.Response({'error': data.get('message', 'OTP verification failed')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response({'error': f'Connection error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SalesStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        period = request.GET.get('period', '30')
        selected_category = request.GET.get('category')
        
        try:
            days = int(period)
        except ValueError:
            days = 30
            
        start_date = timezone.now() - timedelta(days=days)
        
        from .models import OrderItem
        order_items = OrderItem.objects.filter(order__created_at__gte=start_date)
        
        if selected_category:
            order_items = order_items.filter(product__category_id=selected_category)
            
        products_sold = list(order_items.values('product__id', 'product__name', 'product__category__name') 
            .annotate(total_sold=Sum('quantity')) 
            .order_by('-total_sold')[:20])
            
        categories_stats = list(Category.objects.annotate(
            total_sales=Sum('product__orderitem__quantity', filter=Q(product__orderitem__order__created_at__gte=start_date))
        ).values('id', 'name', 'total_sales').order_by('-total_sales'))

        return response.Response({
            'period': period,
            'products': products_sold,
            'categories': categories_stats
        })
