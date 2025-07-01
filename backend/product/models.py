from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    main_menu = models.ForeignKey('main.MainMenu', on_delete=models.CASCADE, related_name='products')
    main_menu_sub = models.ForeignKey('main.MainMenuSub', on_delete=models.CASCADE, related_name='products')
    main_menu_leaf = models.ForeignKey('main.MainMenuLeaf', on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, choices=[('active', 'Active'), ('sold_out', 'Sold Out')], default='active')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'product_product'
        ordering = ['id']

    def __str__(self):
        return self.name
