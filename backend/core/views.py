from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def main_api(request):
    return Response({"msg": "API 메인페이지!"})
