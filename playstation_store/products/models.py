from django.db import models
from django.conf import settings
import uuid

class Category(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=10)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.model}"

class Comment(models.Model):
    product = models.ForeignKey(Product, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.get_full_name()} on {self.product.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')

    def __str__(self):
        return f"Image for {self.product.name}"

class Accessory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    color = models.CharField(max_length=50)
    
    class Meta:
        verbose_name_plural = "Accessories"

    def __str__(self):
        return f"{self.product.name} (Accessory)"

class Game(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    genre = models.CharField(max_length=100)
    platform = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.product.name} (Game)"
