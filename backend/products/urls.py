from django.urls import path
from .views import ProductsList

urlpatterns = [
    path('products/', ProductsList.as_view(), name='products-list'),
]
