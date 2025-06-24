from django.urls import path
from .views import main_api

urlpatterns = [
    path('', main_api),
]
