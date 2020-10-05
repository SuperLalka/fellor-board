from django.db import models


BOARDS_BG_COLOR = "Enter the background color of the board"


class Cards(models.Model):
    name = models.CharField(max_length=40, help_text="Enter card name")
    board = models.ForeignKey('Boards', on_delete=models.CASCADE,
                              null=True, blank=True)
    column = models.ForeignKey('Columns', on_delete=models.CASCADE,
                               null=True, blank=True)


class Columns(models.Model):
    name = models.CharField(max_length=40, help_text="Enter column name")


class Boards(models.Model):
    name = models.CharField(max_length=40, help_text="Enter board name")
    bg_color = models.CharField(max_length=15, help_text=BOARDS_BG_COLOR,
                                null=True, blank=True)
