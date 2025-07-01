from rest_framework import serializers
from .models import ProductCategory, FilterType, FilterValue, Product

class FilterValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterValue
        fields = ['id', 'name', 'sort_order', 'is_active']

class FilterTypeSerializer(serializers.ModelSerializer):
    values = FilterValueSerializer(many=True, read_only=True)

    class Meta:
        model = FilterType
        fields = ['id', 'name', 'display_name', 'sort_order', 'is_active', 'values']

class ProductCategorySerializer(serializers.ModelSerializer):
    filter_types = FilterTypeSerializer(many=True, read_only=True)

    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'parent', 'depth', 'filter_types']

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    filter_values = FilterValueSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'stock', 'price', 'discount_price', 'main_image_url',
            'is_rocket', 'is_free_shipping', 'delivery_expect', 'avg_rating',
            'review_count', 'max_point', 'sales_count', 'discount_rate',
            'category', 'filter_values', 'is_active'
        ]
