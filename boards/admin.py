from django.contrib import admin

from . import models


@admin.register(models.Boards)
class BoardsAdmin(admin.ModelAdmin):
    list_display = ['name', 'bg_color']


@admin.register(models.Columns)
class ColumnsAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(models.Cards)
class CardsAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(models.Comments)
class CommentsAdmin(admin.ModelAdmin):
    list_display = ['id']
