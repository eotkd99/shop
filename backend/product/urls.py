# product/urls.py

from django.urls import path
from .views import ProductList  # ProductList 뷰를 임포트

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),  # 올바른 엔드포인트 설정
]