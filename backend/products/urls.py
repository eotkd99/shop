from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet, FilterTypeViewSet, FilterValueViewSet

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'filter-types', FilterTypeViewSet)
router.register(r'filter-values', FilterValueViewSet)

urlpatterns = router.urls
