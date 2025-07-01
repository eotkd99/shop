from rest_framework import viewsets
from .models import MainMenu, MainMenuSub, MainMenuLeaf, Resource
from .serializers import (
    MainMenuSerializer, MainMenuSubSerializer, MainMenuLeafSerializer,
    ResourceSerializer
)

class MainMenuViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MainMenu.objects.all()
    serializer_class = MainMenuSerializer

class MainMenuSubViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MainMenuSub.objects.all()
    serializer_class = MainMenuSubSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        menu_id = self.request.query_params.get("menu_id")
        if menu_id:
            qs = qs.filter(menu_id=menu_id)
        return qs

class MainMenuLeafViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MainMenuLeaf.objects.all()
    serializer_class = MainMenuLeafSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        sub_id = self.request.query_params.get("sub_id")
        if sub_id:
            qs = qs.filter(sub_id=sub_id)
        return qs
    
from rest_framework.decorators import action
from rest_framework.response import Response

class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_resources_by_screen(self, screen_name):
        resources = Resource.objects.filter(screen=screen_name)
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='main_panel')
    def main_panel(self, request):
        return self.get_resources_by_screen('main_panel')

    @action(detail=False, methods=['get'], url_path='main_grid_panel')
    def main_grid_panel(self, request):
        return self.get_resources_by_screen('main_grid_panel')

    @action(detail=False, methods=['get'], url_path='main_category')
    def main_category(self, request):
        return self.get_resources_by_screen('main_category')

    @action(detail=False, methods=['get'], url_path='main_logo')
    def main_logo(self, request):
        return self.get_resources_by_screen('main_logo')
