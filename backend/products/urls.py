from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet, FilterTypeViewSet, FilterValueViewSet, CategoryOnlyViewSet

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'filter-types', FilterTypeViewSet)
router.register(r'filter-values', FilterValueViewSet)
router.register(r'category-only', CategoryOnlyViewSet, basename='category-only')  # 고유한 basename 추가

urlpatterns = router.urls
