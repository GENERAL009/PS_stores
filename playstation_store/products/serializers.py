from rest_framework import serializers
from .models import Category, Product, Accessory, Game, ProductImage, Comment
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

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
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    accessory = AccessorySerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
