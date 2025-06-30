from rest_framework import serializers
from .models import Product
from main.models import MainMenu, MainMenuSub, MainMenuLeaf  # 외래 키 모델을 임포트

class ProductSerializer(serializers.ModelSerializer):
    # 외래 키 필드 직렬화
    main_menu = serializers.StringRelatedField()  # 문자열로 직렬화 (main_menu 객체의 __str__ 출력)
    main_menu_sub = serializers.StringRelatedField()  # main_menu_sub의 __str__ 출력
    main_menu_leaf = serializers.StringRelatedField()  # main_menu_leaf의 __str__ 출력
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image_url', 'stock', 'main_menu', 'main_menu_sub', 'main_menu_leaf', 'status', 'rating', 'created_at', 'updated_at']
