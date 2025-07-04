from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

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
    
    @action(detail=False, methods=['get'])
    def active_categories(self, request):
        active_categories = ProductCategory.objects.filter(is_active=True)
        serializer = ProductCategorySerializer(active_categories, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='depth-one')
    def depth_one_categories(self, request):
        active_categories = ProductCategory.objects.filter(depth=1)
        serializer = ProductCategorySerializer(active_categories, many=True)
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

    def get_descendants_ids(self, category_id):
        category_ids = set([category_id])
        descendants = ProductCategory.objects.filter(
            parent_id=category_id
        ).values_list('id', flat=True)
        
        category_ids.update(descendants)
        
        while descendants:
            descendants = ProductCategory.objects.filter(
                parent_id__in=descendants
            ).values_list('id', flat=True)
            category_ids.update(descendants)
        
        return list(category_ids)

    def get_queryset(self):
        queryset = super().get_queryset()
        filters = self.request.query_params

        category_id = filters.get('category')
        search = filters.get('search')

        if category_id:
            ids = self.get_descendants_ids(int(category_id))
            queryset = queryset.filter(category_id__in=ids)

        if search:
            q = Q(name__icontains=search)

            matched_categories = ProductCategory.objects.filter(name__icontains=search).values_list('id', flat=True)
            category_ids = set()
            for cid in matched_categories:
                category_ids.update(self.get_descendants_ids(cid))

            if category_ids:
                q |= Q(category_id__in=category_ids)

            queryset = queryset.filter(q)

        queryset = self.apply_filters(queryset, filters)
        queryset = self.apply_sorting(queryset, filters.get('sort'))

        return queryset.distinct()

    def apply_filters(self, queryset, filters):
        filter_types = FilterType.objects.filter(is_active=True)
        for filter_type in filter_types:
            param = f'filter_{filter_type.name}'
            value_ids = filters.getlist(param)
            if value_ids:
                queryset = queryset.filter(
                    filter_values__type=filter_type,
                    filter_values__id__in=value_ids
                )

        if filters.get('is_rocket') == 'true':
            queryset = queryset.filter(is_rocket=True)
        if filters.get('is_free_shipping') == 'true':
            queryset = queryset.filter(is_free_shipping=True)

        min_price = filters.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = filters.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def apply_sorting(self, queryset, sort_option):
        if sort_option == 'low_price':
            queryset = queryset.order_by('discount_price', 'price')
        elif sort_option == 'high_price':
            queryset = queryset.order_by('-discount_price', '-price')
        elif sort_option == 'sales':
            queryset = queryset.order_by('-sales_count')
        elif sort_option == 'new':
            queryset = queryset.order_by('-created_at')
        else: 
            queryset = queryset.order_by('-sales_count', '-review_count', '-avg_rating')

        return queryset
        if sort_option == 'low_price':
            queryset = queryset.order_by('discount_price', 'price')
        elif sort_option == 'high_price':
            queryset = queryset.order_by('-discount_price', '-price')
        elif sort_option == 'sales':
            queryset = queryset.order_by('-sales_count')
        elif sort_option == 'new':
            queryset = queryset.order_by('-created_at')
        else: 
            queryset = queryset.order_by('-sales_count', '-review_count', '-avg_rating')

        return queryset