from django.urls import path
from .views import (
    MyTokenObtainPairView,
    RegisterView,
    LogoutView,
    CheckAuthenticationView,
    google_auth_view,
    find_id_view,
    PasswordResetRequestView,
    PasswordResetConfirmView

)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("join/", RegisterView.as_view(), name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("check-auth/", CheckAuthenticationView.as_view(), name="check_auth"),
    path("auth/google/", google_auth_view, name="google_auth"),
    path("find-id/", find_id_view, name="find-id"),
    path("reset-password/", PasswordResetRequestView.as_view(), name="reset-password-request"),
    path("reset-password/confirm/", PasswordResetConfirmView.as_view(), name="reset-password-confirm"),
]
    