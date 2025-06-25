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
    icon_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'main_menu'
        ordering = ['id']

class MainMenuSub(models.Model):
    menu = models.ForeignKey(MainMenu, related_name='subs', on_delete=models.CASCADE)
    seq = models.IntegerField()
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'main_menu_sub'
        ordering = ['seq']

class MainMenuLeaf(models.Model):
    sub = models.ForeignKey(MainMenuSub, related_name='leaves', on_delete=models.CASCADE)
    seq = models.IntegerField()
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'main_menu_leaf'
        ordering = ['seq']

