from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ProductCategory, FilterType, FilterValue, Product
from .serializers import (
    ProductCategorySerializer,
    FilterTypeSerializer,
    FilterValueSerializer,
    ProductSerializer,
)

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.filter(is_active=True)
    serializer_class = ProductCategorySerializer

    @action(detail=True, methods=['get'])
    def filters(self, request, pk=None):
        category = self.get_object()
        filter_types = category.filter_types.filter(is_active=True).prefetch_related('values')
        serializer = FilterTypeSerializer(filter_types, many=True)
        return Response(serializer.data)

class FilterTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FilterType.objects.filter(is_active=True)
    serializer_class = FilterTypeSerializer

class FilterValueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FilterValue.objects.filter(is_active=True)
    serializer_class = FilterValueSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

    @staticmethod
    def get_descendants_ids(category_id):
        descendants = set()
        stack = [category_id]
        while stack:
            current = stack.pop()
            descendants.add(current)
            children = ProductCategory.objects.filter(parent=current).values_list('id', flat=True)
            stack.extend(children)
        return list(descendants)

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        is_rocket = self.request.query_params.get('is_rocket')
        is_free_shipping = self.request.query_params.get('is_free_shipping')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        sort = self.request.query_params.get('sort')

        if category_id:
            ids = self.get_descendants_ids(int(category_id))
            queryset = queryset.filter(category_id__in=ids)

        # 대분류별 필터 처리
        filter_types = FilterType.objects.filter(is_active=True)
        for filter_type in filter_types:
            param = f'filter_{filter_type.name}'  # 예: filter_brand
            value_ids = self.request.query_params.getlist(param)
            if value_ids:
                queryset = queryset.filter(
                    filter_values__type=filter_type,
                    filter_values__id__in=value_ids
                )

        if is_rocket == 'true':
            queryset = queryset.filter(is_rocket=True)
        if is_free_shipping == 'true':
            queryset = queryset.filter(is_free_shipping=True)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if sort == 'low_price':
            queryset = queryset.order_by('discount_price', 'price')
        elif sort == 'high_price':
            queryset = queryset.order_by('-discount_price', '-price')
        elif sort == 'sales':
            queryset = queryset.order_by('-sales_count')
        elif sort == 'new':
            queryset = queryset.order_by('-created_at')
        else:  # default/ranking
            queryset = queryset.order_by('-sales_count', '-review_count', '-avg_rating')

        return queryset.distinct()


class CategoryOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    # Active 카테고리만 가져오는 API
    queryset = ProductCategory.objects.filter(is_active=True)
    serializer_class = ProductCategorySerializer

    def list(self, request, *args, **kwargs):
        # 카테고리만 가져오는 로직
        categories = self.queryset.all()
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)