from rest_framework import serializers
from .models import MainResource

class MainResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainResource
        fields = ['id', 'name', 'path', 'type', 'screen', 'alt', 'sort_order', 'is_active', 'created_at', 'updated_at']
