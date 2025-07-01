from django.db import models

class Resource(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    screen = models.CharField(max_length=50) 
    type = models.CharField(max_length=50)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resource'
        ordering = ['id']

class MainMenu(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'main_menu'
        ordering = ['id']

    def __str__(self):
        return self.name

class MainMenuSub(models.Model):
    seq = models.IntegerField()
    name = models.CharField(max_length=100)
    menu = models.ForeignKey(MainMenu, on_delete=models.CASCADE, db_column='menu_id', related_name='subs')

    class Meta:
        db_table = 'main_menu_sub'
        ordering = ['seq', 'id']

    def __str__(self):
        return self.name

class MainMenuLeaf(models.Model):
    seq = models.IntegerField()
    name = models.CharField(max_length=100)
    sub = models.ForeignKey(MainMenuSub, on_delete=models.CASCADE, db_column='sub_id', related_name='leaves')

    class Meta:
        db_table = 'main_menu_leaf'
        ordering = ['seq', 'id']

    def __str__(self):
        return self.name
