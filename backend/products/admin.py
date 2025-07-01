from django.contrib import admin
from .models import ProductCategory, Product, FilterType, FilterValue

admin.site.register(ProductCategory)
admin.site.register(Product)
admin.site.register(FilterType)
admin.site.register(FilterValue)
