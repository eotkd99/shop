import json
import requests
from datetime import timedelta

from django.contrib.auth import login
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

from users.authentication import CookieJWTAuthentication
from .serializers import RegisterSerializer, PasswordResetConfirmSerializer

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
    
    
class PasswordResetToken(UntypedToken):
    lifetime = timedelta(minutes=30)  


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "이메일을 입력하세요."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "해당 이메일로 등록된 사용자가 없습니다."}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_BASE_URL}/reset-password/confirm?uid={uid}&token={token}"

        send_mail(
            subject="비밀번호 재설정 안내",
            message=f"아래 링크를 클릭해 새 비밀번호를 설정하세요:\n\n{reset_link}",
            from_email=None,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"detail": "비밀번호 재설정 링크가 이메일로 전송되었습니다."})

from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import PasswordResetConfirmSerializer
import json

class PasswordResetConfirmView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"detail": "비밀번호가 성공적으로 변경되었습니다."}, status=200)
        
        # 강제 출력: serializer.errors를 강제로 로그로 출력
        print("Serializer errors:", json.dumps(serializer.errors))  # 강제로 출력 (디버깅)
        
        # 강제 출력 후 JsonResponse로 오류 반환
        return JsonResponse({"detail": str(serializer.errors)}, status=400)
        
@csrf_exempt
def find_id_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        try:
            user = User.objects.get(email=email)
            return JsonResponse({"username": user.username})
        except User.DoesNotExist:
            return JsonResponse({"detail": "해당 이메일로 가입된 계정을 찾을 수 없습니다."}, status=404)
        
        
@csrf_exempt
def google_auth_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)
        id_token = data.get("id_token")
        if not id_token:
            return JsonResponse({"error": "Missing id_token"}, status=400)

        token_info = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        ).json()
        email = token_info.get("email")
        if not email:
            return JsonResponse({"error": "Invalid token"}, status=400)

        user, _ = User.objects.get_or_create(
            username=email,
            defaults={"first_name": token_info.get("name", "")}
        )
        user.last_login = timezone.now()
        user.save()
        login(request, user)

        refresh = RefreshToken.for_user(user)
        response = JsonResponse({
            "message": "Login successful",
            "email": email,
            "name": user.first_name,
            "picture": token_info.get("picture", "")
        })
        for name, value in {
            "jwt_access": str(refresh.access_token),
            "jwt_refresh": str(refresh)
        }.items():
            response.set_cookie(
                name, value,
                httponly=True, secure=False, samesite='Lax'
            )
        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
