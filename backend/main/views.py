# main/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MainResource
from .serializers import MainResourceSerializer

class MainResourceView(APIView):
    def get(self, request, screen=None):
        # 경로에서 받은 'screen' 값을 이용하여 필터링
        resources = MainResource.objects.filter(screen=screen, is_active=True)
        
        if not resources:
            return Response({"message": "No resources found for the specified screen."}, status=status.HTTP_404_NOT_FOUND)

        serializer = MainResourceSerializer(resources, many=True)
        return Response(serializer.data)
