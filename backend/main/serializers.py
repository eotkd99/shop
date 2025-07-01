from rest_framework import serializers
from .models import MainMenu, MainMenuSub, MainMenuLeaf, Resource

class MainMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainMenu
        fields = ['id', 'name']

class MainMenuSubSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainMenuSub
        fields = ['id', 'seq', 'name', 'menu']

class MainMenuLeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainMenuLeaf
        fields = ['id', 'seq', 'name', 'sub']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'path', 'screen', 'type', 'created_at', 'updated_at']
