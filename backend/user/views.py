from datetime import timezone

from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from user.authentication import CookieJWTAuthentication
from .serializers import RegisterSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token["username"] = user.username
        user.last_login = timezone.now()
        user.save()
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")
        remember = request.data.get("remember")  # True/False

        if remember:
            max_age = 60 * 60 * 24 * 7  
        else:
            max_age = None  
        response.set_cookie(
            'jwt_access',
            access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=max_age,
        )
        response.set_cookie(
            'jwt_refresh',
            refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=max_age,
        )
        return response

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"detail": "회원가입이 완료되었습니다."}, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("jwt_refresh") or request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=400)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

        response = Response({"message": "Successfully logged out."})
        response.delete_cookie('jwt_access')
        response.delete_cookie('jwt_refresh')
        return response


class CheckAuthenticationView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"isAuthenticated": True})
