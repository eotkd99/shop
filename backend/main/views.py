from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resource, MainMenu
from .serializers import ResourceSerializer, MainMenuSerializer

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

class MainMenuViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MainMenu.objects.all()
    serializer_class = MainMenuSerializer
