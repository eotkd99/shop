from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()

        # mainMenu 필터 (id 또는 name 둘 다 지원)
        main_menu = request.GET.get('mainMenu')
        if main_menu and main_menu != 'All':
            if main_menu.isdigit():
                products = products.filter(main_menu_id=int(main_menu))
            else:
                products = products.filter(main_menu__name=main_menu)

        # mainMenuSub 필터 (id 또는 name 둘 다 지원)
        main_menu_sub = request.GET.get('mainMenuSub')
        if main_menu_sub and main_menu_sub != 'All':
            if main_menu_sub.isdigit():
                products = products.filter(main_menu_sub_id=int(main_menu_sub))
            else:
                products = products.filter(main_menu_sub__name=main_menu_sub)

        # mainMenuLeaf 필터 (id 또는 name 둘 다 지원)
        main_menu_leaf = request.GET.get('mainMenuLeaf')
        if main_menu_leaf and main_menu_leaf != 'All':
            if main_menu_leaf.isdigit():
                products = products.filter(main_menu_leaf_id=int(main_menu_leaf))
            else:
                products = products.filter(main_menu_leaf__name=main_menu_leaf)

        # status: In Stock / Out of Stock / 기타
        status_param = request.GET.get('status')
        if status_param and status_param != 'All':
            if status_param in ["In Stock", "in stock"]:
                products = products.filter(stock__gt=0)
            elif status_param in ["Out of Stock", "out of stock"]:
                products = products.filter(stock=0)
            else:
                products = products.filter(status=status_param)

        # rating (숫자 값, 문자열도 수용)
        rating = request.GET.get('rating')
        if rating and rating != "All":
            try:
                products = products.filter(rating=float(rating))
            except Exception:
                pass

        # price ordering
        ordering = request.GET.get('ordering')
        if ordering in ['price', '-price']:
            products = products.order_by(ordering)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
