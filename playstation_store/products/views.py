from rest_framework import viewsets, permissions
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    from rest_framework.decorators import action
    from rest_framework.response import Response
    from rest_framework import status

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comment(self, request, pk=None):
        product = self.get_object()
        text = request.data.get('text')
        if not text:
            return self.Response({'error': 'Comment text required'}, status=self.status.HTTP_400_BAD_REQUEST)
        from .models import Comment
        Comment.objects.create(product=product, user=request.user, text=text)
        return self.Response({'status': 'Comment added'})

    def create(self, request, *args, **kwargs):
        from rest_framework.response import Response
        from rest_framework import status
        from .models import ProductImage
        response = super().create(request, *args, **kwargs)
        product = Product.objects.get(id=response.data['id'])
        for f in request.FILES.getlist('uploaded_images'):
            ProductImage.objects.create(product=product, image=f)
        return response

    def update(self, request, *args, **kwargs):
        from .models import ProductImage
        response = super().update(request, *args, **kwargs)
        product = self.get_object()
        if request.FILES.getlist('uploaded_images'):
            product.images.all().delete()
            for f in request.FILES.getlist('uploaded_images'):
                ProductImage.objects.create(product=product, image=f)
        return response
