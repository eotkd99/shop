from django.db import models

class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    depth = models.PositiveSmallIntegerField(default=1)
    sort_order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'products_category'

class FilterType(models.Model):
    name = models.CharField(max_length=50)
    display_name = models.CharField(max_length=50)
    sort_order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    categories = models.ManyToManyField(ProductCategory, related_name="filter_types", blank=True)

    class Meta:
        db_table = 'products_filter_type'

class FilterValue(models.Model):
    type = models.ForeignKey(FilterType, on_delete=models.CASCADE, related_name='values')
    name = models.CharField(max_length=50)
    sort_order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'products_filter_value'

class Product(models.Model):
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=255)
    stock = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    discount_price = models.IntegerField(default=0)
    main_image_url = models.URLField(blank=True)
    is_rocket = models.BooleanField(default=False)
    is_free_shipping = models.BooleanField(default=False)
    delivery_expect = models.CharField(max_length=50, blank=True)  
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    max_point = models.PositiveIntegerField(default=0)
    sales_count = models.PositiveIntegerField(default=0)           
    discount_rate = models.PositiveSmallIntegerField(null=True, blank=True)  
    filter_values = models.ManyToManyField(FilterValue, related_name='products', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)            
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products_product'
