from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'resources', views.ResourceViewSet)  
router.register(r'main_menu', views.MainMenuViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]
