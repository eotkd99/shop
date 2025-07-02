from django.urls import path
from .views import MainResourceView  

urlpatterns = [
    path('main_resources/<str:screen>/', MainResourceView.as_view()),
]
