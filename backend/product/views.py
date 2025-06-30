from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()

        # 필터링
        category = request.GET.get('category', None)
        if category:
            products = products.filter(category=category)

        # 검색
        search = request.GET.get('search', None)
        if search:
            products = products.filter(name__icontains=search)

        # 가격 정렬
        price_order = request.GET.get('ordering', None)
        if price_order:
            if price_order == 'price':
                products = products.order_by('price')
            elif price_order == '-price':
                products = products.order_by('-price')

        # 결과 직렬화
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
