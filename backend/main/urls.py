from django.urls import path
from .views import MainResourceView  

urlpatterns = [
    path('resources/<str:screen>/', MainResourceView.as_view()),
]
