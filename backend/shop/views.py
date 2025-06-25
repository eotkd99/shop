# api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MainCategory, MainMenu
from .serializers import MainCategorySerializer, MainMenuSerializer

@api_view(['GET'])
def main_category_list(request):
    cats = MainCategory.objects.all().order_by('id')
    serializer = MainCategorySerializer(cats, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def main_menu_list(request):
    menus = MainMenu.objects.all()
    serializer = MainMenuSerializer(menus, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_sorted_data(request):
    data = YourModel.objects.all().order_by('icon_path')
    serializer = YourModelSerializer(data, many=True)
    return Response(serializer.data)