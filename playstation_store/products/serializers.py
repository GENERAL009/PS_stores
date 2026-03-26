from rest_framework import serializers
from .models import Category, Product, Accessory, Game, ProductImage, Comment
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='uuid', read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name']

class AccessorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessory
        fields = ['color']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['genre', 'platform']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='uuid', read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    accessory = AccessorySerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'model', 'description', 'price', 'stock', 'category', 'category_id', 'images', 'comments', 'accessory', 'game', 'created_at']
