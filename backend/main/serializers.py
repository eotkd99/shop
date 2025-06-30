from rest_framework import serializers
from .models import Resource, MainMenu, MainMenuSub, MainMenuLeaf

class MainMenuLeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainMenuLeaf
        fields = ['id', 'name']

class MainMenuSubSerializer(serializers.ModelSerializer):
    leaves = MainMenuLeafSerializer(many=True, read_only=True)

    class Meta:
        model = MainMenuSub
        fields = ['id', 'name', 'leaves']

class MainMenuSerializer(serializers.ModelSerializer):
    subs = MainMenuSubSerializer(many=True, read_only=True)

    class Meta:
        model = MainMenu
        fields = ['id', 'name', 'icon_name', 'subs']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'path', 'screen', 'type', 'created_at', 'updated_at']
