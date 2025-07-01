from rest_framework.routers import DefaultRouter
from .views import (
    MainMenuViewSet, MainMenuSubViewSet, MainMenuLeafViewSet,
    ResourceViewSet
)

router = DefaultRouter()
router.register(r'main_menu', MainMenuViewSet, basename='main_menu')
router.register(r'main_menu_sub', MainMenuSubViewSet, basename='main_menu_sub')
router.register(r'main_menu_leaf', MainMenuLeafViewSet, basename='main_menu_leaf')
router.register(r'resources', ResourceViewSet, basename='resources')

urlpatterns = router.urls
