from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    main_menu = serializers.StringRelatedField()
    main_menu_sub = serializers.StringRelatedField()
    main_menu_leaf = serializers.StringRelatedField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'image_url', 'stock',
            'main_menu', 'main_menu_sub', 'main_menu_leaf',
            'status', 'rating', 'created_at', 'updated_at'
        ]
