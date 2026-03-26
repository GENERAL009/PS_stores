from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Category, Product, Comment, ProductImage
from .serializers import CategorySerializer, ProductSerializer, CommentSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'uuid'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'uuid'

    def get_queryset(self):
        queryset = super().get_queryset()
        category_uuid = self.request.query_params.get('category', None)
        if category_uuid:
            queryset = queryset.filter(category__uuid=category_uuid)
        return queryset

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Note: Serializer now returns UUID as ID, look up by UUID
        product = Product.objects.get(uuid=response.data['id'])
        for f in request.FILES.getlist('uploaded_images'):
            ProductImage.objects.create(product=product, image=f)
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        product = self.get_object()
        if request.FILES.getlist('uploaded_images'):
            product.images.all().delete()
            for f in request.FILES.getlist('uploaded_images'):
                ProductImage.objects.create(product=product, image=f)
        return response

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        product_uuid = self.request.data.get('product')
        product = Product.objects.get(uuid=product_uuid)
        serializer.save(user=self.request.user, product=product)

    def create(self, request, *args, **kwargs):
        product_uuid = request.data.get('product')
        if not product_uuid:
            return Response({'error': 'Product ID required'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
