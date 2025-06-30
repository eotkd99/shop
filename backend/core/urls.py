from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('main.urls')), 
    path('admin/', admin.site.urls),
    path('api/', include('user.urls')),
    path('api/', include('product.urls')),  # 'products/' 경로로 'product' 앱의 URL을 포함시킴

]
